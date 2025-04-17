import { Controller, Get, Post, Body, HttpException, HttpStatus, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
        return await this.transactionsService.createTransaction(
            req.user.id,
            createTransactionDto.sender_id,
            createTransactionDto.receiver_iban,
            createTransactionDto.amount,
            createTransactionDto.currency,
            createTransactionDto.description
        );
    }

    @Get()
    async getTransactions(@Request() req) {
        try {
            const userId = req.user.id;
            return await this.transactionsService.getTransactionsByUserId(userId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('İşlemler getirilirken bir hata oluştu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
