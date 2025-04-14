import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly auditService: AuditService,
    ) {}

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const client = await this.databaseService.getClient();
        
        try {
            await client.query('BEGIN');

            // Gönderen hesabı kontrol et
            const senderResult = await client.query(
                'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
                [createTransactionDto.senderAccountId]
            );

            if (senderResult.rows.length === 0) {
                throw new NotFoundException('Gönderen hesap bulunamadı');
            }

            const senderBalance = parseFloat(senderResult.rows[0].balance);
            if (senderBalance < createTransactionDto.amount) {
                throw new BadRequestException('Yetersiz bakiye');
            }

            // Alıcı hesabı kontrol et
            const receiverResult = await client.query(
                'SELECT id FROM accounts WHERE id = $1 FOR UPDATE',
                [createTransactionDto.receiverAccountId]
            );

            if (receiverResult.rows.length === 0) {
                throw new NotFoundException('Alıcı hesap bulunamadı');
            }

            // Transaction kaydını oluştur
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

            // Gönderen hesaptan parayı düş
            await client.query(
                'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
                [createTransactionDto.amount, createTransactionDto.senderAccountId]
            );

            // Alıcı hesaba parayı ekle
            await client.query(
                'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
                [createTransactionDto.amount, createTransactionDto.receiverAccountId]
            );

            await client.query('COMMIT');

            // Audit log kaydı
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

            return {
                transactionId,
                status: 'completed',
                message: 'Transfer başarıyla tamamlandı'
            };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Transaction error:', error);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('İşlem oluşturulurken bir hata oluştu: ' + error.message);
        } finally {
            client.release();
        }
    }

    async getTransactions(getTransactionsDto: GetTransactionsDto) {
        const { accountId, limit = 10, offset = 0 } = getTransactionsDto;
        
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
        if (accountId) {
            query += ` WHERE t.sender_account_id = $1 OR t.receiver_account_id = $1`;
            queryParams.push(accountId);
        }

        query += ` ORDER BY t.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${
            queryParams.length + 2
        }`;
        
        queryParams.push(limit, offset);

        const result = await this.databaseService.query(query, queryParams);
        
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
