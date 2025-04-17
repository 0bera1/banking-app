export interface Transaction {
  id: number;
  sender_id: number;
  receiver_id: number;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
} 