import { AccountService } from './accounts.service';
import { AccountRequest } from './dto/account-request.dto';
import { AccountResponse } from './dto/account-response.dto';
import { BalanceResponse } from './dto/balance-response.dto';
import { AccountStatusResponse } from './dto/account-status-response.dto';
import { IbanVerificationResponse } from './dto/iban-verification-response.dto';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: number;
    };
}
export declare class AccountsController {
    private readonly accountService;
    constructor(accountService: AccountService);
    createAccount(request: AccountRequest): Promise<AccountResponse>;
    closeAccount(id: number): Promise<void>;
    getBalance(id: number): Promise<BalanceResponse>;
    updateStatus(id: number, request: AccountRequest): Promise<AccountStatusResponse>;
    verifyIban(request: AccountRequest): Promise<IbanVerificationResponse>;
    deposit(id: number, request: AccountRequest): Promise<AccountResponse>;
    withdraw(id: number, request: AccountRequest): Promise<AccountResponse>;
    getAccount(id: number): Promise<AccountResponse>;
    getUserAccounts(userId: number): Promise<Array<AccountResponse>>;
    getAllAccounts(req: RequestWithUser): Promise<Array<AccountResponse>>;
}
export {};
