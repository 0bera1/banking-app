import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountService } from '../accounts.service';

export class DeleteAccountHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: AccountRequest): Promise<void> {
        const id = parseInt(request.params.id);
        const userId = request.userId || 0;
        await this.accountService.remove(id, userId);
    }
} 