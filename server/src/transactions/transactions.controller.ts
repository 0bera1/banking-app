import { Controller, Get, Post, Body, HttpException, HttpStatus, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    // Yeni işlem oluşturma
    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            return await this.transactionsService.createTransaction(createTransactionDto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('İşlem oluşturulurken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async getTransactions(@Query() getTransactionsDto: GetTransactionsDto) {
        try {
            return await this.transactionsService.getTransactions(getTransactionsDto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('İşlemler alınırken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
