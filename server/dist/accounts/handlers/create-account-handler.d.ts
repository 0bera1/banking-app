import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountService } from '../accounts.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountResponse } from '../dto/account-response.dto';
export declare class CreateAccountHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: CreateAccountDto & {
        user_id: number;
    }): Promise<AccountResponse>;
}
