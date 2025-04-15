import { Module } from '@nestjs/common';
import { TransactionLimitsService } from './transaction-limits.service';
import { DatabaseModule } from '../database/database.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [DatabaseModule, ExchangeModule],
  providers: [TransactionLimitsService],
  exports: [TransactionLimitsService],
})
export class TransactionLimitsModule {} 