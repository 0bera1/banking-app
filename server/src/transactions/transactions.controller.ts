import { Controller, Get, Post, Body, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            return await this.transactionsService.createTransaction(createTransactionDto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Transaction creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
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
            throw new HttpException('Transactions retrieval failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
