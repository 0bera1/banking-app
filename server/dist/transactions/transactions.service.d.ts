import { DatabaseService } from '../database/database.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { IExchangeService } from '../exchange/exchange.service';
import { IAuditService } from '../audit/audit.service';
import { TransactionLimitsService } from './transaction-limits.service';
export interface ITransactionsService {
    createTransaction(userId: number, fromAccountId: number, receiverIban: string, amount: number, currency: string, description?: string): Promise<any>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<any[]>;
    getTransactionsByUserId(userId: number): Promise<any[]>;
}
export declare class TransactionsService implements ITransactionsService {
    private readonly databaseService;
    private readonly exchangeService;
    private readonly auditService;
    private readonly transactionLimitsService;
    constructor(databaseService: DatabaseService, exchangeService: IExchangeService, auditService: IAuditService, transactionLimitsService: TransactionLimitsService);
    createTransaction(userId: number, fromAccountId: number, receiverIban: string, amount: number, currency: string, description?: string): Promise<any>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<any>;
    getTransactionsByUserId(userId: number): Promise<any>;
}
