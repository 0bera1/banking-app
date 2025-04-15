export declare class CreateTransactionDto {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    currency: string;
    description?: string;
    transaction_type?: string;
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
    sender_id: number;
    receiver_id: number;
}
