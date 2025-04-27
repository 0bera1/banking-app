import { DatabaseService } from '../database/database.service';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { IUsersService } from '../users/users.service';
import { IExchangeService } from '../exchange/exchange.service';
export interface IAccountsService {
    create(createAccountDto: CreateAccountDto & {
        user_id: number;
    }): Promise<Account>;
    remove(id: number, user_id: number): Promise<void>;
    findOne(id: number): Promise<Account>;
    findByUserId(user_id: number): Promise<Account[]>;
    findByCardNumber(cardNumber: string): Promise<Account>;
    updateBalance(id: number, amount: number, user_id: number): Promise<Account>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<Account>;
    findAll(): Promise<Account[]>;
    deposit(id: number, amount: number, user_id: number): Promise<Account>;
    withdraw(id: number, amount: number, user_id: number): Promise<Account>;
    getBalance(id: number, currency?: string): Promise<{
        balance: number;
        currency: string;
    }>;
    findByIban(iban: string): Promise<Account>;
}
export declare class AccountsService implements IAccountsService {
    private readonly databaseService;
    private readonly usersService;
    private readonly exchangeService;
    constructor(databaseService: DatabaseService, usersService: IUsersService, exchangeService: IExchangeService);
    private generateIban;
    private isIbanUnique;
    private generateUniqueIban;
    private generateCardNumber;
    create(createAccountDto: CreateAccountDto & {
        user_id: number;
    }): Promise<Account>;
    remove(id: number, user_id: number): Promise<void>;
    findOne(id: number): Promise<Account>;
    findByUserId(user_id: number): Promise<Account[]>;
    findByCardNumber(cardNumber: string): Promise<Account>;
    updateBalance(id: number, amount: number, user_id: number): Promise<Account>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<Account>;
    findAll(): Promise<any>;
    deposit(id: number, amount: number, user_id: number): Promise<any>;
    withdraw(id: number, amount: number, user_id: number): Promise<any>;
    getBalance(id: number, currency?: string): Promise<{
        balance: number;
        currency: string;
    }>;
    findByIban(iban: string): Promise<Account>;
}
