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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const database_service_1 = require("../database/database.service");
let TransactionsController = class TransactionsController {
    constructor(transactionsService, databaseService) {
        this.transactionsService = transactionsService;
        this.databaseService = databaseService;
    }
    async create(createTransactionDto) {
        const result = await this.transactionsService.createTransaction(createTransactionDto.sender_id, createTransactionDto.from_account_id, createTransactionDto.receiver_iban, createTransactionDto.amount, createTransactionDto.currency, createTransactionDto.description);
        return result;
    }
    async getUserTransactions(userId) {
        const result = await this.transactionsService.getTransactionsByUserId(parseInt(userId));
        return result;
    }
    async getAccountTransactions(accountId) {
        const accountResult = await this.databaseService.query('SELECT id FROM accounts WHERE id = $1', [accountId]);
        if (!accountResult.rows[0]) {
            throw new Error('Hesap bulunamadı');
        }
        const result = await this.transactionsService.getTransactions({
            account_id: accountResult.rows[0].id
        });
        return result;
    }
    async findAll(queryParams, req) {
        try {
            const accountQuery = `
                SELECT id FROM accounts 
                WHERE user_id = $1 AND status = 'active' 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            const accountResult = await this.databaseService.query(accountQuery, [req.user.id]);
            if (!accountResult.rows[0]) {
                throw new common_1.HttpException('Aktif hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
            }
            const getTransactionsDto = Object.assign(Object.assign({}, queryParams), { account_id: accountResult.rows[0].id });
            return await this.transactionsService.getTransactions(getTransactionsDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'İşlemler getirilirken bir hata oluştu', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getUserTransactions", null);
__decorate([
    (0, common_1.Get)('account/:accountId'),
    __param(0, (0, common_1.Param)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAccountTransactions", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        database_service_1.DatabaseService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map