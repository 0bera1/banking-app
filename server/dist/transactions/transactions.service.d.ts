import { DatabaseService } from '../database/database.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';
export declare class TransactionsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createTransaction(userId: number, fromAccountId: number, receiverIban: string, amount: number, currency: string, description?: string): Promise<any>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<any>;
    getTransactionsByUserId(userId: number): Promise<any>;
}
