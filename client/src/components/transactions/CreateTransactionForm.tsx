import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Account, Currency } from '../../types/account';

interface CreateTransactionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTransactionForm = ({ onClose, onSuccess }: CreateTransactionFormProps) => {
  const [formData, setFormData] = useState({
    senderAccountId: '',
    receiverIban: '',
    amount: '',
    description: '',
  });

  const [receiverInfo, setReceiverInfo] = useState<{
    first_name: string;
    last_name: string;
    iban: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Hesaplar yüklenirken bir hata oluştu');
      }
      return response.json();
    },
  });

  const verifyIban = async (iban: string) => {
    if (!iban) {
      setReceiverInfo(null);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/accounts/verify-iban/${iban}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReceiverInfo({
          first_name: data.first_name,
          last_name: data.last_name,
          iban: data.iban
        });
      } else {
        setReceiverInfo(null);
      }
    } catch (error) {
      setReceiverInfo(null);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: {
      senderAccountId: number;
      receiverIban: string;
      amount: number;
      description?: string;
    }) => {
      const token = localStorage.getItem('token');
      const senderAccount = accounts?.find((acc: Account) => acc.id === data.senderAccountId);
      
      if (!senderAccount) {
        throw new Error('Gönderen hesap bulunamadı');
      }

      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          currency: senderAccount.currency
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'İşlem oluşturulurken bir hata oluştu');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverInfo) return;

    mutation.mutate({
      senderAccountId: parseInt(formData.senderAccountId),
      receiverIban: formData.receiverIban,
      amount: parseFloat(formData.amount),
      description: formData.description || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Para Transferi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="senderAccountId" className="block text-sm font-medium text-gray-700">
              Gönderen Hesap
            </label>
            <select
              id="senderAccountId"
              value={formData.senderAccountId}
              onChange={(e) => setFormData({ ...formData, senderAccountId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Seçiniz</option>
              {accounts?.map((account: Account) => (
                <option key={account.id} value={account.id}>
                  {account.card_holder_name} - {account.iban} ({account.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="receiverIban" className="block text-sm font-medium text-gray-700">
              Alıcı IBAN
            </label>
            <input
              type="text"
              id="receiverIban"
              value={formData.receiverIban}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setFormData({ ...formData, receiverIban: value });
                verifyIban(value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              placeholder="TR..."
              maxLength={26}
            />
            {receiverInfo && (
              <div className="mt-2 text-sm text-gray-600">
                Alıcı: {receiverInfo.first_name} {receiverInfo.last_name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Tutar
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !receiverInfo}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {mutation.isPending ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 