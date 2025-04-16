import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TransactionList from '../../components/transactions/TransactionList';
import { CreateTransactionForm } from '../../components/transactions/CreateTransactionForm';

export const TransactionsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('İşlemler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      console.log('API Yanıtı:', data);
      return Array.isArray(data) ? data : [];
    },
  });

  console.log('İşlenmiş Veri:', transactions);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">İşlemler yüklenirken bir hata oluştu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">İşlemler</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white !bg-indigo-600 hover:!bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 hover:cursor-pointer"
        >
          Yeni İşlem
        </button>
      </div>

      <TransactionList transactions={transactions} />

      {isCreateModalOpen && (
        <CreateTransactionForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            // TODO: Query cache'i güncelle
          }}
        />
      )}
    </div>
  );
}; 