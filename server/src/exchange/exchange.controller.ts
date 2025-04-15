import { Controller, Get, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeService: ExchangeService) {}

    @Get('rate')
    async getExchangeRate(
        @Query('from') fromCurrency: string,
        @Query('to') toCurrency: string,
    ) {
        const rate = await this.exchangeService.getExchangeRate(fromCurrency, toCurrency);
        return { rate };
    }

    @Get('convert')
    async convertAmount(
        @Query('amount') amount: number,
        @Query('from') fromCurrency: string,
        @Query('to') toCurrency: string,
    ) {
        const convertedAmount = await this.exchangeService.convertAmount(
            amount,
            fromCurrency,
            toCurrency,
        );
        return { amount: convertedAmount };
    }

    @Get('currencies')
    getSupportedCurrencies() {
        return {
            currencies: this.exchangeService.getSupportedCurrencies(),
        };
    }
} 