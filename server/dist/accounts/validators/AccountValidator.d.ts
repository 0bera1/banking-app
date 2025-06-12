import { AccountValidationContract } from '../interfaces/account.interface';
import { AccountRepository } from '../repositories/account.repository';
export declare class AccountValidator implements AccountValidationContract {
    private readonly repository;
    private readonly logger;
    private readonly MAX_INITIAL_BALANCE;
    private readonly MAX_ACCOUNTS_PER_USER;
    private readonly MIN_TRANSACTION_AMOUNT;
    private readonly MAX_TRANSACTION_AMOUNT;
    constructor(repository: AccountRepository);
    validateAccountCreation(userId: number, initialBalance: number): Promise<void>;
    validateAccountClosure(accountId: number): Promise<void>;
    validateBalanceUpdate(accountId: number, amount: number): Promise<void>;
    validateStatusUpdate(accountId: number, status: 'active' | 'inactive' | 'blocked'): Promise<void>;
    validateDeposit(accountId: number, amount: number): Promise<void>;
    validateWithdraw(accountId: number, amount: number): Promise<void>;
    validateTransfer(fromAccountId: number, toAccountId: number, amount: number): Promise<void>;
}
