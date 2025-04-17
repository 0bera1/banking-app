export interface Account {
    id: number;
    user_id: number;
    account_number: string;
    balance: number;
    currency: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    card_holder_name?: string;
    card_brand?: string;
    card_issuer?: string;
    card_type?: string;
    iban?: string;
}
