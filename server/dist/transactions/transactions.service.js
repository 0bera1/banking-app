"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const exchange_service_1 = require("../exchange/exchange.service");
const audit_service_1 = require("../audit/audit.service");
const transaction_limits_service_1 = require("./transaction-limits.service");
let TransactionsService = class TransactionsService {
    constructor(databaseService, exchangeService, auditService, transactionLimitsService) {
        this.databaseService = databaseService;
        this.exchangeService = exchangeService;
        this.auditService = auditService;
        this.transactionLimitsService = transactionLimitsService;
    }
    async createTransaction(userId, fromAccountId, receiverIban, amount, currency, description) {
        const fromAccountQuery = `
            SELECT * FROM accounts 
            WHERE id = $1 AND user_id = $2
        `;
        const fromAccountResult = await this.databaseService.query(fromAccountQuery, [fromAccountId, userId]);
        const fromAccount = fromAccountResult.rows[0];
        if (!fromAccount) {
            throw new common_1.HttpException('Gönderen hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        const toAccountQuery = `
            SELECT * FROM accounts 
            WHERE iban = $1
        `;
        const toAccountResult = await this.databaseService.query(toAccountQuery, [receiverIban]);
        const toAccount = toAccountResult.rows[0];
        if (!toAccount) {
            throw new common_1.HttpException('Alıcı hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        if (fromAccount.balance < amount) {
            throw new common_1.HttpException('Yetersiz bakiye', common_1.HttpStatus.BAD_REQUEST);
        }
        if (fromAccount.currency !== currency || toAccount.currency !== currency) {
            throw new common_1.HttpException('Para birimi uyuşmazlığı', common_1.HttpStatus.BAD_REQUEST);
        }
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const updateFromAccountQuery = `
                UPDATE accounts 
                SET balance = balance - $1 
                WHERE id = $2 
                RETURNING *
            `;
            await client.query(updateFromAccountQuery, [amount, fromAccountId]);
            const updateToAccountQuery = `
                UPDATE accounts 
                SET balance = balance + $1 
                WHERE id = $2 
                RETURNING *
            `;
            await client.query(updateToAccountQuery, [amount, toAccount.id]);
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
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getTransactions(getTransactionsDto) {
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
            getTransactionsDto.account_id,
            getTransactionsDto.limit || 10,
            getTransactionsDto.offset || 0
        ];
        return this.databaseService.query(query, values);
    }
    async getTransactionsByUserId(userId) {
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
        }
        catch (error) {
            console.error('İşlemler getirilirken hata:', error);
            throw new common_1.HttpException('İşlemler getirilirken bir hata oluştu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        exchange_service_1.ExchangeService,
        audit_service_1.AuditService,
        transaction_limits_service_1.TransactionLimitsService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map