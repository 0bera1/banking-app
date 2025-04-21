import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Account, AccountStatus, Currency } from '../../types/account';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

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
    AccountStatus: AccountStatus.ACTIVE || AccountStatus.INACTIVE || AccountStatus.BLOCKED,
  });

  const [error, setError] = useState<string | null>(null);
  const [receiverInfo, setReceiverInfo] = useState<{
    first_name: string;
    last_name: string;
    iban: string;
    status: AccountStatus;
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
      setError(null);
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
          iban: data.iban,
          status: data.status
        });
        setError(null);
      } else {
        const errorData = await response.json();
        setReceiverInfo(null);
        setError(errorData.message || 'Geçersiz IBAN numarası veya hesap bulunamadı');
      }
    } catch (error) {
      setReceiverInfo(null);
      setError('IBAN doğrulama sırasında bir hata oluştu');
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

      // Bakiye kontrolü
      if (senderAccount.balance < data.amount) {
        throw new Error('Yetersiz bakiye');
      }

      // Alıcı IBAN kontrolü
      const verifyResponse = await fetch(`http://localhost:3000/accounts/verify-iban/${data.receiverIban}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!verifyResponse.ok) {
        throw new Error('Geçersiz IBAN numarası veya hesap bulunamadı');
      }

      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_id: data.senderAccountId,
          receiver_iban: data.receiverIban,
          amount: data.amount,
          currency: senderAccount.currency,
          description: data.description
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
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverInfo) {
      setError('Lütfen geçerli bir IBAN numarası girin');
      return;
    }

    if (receiverInfo.status === 'inactive') {
      setError('Bu IBAN\'a ait hesap aktif değil');
      return;
    }

    setError(null);

    const amount = parseFloat(formData.amount);
    const senderAccount = accounts?.find((acc: Account) => acc.id === parseInt(formData.senderAccountId));

    if (senderAccount && amount > senderAccount.balance) {
      setError('Yetersiz bakiye');
      return;
    }

    mutation.mutate({
      senderAccountId: parseInt(formData.senderAccountId),
      receiverIban: formData.receiverIban,
      amount: amount,
      description: formData.description || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-30 bg-gray-900/75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Para Transferi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <select
              id="senderAccountId"
              value={formData.senderAccountId}
              onChange={(e) => setFormData({ ...formData, senderAccountId: e.target.value })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            >
              <option value=""> </option>
              {accounts?.map((account: Account) => (
                <option key={account.id} value={account.id}>
                  {account.card_holder_name} - {account.iban} ({account.currency}) - Bakiye: {account.balance}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <label
              htmlFor="senderAccountId"
              className="absolute text-gray-500 duration-500 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Gönderen Hesap
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="receiverIban"
              value={formData.receiverIban}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setFormData({ ...formData, receiverIban: value });
                verifyIban(value);
              }}
              placeholder=" "
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
              maxLength={26}
            />
            <label
              htmlFor="receiverIban"
                className="absolute text-gray-500 duration-500 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Alıcı IBAN
            </label>
            {receiverInfo && (
              <div className="mt-2 text-sm text-gray-600">
                Alıcı: {receiverInfo.first_name} {receiverInfo.last_name}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder=" "
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
              min="0"
              step="0.01"
            />
            <label
              htmlFor="amount"
              className="absolute text-gray-500 duration-500 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Tutar
            </label>
          </div>

          <div className="relative">
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder=" "
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              rows={3}
            />
            <label
              htmlFor="description"
                className="absolute text-gray-500 duration-500 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Açıklama
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center hover:cursor-pointer hover:!bg-red-600 hover:!text-white transition-all duration-500 rounded-md border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !receiverInfo}
              className="inline-flex justify-center hover:cursor-pointer rounded-md border border-transparent !bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:!bg-white hover:!text-indigo-600 transition-all duration-500 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {mutation.isPending ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 