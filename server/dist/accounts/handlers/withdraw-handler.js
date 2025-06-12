"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawHandler = void 0;
class WithdrawHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        const id = parseInt(request.params.id);
        const amount = request.body.amount;
        const userId = request.userId || 0;
        return await this.accountService.withdraw(id, amount, userId);
    }
}
exports.WithdrawHandler = WithdrawHandler;
//# sourceMappingURL=withdraw-handler.js.map