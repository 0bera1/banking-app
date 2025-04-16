import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CardBrand, CardIssuer, CardType, Currency } from '../../types/account';

interface CreateAccountFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAccountForm = ({ onClose, onSuccess }: CreateAccountFormProps) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    cardBrand: CardBrand.VISA,
    cardIssuer: CardIssuer.BANK_A,
    cardType: CardType.DEBIT,
    initialBalance: '',
    currency: Currency.TRY,
  });

  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          initialBalance: data.initialBalance ? parseFloat(data.initialBalance) : 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hesap oluşturulurken bir hata oluştu');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onSuccess();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Hesap Oluştur</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Kart Numarası
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              placeholder="16 haneli kart numarası giriniz"
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              required
              maxLength={16}
              pattern="[0-9]*"
              title="16 haneli kart numarası giriniz"
            />
          </div>

          <div>
            <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
              Kart Sahibinin Adı
            </label>
            <input
              type="text"
              id="cardHolderName"
              value={formData.cardHolderName}
              onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
              placeholder="Hesap sahibi adınızı giriniz"
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="cardBrand" className="block text-sm font-medium text-gray-700">
              Kart Markası
            </label>
            <select
              id="cardBrand"
              value={formData.cardBrand}
              onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value as CardBrand })}
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              required
            >
              {Object.values(CardBrand).map((brand) => (
                <option key={brand} value={brand}>
                  {brand.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cardIssuer" className="block text-sm font-medium text-gray-700">
              Kart Veren Kuruluş
            </label>
            <select
              id="cardIssuer"
              value={formData.cardIssuer}
              onChange={(e) => setFormData({ ...formData, cardIssuer: e.target.value as CardIssuer })}
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              required
            >
              {Object.values(CardIssuer).map((issuer) => (
                <option key={issuer} value={issuer}>
                  {issuer.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cardType" className="block text-sm font-medium text-gray-700">
              Kart Tipi
            </label>
            <select
              id="cardType"
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value as CardType })}
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              required
            >
              {Object.values(CardType).map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700">
              Başlangıç Bakiyesi
            </label>
            <input
              type="number"
              id="initialBalance"
              value={formData.initialBalance}
              onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
              placeholder="Başlangıç bakiyesini giriniz"
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Para Birimi
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
              className="mt-1 block w-full h-7 rounded-md indent-2 border-gray-300 shadow-sm hover:cursor-text focus:!border-indigo-500 focus:!ring-indigo-500 sm:text-sm"
              required
            >
              {Object.values(Currency).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

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
              disabled={mutation.isPending}
              className="inline-flex justify-center hover:cursor-pointer rounded-md border border-transparent !bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:!bg-white hover:!text-indigo-600 transition-all duration-500 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {mutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 