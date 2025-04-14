// Account oluşturma için DTO
export class CreateAccountDto {
    card_number: string;
    card_holder_name: string;
    card_brand?: string;
    card_issuer?: string;
    card_type?: string;
    initial_balance?: number;
} 