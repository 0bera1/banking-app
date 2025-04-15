import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { AuditService } from '../audit/audit.service';
import { TransactionLimitsService } from './transaction-limits.service';
export declare class TransactionsService {
    private readonly databaseService;
    private readonly exchangeService;
    private readonly auditService;
    private readonly transactionLimitsService;
    constructor(databaseService: DatabaseService, exchangeService: ExchangeService, auditService: AuditService, transactionLimitsService: TransactionLimitsService);
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<{
        id: any;
        status: string;
        amount: number;
        currency: any;
    }>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<any>;
}
