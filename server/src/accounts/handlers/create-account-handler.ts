import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountService } from '../accounts.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AccountResponse } from '../dto/account-response.dto';

export class CreateAccountHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: CreateAccountDto & { user_id: number }): Promise<AccountResponse> {
        return await this.accountService.create(request);
    }
} 