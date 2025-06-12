import { AccountRepository } from '../interfaces/AccountRepository';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountResponse } from '../dto/account-response.dto';
import { DatabaseRepository } from '../../database/interfaces/database.interface';
export declare class AccountRepositoryImpl implements AccountRepository {
    private readonly db;
    constructor(db: DatabaseRepository);
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
}
