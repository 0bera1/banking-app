import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DatabaseService } from '../database/database.service';
import { ExchangeService } from '../exchange/exchange.service';
import { AuditService } from '../audit/audit.service';
import { TransactionLimitsService } from './transaction-limits.service';

const databaseService = new DatabaseService();
const exchangeService = new ExchangeService(databaseService);
const auditService = new AuditService(databaseService);
const transactionLimitsService = new TransactionLimitsService(databaseService, exchangeService);
const transactionsServiceInstance = new TransactionsService(
    databaseService,
    exchangeService,
    auditService,
    transactionLimitsService
);

@Module({
    controllers: [TransactionsController],
    providers: [
        {
            provide: DatabaseService,
            useValue: databaseService
        },
        {
            provide: TransactionsService,
            useValue: transactionsServiceInstance
        },
        ExchangeService,
        AuditService,
        TransactionLimitsService
    ],
    exports: [TransactionsService]
})
export class TransactionsModule {}
