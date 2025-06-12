import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { AccountService } from './accounts.service';
import { AccountRequest } from './dto/account-request.dto';
import { AccountResponse } from './dto/account-response.dto';
import { BalanceResponse } from './dto/balance-response.dto';
import { AccountStatusResponse } from './dto/account-status-response.dto';
import { IbanVerificationResponse } from './dto/iban-verification-response.dto';

@Controller('accounts')
export class AccountsController {
    constructor(
        @Inject('IAccountService')
        private readonly accountService: AccountService
    ) {}

    @Post()
    public async createAccount(@Body() request: AccountRequest): Promise<AccountResponse> {
        return await this.accountService.createAccount(request.userId, request.amount);
    }

    @Delete(':id')
    public async closeAccount(@Param('id') id: number): Promise<void> {
        await this.accountService.closeAccount(id);
    }

    @Get(':id/balance')
    public async getBalance(@Param('id') id: number): Promise<BalanceResponse> {
        const balance = await this.accountService.getBalance(id);
        return {
            balance: balance.balance,
            currency: balance.currency
        };
    }

    @Put(':id/status')
    public async updateStatus(
        @Param('id') id: number,
        @Body() request: AccountRequest
    ): Promise<AccountStatusResponse> {
        const account = await this.accountService.updateStatus(id, request.status, request.userId);
        return {
            id: account.id,
            status: account.status,
            message: 'Hesap durumu başarıyla güncellendi'
        };
    }

    @Post('verify-iban')
    public async verifyIban(@Body() request: AccountRequest): Promise<IbanVerificationResponse> {
        const account = await this.accountService.findByIban(request.iban);
        return {
            iban: request.iban,
            isValid: !!account,
            message: account ? 'IBAN doğrulandı' : 'IBAN bulunamadı'
        };
    }

    @Post(':id/deposit')
    public async deposit(
        @Param('id') id: number,
        @Body() request: AccountRequest
    ): Promise<AccountResponse> {
        return await this.accountService.deposit(id, request.amount, request.userId);
    }

    @Post(':id/withdraw')
    public async withdraw(
        @Param('id') id: number,
        @Body() request: AccountRequest
    ): Promise<AccountResponse> {
        return await this.accountService.withdraw(id, request.amount, request.userId);
    }

    @Get(':id')
    public async getAccount(@Param('id') id: number): Promise<AccountResponse> {
        return await this.accountService.findOne(id);
    }

    @Get('user/:userId')
    public async getUserAccounts(@Param('userId') userId: number): Promise<Array<AccountResponse>> {
        return await this.accountService.findByUserId(userId);
    }

    @Get()
    public async getAllAccounts(): Promise<Array<AccountResponse>> {
        return await this.accountService.findAll();
    }
}
