import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppShell,
  Tabs,
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  Table,
  Badge,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  ActionIcon,
  Loader,
  Center,
  Box,
  Divider,
  Select,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconDashboard,
  IconCreditCard,
  IconUsers,
  IconReceipt,
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowLeft,
  IconCurrencyDollar,
  IconUserCheck,
  IconFileInvoice,
  IconCalendarEvent,
  IconChevronRight,
  IconSettings,
  IconMessageCircle,
  IconRefresh,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAdminStore } from '../stores/adminStore';
import type { ChatPoolUsageRow } from '../stores/adminStore';
import { useAuthStore } from '../stores/authStore';
import type { Plan, SiteSettings, UserProfile } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../lib/site-settings';
import { NAVY, GOLD, GOLD_WARM, OFF_WHITE, SLATE_200 } from '../constants/colors';

// ---------------------------------------------------------------------------
// Theme constants
// ---------------------------------------------------------------------------
const GOLD_LIGHT = GOLD_WARM;
const CREAM = OFF_WHITE;
const DARK = NAVY;

// ---------------------------------------------------------------------------
// Stats Card
// ---------------------------------------------------------------------------
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  color: string;
}) {
  return (
    <Card
      padding="lg"
      radius="md"
      style={{
        border: `1px solid ${SLATE_200}`,
        background: '#fff',
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>
          <Text
            fw={700}
            style={{
              fontSize: 28,
              fontFamily: "'Playfair Display', serif",
              color: DARK,
            }}
          >
            {value}
          </Text>
        </Stack>
        <Box
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} stroke={1.5} />
        </Box>
      </Group>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Tab
// ---------------------------------------------------------------------------
function DashboardTab() {
  const { stats, payments, loadingStats, fetchStats, fetchPayments, chatUsage, loadingChatUsage, fetchChatUsage } =
    useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchPayments();
    fetchChatUsage();
  }, [fetchStats, fetchPayments, fetchChatUsage]);

  if (loadingStats && !stats) {
    return (
      <Center py={60}>
        <Loader color={GOLD} />
      </Center>
    );
  }

  const recentPayments = payments.slice(0, 10);

  return (
    <Stack gap="xl">
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <StatCard
          label="Jumlah Pengguna"
          value={stats?.total_users ?? 0}
          icon={IconUsers}
          color={GOLD}
        />
        <StatCard
          label="Jumlah Jemputan"
          value={stats?.total_invitations ?? 0}
          icon={IconCalendarEvent}
          color="#4C6EF5"
        />
        <StatCard
          label="Jumlah Hasil (MYR)"
          value={`RM ${(stats?.revenue_myr ?? 0).toFixed(2)}`}
          icon={IconCurrencyDollar}
          color="#40C057"
        />
        <StatCard
          label="Jemputan Aktif"
          value={stats?.active_invitations ?? 0}
          icon={IconFileInvoice}
          color="#F76707"
        />
      </SimpleGrid>

      <Card
        padding="lg"
        radius="md"
        style={{ border: `1px solid ${SLATE_200}`, background: '#fff' }}
      >
        <Title order={4} mb="md" style={{ color: DARK }}>
          Bayaran Terkini
        </Title>

        {recentPayments.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Tiada bayaran lagi.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Jumlah</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Tarikh</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentPayments.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text size="xs" ff="monospace">
                      {p.id.slice(0, 8)}...
                    </Text>
                  </Table.Td>
                  <Table.Td>RM {Number(p.amount).toFixed(2)}</Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      color={
                        p.status === 'succeeded'
                          ? 'green'
                          : p.status === 'pending'
                            ? 'yellow'
                            : 'red'
                      }
                      variant="light"
                    >
                      {p.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(p.created_at).toLocaleDateString('ms-MY')}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      {/* Chat Usage Stats */}
      <ChatUsagePanel rows={chatUsage} loading={loadingChatUsage} />
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Chat Usage Panel (used in DashboardTab)
// ---------------------------------------------------------------------------
const GLOBAL_POOL_LABELS: Record<string, string> = {
  cuba_preview: 'Chatbot Pratonton /cuba',
  cuba_editor: 'Pembantu AI Editor /cuba',
  editor: 'Pembantu AI Editor (pengguna)',
};

function ChatUsagePanel({ rows, loading }: { rows: ChatPoolUsageRow[]; loading: boolean }) {
  const { resetPoolUsage } = useAdminStore();
  const today = new Date().toISOString().slice(0, 10);

  const globalKeys = ['cuba_preview', 'cuba_editor', 'editor'];
  const globalToday: Record<string, number> = {};
  const globalTotal: Record<string, number> = {};
  const invitationToday: Record<string, number> = {};
  const invitationTotal: Record<string, number> = {};

  for (const r of rows) {
    if (globalKeys.includes(r.pool_key)) {
      globalTotal[r.pool_key] = (globalTotal[r.pool_key] ?? 0) + r.count;
      if (r.date === today) globalToday[r.pool_key] = r.count;
    } else if (r.pool_key.startsWith('invitation:')) {
      const invId = r.pool_key.replace('invitation:', '');
      invitationTotal[invId] = (invitationTotal[invId] ?? 0) + r.count;
      if (r.date === today) invitationToday[invId] = (invitationToday[invId] ?? 0) + r.count;
    }
  }

  const invEntries = Object.entries(invitationTotal).sort((a, b) => b[1] - a[1]);

  const handleReset = async (poolKey: string, mode: 'today' | 'all') => {
    try {
      await resetPoolUsage(poolKey, mode);
      notifications.show({
        title: 'Berjaya',
        message: mode === 'today' ? 'Kiraan hari ini telah direset' : 'Semua kiraan telah direset',
        color: 'green',
        autoClose: 2000,
      });
    } catch {
      notifications.show({ title: 'Ralat', message: 'Gagal mereset kiraan', color: 'red' });
    }
  };

  return (
    <Card padding="lg" radius="md" style={{ border: `1px solid ${SLATE_200}`, background: '#fff' }}>
      <Group mb="md" gap="xs">
        <IconMessageCircle size={20} color={GOLD} />
        <Title order={4} style={{ color: DARK }}>Penggunaan Chatbot</Title>
      </Group>

      {loading ? (
        <Center py="xl"><Loader color={GOLD} size="sm" /></Center>
      ) : rows.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">Tiada data penggunaan lagi.</Text>
      ) : (
        <Stack gap="md">
          {/* Global Pools */}
          <Box>
            <Text fw={600} size="sm" mb="xs" c="dimmed">Pool Global (dikongsi semua pelawat)</Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
              {globalKeys.map((key) => (
                <Card key={key} padding="sm" radius="sm" withBorder style={{ background: 'rgba(10,22,40,0.02)' }}>
                  <Text size="xs" fw={600} mb={4}>{GLOBAL_POOL_LABELS[key]}</Text>
                  <Group gap="lg">
                    <Box>
                      <Text size="xl" fw={700} style={{ color: DARK }}>{globalToday[key] ?? 0}</Text>
                      <Text size="xs" c="dimmed">Hari ini</Text>
                    </Box>
                    <Box>
                      <Text size="xl" fw={700} style={{ color: DARK }}>{globalTotal[key] ?? 0}</Text>
                      <Text size="xs" c="dimmed">Jumlah</Text>
                    </Box>
                  </Group>
                  <Group mt="xs" gap="xs">
                    <Button size="compact-xs" variant="light" color="yellow" leftSection={<IconRefresh size={12} />}
                      onClick={() => handleReset(key, 'today')}>Reset hari ini</Button>
                    <Button size="compact-xs" variant="light" color="red" leftSection={<IconTrash size={12} />}
                      onClick={() => handleReset(key, 'all')}>Reset semua</Button>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Per-Invitation Pools */}
          <Box>
            <Text fw={600} size="sm" mb="xs" c="dimmed">Chatbot Kad Jemputan (per kad)</Text>
            {invEntries.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="sm">Tiada penggunaan chatbot kad jemputan.</Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID Jemputan</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Hari Ini</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Jumlah</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Tindakan</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invEntries.map(([invId, total]) => (
                    <Table.Tr key={invId}>
                      <Table.Td>
                        <Text size="xs" ff="monospace">{invId.slice(0, 12)}…</Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>{invitationToday[invId] ?? 0}</Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>{total}</Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Group gap={4} justify="flex-end">
                          <ActionIcon size="sm" variant="light" color="yellow"
                            onClick={() => handleReset(`invitation:${invId}`, 'today')}
                            title="Reset hari ini">
                            <IconRefresh size={14} />
                          </ActionIcon>
                          <ActionIcon size="sm" variant="light" color="red"
                            onClick={() => handleReset(`invitation:${invId}`, 'all')}
                            title="Reset semua">
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Box>
        </Stack>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Plans Tab
// ---------------------------------------------------------------------------
const EMPTY_PLAN_FORM = {
  name: '',
  name_ms: '',
  description: '',
  price_myr: 0,
  duration_days: 60,
  features_text: '',
  stripe_price_id: '',
  is_active: true,
  sort_order: 0,
  chatbot_enabled: false,
  chatbot_daily_limit: 0,
};

function PlansTab() {
  const { plans, loadingPlans, fetchPlans, createPlan, updatePlan, deletePlan } =
    useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState(EMPTY_PLAN_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(EMPTY_PLAN_FORM);
    setModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      name_ms: plan.name_ms,
      description: plan.description,
      price_myr: plan.price_myr,
      duration_days: plan.duration_days,
      features_text: plan.features.join('\n'),
      stripe_price_id: plan.stripe_price_id ?? '',
      is_active: plan.is_active,
      sort_order: plan.sort_order,
      chatbot_enabled: plan.chatbot_enabled ?? false,
      chatbot_daily_limit: plan.chatbot_daily_limit ?? 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const features = form.features_text
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: Partial<Plan> = {
      name: form.name,
      name_ms: form.name_ms,
      description: form.description,
      price_myr: form.price_myr,
      duration_days: form.duration_days,
      features,
      stripe_price_id: form.stripe_price_id || undefined,
      is_active: form.is_active,
      sort_order: form.sort_order,
      chatbot_enabled: form.chatbot_enabled,
      chatbot_daily_limit: form.chatbot_daily_limit,
    };

    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, payload);
      } else {
        await createPlan(payload);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlan(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4} style={{ color: DARK }}>
          Pelan
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreate}
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
            border: 'none',
          }}
        >
          Tambah Pelan
        </Button>
      </Group>

      {loadingPlans && plans.length === 0 ? (
        <Center py={40}>
          <Loader color={GOLD} />
        </Center>
      ) : (
        <Card
          padding="lg"
          radius="md"
          style={{
            border: `1px solid ${SLATE_200}`,
            background: '#fff',
          }}
        >
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nama</Table.Th>
                <Table.Th>Nama (MS)</Table.Th>
                <Table.Th>Harga (RM)</Table.Th>
                <Table.Th>Tempoh (Hari)</Table.Th>
                <Table.Th>Chatbot</Table.Th>
                <Table.Th>Had/Hari</Table.Th>
                <Table.Th>Aktif</Table.Th>
                <Table.Th>Urutan</Table.Th>
                <Table.Th>Tindakan</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {plans.map((plan) => (
                <Table.Tr key={plan.id}>
                  <Table.Td>{plan.name}</Table.Td>
                  <Table.Td>{plan.name_ms}</Table.Td>
                  <Table.Td>RM {plan.price_myr.toFixed(2)}</Table.Td>
                  <Table.Td>{plan.duration_days}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={plan.chatbot_enabled ? 'green' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {plan.chatbot_enabled ? 'Ya' : 'Tidak'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{plan.chatbot_daily_limit}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={plan.is_active ? 'green' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {plan.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{plan.sort_order}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => openEdit(plan)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => setDeleteConfirm(plan.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? 'Sunting Pelan' : 'Tambah Pelan Baru'}
        size="lg"
      >
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="Name (EN)"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.currentTarget.value })
              }
              required
            />
            <TextInput
              label="Nama (MS)"
              value={form.name_ms}
              onChange={(e) =>
                setForm({ ...form, name_ms: e.currentTarget.value })
              }
              required
            />
          </Group>

          <Textarea
            label="Penerangan"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.currentTarget.value })
            }
          />

          <Group grow>
            <NumberInput
              label="Harga (MYR)"
              value={form.price_myr}
              onChange={(val) =>
                setForm({ ...form, price_myr: Number(val) || 0 })
              }
              min={0}
              decimalScale={2}
              prefix="RM "
            />
            <NumberInput
              label="Tempoh (Hari)"
              value={form.duration_days}
              onChange={(val) =>
                setForm({ ...form, duration_days: Number(val) || 60 })
              }
              min={1}
            />
          </Group>

          <Textarea
            label="Ciri-ciri (satu per baris)"
            value={form.features_text}
            onChange={(e) =>
              setForm({ ...form, features_text: e.currentTarget.value })
            }
            minRows={4}
            autosize
            placeholder="Semua rekaan tema&#10;Tiada watermark&#10;Galeri foto"
          />

          <TextInput
            label="Stripe Price ID"
            value={form.stripe_price_id}
            onChange={(e) =>
              setForm({ ...form, stripe_price_id: e.currentTarget.value })
            }
            placeholder="price_xxxx (kosongkan jika belum ada)"
          />

          <Box pt={8}>
            <Switch
              label="Chatbot AI Diaktifkan"
              checked={form.chatbot_enabled}
              onChange={(e) =>
                setForm({ ...form, chatbot_enabled: e.currentTarget.checked })
              }
              color={GOLD}
            />
          </Box>

          {form.chatbot_enabled && (
            <NumberInput
              label="Had Soalan Chatbot/Hari"
              description="0 = tiada had"
              value={form.chatbot_daily_limit}
              onChange={(val) =>
                setForm({ ...form, chatbot_daily_limit: Number(val) || 0 })
              }
              min={0}
            />
          )}

          <Group grow>
            <NumberInput
              label="Urutan Paparan"
              value={form.sort_order}
              onChange={(val) =>
                setForm({ ...form, sort_order: Number(val) || 0 })
              }
              min={0}
            />
            <Box pt={24}>
              <Switch
                label="Aktif"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.currentTarget.checked })
                }
                color={GOLD}
              />
            </Box>
          </Group>

          <Divider />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={loadingPlans}
            >
              {editingPlan ? 'Simpan' : 'Cipta'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Padam Pelan"
        size="sm"
      >
        <Text mb="lg">
          Adakah anda pasti mahu memadam pelan ini? Tindakan ini tidak boleh
          diundur.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteConfirm(null)}>
            Batal
          </Button>
          <Button
            color="red"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            loading={loadingPlans}
          >
            Padam
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Users Tab
// ---------------------------------------------------------------------------
function UsersTab() {
  const { users, plans, loadingUsers, loadingPlans, fetchUsers, fetchPlans, updateUser } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    subscription_plan_id: 'free',
    subscription_status: 'inactive' as 'inactive' | 'active' | 'expired' | 'granted',
    subscription_active_from: null as Date | null,
    subscription_expires_at: null as Date | null,
    invitation_chatbot_enabled_mode: 'inherit' as 'inherit' | 'enabled' | 'disabled',
    invitation_chat_daily_limit_override: '' as number | '',
    granted_features_text: '',
    admin_notes: '',
    role: 'user' as 'user' | 'admin',
  });

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, [fetchUsers, fetchPlans]);

  const planOptions = [
    { value: 'free', label: 'Percuma' },
    ...plans.map((plan) => ({
      value: plan.id,
      label: plan.name_ms || plan.name,
    })),
  ];

  const planLabelById = new Map(plans.map((plan) => [plan.id, plan.name_ms || plan.name]));

  const openEdit = (user: UserProfile) => {
    setEditingUser(user);
    setForm({
      subscription_plan_id: user.subscription_plan_id || 'free',
      subscription_status: user.subscription_status || 'inactive',
      subscription_active_from: user.subscription_active_from ? new Date(user.subscription_active_from) : null,
      subscription_expires_at: user.subscription_expires_at ? new Date(user.subscription_expires_at) : null,
      invitation_chatbot_enabled_mode:
        user.invitation_chatbot_enabled_override === null || user.invitation_chatbot_enabled_override === undefined
          ? 'inherit'
          : user.invitation_chatbot_enabled_override
            ? 'enabled'
            : 'disabled',
      invitation_chat_daily_limit_override:
        user.invitation_chat_daily_limit_override === null || user.invitation_chat_daily_limit_override === undefined
          ? ''
          : user.invitation_chat_daily_limit_override,
      granted_features_text: (user.granted_features || []).join('\n'),
      admin_notes: user.admin_notes || '',
      role: user.role,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        role: form.role,
        subscription_plan_id: form.subscription_plan_id === 'free' ? null : form.subscription_plan_id,
        subscription_status: form.subscription_status,
        subscription_active_from: form.subscription_active_from ? form.subscription_active_from.toISOString() : null,
        subscription_expires_at: form.subscription_expires_at ? form.subscription_expires_at.toISOString() : null,
        invitation_chatbot_enabled_override:
          form.invitation_chatbot_enabled_mode === 'inherit'
            ? null
            : form.invitation_chatbot_enabled_mode === 'enabled',
        invitation_chat_daily_limit_override:
          form.invitation_chat_daily_limit_override === '' ? null : Number(form.invitation_chat_daily_limit_override),
        granted_features: form.granted_features_text
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        admin_notes: form.admin_notes.trim() || null,
      });

      notifications.show({
        title: 'Berjaya',
        message: 'Tetapan pengguna berjaya dikemas kini',
        color: 'green',
      });
      setModalOpen(false);
    } catch {
      notifications.show({
        title: 'Ralat',
        message: 'Gagal menyimpan tetapan pengguna',
        color: 'red',
      });
    }
  };

  if ((loadingUsers && users.length === 0) || (loadingPlans && plans.length === 0)) {
    return (
      <Center py={60}>
        <Loader color={GOLD} />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Title order={4} style={{ color: DARK }}>
        Pengguna
      </Title>

      <Card
        padding="lg"
        radius="md"
        style={{
          border: `1px solid ${SLATE_200}`,
          background: '#fff',
        }}
      >
        {users.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Tiada pengguna.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>E-mel</Table.Th>
                <Table.Th>Nama</Table.Th>
                <Table.Th>Peranan</Table.Th>
                <Table.Th>Pelan</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Had Chat</Table.Th>
                <Table.Th>Tamat</Table.Th>
                <Table.Th>Tarikh Daftar</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.full_name || '-'}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={user.role === 'admin' ? 'violet' : 'blue'}
                      variant="light"
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{user.subscription_plan_id ? (planLabelById.get(user.subscription_plan_id) || 'Pelan') : 'Percuma'}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        user.subscription_status === 'active' || user.subscription_status === 'granted'
                          ? 'green'
                          : user.subscription_status === 'expired'
                            ? 'red'
                            : 'gray'
                      }
                      variant="light"
                      size="sm"
                    >
                      {user.subscription_status || 'inactive'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {user.invitation_chat_daily_limit_override === null || user.invitation_chat_daily_limit_override === undefined
                      ? '-'
                      : user.invitation_chat_daily_limit_override}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {user.subscription_expires_at
                        ? new Date(user.subscription_expires_at).toLocaleDateString('ms-MY')
                        : '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(user.created_at).toLocaleDateString('ms-MY')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconEdit size={14} />}
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `Urus langganan: ${editingUser.email}` : 'Urus langganan pengguna'}
        size="lg"
      >
        <Stack gap="md">
          <Group grow>
            <Select
              label="Pelan / Tier"
              data={planOptions}
              value={form.subscription_plan_id}
              onChange={(value) => setForm((current) => ({
                ...current,
                subscription_plan_id: value || 'free',
              }))}
            />
            <Select
              label="Status Langganan"
              data={[
                { value: 'inactive', label: 'Tidak Aktif' },
                { value: 'active', label: 'Aktif' },
                { value: 'expired', label: 'Tamat' },
                { value: 'granted', label: 'Grant Manual' },
              ]}
              value={form.subscription_status}
              onChange={(value) => setForm((current) => ({
                ...current,
                subscription_status: (value as typeof current.subscription_status) || 'inactive',
              }))}
            />
          </Group>

          <Group grow>
            <DatePickerInput
              label="Aktif Dari"
              placeholder="Pilih tarikh"
              value={form.subscription_active_from}
              onChange={(value) => setForm((current) => ({
                ...current,
                subscription_active_from: value ? new Date(value) : null,
              }))}
              clearable
            />
            <DatePickerInput
              label="Tamat Pada"
              placeholder="Pilih tarikh"
              value={form.subscription_expires_at}
              onChange={(value) => setForm((current) => ({
                ...current,
                subscription_expires_at: value ? new Date(value) : null,
              }))}
              clearable
            />
          </Group>

          <Group grow>
            <Select
              label="Peranan"
              data={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={form.role}
              onChange={(value) => setForm((current) => ({
                ...current,
                role: (value as 'user' | 'admin') || 'user',
              }))}
            />
            <Select
              label="Override Chatbot Kad Jemputan"
              description="Pilih sama ada ikut pelan, paksa aktif, atau matikan terus"
              data={[
                { value: 'inherit', label: 'Ikut pelan / default' },
                { value: 'enabled', label: 'Paksa aktif' },
                { value: 'disabled', label: 'Matikan' },
              ]}
              value={form.invitation_chatbot_enabled_mode}
              onChange={(value) => setForm((current) => ({
                ...current,
                invitation_chatbot_enabled_mode:
                  (value as 'inherit' | 'enabled' | 'disabled') || 'inherit',
              }))}
            />
          </Group>

          <NumberInput
            label="Had Chatbot Kad Jemputan (override)"
            description="Kosongkan untuk ikut pelan. 0 = tanpa had."
            value={form.invitation_chat_daily_limit_override}
            onChange={(value) => setForm((current) => ({
              ...current,
              invitation_chat_daily_limit_override:
                value === '' || value === null ? '' : Number(value),
            }))}
            min={0}
          />

          <Textarea
            label="Grant / Extra Features"
            description="Satu baris satu kelebihan, contoh: unlimited-chatbot, vip-support, custom-theme"
            value={form.granted_features_text}
            onChange={(e) => setForm((current) => ({
              ...current,
              granted_features_text: e.currentTarget.value,
            }))}
            minRows={3}
            autosize
          />

          <Textarea
            label="Nota Admin"
            value={form.admin_notes}
            onChange={(e) => setForm((current) => ({
              ...current,
              admin_notes: e.currentTarget.value,
            }))}
            minRows={3}
            autosize
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} loading={loadingUsers}>
              Simpan Perubahan
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Payments Tab
// ---------------------------------------------------------------------------
function PaymentsTab() {
  const { payments, loadingPayments, fetchPayments } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filtered = statusFilter
    ? payments.filter((p) => p.status === statusFilter)
    : payments;

  if (loadingPayments && payments.length === 0) {
    return (
      <Center py={60}>
        <Loader color={GOLD} />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={4} style={{ color: DARK }}>
          Bayaran
        </Title>
        <Select
          placeholder="Tapis status"
          clearable
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'succeeded', label: 'Succeeded' },
            { value: 'failed', label: 'Failed' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          w={200}
        />
      </Group>

      <Card
        padding="lg"
        radius="md"
        style={{
          border: `1px solid ${SLATE_200}`,
          background: '#fff',
        }}
      >
        {filtered.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Tiada bayaran{statusFilter ? ` dengan status "${statusFilter}"` : ''}.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Pengguna</Table.Th>
                <Table.Th>Jumlah</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Pelan ID</Table.Th>
                <Table.Th>Tarikh</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtered.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text size="xs" ff="monospace">
                      {p.id.slice(0, 8)}...
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" ff="monospace">
                      {p.user_id.slice(0, 8)}...
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    RM {Number(p.amount).toFixed(2)}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      color={
                        p.status === 'succeeded'
                          ? 'green'
                          : p.status === 'pending'
                            ? 'yellow'
                            : 'red'
                      }
                      variant="light"
                    >
                      {p.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" ff="monospace">
                      {p.plan_id.slice(0, 8)}...
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(p.created_at).toLocaleDateString('ms-MY')}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}

function SiteSettingsTab() {
  const {
    siteSettings,
    loadingSiteSettings,
    fetchSiteSettings,
    updateSiteSettings,
  } = useAdminStore();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetchSiteSettings();
  }, [fetchSiteSettings]);

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  const handleSave = async () => {
    try {
      await updateSiteSettings(form);
    } catch (err) {
      console.error('Failed to save site settings:', err);
    }
  };

  if (loadingSiteSettings && form.id === DEFAULT_SITE_SETTINGS.id && form.company_name === DEFAULT_SITE_SETTINGS.company_name) {
    return (
      <Center py={60}>
        <Loader color={GOLD} />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Title order={4} style={{ color: DARK }}>
        Tetapan Laman
      </Title>

      <Card
        padding="lg"
        radius="md"
        style={{
          border: `1px solid ${SLATE_200}`,
          background: '#fff',
        }}
      >
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="Nama Syarikat / Jenama"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.currentTarget.value })}
            />
            <TextInput
              label="E-mel Hubungan"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.currentTarget.value })}
            />
          </Group>

          <TextInput
            label="Telefon"
            value={form.contact_phone || ''}
            onChange={(e) => setForm({ ...form, contact_phone: e.currentTarget.value })}
          />

          <Textarea
            label="Tagline Footer"
            value={form.company_tagline}
            onChange={(e) => setForm({ ...form, company_tagline: e.currentTarget.value })}
            minRows={2}
            autosize
          />

          <Textarea
            label="Ringkasan Tentang Kami"
            value={form.about_short}
            onChange={(e) => setForm({ ...form, about_short: e.currentTarget.value })}
            minRows={4}
            autosize
          />

          <Textarea
            label="Alamat"
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.currentTarget.value })}
            minRows={2}
            autosize
          />

          <Divider label="Media Sosial" labelPosition="center" />

          <TextInput
            label="Instagram URL"
            placeholder="https://instagram.com/..."
            value={form.instagram_url || ''}
            onChange={(e) => setForm({ ...form, instagram_url: e.currentTarget.value })}
          />
          <TextInput
            label="Facebook URL"
            placeholder="https://facebook.com/..."
            value={form.facebook_url || ''}
            onChange={(e) => setForm({ ...form, facebook_url: e.currentTarget.value })}
          />
          <TextInput
            label="X / Twitter URL"
            placeholder="https://x.com/..."
            value={form.x_url || ''}
            onChange={(e) => setForm({ ...form, x_url: e.currentTarget.value })}
          />

          <Divider label="Chatbot & Pembantu AI" labelPosition="center" />

          <Text size="sm" c="dimmed">
            Kawal ciri chatbot dan pembantu AI untuk pelawat percubaan dan pengguna berdaftar.
          </Text>

          {/* /cuba preview chatbot */}
          <Card padding="sm" radius="sm" withBorder style={{ background: 'rgba(10,22,40,0.03)' }}>
            <Stack gap="xs">
              <Text fw={600} size="sm">Chatbot Pratonton /cuba</Text>
              <Text size="xs" c="dimmed">Chatbot tetamu di pratonton halaman percubaan</Text>
              <Group grow>
                <Box pt={8}>
                  <Switch
                    label="Aktifkan"
                    checked={form.cuba_preview_chat_enabled ?? true}
                    onChange={(e) => setForm({ ...form, cuba_preview_chat_enabled: e.currentTarget.checked })}
                    color={GOLD}
                  />
                </Box>
                {form.cuba_preview_chat_enabled !== false && (
                  <NumberInput
                    label="Had harian"
                    description="Jumlah soalan dikongsi semua pelawat sehari. 0 = tiada had"
                    value={form.cuba_preview_chat_daily_limit ?? 10}
                    onChange={(val) => setForm({ ...form, cuba_preview_chat_daily_limit: Number(val) || 0 })}
                    min={0}
                  />
                )}
              </Group>
            </Stack>
          </Card>

          {/* /cuba editor AI assistant */}
          <Card padding="sm" radius="sm" withBorder style={{ background: 'rgba(10,22,40,0.03)' }}>
            <Stack gap="xs">
              <Text fw={600} size="sm">Pembantu AI Editor /cuba</Text>
              <Text size="xs" c="dimmed">Pembantu AI dalam editor halaman percubaan</Text>
              <Group grow>
                <Box pt={8}>
                  <Switch
                    label="Aktifkan"
                    checked={form.cuba_editor_chat_enabled ?? true}
                    onChange={(e) => setForm({ ...form, cuba_editor_chat_enabled: e.currentTarget.checked })}
                    color={GOLD}
                  />
                </Box>
                {form.cuba_editor_chat_enabled !== false && (
                  <NumberInput
                    label="Had harian"
                    description="Jumlah soalan dikongsi semua pengguna sehari. 0 = tiada had"
                    value={form.cuba_editor_chat_daily_limit ?? 10}
                    onChange={(val) => setForm({ ...form, cuba_editor_chat_daily_limit: Number(val) || 0 })}
                    min={0}
                  />
                )}
              </Group>
            </Stack>
          </Card>

          {/* Signed-in editor AI assistant */}
          <Card padding="sm" radius="sm" withBorder style={{ background: 'rgba(10,22,40,0.03)' }}>
            <Stack gap="xs">
              <Text fw={600} size="sm">Pembantu AI Editor (Pengguna Berdaftar)</Text>
              <Text size="xs" c="dimmed">Pembantu AI dalam editor untuk pengguna yang telah log masuk</Text>
              <Group grow>
                <Box pt={8}>
                  <Switch
                    label="Aktifkan"
                    checked={form.editor_chat_enabled ?? true}
                    onChange={(e) => setForm({ ...form, editor_chat_enabled: e.currentTarget.checked })}
                    color={GOLD}
                  />
                </Box>
                {form.editor_chat_enabled !== false && (
                  <NumberInput
                    label="Had harian"
                    description="Jumlah soalan dikongsi semua pengguna sehari. 0 = tiada had"
                    value={form.editor_chat_daily_limit ?? 20}
                    onChange={(val) => setForm({ ...form, editor_chat_daily_limit: Number(val) || 0 })}
                    min={0}
                  />
                )}
              </Group>
            </Stack>
          </Card>

          {/* Published invitation chatbot */}
          <Card padding="sm" radius="sm" withBorder style={{ background: 'rgba(10,22,40,0.03)' }}>
            <Stack gap="xs">
              <Text fw={600} size="sm">Chatbot Kad Jemputan</Text>
              <Text size="xs" c="dimmed">Chatbot tetamu di kad jemputan yang diterbitkan (dikongsi semua pelawat)</Text>
              <Group grow>
                <Box pt={8}>
                  <Switch
                    label="Aktifkan"
                    checked={form.invitation_chat_enabled ?? true}
                    onChange={(e) => setForm({ ...form, invitation_chat_enabled: e.currentTarget.checked })}
                    color={GOLD}
                  />
                </Box>
                {form.invitation_chat_enabled !== false && (
                  <NumberInput
                    label="Had harian"
                    description="Jumlah soalan dikongsi semua pelawat sehari. 0 = tiada had"
                    value={form.invitation_chat_daily_limit ?? 20}
                    onChange={(val) => setForm({ ...form, invitation_chat_daily_limit: Number(val) || 0 })}
                    min={0}
                  />
                )}
              </Group>
            </Stack>
          </Card>

          <Group justify="flex-end">
            <Button onClick={handleSave} loading={loadingSiteSettings}>
              Simpan Tetapan
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Admin Page
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  // Wait for auth to initialize before showing access denied
  if (!initialized) {
    return (
      <Center style={{ minHeight: '100vh', background: CREAM }}>
        <Loader color={GOLD} />
      </Center>
    );
  }

  // Protect: only admin can access
  if (!user) {
    return (
      <Center style={{ minHeight: '100vh', background: CREAM }}>
        <Stack align="center" gap="md">
          <Title order={3} style={{ color: DARK }}>
            Akses Ditolak
          </Title>
          <Text c="dimmed">Sila log masuk terlebih dahulu.</Text>
          <Button
            onClick={() => navigate('/login')}
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
              border: 'none',
            }}
          >
            Log Masuk
          </Button>
        </Stack>
      </Center>
    );
  }

  if (user.role !== 'admin') {
    return (
      <Center style={{ minHeight: '100vh', background: CREAM }}>
        <Stack align="center" gap="md">
          <Title order={3} style={{ color: DARK }}>
            Akses Ditolak
          </Title>
          <Text c="dimmed">
            Halaman ini hanya untuk pentadbir sahaja.
          </Text>
          <Button
            variant="outline"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/dashboard')}
            style={{ borderColor: GOLD, color: GOLD }}
          >
            Kembali ke Dashboard
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 64 }}
      padding="lg"
      styles={{
        main: {
          background: CREAM,
          minHeight: '100vh',
        },
      }}
    >
      <AppShell.Header
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${SLATE_200}`,
        }}
      >
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Group gap="md">
              <Text
                fw={700}
                size="xl"
                onClick={() => navigate('/')}
                style={{
                  cursor: 'pointer',
                  fontFamily: "'Playfair Display', serif",
                  color: GOLD,
                }}
              >
                Jemput
              </Text>
              <IconChevronRight size={16} color={GOLD} />
              <Badge
                variant="filled"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                }}
              >
                Admin
              </Badge>
            </Group>
            <Group gap="sm">
              <Text size="sm" c="dimmed">
                {user.email}
              </Text>
              <Button
                variant="subtle"
                size="sm"
                leftSection={<IconArrowLeft size={14} />}
                onClick={() => navigate('/dashboard')}
                style={{ color: GOLD }}
              >
                Dashboard
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="md">
          <Tabs defaultValue="dashboard" variant="outline">
            <Tabs.List mb="lg">
              <Tabs.Tab
                value="dashboard"
                leftSection={<IconDashboard size={16} />}
              >
                Papan Pemuka
              </Tabs.Tab>
              <Tabs.Tab
                value="plans"
                leftSection={<IconCreditCard size={16} />}
              >
                Pelan
              </Tabs.Tab>
              <Tabs.Tab
                value="users"
                leftSection={<IconUserCheck size={16} />}
              >
                Pengguna
              </Tabs.Tab>
              <Tabs.Tab
                value="payments"
                leftSection={<IconReceipt size={16} />}
              >
                Bayaran
              </Tabs.Tab>
              <Tabs.Tab
                value="site-settings"
                leftSection={<IconSettings size={16} />}
              >
                Tetapan Laman
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="dashboard">
              <DashboardTab />
            </Tabs.Panel>

            <Tabs.Panel value="plans">
              <PlansTab />
            </Tabs.Panel>

            <Tabs.Panel value="users">
              <UsersTab />
            </Tabs.Panel>

            <Tabs.Panel value="payments">
              <PaymentsTab />
            </Tabs.Panel>

            <Tabs.Panel value="site-settings">
              <SiteSettingsTab />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
