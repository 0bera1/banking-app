"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
class AccountService {
    constructor(repository, usersService, validator) {
        this.repository = repository;
        this.usersService = usersService;
        this.validator = validator;
    }
    async getAccountBalance(accountId) {
        const balance = await this.repository.getBalance(accountId);
        return balance.balance;
    }
    async transferMoney(fromAccountId, toAccountId, amount) {
        await this.validator.validateTransfer(fromAccountId, toAccountId, amount);
        await this.repository.updateBalance(fromAccountId, -amount, 0);
        await this.repository.updateBalance(toAccountId, amount, 0);
    }
    async createAccount(userId, initialBalance) {
        await this.validator.validateAccountCreation(userId, initialBalance);
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const createAccountDto = {
            user_id: userId,
            account_number: this.generateAccountNumber(),
            balance: initialBalance,
            currency: 'TRY',
            status: 'active',
            iban: this.generateIban()
        };
        return await this.repository.create(createAccountDto);
    }
    async closeAccount(accountId) {
        await this.validator.validateAccountClosure(accountId);
        await this.repository.remove(accountId, 0);
    }
    async create(createAccountDto) {
        await this.validator.validateAccountCreation(createAccountDto.user_id, createAccountDto.balance);
        return await this.repository.create(createAccountDto);
    }
    async remove(id, user_id) {
        await this.validator.validateAccountClosure(id);
        await this.repository.remove(id, user_id);
    }
    async findOne(id) {
        return await this.repository.findOne(id);
    }
    async findByUserId(userId) {
        return await this.repository.findByUserId(userId);
    }
    async findByCardNumber(cardNumber) {
        return await this.repository.findByCardNumber(cardNumber);
    }
    async updateBalance(id, amount, user_id) {
        await this.validator.validateBalanceUpdate(id, amount);
        return await this.repository.updateBalance(id, amount, user_id);
    }
    async updateStatus(id, status, user_id) {
        await this.validator.validateStatusUpdate(id, status);
        return await this.repository.updateStatus(id, status, user_id);
    }
    async findAll() {
        return await this.repository.findAll();
    }
    async deposit(id, amount, user_id) {
        await this.validator.validateDeposit(id, amount);
        return await this.repository.deposit(id, amount, user_id);
    }
    async withdraw(id, amount, user_id) {
        await this.validator.validateWithdraw(id, amount);
        return await this.repository.withdraw(id, amount, user_id);
    }
    async getBalance(id, currency) {
        return await this.repository.getBalance(id, currency);
    }
    async findByIban(iban) {
        return await this.repository.findByIban(iban);
    }
    generateAccountNumber() {
        return Math.random().toString().slice(2, 12);
    }
    generateIban() {
        return 'TR' + Math.random().toString().slice(2, 26);
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=accounts.service.js.map