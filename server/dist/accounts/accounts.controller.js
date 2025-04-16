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
const create_account_dto_1 = require("./dto/create-account.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
let AccountsController = class AccountsController {
    constructor(accountsService, usersService) {
        this.accountsService = accountsService;
        this.usersService = usersService;
    }
    async create(req, createAccountDto) {
        try {
            return await this.accountsService.create(Object.assign(Object.assign({}, createAccountDto), { user_id: req.user.id }));
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException('Bu kart numarası zaten kullanımda', common_1.HttpStatus.CONFLICT);
            }
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.HttpException('Hesap oluşturulurken bir hata oluştu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(req, id) {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new common_1.HttpException('Hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        if (account.user_id !== req.user.id) {
            throw new common_1.HttpException('Bu hesabı görüntüleme yetkiniz yok', common_1.HttpStatus.FORBIDDEN);
        }
        return account;
    }
    async findAll(req) {
        return await this.accountsService.findByUserId(req.user.id);
    }
    async remove(req, id) {
        try {
            await this.accountsService.remove(+id, req.user.id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Hesap silinirken bir hata oluştu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    deposit(id, amount) {
        return this.accountsService.deposit(+id, amount);
    }
    withdraw(id, amount) {
        return this.accountsService.withdraw(+id, amount);
    }
    getBalance(id, currency) {
        return this.accountsService.getBalance(+id, currency);
    }
    async verifyIban(iban) {
        const account = await this.accountsService.findByIban(iban);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        const user = await this.usersService.findOne(account.user_id);
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        return {
            iban: account.iban,
            first_name: user.first_name,
            last_name: user.last_name
        };
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('card/:cardNumber'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('cardNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findByCardNumber", null);
__decorate([
    (0, common_1.Put)(':id/deposit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Put)(':id/withdraw'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "withdraw", null);
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
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)('accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService,
        users_service_1.UsersService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map