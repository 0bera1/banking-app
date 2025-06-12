import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountResponse } from '../dto/account-response.dto';
import { AccountService } from '../accounts.service';
export declare class WithdrawHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: AccountRequest): Promise<AccountResponse>;
}
