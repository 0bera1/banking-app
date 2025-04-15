import { ExchangeService } from './exchange.service';
export declare class ExchangeController {
    private readonly exchangeService;
    constructor(exchangeService: ExchangeService);
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<{
        rate: number;
    }>;
    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<{
        amount: number;
    }>;
    getSupportedCurrencies(): {
        currencies: string[];
    };
}
