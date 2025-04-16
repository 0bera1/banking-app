import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TransactionInfo } from '../../components/transactions/TransactionInfo';

export const TransactionDetailPage = () => {
  const { transactionId } = useParams();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/transactions/${transactionId}`);
      if (!response.ok) {
        throw new Error('İşlem bilgileri yüklenirken bir hata oluştu');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">İşlem bulunamadı</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-gray-900">İşlem Detayı</h1>
      </div>

      <TransactionInfo transaction={transaction} />
    </div>
  );
}; 