import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Account } from '../../types/account';
import { CreateTransactionForm } from '../../components/transactions/CreateTransactionForm';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';

export const DepositWithdrawPage = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [error, setError] = useState<string | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
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
    refetchInterval: 5000,
  });

  const mutation = useMutation({
    mutationFn: async (data: { accountId: number; amount: number; type: 'deposit' | 'withdraw' }) => {
      const token = localStorage.getItem('token');
      const endpoint = data.type === 'deposit' 
        ? `http://localhost:3000/accounts/${data.accountId}/deposit`
        : `http://localhost:3000/accounts/${data.accountId}/withdraw`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: data.amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'İşlem sırasında bir hata oluştu');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setAmount('');
      setError(null);
      toast.success(
        transactionType === 'deposit' 
          ? 'Para yatırma işlemi başarıyla tamamlandı'
          : 'Para çekme işlemi başarıyla tamamlandı'
      );
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAccount) {
      setError('Lütfen bir hesap seçin');
      toast.error('Lütfen bir hesap seçin');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Lütfen geçerli bir tutar girin');
      toast.error('Lütfen geçerli bir tutar girin');
      return;
    }

    const account = accounts.find((acc: Account) => acc.id === parseInt(selectedAccount));
    if (transactionType === 'withdraw' && account && amountValue > account.balance) {
      setError('Yetersiz bakiye');
      toast.error('Yetersiz bakiye');
      return;
    }

    mutation.mutate({
      accountId: parseInt(selectedAccount),
      amount: amountValue,
      type: transactionType
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {transactionType === 'deposit' ? 'Para Yatırma' : 'Para Çekme'}
      </h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTransactionType('deposit')}
          className={`flex-1 py-2 px-4 hover:cursor-pointer rounded-md ${
            transactionType === 'deposit'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600'
          }`}
        >
          Para Yatır
        </button>
        <button
          onClick={() => setTransactionType('withdraw')}
          className={`flex-1 py-2 px-4 hover:cursor-pointer rounded-md ${
            transactionType === 'withdraw'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600'
          }`}
        >
          Para Çek
        </button>
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="flex-1 py-2 px-4 rounded-md bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 hover:cursor-pointer"
        >
          Para Gönder
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
            required
          >
            <option value=""> </option>
            {accounts.map((account: Account) => (
              <option key={account.id} value={account.id}>
                {account.card_holder_name} - {account.iban} ({account.currency}) - Bakiye: {account.balance}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <label
            htmlFor="account"
            className="absolute text-gray-500 duration-500 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#F9FAFB] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
          >
            Hesap Seçin
          </label>
        </div>

        {selectedAccount && (
          <div className="bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Mevcut Bakiye:</p>
            <p className="text-lg font-semibold text-gray-900">
              {accounts.find((acc: Account) => acc.id === parseInt(selectedAccount))?.balance} {accounts.find((acc: Account) => acc.id === parseInt(selectedAccount))?.currency}
            </p>
          </div>
        )}

        <div className="relative">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
            required
            min="0"
            step="0.01"
            placeholder=" "
          />
          <label
            htmlFor="amount"
                className="absolute text-gray-500 duration-500 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#F9FAFB] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
          >
            {transactionType === 'deposit' ? 'Yatırılacak Tutar' : 'Çekilecek Tutar'}
          </label>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {mutation.isPending ? 'İşlem yapılıyor...' : transactionType === 'deposit' ? 'Para Yatır' : 'Para Çek'}
        </button>
      </form>

      {isTransactionModalOpen && (
        <CreateTransactionForm
          onClose={() => setIsTransactionModalOpen(false)}
          onSuccess={() => {
            setIsTransactionModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
          }}
        />
      )}
    </div>
  );
}; 