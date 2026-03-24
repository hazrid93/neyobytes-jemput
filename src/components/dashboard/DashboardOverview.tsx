import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SimpleGrid,
  Card,
  Text,
  Title,
  Group,
  Badge,
  Button,
  ActionIcon,
  Stack,
  Center,
  ThemeIcon,
  Menu,
  CopyButton,
  Tooltip,
  Box,
  Loader,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconEye,
  IconShare,
  IconTrash,
  IconDots,
  IconCalendar,
  IconUsers,
  IconUserCheck,
  IconCheck,
  IconCopy,
  IconCards,
  IconExternalLink,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { useDashboardStore } from '../../stores/dashboardStore';
import CreateInvitationModal from './CreateInvitationModal';
import type { Invitation } from '../../types';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { invitations, loading, fetchMyInvitations, deleteInvitation } =
    useDashboardStore();

  const [createModalOpened, setCreateModalOpened] = useState(false);

  useEffect(() => {
    fetchMyInvitations();
  }, [fetchMyInvitations]);

  const handleDelete = async (inv: Invitation) => {
    if (
      !window.confirm(
        `Padam kad "${inv.groom_name} & ${inv.bride_name}"? Tindakan ini tidak boleh dibatalkan.`
      )
    )
      return;
    try {
      await deleteInvitation(inv.id);
      notifications.show({
        title: 'Dipadam',
        message: 'Kad jemputan telah dipadam',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Ralat',
        message: 'Gagal memadam kad',
        color: 'red',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInvitationUrl = (slug: string) =>
    `${window.location.origin}/${slug}`;

  if (loading && invitations.length === 0) {
    return (
      <Center h="50vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed">Memuatkan kad anda...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <div>
          <Title
            order={2}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Kad Saya
          </Title>
          <Text size="sm" c="dimmed">
            Urus semua kad jemputan anda
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => setCreateModalOpened(true)}
          style={{
            background: 'linear-gradient(135deg, #8B6F4E, #D4AF37)',
            border: 'none',
          }}
          size="md"
        >
          Cipta Kad Baru
        </Button>
      </Group>

      {invitations.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Center py={100}>
            <Stack align="center" gap="lg" maw={400}>
              <ThemeIcon size={80} radius="xl" variant="light" color="gold">
                <IconCards size={40} />
              </ThemeIcon>
              <Title order={3} ta="center" c="dimmed">
                Tiada Kad Lagi
              </Title>
              <Text ta="center" c="dimmed" size="sm">
                Mulakan dengan mencipta kad jemputan digital pertama anda.
                Ia mengambil masa kurang dari 5 minit!
              </Text>
              <Button
                size="lg"
                leftSection={<IconPlus size={20} />}
                onClick={() => setCreateModalOpened(true)}
                style={{
                  background: 'linear-gradient(135deg, #8B6F4E, #D4AF37)',
                  border: 'none',
                }}
              >
                Cipta Kad Pertama Anda
              </Button>
            </Stack>
          </Center>
        </motion.div>
      ) : (
        /* Invitation Cards Grid */
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <AnimatePresence>
            {invitations.map((inv, index) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="lg"
                  withBorder
                  style={{
                    borderColor: inv.status === 'published' ? '#D4AF37' : '#e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background:
                      inv.status === 'published'
                        ? 'linear-gradient(135deg, rgba(253,248,240,0.8), rgba(245,230,211,0.5))'
                        : undefined,
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,111,78,0.15)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Header */}
                  <Group justify="space-between" mb="sm">
                    <Badge
                      color={inv.status === 'published' ? 'green' : 'yellow'}
                      variant="light"
                      size="sm"
                    >
                      {inv.status === 'published' ? 'Diterbitkan' : 'Draf'}
                    </Badge>
                    <Menu shadow="md" width={180} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={() => navigate(`/dashboard/edit/${inv.id}`)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconEye size={14} />}
                          component="a"
                          href={`/${inv.slug}`}
                          target="_blank"
                        >
                          Lihat Kad
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconUsers size={14} />}
                          onClick={() => navigate(`/dashboard/rsvp/${inv.id}`)}
                        >
                          RSVP
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={() => handleDelete(inv)}
                        >
                          Padam
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>

                  {/* Couple Names */}
                  <Title
                    order={4}
                    mb={4}
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: '#8B6F4E',
                    }}
                  >
                    {inv.groom_name}
                  </Title>
                  <Title
                    order={4}
                    mb="sm"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: '#8B6F4E',
                    }}
                  >
                    &amp; {inv.bride_name}
                  </Title>

                  {/* Date */}
                  <Group gap="xs" mb="xs">
                    <IconCalendar size={14} color="#8B6F4E" />
                    <Text size="sm" c="dimmed">
                      {formatDate(inv.event_date)}
                    </Text>
                  </Group>

                  {/* Slug URL */}
                  <Group gap="xs" mb="md">
                    <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                      /{inv.slug}
                    </Text>
                    <CopyButton value={getInvitationUrl(inv.slug)} timeout={2000}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Disalin!' : 'Salin pautan'}>
                          <ActionIcon
                            variant="subtle"
                            size="xs"
                            color={copied ? 'green' : 'gray'}
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck size={12} />
                            ) : (
                              <IconCopy size={12} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Group>

                  {/* Quick Actions */}
                  <Group gap="xs" mt="auto">
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<IconEdit size={14} />}
                      color="gold"
                      onClick={() => navigate(`/dashboard/edit/${inv.id}`)}
                      style={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<IconUserCheck size={14} />}
                      color="blue"
                      onClick={() => navigate(`/dashboard/rsvp/${inv.id}`)}
                      style={{ flex: 1 }}
                    >
                      RSVP
                    </Button>
                    <Tooltip label="Lihat kad">
                      <ActionIcon
                        variant="light"
                        color="gray"
                        size="md"
                        component="a"
                        href={`/${inv.slug}`}
                        target="_blank"
                      >
                        <IconExternalLink size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      )}

      <CreateInvitationModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
    </Box>
  );
}
