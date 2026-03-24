import { useState, useMemo } from 'react';
import {
  Card,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  TextInput,
  SegmentedControl,
  Table,
  ActionIcon,
  Button,
  SimpleGrid,
  ThemeIcon,
  Center,
  Box,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconSearch,
  IconDownload,
  IconTrash,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconBabyCarriage,
  IconUser,
  IconClipboardList,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { supabase } from '../../lib/supabase';
import { useDashboardStore } from '../../stores/dashboardStore';
import { exportRSVPsToExcel } from '../../lib/export';
import type { RSVP } from '../../types';

type SortField = 'guest_name' | 'attending' | 'num_adults' | 'num_children' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function RSVPDashboard() {
  const rsvps = useDashboardStore((s) => s.rsvps);
  const currentInvitation = useDashboardStore((s) => s.currentInvitation);
  const fetchInvitationDetails = useDashboardStore((s) => s.fetchInvitationDetails);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Stats
  const stats = useMemo(() => {
    const attending = rsvps.filter((r) => r.attending);
    const notAttending = rsvps.filter((r) => !r.attending);
    const totalAdults = rsvps.reduce((s, r) => s + r.num_adults, 0);
    const totalChildren = rsvps.reduce((s, r) => s + r.num_children, 0);
    return {
      total: rsvps.length,
      attending: attending.length,
      notAttending: notAttending.length,
      totalAdults,
      totalChildren,
    };
  }, [rsvps]);

  // Filter & sort
  const filteredRsvps = useMemo(() => {
    let result = [...rsvps];

    // Filter by attendance
    if (filter === 'attending') result = result.filter((r) => r.attending);
    if (filter === 'not_attending') result = result.filter((r) => !r.attending);

    // Search by name
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.guest_name.toLowerCase().includes(q) ||
          (r.phone && r.phone.includes(q)) ||
          (r.message && r.message.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'guest_name':
          cmp = a.guest_name.localeCompare(b.guest_name);
          break;
        case 'attending':
          cmp = Number(a.attending) - Number(b.attending);
          break;
        case 'num_adults':
          cmp = a.num_adults - b.num_adults;
          break;
        case 'num_children':
          cmp = a.num_children - b.num_children;
          break;
        case 'created_at':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rsvps, filter, search, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async (rsvp: RSVP) => {
    if (!window.confirm(`Padam RSVP dari "${rsvp.guest_name}"?`)) return;
    try {
      await supabase.from('rsvps').delete().eq('id', rsvp.id);
      if (currentInvitation) {
        await fetchInvitationDetails(currentInvitation.id);
      }
      notifications.show({
        title: 'Dipadam',
        message: `RSVP dari ${rsvp.guest_name} telah dipadam`,
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Ralat',
        message: 'Gagal memadam RSVP',
        color: 'red',
      });
    }
  };

  const handleExport = () => {
    if (rsvps.length === 0) {
      notifications.show({
        title: 'Tiada data',
        message: 'Tiada RSVP untuk dieksport',
        color: 'yellow',
      });
      return;
    }
    const coupleName = currentInvitation
      ? `${currentInvitation.groom_name} & ${currentInvitation.bride_name}`
      : 'Wedding';
    exportRSVPsToExcel(rsvps, coupleName);
    notifications.show({
      title: 'Berjaya!',
      message: 'Fail Excel telah dimuat turun',
      color: 'green',
    });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <IconArrowUp size={14} style={{ marginLeft: 4 }} />
    ) : (
      <IconArrowDown size={14} style={{ marginLeft: 4 }} />
    );
  };

  const statsCards = [
    {
      label: 'Jumlah RSVP',
      value: stats.total,
      icon: IconClipboardList,
      color: 'blue',
    },
    {
      label: 'Hadir',
      value: stats.attending,
      icon: IconUserCheck,
      color: 'green',
    },
    {
      label: 'Tidak Hadir',
      value: stats.notAttending,
      icon: IconUserX,
      color: 'red',
    },
    {
      label: 'Dewasa',
      value: stats.totalAdults,
      icon: IconUser,
      color: 'violet',
    },
    {
      label: 'Kanak-kanak',
      value: stats.totalChildren,
      icon: IconBabyCarriage,
      color: 'orange',
    },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="lg" align="flex-start">
        <div>
          <Title order={3} style={{ fontFamily: 'Playfair Display, serif' }}>
            Pengurusan RSVP
          </Title>
          <Text size="sm" c="dimmed">
            Pantau kehadiran tetamu anda
          </Text>
        </div>
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={handleExport}
          variant="light"
          color="green"
        >
          Eksport Excel
        </Button>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 2, xs: 3, md: 5 }} mb="xl">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Group gap="xs">
                <ThemeIcon size="lg" radius="md" variant="light" color={stat.color}>
                  <stat.icon size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    {stat.label}
                  </Text>
                  <Text size="xl" fw={700}>
                    {stat.value}
                  </Text>
                </div>
              </Group>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>

      {/* Filters */}
      <Group mb="md" gap="md" wrap="wrap">
        <TextInput
          placeholder="Cari nama, telefon..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          data={[
            { label: `Semua (${stats.total})`, value: 'all' },
            { label: `Hadir (${stats.attending})`, value: 'attending' },
            { label: `Tidak (${stats.notAttending})`, value: 'not_attending' },
          ]}
          size="sm"
        />
      </Group>

      {/* Empty state */}
      {rsvps.length === 0 ? (
        <Center py={80}>
          <Stack align="center" gap="md">
            <ThemeIcon size={64} radius="xl" variant="light" color="gray">
              <IconUsers size={32} />
            </ThemeIcon>
            <Title order={3} c="dimmed">
              Tiada RSVP Lagi
            </Title>
            <Text c="dimmed" size="sm" ta="center" maw={360}>
              Setelah anda terbitkan kad jemputan, RSVP dari tetamu akan dipaparkan di sini.
            </Text>
          </Stack>
        </Center>
      ) : isMobile ? (
        /* Mobile: Card view */
        <Stack gap="sm">
          <AnimatePresence>
            {filteredRsvps.map((rsvp, index) => (
              <motion.div
                key={rsvp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card shadow="xs" padding="md" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600}>{rsvp.guest_name}</Text>
                    <Badge
                      color={rsvp.attending ? 'green' : 'red'}
                      variant="light"
                      size="sm"
                    >
                      {rsvp.attending ? 'Hadir' : 'Tidak Hadir'}
                    </Badge>
                  </Group>
                  {rsvp.phone && (
                    <Text size="sm" c="dimmed">
                      {rsvp.phone}
                    </Text>
                  )}
                  <Group gap="lg" mt="xs">
                    <Text size="sm">
                      <b>{rsvp.num_adults}</b> dewasa
                    </Text>
                    <Text size="sm">
                      <b>{rsvp.num_children}</b> kanak-kanak
                    </Text>
                  </Group>
                  {rsvp.message && (
                    <Text size="sm" mt="xs" c="dimmed" lineClamp={2}>
                      &ldquo;{rsvp.message}&rdquo;
                    </Text>
                  )}
                  <Group justify="space-between" mt="xs">
                    <Text size="xs" c="dimmed">
                      {formatDate(rsvp.created_at)}
                    </Text>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => handleDelete(rsvp)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>
      ) : (
        /* Desktop: Table view */
        <Card shadow="sm" radius="md" withBorder p={0} style={{ overflow: 'hidden' }}>
          <Table.ScrollContainer minWidth={700}>
            <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr style={{ background: '#FDF8F0' }}>
                  <Table.Th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('guest_name')}
                  >
                    <Group gap={4}>
                      Nama
                      <SortIcon field="guest_name" />
                    </Group>
                  </Table.Th>
                  <Table.Th>Telefon</Table.Th>
                  <Table.Th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('attending')}
                  >
                    <Group gap={4}>
                      Status
                      <SortIcon field="attending" />
                    </Group>
                  </Table.Th>
                  <Table.Th
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => handleSort('num_adults')}
                  >
                    <Group gap={4} justify="center">
                      Dewasa
                      <SortIcon field="num_adults" />
                    </Group>
                  </Table.Th>
                  <Table.Th
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => handleSort('num_children')}
                  >
                    <Group gap={4} justify="center">
                      Kanak-kanak
                      <SortIcon field="num_children" />
                    </Group>
                  </Table.Th>
                  <Table.Th>Mesej</Table.Th>
                  <Table.Th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('created_at')}
                  >
                    <Group gap={4}>
                      Tarikh
                      <SortIcon field="created_at" />
                    </Group>
                  </Table.Th>
                  <Table.Th w={50} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredRsvps.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Center py="xl">
                        <Text c="dimmed">Tiada keputusan ditemui</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredRsvps.map((rsvp) => (
                    <Table.Tr key={rsvp.id}>
                      <Table.Td>
                        <Text fw={500} size="sm">
                          {rsvp.guest_name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {rsvp.phone || '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={rsvp.attending ? 'green' : 'red'}
                          variant="light"
                          size="sm"
                        >
                          {rsvp.attending ? 'Hadir' : 'Tidak Hadir'}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text size="sm" fw={500}>
                          {rsvp.num_adults}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Text size="sm" fw={500}>
                          {rsvp.num_children}
                        </Text>
                      </Table.Td>
                      <Table.Td maw={250}>
                        <Tooltip
                          label={rsvp.message}
                          multiline
                          maw={300}
                          disabled={!rsvp.message}
                        >
                          <Text size="sm" c="dimmed" lineClamp={1}>
                            {rsvp.message || '-'}
                          </Text>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          {formatDate(rsvp.created_at)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(rsvp)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      )}

      {filteredRsvps.length > 0 && filteredRsvps.length < rsvps.length && (
        <Text size="sm" c="dimmed" ta="center" mt="md">
          Menunjukkan {filteredRsvps.length} dari {rsvps.length} RSVP
        </Text>
      )}
    </Box>
  );
}
