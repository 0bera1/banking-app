"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccountHandler = void 0;
class GetAccountHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        var _a;
        const id = parseInt(((_a = request.params) === null || _a === void 0 ? void 0 : _a.id) || '0');
        return await this.accountService.findOne(id);
    }
}
exports.GetAccountHandler = GetAccountHandler;
//# sourceMappingURL=get-account-handler.js.map