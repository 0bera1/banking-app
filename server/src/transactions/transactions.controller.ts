import { Controller, Post, Body, Get, UseGuards, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseService } from '../database/database.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    private readonly transactionsService: TransactionsService;
    private readonly databaseService: DatabaseService;

    public constructor(
        transactionsService: TransactionsService,
        databaseService: DatabaseService
    ) {
        this.transactionsService = transactionsService;
        this.databaseService = databaseService;
    }

    @Post()
    public async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req):Promise<any> {
        try {
            return await this.transactionsService.createTransaction(
                req.user.id,
                createTransactionDto.from_account_id,
                createTransactionDto.receiver_iban,
                createTransactionDto.amount,
                createTransactionDto.currency,
                createTransactionDto.description
            );
        } catch (error) {
            throw new HttpException(
                error.message || 'İşlem oluşturulurken bir hata oluştu',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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

    @Get('user')
    public async findByUserId(@Req() req) {
        try {
            return await this.transactionsService.getTransactionsByUserId(req.user.id);
        } catch (error) {
            throw new HttpException(
                error.message || 'Kullanıcı işlemleri getirilirken bir hata oluştu',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
