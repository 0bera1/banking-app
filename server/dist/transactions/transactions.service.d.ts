import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { AuditService } from '../audit/audit.service';
export declare class TransactionsService {
    private readonly databaseService;
    private readonly auditService;
    constructor(databaseService: DatabaseService, auditService: AuditService);
    createTransaction(createTransactionDto: CreateTransactionDto): Promise<{
        transactionId: any;
        status: string;
        message: string;
    }>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<{
        transactions: any;
        total: number;
        limit: number;
        offset: number;
    }>;
}
