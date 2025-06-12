export interface TransactionResponse {
    id: number;
    sender_id: number;
    receiver_id: number;
    amount: number;
    currency: string;
    description?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    sender_name?: string;
    receiver_name?: string;
}
