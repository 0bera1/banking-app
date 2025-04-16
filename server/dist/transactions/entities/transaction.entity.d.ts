import { Account } from '../../accounts/entities/account.entity';
export declare class Transaction {
    id: number;
    sender_id: number;
    receiver_id: number;
    amount: number;
    currency: string;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: Date;
    updated_at: Date;
    sender: Account;
    receiver: Account;
}
