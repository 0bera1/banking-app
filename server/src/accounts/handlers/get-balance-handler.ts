import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { BalanceResponse } from '../dto/balance-response.dto';
import { AccountService } from '../accounts.service';

export class GetBalanceHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: AccountRequest): Promise<BalanceResponse> {
        const id = parseInt(request.params.id);
        const currency = request.query?.currency;
        const balance = await this.accountService.getBalance(id, currency);
        return {
            balance: balance.balance,
            currency: balance.currency
        };
    }
} 