import { DatabaseService } from '../database/database.service';
export declare class ExchangeService {
    private readonly databaseService;
    private exchangeRates;
    constructor(databaseService: DatabaseService);
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
    getSupportedCurrencies(): string[];
}
