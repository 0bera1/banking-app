import { AccountHandler } from '../interfaces/account-handler.interface';
import { AccountRequest } from '../dto/account-request.dto';
import { AccountStatusResponse } from '../dto/account-status-response.dto';
import { AccountService } from '../accounts.service';

export class UpdateStatusHandler implements AccountHandler {
    constructor(private readonly accountService: AccountService) {}

    public async handle(request: AccountRequest): Promise<AccountStatusResponse> {
        const id = parseInt(request.params.id);
        const status = request.body.status;
        const userId = request.userId || 0;
        const account = await this.accountService.updateStatus(id, status, userId);
        return {
            id: account.id,
            status: account.status,
            message: 'Hesap durumu başarıyla güncellendi'
        };
    }
} 