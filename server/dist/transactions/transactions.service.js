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
const audit_service_1 = require("../audit/audit.service");
let TransactionsService = class TransactionsService {
    constructor(databaseService, auditService) {
        this.databaseService = databaseService;
        this.auditService = auditService;
    }
    async createTransaction(createTransactionDto) {
        const client = await this.databaseService.getClient();
        try {
            await client.query('BEGIN');
            const senderResult = await client.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [createTransactionDto.senderAccountId]);
            if (senderResult.rows.length === 0) {
                throw new common_1.NotFoundException('Sender account not found');
            }
            const senderBalance = parseFloat(senderResult.rows[0].balance);
            if (senderBalance < createTransactionDto.amount) {
                throw new common_1.BadRequestException('Insufficient balance');
            }
            const receiverResult = await client.query('SELECT id FROM accounts WHERE id = $1 FOR UPDATE', [createTransactionDto.receiverAccountId]);
            if (receiverResult.rows.length === 0) {
                throw new common_1.NotFoundException('Receiver account not found');
            }
            const transactionResult = await client.query(`INSERT INTO transactions 
                (sender_account_id, receiver_account_id, amount, description, status)
                VALUES ($1, $2, $3, $4, 'completed')
                RETURNING id`, [
                createTransactionDto.senderAccountId,
                createTransactionDto.receiverAccountId,
                createTransactionDto.amount,
                createTransactionDto.description
            ]);
            const transactionId = transactionResult.rows[0].id;
            await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [createTransactionDto.amount, createTransactionDto.senderAccountId]);
            await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [createTransactionDto.amount, createTransactionDto.receiverAccountId]);
            await client.query('COMMIT');
            await this.auditService.log('CREATE', 'transactions', transactionId, null, {
                senderAccountId: createTransactionDto.senderAccountId,
                receiverAccountId: createTransactionDto.receiverAccountId,
                amount: createTransactionDto.amount,
                description: createTransactionDto.description,
                status: 'completed'
            });
            return {
                transactionId,
                status: 'completed',
                message: 'Transfer successfully completed'
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
        query += ` ORDER BY t.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);
        const result = await this.databaseService.query(query, queryParams);
        const countQuery = `
            SELECT COUNT(*) as total
            FROM transactions t
            ${accountId ? 'WHERE t.sender_account_id = $1 OR t.receiver_account_id = $1' : ''}
        `;
        const countResult = await this.databaseService.query(countQuery, accountId ? [accountId] : []);
        return {
            transactions: result.rows,
            total: parseInt(countResult.rows[0].total),
            limit,
            offset
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        audit_service_1.AuditService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map