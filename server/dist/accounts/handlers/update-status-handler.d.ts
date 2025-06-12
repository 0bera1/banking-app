import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountStatusResponse } from '../dto/account-status-response.dto';
import { AccountService } from '../accounts.service';
export declare class UpdateStatusHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: AccountRequest): Promise<AccountStatusResponse>;
}
