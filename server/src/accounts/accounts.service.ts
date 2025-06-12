import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AccountRepository } from './repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/interface/UserRepository';
import { ExchangeService, IExchangeService } from '../exchange/exchange.service';
import { UserResponseDto } from "../users/dto/user-response.dto";
import { AccountServiceContract, AccountRepositoryContract, AccountValidationContract } from './interfaces/account.interface';
import { DatabaseRepository } from '../database/interfaces/database.interface';
import { AccountResponse } from './dto/account-response.dto';
import { AccountValidator } from './validators/account.validator';

// export interface IAccountsService {
//     create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<Account>;
//     remove(id: number, user_id: number): Promise<void>;
//     findOne(id: number): Promise<Account>;
//     findByUserId(user_id: number): Promise<Account[]>;
//     findByCardNumber(cardNumber: string): Promise<Account>;
//     updateBalance(id: number, amount: number, user_id: number): Promise<Account>;
//     updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<Account>;
//     findAll(): Promise<Account[]>;
//     deposit(id: number, amount: number, user_id: number): Promise<Account>;
//     withdraw(id: number, amount: number, user_id: number): Promise<Account>;
//     getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string; }>;
//     findByIban(iban: string): Promise<Account>;
// }

export class AccountService implements AccountServiceContract {
    constructor(
        private readonly repository: AccountRepository,
        private readonly usersService: UsersService,
        private readonly validator: AccountValidator
    ) {}

    public async getAccountBalance(accountId: number): Promise<number> {
        const balance = await this.repository.getBalance(accountId);
        return balance.balance;
    }

    public async transferMoney(fromAccountId: number, toAccountId: number, amount: number): Promise<void> {
        await this.validator.validateTransfer(fromAccountId, toAccountId, amount);
        await this.repository.updateBalance(fromAccountId, -amount, 0);
        await this.repository.updateBalance(toAccountId, amount, 0);
    }

    public async createAccount(userId: number, initialBalance: number): Promise<AccountResponse> {
        await this.validator.validateAccountCreation(userId, initialBalance);
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const createAccountDto: CreateAccountDto & { user_id: number } = {
            user_id: userId,
            account_number: this.generateAccountNumber(),
            balance: initialBalance,
            currency: 'TRY',
            status: 'active',
            iban: this.generateIban()
        };

        return await this.repository.create(createAccountDto);
    }

    public async closeAccount(accountId: number): Promise<void> {
        await this.validator.validateAccountClosure(accountId);
        await this.repository.remove(accountId, 0);
    }

    public async create(createAccountDto: CreateAccountDto & { user_id: number }): Promise<AccountResponse> {
        await this.validator.validateAccountCreation(createAccountDto.user_id, createAccountDto.balance);
        return await this.repository.create(createAccountDto);
    }

    public async remove(id: number, user_id: number): Promise<void> {
        await this.validator.validateAccountClosure(id);
        await this.repository.remove(id, user_id);
    }

    public async findOne(id: number): Promise<AccountResponse> {
        return await this.repository.findOne(id);
    }

    public async findByUserId(userId: number): Promise<Array<AccountResponse>> {
        return await this.repository.findByUserId(userId);
    }

    public async findByCardNumber(cardNumber: string): Promise<AccountResponse> {
        return await this.repository.findByCardNumber(cardNumber);
    }

    public async updateBalance(id: number, amount: number, user_id: number): Promise<AccountResponse> {
        await this.validator.validateBalanceUpdate(id, amount);
        return await this.repository.updateBalance(id, amount, user_id);
    }

    public async updateStatus(id: number, status: 'active' | 'inactive' | 'blocked', user_id: number): Promise<AccountResponse> {
        await this.validator.validateStatusUpdate(id, status);
        return await this.repository.updateStatus(id, status, user_id);
    }

    public async findAll(): Promise<Array<AccountResponse>> {
        return await this.repository.findAll();
    }

    public async deposit(id: number, amount: number, user_id: number): Promise<AccountResponse> {
        await this.validator.validateDeposit(id, amount);
        return await this.repository.deposit(id, amount, user_id);
    }

    public async withdraw(id: number, amount: number, user_id: number): Promise<AccountResponse> {
        await this.validator.validateWithdraw(id, amount);
        return await this.repository.withdraw(id, amount, user_id);
    }

    public async getBalance(id: number, currency?: string): Promise<{ balance: number; currency: string; }> {
        return await this.repository.getBalance(id, currency);
    }

    public async findByIban(iban: string): Promise<AccountResponse> {
        return await this.repository.findByIban(iban);
    }

    private generateAccountNumber(): string {
        return Math.random().toString().slice(2, 12);
    }

    private generateIban(): string {
        return 'TR' + Math.random().toString().slice(2, 26);
    }
}
