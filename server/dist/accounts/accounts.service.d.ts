import { DatabaseService } from '../database/database.service';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
export declare class AccountsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<Account>;
    findByCardNumber(cardNumber: string): Promise<Account>;
    updateBalance(id: number, amount: number): Promise<Account>;
    updateStatus(id: number, status: 'active' | 'inactive' | 'blocked'): Promise<Account>;
}
