import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { BalanceResponse } from '../dto/balance-response.dto';
import { AccountService } from '../accounts.service';
export declare class GetBalanceHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: AccountRequest): Promise<BalanceResponse>;
}
