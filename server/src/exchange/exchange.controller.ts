import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {ExchangeService} from './exchange.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('exchange')
@UseGuards(JwtAuthGuard)
export class ExchangeController {
    private readonly exchangeService: ExchangeService;

    public constructor(exchangeService: ExchangeService) {
        this.exchangeService = exchangeService;
    }

    @Get('rate')
    public getExchangeRate(@Query('from') fromCurrency: string,
                           @Query('to') toCurrency: string
    ): Promise<number> {
        return this.exchangeService.getExchangeRate(fromCurrency, toCurrency);
    }

    @Get('convert')
    public convertAmount(@Query('amount') amount: number,
                         @Query('from') fromCurrency: string,
                         @Query('to') toCurrency: string
    ): Promise<number> {
        return this.exchangeService.convertAmount(amount, fromCurrency, toCurrency);
    }

    @Get('currencies')
    public getSupportedCurrencies(): string[] {
        return this.exchangeService.getSupportedCurrencies();
    }
} 