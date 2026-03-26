import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Tabs,
  Stack,
  Anchor,
  Box,
  Divider,
  Alert,
} from '@mantine/core';
import { IconMail, IconLock, IconUser, IconAlertCircle, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

const NAVY = '#0A1628';
const NAVY_LIGHT = '#1E3A5F';
const GOLD = '#D4AF37';
const GOLD_WARM = '#C8A951';

type ViewMode = 'auth' | 'forgot' | 'reset-password';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signIn, signUp, signOut, resetPassword, updatePassword, initialized } = useAuthStore();

  const [view, setView] = useState<ViewMode>('auth');
  const [activeTab, setActiveTab] = useState<string | null>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If user arrives with ?reset=true, show the reset password form
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setView('reset-password');
    }
  }, [searchParams]);

  // Redirect if already logged in (but not if resetting password)
  if (initialized && user && view !== 'reset-password') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa log masuk';
      setError(msg);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    if (!fullName.trim()) {
      setError('Sila masukkan nama penuh anda');
      return;
    }
    try {
      await signUp(email, password, fullName);
      setSuccess('Akaun berjaya didaftarkan! Sila semak emel untuk pengesahan.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa mendaftar';
      setError(msg);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Sila masukkan alamat emel anda');
      return;
    }
    try {
      await resetPassword(email);
      setSuccess('Pautan tetapan semula kata laluan telah dihantar ke emel anda. Sila semak peti masuk dan spam.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa menghantar emel';
      setError(msg);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('Kata laluan mesti sekurang-kurangnya 6 aksara');
      return;
    }
    if (password !== confirmPassword) {
      setError('Kata laluan tidak sepadan');
      return;
    }
    try {
      await updatePassword(password);
      setSuccess('Kata laluan berjaya dikemas kini! Mengalihkan ke papan pemuka...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa mengemas kini kata laluan';
      setError(msg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'forgot') {
      handleForgotPassword();
    } else if (view === 'reset-password') {
      handleResetPassword();
    } else if (activeTab === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 80% 50% at 20% 80%, rgba(30,58,95,0.4) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(37,99,235,0.1) 0%, transparent 50%),
          linear-gradient(160deg, ${NAVY} 0%, #162240 60%, ${NAVY_LIGHT} 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Container size={440} w="100%">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Branding */}
          <Box ta="center" mb="xl">
            <Title
              order={1}
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.8rem',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              Jemput
            </Title>
            <Text size="sm" mt={4} style={{ color: 'rgba(255,255,255,0.5)' }}>
              Kad Kahwin Digital Terbaik
            </Text>
          </Box>

          <Paper
            shadow="xl"
            p="xl"
            radius="lg"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Forgot Password View */}
            {view === 'forgot' && (
              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Anchor
                    component="button"
                    type="button"
                    size="sm"
                    onClick={() => { setView('auth'); setError(''); setSuccess(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, color: NAVY_LIGHT }}
                  >
                    <IconArrowLeft size={14} /> Kembali
                  </Anchor>

                  <Title order={3} style={{ fontFamily: 'Playfair Display, serif', color: NAVY }}>
                    Lupa Kata Laluan?
                  </Title>
                  <Text size="sm" c="dimmed">
                    Masukkan alamat emel anda dan kami akan hantar pautan untuk tetapkan semula kata laluan.
                  </Text>

                  {error && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" onClose={() => setError('')} withCloseButton>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert icon={<IconCheck size={16} />} color="green" variant="light">
                      {success}
                    </Alert>
                  )}

                  <TextInput
                    label="Emel"
                    placeholder="anda@contoh.com"
                    leftSection={<IconMail size={16} />}
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    required
                    type="email"
                    size="md"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    loading={loading}
                    style={{
                      background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
                      border: 'none',
                    }}
                  >
                    Hantar Pautan
                  </Button>
                </Stack>
              </form>
            )}

            {/* Reset Password View (after clicking email link) */}
            {view === 'reset-password' && (
              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Title order={3} style={{ fontFamily: 'Playfair Display, serif', color: NAVY }}>
                    Tetapkan Kata Laluan Baru
                  </Title>
                  <Text size="sm" c="dimmed">
                    Masukkan kata laluan baru anda.
                  </Text>

                  {error && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" onClose={() => setError('')} withCloseButton>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert icon={<IconCheck size={16} />} color="green" variant="light">
                      {success}
                    </Alert>
                  )}

                  <PasswordInput
                    label="Kata Laluan Baru"
                    placeholder="Minimum 6 aksara"
                    leftSection={<IconLock size={16} />}
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    required
                    minLength={6}
                    size="md"
                  />
                  <PasswordInput
                    label="Sahkan Kata Laluan"
                    placeholder="Masukkan sekali lagi"
                    leftSection={<IconLock size={16} />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    required
                    minLength={6}
                    size="md"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    size="md"
                    loading={loading}
                    style={{
                      background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
                      border: 'none',
                    }}
                  >
                    Kemas Kini Kata Laluan
                  </Button>

                  {user && (
                    <Anchor
                      component="button"
                      type="button"
                      size="sm"
                      ta="center"
                      onClick={() => { signOut(); setView('auth'); }}
                      style={{ color: NAVY_LIGHT }}
                    >
                      Log keluar & kembali
                    </Anchor>
                  )}
                </Stack>
              </form>
            )}

            {/* Login / Register View */}
            {view === 'auth' && (
              <>
                <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
                  <Tabs.List grow mb="lg">
                    <Tabs.Tab value="login" style={{ fontWeight: 600 }}>
                      Log Masuk
                    </Tabs.Tab>
                    <Tabs.Tab value="register" style={{ fontWeight: 600 }}>
                      Daftar
                    </Tabs.Tab>
                  </Tabs.List>

                  {error && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" mb="md" onClose={() => setError('')} withCloseButton>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert icon={<IconCheck size={16} />} color="green" variant="light" mb="md">
                      {success}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Tabs.Panel value="login">
                      <Stack gap="md">
                        <TextInput
                          label="Emel"
                          placeholder="anda@contoh.com"
                          leftSection={<IconMail size={16} />}
                          value={email}
                          onChange={(e) => setEmail(e.currentTarget.value)}
                          required
                          type="email"
                          size="md"
                        />
                        <PasswordInput
                          label="Kata Laluan"
                          placeholder="Masukkan kata laluan"
                          leftSection={<IconLock size={16} />}
                          value={password}
                          onChange={(e) => setPassword(e.currentTarget.value)}
                          required
                          size="md"
                        />
                        <Anchor
                          component="button"
                          type="button"
                          size="xs"
                          c="dimmed"
                          ta="right"
                          onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                        >
                          Lupa kata laluan?
                        </Anchor>
                        <Button
                          type="submit"
                          fullWidth
                          size="md"
                          loading={loading}
                          style={{
                            background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                            border: 'none',
                            color: NAVY,
                            fontWeight: 700,
                          }}
                        >
                          Log Masuk
                        </Button>
                        <Text ta="center" size="sm" c="dimmed">
                          Belum ada akaun?{' '}
                          <Anchor component="button" type="button" size="sm" onClick={() => setActiveTab('register')}>
                            Daftar sekarang
                          </Anchor>
                        </Text>
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="register">
                      <Stack gap="md">
                        <TextInput
                          label="Nama Penuh"
                          placeholder="Nama penuh anda"
                          leftSection={<IconUser size={16} />}
                          value={fullName}
                          onChange={(e) => setFullName(e.currentTarget.value)}
                          required
                          size="md"
                        />
                        <TextInput
                          label="Emel"
                          placeholder="anda@contoh.com"
                          leftSection={<IconMail size={16} />}
                          value={email}
                          onChange={(e) => setEmail(e.currentTarget.value)}
                          required
                          type="email"
                          size="md"
                        />
                        <PasswordInput
                          label="Kata Laluan"
                          placeholder="Minimum 6 aksara"
                          leftSection={<IconLock size={16} />}
                          value={password}
                          onChange={(e) => setPassword(e.currentTarget.value)}
                          required
                          minLength={6}
                          size="md"
                        />
                        <Button
                          type="submit"
                          fullWidth
                          size="md"
                          loading={loading}
                          style={{
                            background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                            border: 'none',
                            color: NAVY,
                            fontWeight: 700,
                          }}
                        >
                          Daftar Akaun
                        </Button>
                        <Text ta="center" size="sm" c="dimmed">
                          Sudah ada akaun?{' '}
                          <Anchor component="button" type="button" size="sm" onClick={() => setActiveTab('login')}>
                            Log masuk
                          </Anchor>
                        </Text>
                      </Stack>
                    </Tabs.Panel>
                  </form>
                </Tabs>
              </>
            )}

            <Divider my="lg" label="atau" labelPosition="center" />

            <Anchor
              component="button"
              type="button"
              size="sm"
              ta="center"
              display="block"
              c="dimmed"
              onClick={() => navigate('/')}
            >
              Kembali ke halaman utama
            </Anchor>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
