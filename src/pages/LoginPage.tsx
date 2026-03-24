import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
import { IconMail, IconLock, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, initialized } = useAuthStore();

  const [activeTab, setActiveTab] = useState<string | null>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (initialized && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    setError('');
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
    if (!fullName.trim()) {
      setError('Sila masukkan nama penuh anda');
      return;
    }
    try {
      await signUp(email, password, fullName);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa mendaftar';
      setError(msg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FDF8F0 0%, #F5E6D3 50%, #E8D5B7 100%)',
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
                color: '#8B6F4E',
                letterSpacing: '-0.02em',
              }}
            >
              Jemput
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Kad Kahwin Digital Terbaik
            </Text>
          </Box>

          <Paper
            shadow="xl"
            p="xl"
            radius="lg"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
            }}
          >
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List grow mb="lg">
                <Tabs.Tab value="login" style={{ fontWeight: 600 }}>
                  Log Masuk
                </Tabs.Tab>
                <Tabs.Tab value="register" style={{ fontWeight: 600 }}>
                  Daftar
                </Tabs.Tab>
              </Tabs.List>

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  mb="md"
                  onClose={() => setError('')}
                  withCloseButton
                >
                  {error}
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
                    <Button
                      type="submit"
                      fullWidth
                      size="md"
                      loading={loading}
                      mt="xs"
                      style={{
                        background: 'linear-gradient(135deg, #8B6F4E, #D4AF37)',
                        border: 'none',
                      }}
                    >
                      Log Masuk
                    </Button>
                    <Text ta="center" size="sm" c="dimmed">
                      Belum ada akaun?{' '}
                      <Anchor
                        component="button"
                        type="button"
                        size="sm"
                        onClick={() => setActiveTab('register')}
                      >
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
                      mt="xs"
                      style={{
                        background: 'linear-gradient(135deg, #8B6F4E, #D4AF37)',
                        border: 'none',
                      }}
                    >
                      Daftar Akaun
                    </Button>
                    <Text ta="center" size="sm" c="dimmed">
                      Sudah ada akaun?{' '}
                      <Anchor
                        component="button"
                        type="button"
                        size="sm"
                        onClick={() => setActiveTab('login')}
                      >
                        Log masuk
                      </Anchor>
                    </Text>
                  </Stack>
                </Tabs.Panel>
              </form>
            </Tabs>

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
