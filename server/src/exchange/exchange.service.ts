import {DatabaseService} from '../database/database.service';

export interface IExchangeService {
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;

    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;

    getSupportedCurrencies(): string[];
}

export class ExchangeService implements IExchangeService {
    private readonly databaseService: DatabaseService;
    private readonly exchangeRates: { [key: string]: number } = {
        USD: 1,
        EUR: 0.85,
        TRY: 31.50,
        GBP: 0.73,
    };

    public constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
        const fromRate:number = this.exchangeRates[fromCurrency.toUpperCase()];
        const toRate:number = this.exchangeRates[toCurrency.toUpperCase()];

        if (!fromRate || !toRate) {
            throw new Error('Desteklenmeyen para birimi');
        }

        return toRate / fromRate;
    }

    public async convertAmount(amount: number,
                               fromCurrency: string,
                               toCurrency: string,
    ): Promise<number> {
        const rate:number = await this.getExchangeRate(fromCurrency, toCurrency);
        return amount * rate;
    }

    public getSupportedCurrencies(): string[] {
        return Object.keys(this.exchangeRates);
    }
} 