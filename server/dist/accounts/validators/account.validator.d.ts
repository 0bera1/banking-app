import { AccountValidationContract } from '../interfaces/account.interface';
import { AccountRepository } from '../repositories/account.repository';
export declare class AccountValidator implements AccountValidationContract {
    private readonly repository;
    constructor(repository: AccountRepository);
    validateTransfer(fromAccountId: number, toAccountId: number, amount: number): Promise<void>;
    validateAccountCreation(userId: number, initialBalance: number): Promise<void>;
    validateAccountClosure(accountId: number): Promise<void>;
    validateBalanceUpdate(id: number, amount: number): Promise<void>;
    validateStatusUpdate(id: number, status: 'active' | 'inactive' | 'blocked'): Promise<void>;
    validateDeposit(id: number, amount: number): Promise<void>;
    validateWithdraw(id: number, amount: number): Promise<void>;
}
