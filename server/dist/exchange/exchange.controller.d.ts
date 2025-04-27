import { ExchangeService } from './exchange.service';
export declare class ExchangeController {
    private readonly exchangeService;
    constructor(exchangeService: ExchangeService);
    getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
    convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
    getSupportedCurrencies(): string[];
}
