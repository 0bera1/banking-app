"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositHandler = void 0;
class DepositHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        const id = parseInt(request.params.id);
        const amount = request.body.amount;
        const userId = request.userId || 0;
        return await this.accountService.deposit(id, amount, userId);
    }
}
exports.DepositHandler = DepositHandler;
//# sourceMappingURL=deposit-handler.js.map