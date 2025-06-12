import { AccountRepository } from './repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UsersService } from '../users/users.service';
import { AccountServiceContract } from './interfaces/account.interface';
import { AccountResponse } from './dto/account-response.dto';
import { AccountValidator } from './validators/account.validator';
export declare class AccountService implements AccountServiceContract {
    private readonly repository;
    private readonly usersService;
    private readonly validator;
    constructor(repository: AccountRepository, usersService: UsersService, validator: AccountValidator);
    getAccountBalance(accountId: number): Promise<number>;
    transferMoney(fromAccountId: number, toAccountId: number, amount: number): Promise<void>;
    createAccount(userId: number, initialBalance: number): Promise<AccountResponse>;
    closeAccount(accountId: number): Promise<void>;
    create(createAccountDto: CreateAccountDto & {
        user_id: number;
    }): Promise<AccountResponse>;
    remove(id: number, user_id: number): Promise<void>;
    findOne(id: number): Promise<AccountResponse>;
    findByUserId(user_id: number): Promise<Array<AccountResponse>>;
    findByCardNumber(cardNumber: string): Promise<AccountResponse>;
    updateBalance(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<AccountResponse>;
    findAll(): Promise<Array<AccountResponse>>;
    deposit(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    withdraw(id: number, amount: number, user_id: number): Promise<AccountResponse>;
    getBalance(id: number, currency?: string): Promise<{
        balance: number;
        currency: string;
    }>;
    findByIban(iban: string): Promise<AccountResponse>;
    private generateAccountNumber;
    private generateIban;
}
