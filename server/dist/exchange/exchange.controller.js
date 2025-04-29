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
exports.ExchangeController = void 0;
const common_1 = require("@nestjs/common");
const exchange_service_1 = require("./exchange.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ExchangeController = class ExchangeController {
    constructor(exchangeService) {
        this.exchangeService = exchangeService;
    }
    getExchangeRate(fromCurrency, toCurrency) {
        return this.exchangeService.getExchangeRate(fromCurrency, toCurrency);
    }
    convertAmount(amount, fromCurrency, toCurrency) {
        return this.exchangeService.convertAmount(amount, fromCurrency, toCurrency);
    }
    getSupportedCurrencies() {
        return this.exchangeService.getSupportedCurrencies();
    }
};
exports.ExchangeController = ExchangeController;
__decorate([
    (0, common_1.Get)('rate'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "getExchangeRate", null);
__decorate([
    (0, common_1.Get)('convert'),
    __param(0, (0, common_1.Query)('amount')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ExchangeController.prototype, "convertAmount", null);
__decorate([
    (0, common_1.Get)('currencies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ExchangeController.prototype, "getSupportedCurrencies", null);
exports.ExchangeController = ExchangeController = __decorate([
    (0, common_1.Controller)('exchange'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService])
], ExchangeController);
//# sourceMappingURL=exchange.controller.js.map