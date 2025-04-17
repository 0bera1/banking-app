import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, UseGuards, Request, Put, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly usersService: UsersService
    ) {}

    // Yeni hesap oluşturma endpoint'i
    @Post()
    async create(@Request() req, @Body() createAccountDto: CreateAccountDto): Promise<Account> {
        try {
            console.log('Request user:', req.user);
            console.log('Create account DTO:', createAccountDto);
            
            if (!req.user || !req.user.id) {
                console.error('User not found in request');
                throw new HttpException('Kullanıcı bilgisi bulunamadı', HttpStatus.UNAUTHORIZED);
            }

            const account = await this.accountsService.create({
                ...createAccountDto,
                user_id: req.user.id
            });
            
            console.log('Created account:', account);
            return account;
        } catch (error) {
            console.error('Error in create controller:', error);
            if (error.code === '23505') { // Unique constraint violation
                throw new HttpException('Bu kart numarası zaten kullanımda', HttpStatus.CONFLICT);
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            if (error instanceof HttpException) {
                throw error;
            }
            console.error('Detailed error:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw new HttpException(
                `Hesap oluşturulurken bir hata oluştu: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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
    async deposit(@Request() req, @Param('id') id: string, @Body('amount') amount: number) {
        if (!req.user || !req.user.id) {
            throw new HttpException('Kullanıcı bilgisi bulunamadı', HttpStatus.UNAUTHORIZED);
        }
        return this.accountsService.deposit(+id, amount, req.user.id);
    }

    @Put(':id/withdraw')
    async withdraw(@Request() req, @Param('id') id: string, @Body('amount') amount: number) {
        if (!req.user || !req.user.id) {
            throw new HttpException('Kullanıcı bilgisi bulunamadı', HttpStatus.UNAUTHORIZED);
        }
        return this.accountsService.withdraw(+id, amount, req.user.id);
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
