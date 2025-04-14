import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    // Yeni hesap oluşturma endpoint'i
    @Post()
    async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
        try {
            return await this.accountsService.create(createAccountDto);
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new HttpException('Bu kart numarası zaten kullanımda', HttpStatus.CONFLICT);
            }
            throw new HttpException('Hesap oluşturulurken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hesap detayı görüntüleme endpoint'i
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Account> {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new HttpException('Hesap bulunamadı', HttpStatus.NOT_FOUND);
        }
        return account;
    }

    // Hesap silme endpoint'i
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new HttpException('Hesap bulunamadı', HttpStatus.NOT_FOUND);
        }
        await this.accountsService.remove(+id);
    }

    // Kart numarasına göre hesap bulma endpoint'i
    @Get('card/:cardNumber')
    async findByCardNumber(@Param('cardNumber') cardNumber: string): Promise<Account> {
        const account = await this.accountsService.findByCardNumber(cardNumber);
        if (!account) {
            throw new HttpException('Hesap bulunamadı', HttpStatus.NOT_FOUND);
        }
        return account;
    }
}
