"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeService = void 0;
class ExchangeService {
    constructor(databaseService) {
        this.exchangeRates = {
            USD: 1,
            EUR: 0.85,
            TRY: 31.50,
            GBP: 0.73,
        };
        this.databaseService = databaseService;
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
}
exports.ExchangeService = ExchangeService;
//# sourceMappingURL=exchange.service.js.map