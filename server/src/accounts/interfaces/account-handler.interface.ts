import { AccountRequest } from '../dto/account-request.dto';
import { AccountResponse } from '../dto/account-response.dto';
import { BalanceResponse } from '../dto/balance-response.dto';
import { AccountStatusResponse } from '../dto/account-status-response.dto';
import { IbanVerificationResponse } from '../dto/iban-verification-response.dto';

export interface AccountHandler {
    handle(request: AccountRequest): Promise<AccountResponse | BalanceResponse | AccountStatusResponse | IbanVerificationResponse | void>;
}

export interface AccountOperation {
    type: 'create' | 'read' | 'update' | 'delete';
    description: string;
}

export interface AccountValidator {
    validate(request: AccountRequest): Promise<void>;
} 