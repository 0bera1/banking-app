import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Giriş yapılırken bir hata oluştu');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      addNotification('success', 'Başarıyla giriş yaptınız');
      navigate('/accounts');
    },
    onError: (error: Error) => {
      addNotification('error', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder=" "
                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              />
              <label
                htmlFor="email"
                className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#F9FAFB] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
              >
                E-posta adresi
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder=" "
                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer"
              />
              <label
                htmlFor="password"
                className="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-[#F9FAFB] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-indigo-600 left-1"
              >
                Şifre
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 hover:cursor-pointer px-4 border border-transparent text-sm font-medium rounded-md text-[#F9FAFB] bg-indigo-600 hover:bg-transparent hover:text-indigo-600 hover:border-indigo-600 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mutation.isPending ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 relative after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-500 after:transition-all after:duration-500"
            >
              Hesabınız yok mu? Kayıt olun
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}; 