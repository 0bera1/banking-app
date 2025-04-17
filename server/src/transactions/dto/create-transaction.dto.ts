export interface CreateTransactionDto {
    sender_id: number;
    receiver_iban: string;
    amount: number;
    currency: string;
    description?: string;
} 