// Account entity'si için interface tanımı
export interface Account {
    id: number;
    card_number: string;
    card_holder_name: string;
    balance: number;
    card_brand?: string;
    card_issuer?: string;
    card_type?: string;
    status: 'active' | 'inactive' | 'blocked';
    created_at: Date;
    updated_at: Date;
} 