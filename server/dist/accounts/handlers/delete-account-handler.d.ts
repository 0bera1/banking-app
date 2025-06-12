import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountService } from '../accounts.service';
export declare class DeleteAccountHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: AccountRequest): Promise<void>;
}
