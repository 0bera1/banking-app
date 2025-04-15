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
    async createTransaction(createTransactionDto) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const senderResult = await client.query('SELECT balance, currency, user_id FROM accounts WHERE id = $1 FOR UPDATE', [createTransactionDto.fromAccountId]);
            if (senderResult.rows.length === 0) {
                throw new common_1.NotFoundException('Sender account not found');
            }
            const senderBalance = parseFloat(senderResult.rows[0].balance);
            if (senderBalance < createTransactionDto.amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            const receiverResult = await client.query('SELECT id, currency FROM accounts WHERE id = $1 FOR UPDATE', [createTransactionDto.toAccountId]);
            if (receiverResult.rows.length === 0) {
                throw new common_1.NotFoundException('Receiver account not found');
            }
            const [isDailyLimitExceeded, isWeeklyLimitExceeded, isMonthlyLimitExceeded, isSingleTransactionLimitExceeded,] = await Promise.all([
                this.transactionLimitsService.checkDailyLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
                this.transactionLimitsService.checkWeeklyLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
                this.transactionLimitsService.checkMonthlyLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
                this.transactionLimitsService.checkSingleTransactionLimit(senderResult.rows[0].user_id, createTransactionDto.amount, senderResult.rows[0].currency),
            ]);
            if (!isDailyLimitExceeded) {
                throw new common_1.BadRequestException('Günlük transfer limiti aşıldı');
            }
            if (!isWeeklyLimitExceeded) {
                throw new common_1.BadRequestException('Haftalık transfer limiti aşıldı');
            }
            if (!isMonthlyLimitExceeded) {
                throw new common_1.BadRequestException('Aylık transfer limiti aşıldı');
            }
            if (!isSingleTransactionLimitExceeded) {
                throw new common_1.BadRequestException('Tek seferlik transfer limiti aşıldı');
            }
            const convertedAmount = await this.exchangeService.convertAmount(createTransactionDto.amount, senderResult.rows[0].currency, receiverResult.rows[0].currency);
            const transactionResult = await client.query(`INSERT INTO transactions 
                (sender_id, receiver_id, amount, currency, status, description)
                VALUES ($1, $2, $3, $4, 'completed', $5)
                RETURNING id`, [
                createTransactionDto.fromAccountId,
                createTransactionDto.toAccountId,
                convertedAmount,
                senderResult.rows[0].currency,
                createTransactionDto.description
            ]);
            const transactionId = transactionResult.rows[0].id;
            await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [createTransactionDto.amount, createTransactionDto.fromAccountId]);
            await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [convertedAmount, createTransactionDto.toAccountId]);
            await client.query('COMMIT');
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
            return {
                id: transactionId,
                status: 'completed',
                amount: convertedAmount,
                currency: receiverResult.rows[0].currency
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Transaction error:', error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Transaction creation failed: ' + error.message);
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
            getTransactionsDto.accountId,
            getTransactionsDto.limit,
            getTransactionsDto.offset
        ];
        return this.databaseService.query(query, values);
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