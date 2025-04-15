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
exports.ExchangeService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ExchangeService = class ExchangeService {
    constructor(databaseService) {
        this.databaseService = databaseService;
        this.exchangeRates = {
            USD: 1,
            EUR: 0.85,
            TRY: 31.50,
            GBP: 0.73,
        };
    }
    async getExchangeRate(fromCurrency, toCurrency) {
        const fromRate = this.exchangeRates[fromCurrency.toUpperCase()];
        const toRate = this.exchangeRates[toCurrency.toUpperCase()];
        if (!fromRate || !toRate) {
            throw new Error('Desteklenmeyen para birimi');
        }
        return toRate / fromRate;
    }
    async convertAmount(amount, fromCurrency, toCurrency) {
        const rate = await this.getExchangeRate(fromCurrency, toCurrency);
        return amount * rate;
    }
    getSupportedCurrencies() {
        return Object.keys(this.exchangeRates);
    }
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ExchangeService);
//# sourceMappingURL=exchange.service.js.map