import { IsNotEmpty, IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { CardBrand, CardIssuer, CardType, Currency } from '../entities/account.entity';

// Account oluşturma için DTO
export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    cardNumber: string;

    @IsString()
    @IsNotEmpty()
    cardHolderName: string;

    @IsEnum(CardBrand)
    @IsNotEmpty()
    cardBrand: CardBrand;

    @IsEnum(CardIssuer)
    @IsNotEmpty()
    cardIssuer: CardIssuer;

    @IsEnum(CardType)
    @IsNotEmpty()
    cardType: CardType;

    @IsNumber()
    @Min(0)
    @IsOptional()
    initialBalance?: number;

    @IsEnum(Currency)
    @IsOptional()
    currency?: Currency;
} 