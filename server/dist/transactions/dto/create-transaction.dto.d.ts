export interface CreateTransactionDto {
    from_account_id: number;
    receiver_iban: string;
    amount: number;
    currency: string;
    description?: string;
}
