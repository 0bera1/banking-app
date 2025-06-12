import { IDatabaseService } from '../../database/interfaces/database.interface';
import { AccountResponse } from '../dto/account-response.dto';
import { CreateAccountDto } from '../dto/create-account.dto';

export interface Transaction {
    id: number;
    accountId: number;
    amount: number;
    type: 'deposit' | 'withdraw' | 'transfer';
    date: Date;
    description?: string;
}

export interface AccountServiceContract {
    getAccountBalance(accountId: number): Promise<number>;
    transferMoney(fromAccountId: number, toAccountId: number, amount: number): Promise<void>;
    createAccount(userId: number, initialBalance: number): Promise<AccountResponse>;
    closeAccount(accountId: number): Promise<void>;
    create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<AccountResponse>;
    remove(id: number, user_id: number): Promise<void>;
    findOne(id: number): Promise<AccountResponse>;
    findByUserId(user_id: number): Promise<Array<AccountResponse>>;
    findByCardNumber(cardNumber: string): Promise<AccountResponse>;
    updateBalance(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<AccountResponse>;
    findAll(): Promise<Array<AccountResponse>>;
    deposit(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    withdraw(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string; }>;
    findByIban(iban: string): Promise<AccountResponse>;
}

export interface AccountRepositoryContract {
    getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string; }>;
    updateBalance(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<AccountResponse>;
    remove(id: number, user_id: number): Promise<void>;
    findOne(id: number): Promise<AccountResponse>;
    findByUserId(user_id: number): Promise<Array<AccountResponse>>;
    findByCardNumber(cardNumber: string): Promise<AccountResponse>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<AccountResponse>;
    findAll(): Promise<Array<AccountResponse>>;
    deposit(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    withdraw(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    findByIban(iban: string): Promise<AccountResponse>;
}

export interface AccountValidationContract {
    validateTransfer(fromAccountId: number, toAccountId: number, amount: number): Promise<void>;
    validateAccountCreation(userId: number, initialBalance: number): Promise<void>;
    validateAccountClosure(accountId: number): Promise<void>;
    validateBalanceUpdate(id: number, amount: number): Promise<void>;
    validateStatusUpdate(id: number, status: 'active' | 'inactive' | 'blocked'): Promise<void>;
    validateDeposit(id: number, amount: number): Promise<void>;
    validateWithdraw(id: number, amount: number): Promise<void>;
} 