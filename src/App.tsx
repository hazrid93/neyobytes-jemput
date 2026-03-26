import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { useAuthStore } from './stores/authStore';
import LandingPage from './pages/LandingPage';
import InvitationPage from './pages/InvitationPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import TrialEditorPage from './pages/TrialEditorPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';

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
      <Route path="/tentang-kami" element={<AboutPage />} />
      <Route path="/hubungi-kami" element={<ContactPage />} />
      <Route path="/terma" element={<TermsPage />} />
      <Route path="/privasi" element={<PrivacyPage />} />
      <Route path="/polisi-bayaran-balik" element={<RefundPage />} />
      <Route path="/cuba" element={<TrialEditorPage />} />
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
