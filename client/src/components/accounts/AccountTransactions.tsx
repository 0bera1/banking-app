import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../../types/transaction';

interface AccountTransactionsProps {
  accountId: number;
}

export const AccountTransactions = ({ accountId }: AccountTransactionsProps) => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', accountId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/accounts/${accountId}/transactions`);
      if (!response.ok) {
        throw new Error('İşlem geçmişi yüklenirken bir hata oluştu');
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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz işlem bulunmuyor</h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr className="table-row">
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Tarih
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              İşlem Türü
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Miktar
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Açıklama
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction: Transaction) => (
            <tr key={transaction.id} className="table-row">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                {new Date(transaction.created_at).toLocaleDateString('tr-TR')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {transaction.amount.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {transaction.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 