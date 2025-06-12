import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { IbanVerificationResponse } from '../dto/iban-verification-response.dto';
import { AccountService } from '../accounts.service';
export declare class VerifyIbanHandler implements AccountHandler {
    private readonly accountService;
    constructor(accountService: AccountService);
    handle(request: AccountRequest): Promise<IbanVerificationResponse>;
}
