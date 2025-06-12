"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyIbanHandler = void 0;
class VerifyIbanHandler {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async handle(request) {
        const iban = request.params.iban;
        const account = await this.accountService.findByIban(iban);
        return {
            iban: iban,
            isValid: !!account,
            message: account ? 'IBAN doğrulandı' : 'IBAN bulunamadı'
        };
    }
}
exports.VerifyIbanHandler = VerifyIbanHandler;
//# sourceMappingURL=verify-iban-handler.js.map