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
let AccountsController = class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    async create(createAccountDto) {
        try {
            return await this.accountsService.create(createAccountDto);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException('Bu kart numarası zaten kullanımda', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Hesap oluşturulurken bir hata oluştu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new common_1.HttpException('Hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        return account;
    }
    async remove(id) {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new common_1.HttpException('Hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        await this.accountsService.remove(+id);
    }
    async findByCardNumber(cardNumber) {
        const account = await this.accountsService.findByCardNumber(cardNumber);
        if (!account) {
            throw new common_1.HttpException('Hesap bulunamadı', common_1.HttpStatus.NOT_FOUND);
        }
        return account;
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('card/:cardNumber'),
    __param(0, (0, common_1.Param)('cardNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountsController.prototype, "findByCardNumber", null);
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)('accounts'),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map