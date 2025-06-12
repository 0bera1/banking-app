import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { IbanVerificationResponse } from '../dto/iban-verification-response.dto';
import { AccountService } from '../accounts.service';

export class VerifyIbanHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: AccountRequest): Promise<IbanVerificationResponse> {
        const iban = request.params.iban;
        const account = await this.accountService.findByIban(iban);
        return {
            iban: iban,
            isValid: !!account,
            message: account ? 'IBAN doğrulandı' : 'IBAN bulunamadı'
        };
    }
} 