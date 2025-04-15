import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto): Promise<{
        id: any;
        status: string;
        amount: number;
        currency: any;
    }>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<any>;
}
