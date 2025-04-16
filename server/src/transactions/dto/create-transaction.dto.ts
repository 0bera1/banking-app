import { IsNotEmpty, IsNumber, Min, IsString, IsOptional } from 'class-validator';

// Transaction oluşturma için DTO
export class CreateTransactionDto {
    @IsNumber()
    @IsNotEmpty()
    senderAccountId: number;

    @IsNotEmpty()
    @IsString()
    receiverIban: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01) // Minimum değer
    amount: number; // İşlem miktarı

    @IsString()
    @IsNotEmpty()
    currency: string; // Para birimi

    @IsString()
    @IsOptional()
    description?: string; // İşlem açıklaması
} 