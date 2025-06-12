export interface ExchangeRepository {
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;

    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;

    getSupportedCurrencies(): string[];
} 