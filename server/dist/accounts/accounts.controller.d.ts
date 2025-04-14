import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    create(createAccountDto: CreateAccountDto): Promise<Account>;
    findOne(id: string): Promise<Account>;
    remove(id: string): Promise<void>;
    findByCardNumber(cardNumber: string): Promise<Account>;
}
