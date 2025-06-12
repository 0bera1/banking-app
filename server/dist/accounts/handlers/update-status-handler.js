"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusHandler = void 0;
class UpdateStatusHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
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
exports.UpdateStatusHandler = UpdateStatusHandler;
//# sourceMappingURL=update-status-handler.js.map