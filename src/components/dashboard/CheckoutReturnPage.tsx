import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  Loader,
  Center,
  ThemeIcon,
  Paper,
  Group,
  Progress,
} from '@mantine/core';
import {
  IconCircleCheck,
  IconCircleX,
  IconArrowRight,
  IconRefresh,
} from '@tabler/icons-react';
import { usePaymentStore } from '../../stores/paymentStore';
import { GOLD, GOLD_WARM } from '../../constants/colors';

export default function CheckoutReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { verifyPayment } = usePaymentStore();

  const [status, setStatus] = useState<
    'loading' | 'success' | 'failed'
  >('loading');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [countdown, setCountdown] = useState(5);

  // Verify payment on mount
  useEffect(() => {
    async function verify() {
      if (!sessionId) {
        setStatus('failed');
        return;
      }

      try {
        const result = await verifyPayment(sessionId);

        if (result.payment_status === 'paid') {
          setStatus('success');
          setCustomerEmail(result.customer_email || '');
        } else {
          setStatus('failed');
        }
      } catch {
        setStatus('failed');
      }
    }

    verify();
  }, [sessionId, verifyPayment]);

  // Countdown + auto-redirect on success
  useEffect(() => {
    if (status !== 'success') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/dashboard/subscription', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, navigate]);

  // Loading state
  if (status === 'loading') {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed" size="lg">
            Mengesahkan pembayaran...
          </Text>
        </Stack>
      </Center>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <Container size="sm" py={80}>
        <Paper
          radius="lg"
          p="xl"
          shadow="md"
          style={{
            background: 'linear-gradient(135deg, #FFFAF3 0%, #F0FFF0 100%)',
            border: '1px solid #c3e6cb',
            textAlign: 'center',
          }}
        >
          <Stack align="center" gap="lg">
            <ThemeIcon
              size={80}
              radius="xl"
              variant="light"
              color="green"
            >
              <IconCircleCheck size={48} />
            </ThemeIcon>

            <Title
              order={2}
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#2C1810',
              }}
            >
              Pembayaran Berjaya!
            </Title>

            <Text size="lg" c="dimmed">
              Terima kasih! Pelan anda telah diaktifkan.
            </Text>

            {customerEmail && (
              <Text size="sm" c="dimmed">
                Resit akan dihantar ke {customerEmail}
              </Text>
            )}

            <Stack gap="xs" w="100%" maw={300}>
              <Progress
                value={((5 - countdown) / 5) * 100}
                color="green"
                size="sm"
                radius="xl"
                animated
              />
              <Text size="xs" c="dimmed">
                Mengalihkan ke dashboard dalam {countdown} saat...
              </Text>
            </Stack>

            <Button
              size="md"
              radius="xl"
              rightSection={<IconArrowRight size={16} />}
              onClick={() =>
                navigate('/dashboard/subscription', { replace: true })
              }
              style={{
                background:
                  `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                border: 'none',
                fontWeight: 600,
              }}
            >
              Pergi ke Dashboard
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Failed state
  return (
    <Container size="sm" py={80}>
      <Paper
        radius="lg"
        p="xl"
        shadow="md"
        style={{
          background: 'linear-gradient(135deg, #FFFAF3 0%, #FFF5F5 100%)',
          border: '1px solid #f5c6cb',
          textAlign: 'center',
        }}
      >
        <Stack align="center" gap="lg">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="light"
            color="red"
          >
            <IconCircleX size={48} />
          </ThemeIcon>

          <Title
            order={2}
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2C1810',
            }}
          >
            Pembayaran Gagal
          </Title>

          <Text size="lg" c="dimmed">
            Maaf, pembayaran anda tidak berjaya. Sila cuba semula.
          </Text>

          <Group gap="sm">
            <Button
              size="md"
              radius="xl"
              leftSection={<IconRefresh size={16} />}
              onClick={() => navigate('/pricing')}
              style={{
                background:
                  `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                border: 'none',
                fontWeight: 600,
              }}
            >
              Cuba Semula
            </Button>

            <Button
              size="md"
              radius="xl"
              variant="outline"
              color="gold"
              onClick={() => navigate('/dashboard')}
            >
              Kembali ke Dashboard
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
