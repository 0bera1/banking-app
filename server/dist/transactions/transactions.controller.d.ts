import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { DatabaseService } from '../database/database.service';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly databaseService;
    constructor(transactionsService: TransactionsService, databaseService: DatabaseService);
    create(createTransactionDto: CreateTransactionDto): Promise<any>;
    getUserTransactions(userId: string): Promise<unknown[]>;
    getAccountTransactions(accountId: string): Promise<unknown[]>;
    findAll(queryParams: GetTransactionsDto, req: any): Promise<unknown[]>;
}
