import { QueryClient, } from '@tanstack/react-query';
import { Account, AccountStatus } from '../../types/account';

interface AccountInfoProps {
  account: Account;
}

export const AccountInfo = ({ account }: AccountInfoProps) => {
  const handleAccountStatusChange = async (status: AccountStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/accounts/${account.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hesap durumu güncellenirken bir hata oluştu');
      }
      const queryClient = new QueryClient();
      queryClient.invalidateQueries({ queryKey: ['account', account.id] });
    } catch (error) {
      console.error('Hesap durumu güncellenirken bir hata oluştu:', error);
    }
  }

  return (
    <div className="bg-white shadow-md overflow-hidden sm:rounded-lg border border-gray-300">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Hesap Bilgileri</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">IBAN</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.iban}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Hesap Numarası</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.card_number}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Hesap Sahibi</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.card_holder_name}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Bakiye</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: account.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(account.balance)}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Kart Tipi</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.card_type}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Kart Markası</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.card_brand}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Kart İhraççısı</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.card_issuer}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Durum</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{account.status}</dd>
            {account.status === AccountStatus.INACTIVE && (
              <button onClick={() => handleAccountStatusChange(AccountStatus.ACTIVE)} className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Hesabı Aktif Et
              </button>
            )}
            {account.status === AccountStatus.ACTIVE && (
              <button onClick={() => handleAccountStatusChange(AccountStatus.INACTIVE)} className="mt-1 hover:cursor-pointer text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Hesabı Kapat
              </button>
            )}
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(account.created_at).toLocaleDateString('tr-TR')}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}; 