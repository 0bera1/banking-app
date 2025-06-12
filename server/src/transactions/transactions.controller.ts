import { Controller, Post, Body, Get, Param, UseGuards, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(
        private readonly transactionsService: TransactionsService,
        private readonly databaseService: DatabaseService
    ) {}

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        const result = await this.transactionsService.createTransaction(
            createTransactionDto.sender_id,
            createTransactionDto.from_account_id,
            createTransactionDto.receiver_iban,
            createTransactionDto.amount,
            createTransactionDto.currency,
            createTransactionDto.description
        );
        return result;
    }

    @Get('user/:userId')
    async getUserTransactions(@Param('userId') userId: string) {
        const result = await this.transactionsService.getTransactionsByUserId(parseInt(userId));
        return result;
    }

    @Get('account/:accountId')
    async getAccountTransactions(@Param('accountId') accountId: string) {
        const accountResult = await this.databaseService.query(
            'SELECT id FROM accounts WHERE id = $1',
            [accountId]
        );

        if (!accountResult.rows[0]) {
            throw new Error('Hesap bulunamadı');
        }

        const result = await this.transactionsService.getTransactions({
            account_id: accountResult.rows[0].id
        });
        return result;
    }

    @Get()
    public async findAll(@Query() queryParams: GetTransactionsDto, @Req() req) {
        try {
            // Kullanıcının aktif hesabını bul
            const accountQuery = `
                SELECT id FROM accounts 
                WHERE user_id = $1 AND status = 'active' 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            const accountResult = await this.databaseService.query(accountQuery, [req.user.id]);
            
            if (!accountResult.rows[0]) {
                throw new HttpException('Aktif hesap bulunamadı', HttpStatus.NOT_FOUND);
            }

            const getTransactionsDto: GetTransactionsDto = {
                ...queryParams,
                account_id: accountResult.rows[0].id
            };

            return await this.transactionsService.getTransactions(getTransactionsDto);
        } catch (error) {
            throw new HttpException(
                error.message || 'İşlemler getirilirken bir hata oluştu',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
