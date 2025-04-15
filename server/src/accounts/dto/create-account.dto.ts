import { IsString, IsNumber, IsOptional } from 'class-validator';

// Account oluşturma için DTO
export class CreateAccountDto {
    @IsString()
    cardNumber: string;

    @IsString()
    cardHolderName: string;

    @IsString()
    cardBrand: string;

    @IsString()
    cardIssuer: string;

    @IsString()
    cardType: string;

    @IsNumber()
    @IsOptional()
    initialBalance?: number;

    @IsNumber()
    user_id: number;

    @IsString()
    @IsOptional()
    currency?: string = 'TRY';
} 