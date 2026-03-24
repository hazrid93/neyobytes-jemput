import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { useAuthStore } from './stores/authStore';
import LandingPage from './pages/LandingPage';
import InvitationPage from './pages/InvitationPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';

const AdminPage = lazy(() => import('./pages/AdminPage'));

function LazyFallback() {
  return (
    <Center style={{ minHeight: '100vh' }}>
      <Loader color="#B08D5B" />
    </Center>
  );
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/dashboard/*" element={<DashboardPage />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<LazyFallback />}>
            <AdminPage />
          </Suspense>
        }
      />
      <Route path="/:slug" element={<InvitationPage />} />
    </Routes>
  );
}
