import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import {
  Container,
  Group,
  Stack,
  Title,
  Text,
  Card,
  List,
  ThemeIcon,
  Button,
  Loader,
  Center,
  Alert,
  Badge,
  Divider,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCircleCheck,
  IconArrowLeft,
  IconAlertTriangle,
  IconCrown,
  IconRobot,
} from '@tabler/icons-react';
import { usePaymentStore } from '../../stores/paymentStore';
import type { Plan } from '../../types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const invitationId = searchParams.get('invitation') || undefined;
  const isDesktop = useMediaQuery('(min-width: 48em)');

  const { plans, fetchPlans, fetchStripeConfig, createCheckout } =
    usePaymentStore();

  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof loadStripe
  > | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  // Initialize: fetch plans + stripe config
  useEffect(() => {
    async function init() {
      try {
        if (!planId) {
          setError('Tiada pelan dipilih.');
          setInitLoading(false);
          return;
        }

        // Fetch plans and stripe config in parallel
        const [, config] = await Promise.all([
          fetchPlans(),
          fetchStripeConfig(),
        ]);

        if (!config.publishableKey) {
          setError('Stripe belum dikonfigurasi. Sila hubungi pentadbir.');
          setInitLoading(false);
          return;
        }

        setStripePromise(loadStripe(config.publishableKey));
        setInitLoading(false);
      } catch (err) {
        console.error('Checkout init error:', err);
        setError('Gagal memuatkan halaman pembayaran.');
        setInitLoading(false);
      }
    }

    init();
  }, [planId, fetchPlans, fetchStripeConfig]);

  // Once plans are loaded, find the selected plan
  useEffect(() => {
    if (plans.length > 0 && planId) {
      const found = plans.find((p) => p.id === planId);
      if (found) {
        setPlan(found);
      } else {
        setError('Pelan tidak dijumpai.');
      }
    }
  }, [plans, planId]);

  // Create checkout session — used as fetchClientSecret for EmbeddedCheckoutProvider
  const fetchClientSecret = useCallback(async () => {
    if (!planId) throw new Error('No plan ID');
    const clientSecret = await createCheckout(planId, invitationId);
    return clientSecret;
  }, [planId, invitationId, createCheckout]);

  // Loading state
  if (initLoading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed">Memuatkan pembayaran...</Text>
        </Stack>
      </Center>
    );
  }

  // Error state
  if (error) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconAlertTriangle size={18} />}
          title="Ralat"
          color="red"
          variant="light"
          radius="md"
        >
          {error}
        </Alert>
        <Button
          mt="md"
          variant="light"
          color="gold"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/pricing')}
        >
          Kembali ke Harga
        </Button>
      </Container>
    );
  }

  // Plan not found or stripe not ready
  if (!plan || !stripePromise) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed">Menyediakan pembayaran...</Text>
        </Stack>
      </Center>
    );
  }

  // No stripe_price_id configured
  if (!plan.stripe_price_id) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconAlertTriangle size={18} />}
          title="Pelan Belum Dikonfigurasi"
          color="yellow"
          variant="light"
          radius="md"
        >
          Pelan ini belum dikonfigurasi untuk pembayaran. Sila hubungi
          pentadbir.
        </Alert>
        <Button
          mt="md"
          variant="light"
          color="gold"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/pricing')}
        >
          Kembali ke Harga
        </Button>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Button
        variant="subtle"
        color="dark"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/pricing')}
        mb="lg"
      >
        Kembali ke Harga
      </Button>

      {/* Responsive grid: side-by-side on sm+, stacked on mobile */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop
            ? 'minmax(0, 1fr) minmax(0, 1.5fr)'
            : '1fr',
          gap: isDesktop ? 24 : 16,
          alignItems: 'start',
        }}
      >
        <PlanSummaryCard plan={plan} />

        <Card
          shadow="sm"
          radius="md"
          padding={0}
          withBorder
          style={{ borderColor: '#E8D5B7', overflow: 'hidden' }}
        >
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Card>
      </Box>
    </Container>
  );
}

function PlanSummaryCard({ plan }: { plan: Plan }) {
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="xl"
      withBorder
      style={{
        borderColor: '#E8D5B7',
        background: 'linear-gradient(135deg, #FFFAF3 0%, #FDF5E6 100%)',
      }}
    >
      <Group gap="sm" mb="md">
        <IconCrown size={22} color="#D4AF37" />
        <Title order={4} style={{ color: '#8B6F4E' }}>
          Ringkasan Pesanan
        </Title>
      </Group>

      <Divider mb="md" color="#E8D5B7" />

      <Group justify="space-between" mb="xs">
        <Text fw={600} style={{ color: '#2C1810' }}>
          Pelan {plan.name_ms}
        </Text>
        <Badge
          size="lg"
          variant="light"
          color="gold"
          style={{ fontWeight: 700 }}
        >
          RM{plan.price_myr}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        Aktif selama {plan.duration_days} hari
      </Text>

      <Divider mb="md" color="#E8D5B7" />

      <Text size="sm" fw={600} c="#8B6F4E" mb="xs">
        Termasuk:
      </Text>

      <List
        spacing={8}
        size="sm"
        icon={
          <ThemeIcon color="gold" size={18} radius="xl" variant="light">
            <IconCircleCheck size={12} />
          </ThemeIcon>
        }
      >
        {plan.features.map((feature) => (
          <List.Item key={feature}>
            <Text size="sm" style={{ color: '#4A3B2D' }}>
              {feature}
            </Text>
          </List.Item>
        ))}
      </List>

      {plan.chatbot_enabled && (
        <Group gap="xs" mt="sm">
          <ThemeIcon color="gold" size={18} radius="xl" variant="light">
            <IconRobot size={12} />
          </ThemeIcon>
          <Text size="sm" c="#4A3B2D">
            Chatbot AI:{' '}
            {plan.chatbot_daily_limit === 0
              ? 'Tanpa had'
              : `${plan.chatbot_daily_limit} soalan/hari`}
          </Text>
        </Group>
      )}
    </Card>
  );
}
