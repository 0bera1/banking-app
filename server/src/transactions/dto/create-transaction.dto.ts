export interface CreateTransactionDto {
    sender_id: number;
    receiver_id: number;
    amount: number;
    currency: string;
    description?: string;
} 