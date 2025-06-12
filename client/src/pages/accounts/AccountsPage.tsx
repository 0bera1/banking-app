import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AccountList } from '../../components/accounts/AccountList';
import { CreateAccountForm } from '../../components/accounts/CreateAccountForm';
import { useNavigate } from 'react-router-dom';

export const AccountsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('Oturum süresi dolmuş');
      }

      const response = await fetch('http://localhost:3000/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Oturum süresi dolmuş');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mesaj || 'Hesaplarınız yüklenirken bir hata oluştu');
      }

      return response.json();
    },
  });

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Hata!</p>
          <p>{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hesaplarım</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex hover:cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Yeni Hesap
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : accounts && accounts.length > 0 ? (
        <AccountList accounts={accounts} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Henüz hesabınız bulunmuyor.</p>
          <p className="text-gray-500 mt-2">Yeni bir hesap oluşturmak için "Yeni Hesap" butonuna tıklayabilirsiniz.</p>
        </div>
      )}

      {isCreateModalOpen && (
        <CreateAccountForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}; 