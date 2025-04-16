import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { UsersService } from '../users/users.service';
export declare class AccountsController {
    private readonly accountsService;
    private readonly usersService;
    constructor(accountsService: AccountsService, usersService: UsersService);
    create(req: any, createAccountDto: CreateAccountDto): Promise<Account>;
    findOne(req: any, id: string): Promise<Account>;
    findAll(req: any): Promise<Account[]>;
    remove(req: any, id: string): Promise<void>;
    findByCardNumber(req: any, cardNumber: string): Promise<Account>;
    deposit(id: string, amount: number): Promise<any>;
    withdraw(id: string, amount: number): Promise<any>;
    getBalance(id: string, currency?: string): Promise<{
        balance: number;
        currency: string;
    }>;
    verifyIban(iban: string): Promise<{
        iban: string;
        first_name: string;
        last_name: string;
    }>;
}
