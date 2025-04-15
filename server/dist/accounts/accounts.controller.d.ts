import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
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
}
