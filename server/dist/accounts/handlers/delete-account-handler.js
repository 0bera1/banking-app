"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAccountHandler = void 0;
class DeleteAccountHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        const id = parseInt(request.params.id);
        const userId = request.userId || 0;
        await this.accountService.remove(id, userId);
    }
}
exports.DeleteAccountHandler = DeleteAccountHandler;
//# sourceMappingURL=delete-account-handler.js.map