"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalanceHandler = void 0;
class GetBalanceHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        var _a;
        const id = parseInt(request.params.id);
        const currency = (_a = request.query) === null || _a === void 0 ? void 0 : _a.currency;
        const balance = await this.accountService.getBalance(id, currency);
        return {
            balance: balance.balance,
            currency: balance.currency
        };
    }
}
exports.GetBalanceHandler = GetBalanceHandler;
//# sourceMappingURL=get-balance-handler.js.map