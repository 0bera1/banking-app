"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountValidator = void 0;
class AccountValidator {
    constructor(repository) {
        this.repository = repository;
    }
    async validateTransfer(fromAccountId, toAccountId, amount) {
        if (amount <= 0) {
            throw new Error('Transfer tutarı sıfırdan büyük olmalıdır');
        }
        const fromAccount = await this.repository.findOne(fromAccountId);
        if (!fromAccount) {
            throw new Error('Gönderen hesap bulunamadı');
        }
        const toAccount = await this.repository.findOne(toAccountId);
        if (!toAccount) {
            throw new Error('Alıcı hesap bulunamadı');
        }
        if (fromAccount.balance < amount) {
            throw new Error('Yetersiz bakiye');
        }
        if (fromAccount.status !== 'active') {
            throw new Error('Gönderen hesap aktif değil');
        }
        if (toAccount.status !== 'active') {
            throw new Error('Alıcı hesap aktif değil');
        }
    }
    async validateAccountCreation(userId, initialBalance) {
        if (!userId) {
            throw new Error('Kullanıcı ID gereklidir');
        }
        if (initialBalance < 0) {
            throw new Error('Başlangıç bakiyesi sıfırdan küçük olamaz');
        }
    }
    async validateAccountClosure(accountId) {
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (account.balance > 0) {
            throw new Error('Hesap kapatılmadan önce bakiye sıfırlanmalıdır');
        }
    }
    async validateBalanceUpdate(id, amount) {
        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (account.status !== 'active') {
            throw new Error('Hesap aktif değil');
        }
        if (amount === 0) {
            throw new Error('İşlem tutarı sıfır olamaz');
        }
    }
    async validateStatusUpdate(id, status) {
        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (account.status === status) {
            throw new Error('Hesap zaten bu durumda');
        }
    }
    async validateDeposit(id, amount) {
        if (amount <= 0) {
            throw new Error('Para yatırma tutarı sıfırdan büyük olmalıdır');
        }
        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (account.status !== 'active') {
            throw new Error('Hesap aktif değil');
        }
    }
    async validateWithdraw(id, amount) {
        if (amount <= 0) {
            throw new Error('Para çekme tutarı sıfırdan büyük olmalıdır');
        }
        const account = await this.repository.findOne(id);
        if (!account) {
            throw new Error('Hesap bulunamadı');
        }
        if (account.status !== 'active') {
            throw new Error('Hesap aktif değil');
        }
        if (account.balance < amount) {
            throw new Error('Yetersiz bakiye');
        }
    }
}
exports.AccountValidator = AccountValidator;
//# sourceMappingURL=account.validator.js.map