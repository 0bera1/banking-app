import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly databaseService: DatabaseService,  // Veritabanı bağlantısı için servis
        private readonly auditService: AuditService,        // İşlem kayıtları için audit servisi
    ) {}

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const client = await this.databaseService.getClient(); // Veritabanından bir client (bağlantı) alır
        
        try {
            await client.query('BEGIN'); // Transaction (işlem bloğu) başlatılır

            // Gönderen hesabın bakiyesini kontrol eder
            const senderResult = await client.query(
                'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
                [createTransactionDto.senderAccountId]
            );

            // Eğer gönderen hesap bulunamadıysa
            if (senderResult.rows.length === 0) {
                throw new NotFoundException('Sender account not found');
            }

            const senderBalance = parseFloat(senderResult.rows[0].balance);
            // Gönderen hesabın bakiyesi, gönderilecek tutardan azsa işlem iptal edilir
            if (senderBalance < createTransactionDto.amount) {
                throw new BadRequestException('Insufficient balance');
            }

            // Alıcı hesabın varlığını kontrol eder
            const receiverResult = await client.query(
                'SELECT id FROM accounts WHERE id = $1 FOR UPDATE',
                [createTransactionDto.receiverAccountId]
            );

            if (receiverResult.rows.length === 0) {
                throw new NotFoundException('Receiver account not found');
            }

            // Transaction kaydını veritabanına ekler, işlem ID’sini alır
            const transactionResult = await client.query(
                `INSERT INTO transactions 
                (sender_account_id, receiver_account_id, amount, description, status)
                VALUES ($1, $2, $3, $4, 'completed')
                RETURNING id`,
                [
                    createTransactionDto.senderAccountId,
                    createTransactionDto.receiverAccountId,
                    createTransactionDto.amount,
                    createTransactionDto.description
                ]
            );

            const transactionId = transactionResult.rows[0].id;

            // Gönderen hesabın bakiyesinden para düşer
            await client.query(
                'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
                [createTransactionDto.amount, createTransactionDto.senderAccountId]
            );

            // Alıcı hesabın bakiyesine para ekler
            await client.query(
                'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
                [createTransactionDto.amount, createTransactionDto.receiverAccountId]
            );

            await client.query('COMMIT'); // İşlem bloğunu commitler

            // Audit servisine, bu işlemle ilgili log kaydı gönderir
            await this.auditService.log(
                'CREATE',
                'transactions',
                transactionId,
                null,
                {
                    senderAccountId: createTransactionDto.senderAccountId,
                    receiverAccountId: createTransactionDto.receiverAccountId,
                    amount: createTransactionDto.amount,
                    description: createTransactionDto.description,
                    status: 'completed'
                }
            );

            // İşlem başarılıysa, kullanıcıya bilgilendirici bir yanıt döner
            return {
                transactionId,
                status: 'completed',
                message: 'Transfer successfully completed'
            };

        } catch (error) {
            await client.query('ROLLBACK'); // Hata olursa iptal (parayı düşürme/ekleme iptal olur)
            console.error('Transaction error:', error);

            // Eğer hata daha önce benim yazdığım hatalardan biri ise tekrar aynı hatayı ver
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            // Eğer hata benim yazdığım hatalardan biri değilse yeni bir hata oluştur
            throw new BadRequestException('Transaction creation failed: ' + error.message);
        } finally {
            client.release(); // Veritabanı bağlantısını serbest bırakır
        }
    }

    async getTransactions(getTransactionsDto: GetTransactionsDto) {
        const { accountId, limit = 10, offset = 0 } = getTransactionsDto; // Gelen filtre ve sayfalama parametrelerini alır
        // Hesaplar ile birlikte transaction listesini çeker
        // - Hesapların kart numaralarını için LEFT JOIN kullanıyoruz
        // - Tarihe göre sıralamak için ORDER BY kullanıyoruz
        
        let query = `
            SELECT 
                t.id,
                t.sender_account_id as "senderAccountId",
                t.receiver_account_id as "receiverAccountId",
                t.amount,
                t.description,
                t.status,
                t.created_at as "createdAt",
                sa.card_number as "senderCardNumber",
                ra.card_number as "receiverCardNumber"
            FROM transactions t
            LEFT JOIN accounts sa ON t.sender_account_id = sa.id
            LEFT JOIN accounts ra ON t.receiver_account_id = ra.id
        `;

        const queryParams = [];
        
        // Eğer bir hesap ID’si verildiyse, hem gönderen hem alıcı olarak filtreler
        if (accountId) {
            query += ` WHERE t.sender_account_id = $1 OR t.receiver_account_id = $1`;
            queryParams.push(accountId);
        }

        // Sonuçları tarihe göre sıralar, limit ve offset uygular
        query += ` ORDER BY t.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${
            queryParams.length + 2
        }`;
        
        queryParams.push(limit, offset);

        // Transaction listesini veritabanından çeker
        const result = await this.databaseService.query(query, queryParams);
        
        // Toplam transaction sayısı
        const countQuery = `
            SELECT COUNT(*) as total
            FROM transactions t
            ${accountId ? 'WHERE t.sender_account_id = $1 OR t.receiver_account_id = $1' : ''}
        `;

        const countResult = await this.databaseService.query(
            countQuery,
            accountId ? [accountId] : []
        );

        return {
            transactions: result.rows,
            total: parseInt(countResult.rows[0].total),
            limit,
            offset
        };
    }
}
