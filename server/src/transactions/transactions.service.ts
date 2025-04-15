import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { AuditService } from '../audit/audit.service';
import { TransactionLimitsService } from './transaction-limits.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly databaseService: DatabaseService,  // Veritabanı bağlantısı için servis
        private readonly exchangeService: ExchangeService,
        private readonly auditService: AuditService,        // İşlem kayıtları için audit servisi
        private readonly transactionLimitsService: TransactionLimitsService,
    ) {}

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const client = await this.databaseService.getClient(); // Veritabanından bir client (bağlantı) alır
        
        try {
            await client.query('BEGIN'); // Transaction (işlem bloğu) başlatılır

            // Gönderen hesabın bakiyesini kontrol eder
            const senderResult = await client.query(
                'SELECT balance, currency, user_id FROM accounts WHERE id = $1 FOR UPDATE',
                [createTransactionDto.fromAccountId]
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
                'SELECT id, currency FROM accounts WHERE id = $1 FOR UPDATE',
                [createTransactionDto.toAccountId]
            );

            if (receiverResult.rows.length === 0) {
                throw new NotFoundException('Receiver account not found');
            }

            // Transaction limitlerini kontrol et
            const [
                isDailyLimitExceeded,
                isWeeklyLimitExceeded,
                isMonthlyLimitExceeded,
                isSingleTransactionLimitExceeded,
            ] = await Promise.all([
                this.transactionLimitsService.checkDailyLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
                this.transactionLimitsService.checkWeeklyLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
                this.transactionLimitsService.checkMonthlyLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
                this.transactionLimitsService.checkSingleTransactionLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
            ]);

            if (!isDailyLimitExceeded) {
                throw new BadRequestException('Günlük transfer limiti aşıldı');
            }

            if (!isWeeklyLimitExceeded) {
                throw new BadRequestException('Haftalık transfer limiti aşıldı');
            }

            if (!isMonthlyLimitExceeded) {
                throw new BadRequestException('Aylık transfer limiti aşıldı');
            }

            if (!isSingleTransactionLimitExceeded) {
                throw new BadRequestException('Tek seferlik transfer limiti aşıldı');
            }

            // Para birimi dönüşümü
            const convertedAmount = await this.exchangeService.convertAmount(
                createTransactionDto.amount,
                senderResult.rows[0].currency,
                receiverResult.rows[0].currency
            );

            // Transaction kaydını veritabanına ekler, işlem ID'sini alır
            const transactionResult = await client.query(
                `INSERT INTO transactions 
                (sender_id, receiver_id, amount, currency, status, description)
                VALUES ($1, $2, $3, $4, 'completed', $5)
                RETURNING id`,
                [
                    createTransactionDto.fromAccountId,
                    createTransactionDto.toAccountId,
                    convertedAmount,
                    senderResult.rows[0].currency,
                    createTransactionDto.description
                ]
            );

            const transactionId = transactionResult.rows[0].id;

            // Gönderen hesabın bakiyesinden para düşer
            await client.query(
                'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
                [createTransactionDto.amount, createTransactionDto.fromAccountId]
            );

            // Alıcı hesabın bakiyesine para ekler
            await client.query(
                'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
                [convertedAmount, createTransactionDto.toAccountId]
            );

            await client.query('COMMIT'); // İşlem bloğunu commitler

            // Audit servisine, bu işlemle ilgili log kaydı gönderir
            await this.auditService.logAction({
                userId: senderResult.rows[0].user_id,
                action: 'TRANSFER',
                details: {
                    transactionId,
                    fromAccount: createTransactionDto.fromAccountId,
                    toAccount: createTransactionDto.toAccountId,
                    amount: createTransactionDto.amount,
                    currency: createTransactionDto.currency
                }
            });

            // İşlem başarılıysa, kullanıcıya bilgilendirici bir yanıt döner
            return {
                id: transactionId,
                status: 'completed',
                amount: convertedAmount,
                currency: receiverResult.rows[0].currency
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
        const query = `
            SELECT t.*, 
                   a1.card_holder_name as sender_name,
                   a2.card_holder_name as receiver_name
            FROM transactions t
            LEFT JOIN accounts a1 ON t.sender_id = a1.id
            LEFT JOIN accounts a2 ON t.receiver_id = a2.id
            WHERE t.sender_id = $1 OR t.receiver_id = $1
            ORDER BY t.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const values = [
            getTransactionsDto.accountId,
            getTransactionsDto.limit,
            getTransactionsDto.offset
        ];
        return this.databaseService.query(query, values);
    }
}
