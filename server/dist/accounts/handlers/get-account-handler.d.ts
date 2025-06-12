import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountService } from '../accounts.service';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountResponse } from '../dto/account-response.dto';
export declare class GetAccountHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: AccountRequest): Promise<AccountResponse>;
}
