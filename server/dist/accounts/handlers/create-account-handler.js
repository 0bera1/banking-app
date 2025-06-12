"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountHandler = void 0;
class CreateAccountHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        return await this.accountService.create(request);
    }
}
exports.CreateAccountHandler = CreateAccountHandler;
//# sourceMappingURL=create-account-handler.js.map