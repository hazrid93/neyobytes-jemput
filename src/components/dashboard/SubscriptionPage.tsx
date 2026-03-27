import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Card,
  Badge,
  Group,
  Stack,
  Button,
  Table,
  Loader,
  Center,
  Divider,
  List,
  ThemeIcon,
  Alert,
  Paper,
} from '@mantine/core';
import {
  IconCrown,
  IconCheck,
  IconCalendar,
  IconCreditCard,
  IconExternalLink,
  IconAlertTriangle,
  IconRocket,
  IconRobot,
  IconClock,
  IconReceipt,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { usePaymentStore } from '../../stores/paymentStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { SLATE_200 } from '../../constants/colors';
import type { Payment } from '../../types';
import { supabase } from '../../lib/supabase';
import { getUserSubscriptionFeatures } from '../../lib/subscription';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { plans, fetchPlans, loading: plansLoading } = usePaymentStore();
  const { invitations, fetchMyInvitations, loading: invLoading } = useDashboardStore();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [subscriptionSummary, setSubscriptionSummary] = useState<Awaited<ReturnType<typeof getUserSubscriptionFeatures>> | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchMyInvitations();
    fetchPayments();
    fetchSubscriptionSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPlans, fetchMyInvitations]);

  async function fetchPayments() {
    setPaymentsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPayments(
          data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            user_id: row.user_id as string,
            invitation_id: (row.invitation_id as string) ?? undefined,
            plan_id: row.plan_id as string,
            amount: Number(row.amount),
            currency: (row.currency as string) ?? 'myr',
            stripe_session_id: (row.stripe_session_id as string) ?? undefined,
            stripe_payment_intent_id: (row.stripe_payment_intent_id as string) ?? undefined,
            status: row.status as Payment['status'],
            created_at: row.created_at as string,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setPaymentsLoading(false);
    }
  }

  async function fetchSubscriptionSummary() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const summary = await getUserSubscriptionFeatures(user.id);
      setSubscriptionSummary(summary);
    } catch (err) {
      console.error('Failed to fetch subscription summary:', err);
    }
  }

  async function createPortalSession() {
    setPortalLoading(true);
    try {
      // Get user's stripe_customer_id from profile
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      if (!profile?.stripe_customer_id) {
        notifications.show({
          title: 'Stripe Portal',
          message: 'Tiada akaun Stripe dikaitkan. Sila buat pembayaran terlebih dahulu.',
          color: 'yellow',
        });
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_URL}/stripe/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: profile.stripe_customer_id }),
      });

      if (!res.ok) throw new Error('Portal request failed');

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        notifications.show({
          title: 'Stripe Portal',
          message: 'Portal langganan Stripe tidak tersedia buat masa ini. Sila cuba sebentar lagi.',
          color: 'yellow',
        });
      }
    } catch (err) {
      console.error('Portal session failed:', err);
      notifications.show({
        title: 'Ralat',
        message: 'Tidak dapat membuka portal Stripe. Sila cuba sebentar lagi.',
        color: 'red',
      });
    } finally {
      setPortalLoading(false);
    }
  }

  // Determine current plan from the first invitation
  const currentInvitation = invitations.length > 0 ? invitations[0] : null;
  const expiresAt = subscriptionSummary?.expires_at
    ? new Date(subscriptionSummary.expires_at)
    : currentInvitation?.expires_at
    ? new Date(currentInvitation.expires_at)
    : null;
  const now = new Date();
  const isExpired = expiresAt ? expiresAt < now : false;
  const daysRemaining = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Find the plan for the most recent successful payment
  const lastSuccessfulPayment = payments.find((p) => p.status === 'succeeded');
  const currentPlan = subscriptionSummary?.plan_id
    ? plans.find((p) => p.id === subscriptionSummary.plan_id)
    : lastSuccessfulPayment
    ? plans.find((p) => p.id === lastSuccessfulPayment.plan_id)
    : plans.find((p) => p.price_myr === 0); // fallback to free plan

  const isLoading = plansLoading || invLoading || paymentsLoading;

  if (isLoading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed">Memuatkan maklumat langganan...</Text>
        </Stack>
      </Center>
    );
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'succeeded':
        return <Badge color="green" variant="light">Berjaya</Badge>;
      case 'pending':
        return <Badge color="yellow" variant="light">Menunggu</Badge>;
      case 'failed':
        return <Badge color="red" variant="light">Gagal</Badge>;
      default:
        return <Badge color="gray" variant="light">{status}</Badge>;
    }
  }

  function getPlanName(planId: string): string {
    const plan = plans.find((p) => p.id === planId);
    return plan?.name_ms || plan?.name || planId;
  }

  return (
    <Container size="md" py="lg">
      <Group mb="xl" gap="sm">
        <IconCrown size={28} color="#D4AF37" />
        <Title
          order={2}
          style={{ fontFamily: 'Playfair Display, serif', color: '#8B6F4E' }}
        >
          Langganan
        </Title>
      </Group>

      {/* Current Plan Card */}
      <Card
        shadow="sm"
        radius="md"
        mb="xl"
        padding="xl"
        withBorder
        style={{
          borderColor: SLATE_200,
          background: 'linear-gradient(135deg, #FFFAF3 0%, #FDF5E6 100%)',
        }}
      >
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <IconCrown size={24} color="#D4AF37" />
            <Title order={3} style={{ color: '#8B6F4E' }}>
              {currentPlan ? `Pelan ${currentPlan.name_ms}` : 'Tiada Pelan Aktif'}
            </Title>
          </Group>
          <Badge
            size="lg"
            variant="filled"
            color={isExpired ? 'red' : 'green'}
            leftSection={isExpired ? <IconAlertTriangle size={14} /> : <IconCheck size={14} />}
          >
            {isExpired ? 'Tamat Tempoh' : 'Aktif'}
          </Badge>
        </Group>

        <Divider mb="md" color={SLATE_200} />

        {/* Expiry info */}
        {expiresAt && (
          <Paper
            p="md"
            radius="md"
            mb="md"
            style={{
              background: isExpired
                ? 'rgba(255, 59, 48, 0.06)'
                : 'rgba(212, 175, 55, 0.08)',
              border: `1px solid ${isExpired ? 'rgba(255, 59, 48, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`,
            }}
          >
            <Group gap="sm">
              <IconCalendar size={20} color={isExpired ? '#e03131' : '#D4AF37'} />
              <div>
                <Text size="sm" fw={600} c={isExpired ? 'red' : '#8B6F4E'}>
                  {isExpired
                    ? `Tamat tempoh pada: ${formatDate(expiresAt.toISOString())}`
                    : `Aktif sehingga: ${formatDate(expiresAt.toISOString())}`}
                </Text>
                {!isExpired && (
                  <Group gap="xs" mt={4}>
                    <IconClock size={14} color="#8B6F4E" />
                    <Text size="xs" c="dimmed">
                      {daysRemaining} hari lagi
                    </Text>
                  </Group>
                )}
              </div>
            </Group>
          </Paper>
        )}

        {/* Expired warning */}
        {isExpired && (
          <Alert
            icon={<IconAlertTriangle size={18} />}
            title="Kad Anda Telah Tamat Tempoh"
            color="red"
            variant="light"
            mb="md"
            radius="md"
          >
            Kad anda telah tamat tempoh. Sila perbaharui untuk mengaktifkan semula.
          </Alert>
        )}

        {/* Features list */}
        {currentPlan && currentPlan.features && currentPlan.features.length > 0 && (
          <Stack gap="xs" mb="md">
            <Text size="sm" fw={600} c="#8B6F4E">
              Ciri-ciri pelan:
            </Text>
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon color="gold" size={20} radius="xl" variant="light">
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {currentPlan.features.map((feature, idx) => (
                <List.Item key={idx}>
                  <Text size="sm" c="#5C4033">
                    {feature}
                  </Text>
                </List.Item>
              ))}
            </List>
            {(subscriptionSummary?.invitation_chatbot_enabled || currentPlan.chatbot_enabled) && (
              <Group gap="xs" mt="xs">
                <ThemeIcon color="gold" size={20} radius="xl" variant="light">
                  <IconRobot size={12} />
                </ThemeIcon>
                <Text size="sm" c="#5C4033">
                  Chatbot AI: {(subscriptionSummary?.invitation_chat_daily_limit ?? currentPlan.chatbot_daily_limit) === 0
                    ? 'Soalan tanpa had setiap tetamu'
                    : `${subscriptionSummary?.invitation_chat_daily_limit ?? currentPlan.chatbot_daily_limit} soalan/hari setiap tetamu`}
                </Text>
              </Group>
            )}
          </Stack>
        )}

        {/* Action Buttons */}
        <Divider mb="md" color={SLATE_200} />
        <Group gap="sm">
          {isExpired ? (
            <Button
              leftSection={<IconRocket size={18} />}
              color="red"
              variant="filled"
              onClick={() => navigate('/pricing')}
            >
              Perbaharui Sekarang
            </Button>
          ) : (
            <Button
              leftSection={<IconRocket size={18} />}
              variant="light"
              color="gold"
              onClick={() => navigate('/pricing')}
            >
              Naik Taraf
            </Button>
          )}
          <Button
            leftSection={<IconCreditCard size={18} />}
            rightSection={<IconExternalLink size={14} />}
            variant="outline"
            color="gold"
            onClick={createPortalSession}
            loading={portalLoading}
          >
            Urus Langganan di Stripe
          </Button>
        </Group>
      </Card>

      {/* Payment History */}
      <Card shadow="sm" radius="md" padding="xl" withBorder style={{ borderColor: SLATE_200 }}>
        <Group gap="sm" mb="md">
          <IconReceipt size={22} color="#D4AF37" />
          <Title order={4} style={{ color: '#8B6F4E' }}>
            Sejarah Pembayaran
          </Title>
        </Group>

        {payments.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Tiada rekod pembayaran.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tarikh</Table.Th>
                <Table.Th>Pelan</Table.Th>
                <Table.Th>Jumlah (RM)</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payments.map((payment) => (
                <Table.Tr key={payment.id}>
                  <Table.Td>{formatDate(payment.created_at)}</Table.Td>
                  <Table.Td>{getPlanName(payment.plan_id)}</Table.Td>
                  <Table.Td>
                    {payment.amount === 0
                      ? 'Percuma'
                      : `RM ${payment.amount.toFixed(2)}`}
                  </Table.Td>
                  <Table.Td>{getStatusBadge(payment.status)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}
