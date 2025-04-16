export interface Transaction {
  id: number;
  sender_id: number;
  receiver_id: number;
  amount: number;
  currency: string;
  description?: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
  sender_name: string;
  receiver_name: string;
} 