import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { AccountsPage } from './pages/accounts/AccountsPage';
import { AccountDetailPage } from './pages/accounts/AccountDetailPage';
import { TransactionsPage } from './pages/transactions/TransactionsPage';
import { TransactionDetailPage } from './pages/transactions/TransactionDetailPage';
import { NotificationProvider } from './context/NotificationContext';
import { Notification } from './components/notifications/Notification';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DepositWithdrawPage } from './pages/accounts/DepositWithdrawPage';
import { Toaster } from 'react-hot-toast';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<AuthGuard><Layout><Outlet /></Layout></AuthGuard>}>
              <Route path="/" element={<Navigate to="/accounts" replace />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/transactions/:transactionId" element={<TransactionDetailPage />} />
              <Route path="/deposit-withdraw" element={<DepositWithdrawPage />} />
            </Route>
          </Routes>
          <Notification />
          <Toaster position="top-right" />
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
