import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DatabaseModule } from '../database/database.module';
import { ExchangeModule } from '../exchange/exchange.module';
import { AuditModule } from '../audit/audit.module';
import { TransactionLimitsModule } from './transaction-limits.module';

@Module({
  imports: [
    DatabaseModule,
    ExchangeModule,
    AuditModule,
    TransactionLimitsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
