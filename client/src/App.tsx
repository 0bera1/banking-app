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
            </Route>
          </Routes>
          <Notification />
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
