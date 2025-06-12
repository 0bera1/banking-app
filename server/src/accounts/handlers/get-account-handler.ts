import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountService } from '../accounts.service';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountResponse } from '../dto/account-response.dto';

export class GetAccountHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: AccountRequest): Promise<AccountResponse> {
        const id = parseInt(request.params?.id || '0');
        return await this.accountService.findOne(id);
    }
} 