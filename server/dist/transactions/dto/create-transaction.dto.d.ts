export declare class CreateTransactionDto {
    senderAccountId: number;
    receiverIban: string;
    amount: number;
    currency: string;
    description?: string;
}
