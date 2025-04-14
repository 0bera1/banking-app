import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

// Transaction oluşturma için DTO
export class CreateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    senderAccountId: string;

    @IsUUID()
    @IsNotEmpty()
    receiverAccountId: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01)
    amount: number;

    @IsNotEmpty()
    description: string;

    transaction_type: string;
    card_brand?: string;
    card_issuer?: string;
    card_type?: string;
    card_holder_name?: string;
    transaction_category?: string;
    transaction_method?: string;
    is_refund?: boolean;
    currency_code?: string;
    authorization_code?: string;
    merchant_name?: string;
    merchant_address?: string;
    email?: string;
    phone?: string;
    device_type?: string;
    some_field?: string;
} 