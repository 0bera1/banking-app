// Transaction entity'si için interface tanımı
export class Transaction {
    id: string;
    senderAccountId: string;
    receiverAccountId: string;
    amount: number;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    senderCardNumber?: string;
    receiverCardNumber?: string;
} 