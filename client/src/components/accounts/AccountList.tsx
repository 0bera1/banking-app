import { useNavigate } from 'react-router-dom';
import { Account } from '../../types/account';

interface AccountListProps {
  accounts: Account[];
}

export const AccountList = ({ accounts }: AccountListProps) => {
  const navigate = useNavigate();

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz hesap bulunmuyor</h3>
        <p className="mt-1 text-sm text-gray-500">Yeni bir hesap oluşturarak başlayın.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-md ring-1 ring-gray-300 ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr className="table-row">
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Hesap Numarası
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Hesap Sahibi
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Bakiye
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">İşlemler</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {accounts.map((account) => (
            <tr key={account.id} className="table-row">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {account.card_number}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {account.card_holder_name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: account.currency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(account.balance)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => navigate(`/accounts/${account.id}`)}
                  className=" hover:cursor-pointer !bg-indigo-700 hover:shadow-2xl hover:!bg-indigo-600 text-white px-4 py-1 rounded-full"
                >
                  Detay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 