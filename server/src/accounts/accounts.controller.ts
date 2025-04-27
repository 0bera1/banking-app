import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, UseGuards, Request, Put, Query, NotFoundException, BadRequestException, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '../database/database.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
    private readonly accountsService: AccountsService;
    private readonly usersService: UsersService;

    public constructor(
        accountsService: AccountsService,
        databaseService: DatabaseService
    ) {
        this.accountsService = accountsService;
        this.usersService = new UsersService(databaseService);
    }

    @Get()
    async getUserAccounts(@Req() req) {
        const userId = req.user.id;
        if (!userId) {
            throw new BadRequestException('Kullanıcı bilgisi bulunamadı');
        }
        return await this.accountsService.findByUserId(userId);
    }

    @Get(':id')
    async getAccountById(@Req() req, @Param('id') id: string) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new BadRequestException('Geçersiz hesap ID formatı');
        }

        const account = await this.accountsService.findOne(accountId);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.user_id !== req.user.id) {
            throw new HttpException('Bu hesabı görüntüleme yetkiniz yok', HttpStatus.FORBIDDEN);
        }

        return account;
    }

    @Post()
    async createAccount(@Req() req, @Body() createAccountDto: CreateAccountDto) {
        if (!req.user?.id) {
            throw new BadRequestException('Kullanıcı bilgisi bulunamadı');
        }

        return await this.accountsService.create({
            ...createAccountDto,
            user_id: req.user.id
        });
    }

    @Delete(':id')
    async deleteAccount(@Req() req, @Param('id') id: string) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new BadRequestException('Geçersiz hesap ID formatı');
        }

        await this.accountsService.remove(accountId, req.user.id);
        return { message: 'Hesap başarıyla silindi' };
    }

    @Put(':id/deposit')
    async deposit(@Req() req, @Param('id') id: string, @Body('amount') amount: number) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new BadRequestException('Geçersiz hesap ID formatı');
        }

        if (!amount || amount <= 0) {
            throw new BadRequestException('Geçersiz miktar');
        }

        return await this.accountsService.deposit(accountId, amount, req.user.id);
    }

    @Put(':id/withdraw')
    async withdraw(@Req() req, @Param('id') id: string, @Body('amount') amount: number) {
        const accountId = parseInt(id, 10);
        if (isNaN(accountId)) {
            throw new BadRequestException('Geçersiz hesap ID formatı');
        }

        if (!amount || amount <= 0) {
            throw new BadRequestException('Geçersiz miktar');
        }

        return await this.accountsService.withdraw(accountId, amount, req.user.id);
    }

    // Kart numarasına göre hesap bulma endpoint'i
    @Get('card/:cardNumber')
    async findByCardNumber(@Request() req, @Param('cardNumber') cardNumber: string): Promise<Account> {
        const account = await this.accountsService.findByCardNumber(cardNumber);
        if (!account) {
            throw new HttpException('Hesap bulunamadı', HttpStatus.NOT_FOUND);
        }
        
        if (account.user_id !== req.user.id) {
            throw new HttpException('Bu hesabı görüntüleme yetkiniz yok', HttpStatus.FORBIDDEN);
        }
        
        return account;
    }

    @Get(':id/balance')
    getBalance(
        @Param('id') id: string,
        @Query('currency') currency?: string,
    ) {
        return this.accountsService.getBalance(+id, currency);
    }

    @Get('verify-iban/:iban')
    async verifyIban(@Param('iban') iban: string) {
        const account = await this.accountsService.findByIban(iban);
        if (!account) {
            throw new NotFoundException('Hesap bulunamadı');
        }

        if (account.status === 'inactive') {
            throw new BadRequestException('Bu IBAN\'a ait hesap aktif değil');
        }

        const user = await this.usersService.findOne(account.user_id);
        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı');
        }

        return {
            iban: account.iban,
            first_name: user.first_name,
            last_name: user.last_name,
            status: account.status
        };
    }

    @Put(':id/status')
    async updateStatus(
        @Request() req,
        @Param('id') id: string,
        @Body('status') status: 'active' | 'inactive' | 'blocked'
    ): Promise<Account> {
        try {
            return await this.accountsService.updateStatus(+id, status, req.user.id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Hesap durumu güncellenirken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
