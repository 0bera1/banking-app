import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto): Promise<{
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
