import { DatabaseService } from '../database/database.service';
export interface IExchangeService {
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
    getSupportedCurrencies(): string[];
}
export declare class ExchangeService implements IExchangeService {
    private readonly databaseService;
    private readonly exchangeRates;
    constructor(databaseService: DatabaseService);
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
    getSupportedCurrencies(): string[];
}
