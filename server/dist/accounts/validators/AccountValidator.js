"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountValidator = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
class AccountValidator {
    constructor(repository) {
        this.logger = new common_2.Logger(AccountValidator.name);
        this.MAX_INITIAL_BALANCE = 1000000;
        this.MAX_ACCOUNTS_PER_USER = 5;
        this.MIN_TRANSACTION_AMOUNT = 1;
        this.MAX_TRANSACTION_AMOUNT = 50000;
        this.repository = repository;
    }
    async validateAccountCreation(userId, initialBalance) {
        this.logger.log(`${userId} numaralı kullanıcı için hesap oluşturma doğrulaması yapılıyor`);
        if (!userId) {
            throw new Error('Kullanıcı ID gereklidir');
        }
        if (initialBalance < 0) {
            throw new Error('Başlangıç bakiyesi sıfırdan küçük olamaz');
        }
        if (initialBalance > this.MAX_INITIAL_BALANCE) {
            throw new common_1.BadRequestException(`Maksimum başlangıç bakiyesi (${this.MAX_INITIAL_BALANCE}) aşıldı`);
        }
        const userAccounts = await this.repository.findByUserId(userId);
        if (userAccounts.length >= this.MAX_ACCOUNTS_PER_USER) {
            throw new common_1.BadRequestException(`Maksimum hesap sayısına (${this.MAX_ACCOUNTS_PER_USER}) ulaşıldı`);
        }
    }
    async validateAccountClosure(accountId) {
        this.logger.log(`${accountId} numaralı hesap için kapatma doğrulaması yapılıyor`);
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.balance > 0) {
            throw new common_1.BadRequestException('Hesap kapatılmadan önce bakiye sıfırlanmalıdır');
        }
    }
    async validateBalanceUpdate(accountId, amount) {
        this.logger.log(`${accountId} numaralı hesap için bakiye güncelleme doğrulaması yapılıyor`);
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.status !== 'active') {
            throw new common_1.BadRequestException('Hesap aktif değil');
        }
        if (amount === 0) {
            throw new common_1.BadRequestException('İşlem tutarı sıfır olamaz');
        }
        if (account.balance + amount < 0) {
            throw new common_1.BadRequestException('Yetersiz bakiye');
        }
        if (Math.abs(amount) < this.MIN_TRANSACTION_AMOUNT) {
            throw new common_1.BadRequestException(`Minimum işlem tutarı ${this.MIN_TRANSACTION_AMOUNT} olmalıdır`);
        }
        if (Math.abs(amount) > this.MAX_TRANSACTION_AMOUNT) {
            throw new common_1.BadRequestException(`Maksimum işlem tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }
    }
    async validateStatusUpdate(accountId, status) {
        this.logger.log(`${accountId} numaralı hesap için durum güncelleme doğrulaması yapılıyor`);
        const account = await this.repository.findOne(accountId);
        if (!account) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (account.status === status) {
            throw new common_1.BadRequestException('Hesap zaten bu durumda');
        }
        if (!['active', 'inactive', 'blocked'].includes(status)) {
            throw new common_1.BadRequestException('Geçersiz hesap durumu');
        }
        if (status === 'blocked' && account.balance > 0) {
            throw new common_1.BadRequestException('Pozitif bakiyeli hesap bloke edilemez');
        }
    }
    async validateDeposit(accountId, amount) {
        this.logger.log(`${accountId} numaralı hesap için para yatırma doğrulaması yapılıyor`);
        if (amount <= 0) {
            throw new common_1.BadRequestException('Para yatırma tutarı sıfırdan büyük olmalıdır');
        }
        if (amount > this.MAX_TRANSACTION_AMOUNT) {
            throw new common_1.BadRequestException(`Maksimum para yatırma tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }
        await this.validateBalanceUpdate(accountId, amount);
    }
    async validateWithdraw(accountId, amount) {
        this.logger.log(`${accountId} numaralı hesap için para çekme doğrulaması yapılıyor`);
        if (amount <= 0) {
            throw new common_1.BadRequestException('Para çekme tutarı sıfırdan büyük olmalıdır');
        }
        if (amount > this.MAX_TRANSACTION_AMOUNT) {
            throw new common_1.BadRequestException(`Maksimum para çekme tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }
        await this.validateBalanceUpdate(accountId, -amount);
    }
    async validateTransfer(fromAccountId, toAccountId, amount) {
        this.logger.log(`${fromAccountId} numaralı hesaptan ${toAccountId} numaralı hesaba transfer doğrulaması yapılıyor`);
        if (amount <= 0) {
            throw new common_1.BadRequestException('Transfer tutarı sıfırdan büyük olmalıdır');
        }
        if (amount > this.MAX_TRANSACTION_AMOUNT) {
            throw new common_1.BadRequestException(`Maksimum transfer tutarı ${this.MAX_TRANSACTION_AMOUNT} olmalıdır`);
        }
        const fromAccount = await this.repository.findOne(fromAccountId);
        const toAccount = await this.repository.findOne(toAccountId);
        if (!fromAccount || !toAccount) {
            throw new common_1.NotFoundException('Hesap bulunamadı');
        }
        if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
            throw new common_1.BadRequestException('Aktif olmayan hesaplar arasında transfer yapılamaz');
        }
        if (fromAccount.balance < amount) {
            throw new common_1.BadRequestException('Yetersiz bakiye');
        }
        await this.validateWithdraw(fromAccountId, amount);
        await this.validateDeposit(toAccountId, amount);
    }
}
exports.AccountValidator = AccountValidator;
//# sourceMappingURL=AccountValidator.js.map