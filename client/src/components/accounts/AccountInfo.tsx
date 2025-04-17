import { QueryClient, } from '@tanstack/react-query';
import { Account, AccountStatus } from '../../types/account';
import { useState } from 'react';

interface AccountInfoProps {
  account: Account;
}

export const AccountInfo = ({ account }: AccountInfoProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AccountStatus | null>(null);

  const handleAccountStatusChange = async (status: AccountStatus) => {
    setPendingStatus(status);
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/accounts/${account.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: pendingStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hesap durumu güncellenirken bir hata oluştu');
      }
      const queryClient = new QueryClient();
      queryClient.invalidateQueries({ queryKey: ['account', account.id] });
      window.location.reload();
    } catch (error) {
      console.error('Hesap durumu güncellenirken bir hata oluştu:', error);
    } finally {
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  return (
    <>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium mb-4">
              {pendingStatus === AccountStatus.ACTIVE ? 'Hesabı Aktif Et' : 'Hesabı Kapat'}
            </h3>
            <p className="mb-4">Bu işlemi gerçekleştirmek istediğinizden emin misiniz?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setPendingStatus(null);
                }}
                className="px-4 py-2 bg-transparent border border-red-500 text-red-500 transition-all duration-500 hover:cursor-pointer rounded-md hover:bg-red-500 hover:text-white"
              >
                İptal
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-indigo-600 hover:cursor-pointer text-white transition-all duration-500 rounded-md hover:bg-indigo-700"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
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
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 gap-x-2 flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  {account.status === 'active' ? (
                    <span className="bg-green-400 shadow-md text-white px-3 py-0.5 text-[10px] rounded-full">Aktif</span>
                  ) : account.status === 'inactive' ? (
                    <span className="bg-red-500 shadow-md text-white px-3 py-0.5 text-[10px] rounded-full">Pasif</span>
                  ) : (
                    <span className="bg-gray-600 shadow-md text-white px-3 py-0.5 text-[10px] rounded-full">Engellendi</span>
                  )}
                </div>
                {account.status === AccountStatus.INACTIVE && (
                  <button onClick={() => handleAccountStatusChange(AccountStatus.ACTIVE)} className="mt-1 text-sm hover:cursor-pointer hover:bg-gray-200 drop-shadow-sm bg-gray-100 rounded-md px-2 py-1 text-gray-900 sm:mt-0 sm:col-span-2">
                    Hesabı Aktif Et
                  </button>
                )}
                {account.status === AccountStatus.ACTIVE && (
                  <button onClick={() => handleAccountStatusChange(AccountStatus.INACTIVE)} className="mt-1 hover:cursor-pointer hover:bg-gray-200 drop-shadow-sm bg-gray-100 rounded-md px-2 py-1 text-gray-900 sm:mt-0 sm:col-span-2">
                    Hesabı Kapat
                  </button>
                )}
              </dd>
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
    </>
  );
}; 