import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DatabaseModule } from '../database/database.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AuditModule } from '../audit/audit.module';
import { ExchangeModule } from '../exchange/exchange.module';
import { TransactionLimitsModule } from './transaction-limits.module';

@Module({
  imports: [
    DatabaseModule,
    AccountsModule,
    AuditModule,
    ExchangeModule,
    TransactionLimitsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
