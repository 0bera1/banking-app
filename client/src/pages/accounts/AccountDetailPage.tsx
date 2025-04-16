import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AccountInfo } from '../../components/accounts/AccountInfo';
import { AccountTransactions } from '../../components/accounts/AccountTransactions';

export const AccountDetailPage = () => {
  const { accountId } = useParams();

  const { data: account, isLoading } = useQuery({
    queryKey: ['account', accountId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Hesap bilgileri yüklenirken bir hata oluştu');
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

  if (!account) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Hesap bulunamadı</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-700">Hesap Detayı</h1>
      </div>

      <AccountInfo account={account} />
      <AccountTransactions accountId={account.id} />
    </div>
  );
}; 