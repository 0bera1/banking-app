import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CardBrand, CardIssuer, CardType, Currency } from '../../types/account';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

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

  // Kart numarası oluşturma fonksiyonu
  const generateCardNumber = (brand: CardBrand) => {
    let prefix = '';
    switch (brand) {
      case CardBrand.VISA:
        prefix = '4';
        break;
      case CardBrand.MASTERCARD:
        prefix = '5';
        break;
      case CardBrand.AMEX:
        prefix = '3';
        break;
      default:
        prefix = '4';
    }

    // 15 haneli rastgele sayı oluştur (prefix hariç)
    let cardNumber = prefix;
    for (let i = 0; i < 14; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }

    // Luhn algoritması ile kontrol hanesi ekle
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return cardNumber + checkDigit;
  };

  // Kart markası değiştiğinde yeni kart numarası oluştur
  useEffect(() => {
    const newCardNumber = generateCardNumber(formData.cardBrand);
    setFormData(prev => ({ ...prev, cardNumber: newCardNumber }));
  }, [formData.cardBrand]);

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
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Hesap Oluştur</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              readOnly
              placeholder=" "
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            />
            <label
              htmlFor="cardNumber"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Kart Numarası
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="cardHolderName"
              value={formData.cardHolderName}
              onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
              placeholder=" "
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            />
            <label
              htmlFor="cardHolderName"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Kart Sahibinin Adı
            </label>
          </div>

          <div className="relative">
            <select
              id="cardBrand"
              value={formData.cardBrand}
              onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value as CardBrand })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            >
              <option value=""> </option>
              {Object.values(CardBrand).map((brand) => (
                <option key={brand} value={brand}>
                  {brand.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <label
              htmlFor="cardBrand"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Kart Markası
            </label>
          </div>

          <div className="relative">
            <select
              id="cardIssuer"
              value={formData.cardIssuer}
              onChange={(e) => setFormData({ ...formData, cardIssuer: e.target.value as CardIssuer })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            >
              <option value=""> </option>
              {Object.values(CardIssuer).map((issuer) => (
                <option key={issuer} value={issuer}>
                  {issuer.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <label
              htmlFor="cardIssuer"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Kart Veren Kuruluş
            </label>
          </div>

          <div className="relative">
            <select
              id="cardType"
              value={formData.cardType}
              onChange={(e) => setFormData({ ...formData, cardType: e.target.value as CardType })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            >
              <option value=""> </option>
              {Object.values(CardType).map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <label
              htmlFor="cardType"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Kart Tipi
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              id="initialBalance"
              value={formData.initialBalance}
              onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
              placeholder=" "
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              min="0"
              step="0.01"
            />
            <label
              htmlFor="initialBalance"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Başlangıç Bakiyesi
            </label>
          </div>

          <div className="relative">
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              required
            >
              <option value=""> </option>
              {Object.values(Currency).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <label
              htmlFor="currency"
              className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
            >
              Para Birimi
            </label>
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