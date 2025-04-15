import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ExchangeService {
  private exchangeRates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.85,
    TRY: 31.50,
    GBP: 0.73,
  };

  constructor(private readonly databaseService: DatabaseService) {}

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const fromRate = this.exchangeRates[fromCurrency.toUpperCase()];
    const toRate = this.exchangeRates[toCurrency.toUpperCase()];

    if (!fromRate || !toRate) {
      throw new Error('Desteklenmeyen para birimi');
    }

    return toRate / fromRate;
  }

  async convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(this.exchangeRates);
  }
} 