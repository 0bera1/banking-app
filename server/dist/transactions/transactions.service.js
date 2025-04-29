"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
class TransactionsService {
    constructor(databaseService, exchangeService, auditService, transactionLimitsService) {
        this.databaseService = databaseService;
        this.exchangeService = exchangeService;
        this.auditService = auditService;
        this.transactionLimitsService = transactionLimitsService;
    }
    async createTransaction(userId, fromAccountId, receiverIban, amount, currency, description) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const fromAccountQuery = `
                SELECT *
                FROM accounts
                WHERE id = $1
                  AND user_id = $2
            `;
            const fromAccountResult = await client.query(fromAccountQuery, [fromAccountId, userId]);
            const fromAccount = fromAccountResult.rows[0];
            if (!fromAccount) {
                throw new common_1.HttpException('Gönderen hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
            }
            if (fromAccount.status !== 'active') {
                throw new common_1.HttpException('Gönderen hesap aktif değil', common_1.HttpStatus.BAD_REQUEST);
            }
            const toAccountQuery = `
                SELECT *
                FROM accounts
                WHERE iban = $1
            `;
            const toAccountResult = await client.query(toAccountQuery, [receiverIban]);
            const toAccount = toAccountResult.rows[0];
            if (!toAccount) {
                throw new common_1.HttpException('Alıcı hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
            }
            if (toAccount.status !== 'active') {
                throw new common_1.HttpException('Alıcı hesap aktif değil', common_1.HttpStatus.BAD_REQUEST);
            }
            if (fromAccount.balance < amount) {
                throw new common_1.HttpException('Yetersiz bakiye', common_1.HttpStatus.BAD_REQUEST);
            }
            if (fromAccount.currency !== currency || toAccount.currency !== currency) {
                throw new common_1.HttpException('Para birimi uyuşmazlığı', common_1.HttpStatus.BAD_REQUEST);
            }
            const isWithinLimit = await this.transactionLimitsService.checkSingleTransactionLimit(userId, amount, currency);
            if (!isWithinLimit) {
                throw new common_1.HttpException('İşlem limiti aşıldı', common_1.HttpStatus.BAD_REQUEST);
            }
            const updateFromAccountQuery = `
                UPDATE accounts
                SET balance = balance - $1
                WHERE id = $2 RETURNING *
            `;
            await client.query(updateFromAccountQuery, [amount, fromAccountId]);
            const updateToAccountQuery = `
                UPDATE accounts
                SET balance = balance + $1
                WHERE id = $2 RETURNING *
            `;
            await client.query(updateToAccountQuery, [amount, toAccount.id]);
            const createTransactionQuery = `
                INSERT INTO transactions
                    (sender_id, receiver_id, amount, currency, description, status)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
            `;
            const transactionResult = await client.query(createTransactionQuery, [
                fromAccountId,
                toAccount.id,
                amount,
                currency,
                description,
                'completed'
            ]);
            await this.auditService.log('TRANSACTION_CREATE', 'transactions', transactionResult.rows[0].id.toString(), null, {
                sender_id: fromAccountId,
                receiver_id: toAccount.id,
                amount,
                currency,
                description,
                status: 'completed'
            }, userId.toString());
            await client.query('COMMIT');
            return transactionResult.rows[0];
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Transaction hatası:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || 'İşlem sırasında bir hata oluştu', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            client.release();
        }
    }
    async getTransactions(getTransactionsDto) {
        try {
            if (!getTransactionsDto.account_id) {
                throw new common_1.HttpException('Hesap ID\'si gereklidir', common_1.HttpStatus.BAD_REQUEST);
            }
            const query = `
                SELECT t.*,
                       a1.card_holder_name as sender_name,
                       a2.card_holder_name as receiver_name
                FROM transactions t
                         LEFT JOIN accounts a1 ON t.sender_id = a1.id
                         LEFT JOIN accounts a2 ON t.receiver_id = a2.id
                WHERE t.sender_id = $1
                   OR t.receiver_id = $1
                ORDER BY t.created_at DESC
                    LIMIT $2
                OFFSET $3
            `;
            const values = [
                getTransactionsDto.account_id,
                getTransactionsDto.limit || 10,
                getTransactionsDto.offset || 0
            ];
            const result = await this.databaseService.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('İşlemler getirilirken hata:', error);
            throw new common_1.HttpException(error.message || 'İşlemler getirilirken bir hata oluştu', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTransactionsByUserId(userId) {
        try {
            const query = `
                SELECT t.*,
                       s.first_name || ' ' || s.last_name as sender_name,
                       r.first_name || ' ' || r.last_name as receiver_name
                FROM transactions t
                         LEFT JOIN accounts sa ON t.sender_id = sa.id
                         LEFT JOIN accounts ra ON t.receiver_id = ra.id
                         LEFT JOIN users s ON sa.user_id = s.id
                         LEFT JOIN users r ON ra.user_id = r.id
                WHERE sa.user_id = $1
                   OR ra.user_id = $1
                ORDER BY t.created_at DESC
            `;
            const result = await this.databaseService.query(query, [userId]);
            return result.rows;
        }
        catch (error) {
            console.error('İşlemler getirilirken hata:', error);
            throw new common_1.HttpException('İşlemler getirilirken bir hata oluştu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map