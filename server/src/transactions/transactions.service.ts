import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { AuditService } from '../audit/audit.service';
import { TransactionLimitsService } from './transaction-limits.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly exchangeService: ExchangeService,
        private readonly auditService: AuditService,
        private readonly transactionLimitsService: TransactionLimitsService,
    ) {}

    async createTransaction(
        userId: number,
        fromAccountId: number,
        receiverIban: string,
        amount: number,
        currency: string,
        description?: string,
    ) {
        // Gönderen hesabı kontrol et
        const fromAccountQuery = `
            SELECT * FROM accounts 
            WHERE id = $1 AND user_id = $2
        `;
        const fromAccountResult = await this.databaseService.query(fromAccountQuery, [fromAccountId, userId]);
        const fromAccount = fromAccountResult.rows[0];

        if (!fromAccount) {
            throw new HttpException('Gönderen hesap bulunamadı', HttpStatus.NOT_FOUND);
        }

        // Alıcı hesabı IBAN ile bul
        const toAccountQuery = `
            SELECT * FROM accounts 
            WHERE iban = $1
        `;
        const toAccountResult = await this.databaseService.query(toAccountQuery, [receiverIban]);
        const toAccount = toAccountResult.rows[0];

        if (!toAccount) {
            throw new HttpException('Alıcı hesap bulunamadı', HttpStatus.NOT_FOUND);
        }

        // Bakiye kontrolü
        if (fromAccount.balance < amount) {
            throw new HttpException('Yetersiz bakiye', HttpStatus.BAD_REQUEST);
        }

        // Para birimi kontrolü
        if (fromAccount.currency !== currency || toAccount.currency !== currency) {
            throw new HttpException(
                'Para birimi uyuşmazlığı',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Transaction başlat
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');

            // Gönderen hesabın bakiyesini güncelle
            const updateFromAccountQuery = `
                UPDATE accounts 
                SET balance = balance - $1 
                WHERE id = $2 
                RETURNING *
            `;
            await client.query(updateFromAccountQuery, [amount, fromAccountId]);

            // Alıcı hesabın bakiyesini güncelle
            const updateToAccountQuery = `
                UPDATE accounts 
                SET balance = balance + $1 
                WHERE id = $2 
                RETURNING *
            `;
            await client.query(updateToAccountQuery, [amount, toAccount.id]);

            // İşlem kaydını oluştur
            const createTransactionQuery = `
                INSERT INTO transactions 
                (sender_id, receiver_id, amount, currency, description, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const transactionResult = await client.query(createTransactionQuery, [
                fromAccountId,
                toAccount.id,
                amount,
                currency,
                description,
                'completed'
            ]);

            await client.query('COMMIT');
            return transactionResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
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

    async getTransactionsByUserId(userId: number) {
        try {
            const query = `
                SELECT 
                    t.*,
                    s.first_name || ' ' || s.last_name as sender_name,
                    r.first_name || ' ' || r.last_name as receiver_name
                FROM transactions t
                LEFT JOIN accounts sa ON t.sender_id = sa.id
                LEFT JOIN accounts ra ON t.receiver_id = ra.id
                LEFT JOIN users s ON sa.user_id = s.id
                LEFT JOIN users r ON ra.user_id = r.id
                WHERE sa.user_id = $1 OR ra.user_id = $1
                ORDER BY t.created_at DESC
            `;
            
            const result = await this.databaseService.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('İşlemler getirilirken hata:', error);
            throw new HttpException('İşlemler getirilirken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
