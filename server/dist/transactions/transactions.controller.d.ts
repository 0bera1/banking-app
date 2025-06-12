import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { DatabaseService } from '../database/database.service';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly databaseService;
    constructor(transactionsService: TransactionsService, databaseService: DatabaseService);
    create(createTransactionDto: CreateTransactionDto): Promise<any>;
    getUserTransactions(userId: string): Promise<any[]>;
    getAccountTransactions(accountId: string): Promise<any[]>;
    findAll(queryParams: GetTransactionsDto, req: any): Promise<any[]>;
}
