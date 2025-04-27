import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { DatabaseService } from '../database/database.service';
export declare class AccountsController {
    private readonly accountsService;
    private readonly usersService;
    constructor(accountsService: AccountsService, databaseService: DatabaseService);
    getUserAccounts(req: any): Promise<Account[]>;
    getAccountById(req: any, id: string): Promise<Account>;
    createAccount(req: any, createAccountDto: CreateAccountDto): Promise<Account>;
    deleteAccount(req: any, id: string): Promise<{
        message: string;
    }>;
    deposit(req: any, id: string, amount: number): Promise<any>;
    withdraw(req: any, id: string, amount: number): Promise<any>;
    findByCardNumber(req: any, cardNumber: string): Promise<Account>;
    getBalance(id: string, currency?: string): Promise<{
        balance: number;
        currency: string;
    }>;
    verifyIban(iban: string): Promise<{
        iban: string;
        first_name: any;
        last_name: any;
        status: string;
    }>;
    updateStatus(req: any, id: string, status: 'active' | 'inactive' | 'blocked'): Promise<Account>;
}
