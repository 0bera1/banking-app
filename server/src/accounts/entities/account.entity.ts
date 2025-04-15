// Account entity'si için interface tanımı
export interface Account {
    id: number;
    card_number: string;
    card_holder_name: string;
    card_brand: string;
    card_issuer: string;
    card_type: string;
    balance: number;
    currency: string;
    status: 'active' | 'inactive' | 'blocked';
    user_id: number;
    created_at: Date;
    updated_at: Date;
} 