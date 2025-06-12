import { DatabaseService } from '../../database/database.service';
import { AccountRepositoryContract } from '../interfaces/account.interface';
import { AccountResponse } from '../dto/account-response.dto';
export declare class AccountRepository implements AccountRepositoryContract {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private mapToAccountResponse;
    getBalance(id: number, currency?: string): Promise<{
        balance: number;
        currency: string;
    }>;
    updateBalance(id: number, amount: number): Promise<AccountResponse>;
    create(userId: number, initialBalance: number, currency: string): Promise<AccountResponse>;
    remove(id: number, userId: number): Promise<void>;
    findOne(id: number): Promise<AccountResponse>;
    findByUserId(userId: number): Promise<AccountResponse[]>;
    findByCardNumber(cardNumber: string): Promise<AccountResponse>;
    updateStatus(id: number, status: string, userId: number): Promise<AccountResponse>;
    findAll(): Promise<AccountResponse[]>;
    deposit(id: number, amount: number, userId: number): Promise<AccountResponse>;
    withdraw(id: number, amount: number, userId: number): Promise<AccountResponse>;
    findByIban(iban: string): Promise<AccountResponse>;
    private generateIban;
}
