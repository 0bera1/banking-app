import { GetTransactionsDto } from "../dto/get-transactions.dto";
import { TransactionResponse } from "../dto/transaction-response.dto";
export interface TransactionRepository {
    createTransaction(userId: number, fromAccountId: number, receiverIban: string, amount: number, currency: string, description?: string): Promise<TransactionResponse>;
    getTransactions(getTransactionsDto: GetTransactionsDto): Promise<Array<TransactionResponse>>;
    getTransactionsByUserId(userId: number): Promise<Array<TransactionResponse>>;
}
