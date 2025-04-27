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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
const database_service_1 = require("../database/database.service");
let AccountsController = class AccountsController {
    constructor(accountsService, databaseService) {
        this.accountsService = accountsService;
        this.usersService = new users_service_1.UsersService(databaseService);
    }
    async getUserAccounts(req) {
        const userId = req.user.id;
        if (!userId) {
            throw new common_1.BadRequestException('Kullanıcı bilgisi bulunamadı');
        }
        return await this.accountsService.findByUserId(userId);
    }
    async getAccountById(req, id) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new common_1.BadRequestException('Geçersiz hesap ID formatı');
        }
        const account = await this.accountsService.findOne(accountId);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.user_id !== req.user.id) {
            throw new common_1.HttpException('Bu hesabı görüntüleme yetkiniz yok', common_1.HttpStatus.FORBIDDEN);
        }
        return account;
    }
    async createAccount(req, createAccountDto) {
        var _a;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new common_1.BadRequestException('Kullanıcı bilgisi bulunamadı');
        }
        return await this.accountsService.create(Object.assign(Object.assign({}, createAccountDto), { user_id: req.user.id }));
    }
    async deleteAccount(req, id) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new common_1.BadRequestException('Geçersiz hesap ID formatı');
        }
        await this.accountsService.remove(accountId, req.user.id);
        return { message: 'Hesap başarıyla silindi' };
    }
    async deposit(req, id, amount) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new common_1.BadRequestException('Geçersiz hesap ID formatı');
        }
        if (!amount || amount <= 0) {
            throw new common_1.BadRequestException('Geçersiz miktar');
        }
        return await this.accountsService.deposit(accountId, amount, req.user.id);
    }
    async withdraw(req, id, amount) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new common_1.BadRequestException('Geçersiz hesap ID formatı');
        }
        if (!amount || amount <= 0) {
            throw new common_1.BadRequestException('Geçersiz miktar');
        }
        return await this.accountsService.withdraw(accountId, amount, req.user.id);
    }
    async findByCardNumber(req, cardNumber) {
        const account = await this.accountsService.findByCardNumber(cardNumber);
        if (!account) {
            throw new common_1.HttpException('Hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        if (account.user_id !== req.user.id) {
            throw new common_1.HttpException('Bu hesabı görüntüleme yetkiniz yok', common_1.HttpStatus.FORBIDDEN);
        }
        return account;
    }
    getBalance(id, currency) {
        return this.accountsService.getBalance(+id, currency);
    }
    async verifyIban(iban) {
        const account = await this.accountsService.findByIban(iban);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.status === 'inactive') {
            throw new common_1.BadRequestException('Bu IBAN\'a ait hesap aktif değil');
        }
        const user = await this.usersService.findOne(account.user_id);
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return {
            iban: account.iban,
            first_name: user.first_name,
            last_name: user.last_name,
            status: account.status
        };
    }
    async updateStatus(req, id, status) {
        try {
            return await this.accountsService.updateStatus(+id, status, req.user.id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Hesap durumu güncellenirken bir hata oluştu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getUserAccounts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "getAccountById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Put)(':id/deposit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Put)(':id/withdraw'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Get)('card/:cardNumber'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('cardNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findByCardNumber", null);
__decorate([
    (0, common_1.Get)(':id/balance'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('verify-iban/:iban'),
    __param(0, (0, common_1.Param)('iban')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "verifyIban", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "updateStatus", null);
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)('accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService,
        database_service_1.DatabaseService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map