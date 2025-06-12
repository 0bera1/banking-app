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
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("./accounts.service");
let AccountsController = class AccountsController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async createAccount(request) {
        return await this.accountService.createAccount(request.userId, request.amount);
    }
    async closeAccount(id) {
        await this.accountService.closeAccount(id);
    }
    async getBalance(id) {
        const balance = await this.accountService.getBalance(id);
        return {
            balance: balance.balance,
            currency: balance.currency
        };
    }
    async updateStatus(id, request) {
        const account = await this.accountService.updateStatus(id, request.status, request.userId);
        return {
            id: account.id,
            status: account.status,
            message: 'Hesap durumu başarıyla güncellendi'
        };
    }
    async verifyIban(request) {
        const account = await this.accountService.findByIban(request.iban);
        return {
            iban: request.iban,
            isValid: !!account,
            message: account ? 'IBAN doğrulandı' : 'IBAN bulunamadı'
        };
    }
    async deposit(id, request) {
        return await this.accountService.deposit(id, request.amount, request.userId);
    }
    async withdraw(id, request) {
        return await this.accountService.withdraw(id, request.amount, request.userId);
    }
    async getAccount(id) {
        return await this.accountService.findOne(id);
    }
    async getUserAccounts(userId) {
        return await this.accountService.findByUserId(userId);
    }
    async getAllAccounts() {
        return await this.accountService.findAll();
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "closeAccount", null);
__decorate([
    (0, common_1.Get)(':id/balance'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('verify-iban'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "verifyIban", null);
__decorate([
    (0, common_1.Post)(':id/deposit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)(':id/withdraw'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getUserAccounts", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getAllAccounts", null);
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)('accounts'),
    __param(0, (0, common_1.Inject)('IAccountService')),
    __metadata("design:paramtypes", [accounts_service_1.AccountService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map