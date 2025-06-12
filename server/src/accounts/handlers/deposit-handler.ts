import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountResponse } from '../dto/account-response.dto';
import { AccountService } from '../accounts.service';

export class DepositHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: AccountRequest): Promise<AccountResponse> {
        const id = parseInt(request.params.id);
        const amount = request.body.amount;
        const userId = request.userId || 0;
        return await this.accountService.deposit(id, amount, userId);
    }
} 