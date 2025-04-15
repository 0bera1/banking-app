import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, UseGuards, Request, Put, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    // Yeni hesap oluşturma endpoint'i
    @Post()
    async create(@Request() req, @Body() createAccountDto: CreateAccountDto): Promise<Account> {
        try {
            return await this.accountsService.create({
                ...createAccountDto,
                user_id: req.user.id
            });
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new HttpException('Bu kart numarası zaten kullanımda', HttpStatus.CONFLICT);
            }
            throw new HttpException('Hesap oluşturulurken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hesap detayı görüntüleme endpoint'i
    @Get(':id')
    async findOne(@Request() req, @Param('id') id: string): Promise<Account> {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new HttpException('Hesap bulunamadı', HttpStatus.NOT_FOUND);
        }
        
        if (account.user_id !== req.user.id) {
            throw new HttpException('Bu hesabı görüntüleme yetkiniz yok', HttpStatus.FORBIDDEN);
        }
        
        return account;
    }

    // Kullanıcının hesaplarını listeleme endpoint'i
    @Get()
    async findAll(@Request() req): Promise<Account[]> {
        return await this.accountsService.findByUserId(req.user.id);
    }

    // Hesap silme endpoint'i
    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string): Promise<void> {
        try {
            await this.accountsService.remove(+id, req.user.id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Hesap silinirken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @Put(':id/deposit')
    deposit(@Param('id') id: string, @Body('amount') amount: number) {
        return this.accountsService.deposit(+id, amount);
    }

    @Put(':id/withdraw')
    withdraw(@Param('id') id: string, @Body('amount') amount: number) {
        return this.accountsService.withdraw(+id, amount);
    }

    @Get(':id/balance')
    getBalance(
        @Param('id') id: string,
        @Query('currency') currency?: string,
    ) {
        return this.accountsService.getBalance(+id, currency);
    }
}
