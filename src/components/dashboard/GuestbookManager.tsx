import {
  Stack,
  Card,
  Text,
  Group,
  ActionIcon,
  Badge,
  Title,
  Center,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconTrash, IconMessage2, IconMessageOff } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../../stores/dashboardStore';

export default function GuestbookManager() {
  const guestbook = useDashboardStore((s) => s.guestbook);
  const deleteGuestbookMessage = useDashboardStore((s) => s.deleteGuestbookMessage);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Padam mesej dari "${name}"?`)) return;
    try {
      await deleteGuestbookMessage(id);
      notifications.show({
        title: 'Dipadam',
        message: 'Mesej telah dipadam',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Ralat',
        message: 'Gagal memadam mesej',
        color: 'red',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (guestbook.length === 0) {
    return (
      <Center py={80}>
        <Stack align="center" gap="md">
          <ThemeIcon size={64} radius="xl" variant="light" color="gray">
            <IconMessageOff size={32} />
          </ThemeIcon>
          <Title order={3} c="dimmed">
            Tiada Mesej Lagi
          </Title>
          <Text c="dimmed" size="sm" ta="center" maw={360}>
            Ucapan dari tetamu anda akan dipaparkan di sini setelah mereka
            meninggalkan mesej di buku tamu.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={3} style={{ fontFamily: 'Playfair Display, serif' }}>
            Buku Tamu
          </Title>
          <Text size="sm" c="dimmed">
            {guestbook.length} mesej
          </Text>
        </div>
        <Badge size="lg" variant="light" leftSection={<IconMessage2 size={14} />}>
          {guestbook.length} Mesej
        </Badge>
      </Group>

      <Stack gap="md">
        <AnimatePresence>
          {guestbook.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  borderLeft: '4px solid #D4AF37',
                  background: 'rgba(253, 248, 240, 0.5)',
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="md">
                        {msg.name}
                      </Text>
                    </Group>
                    <Text
                      size="sm"
                      c="dimmed"
                      mb="xs"
                      style={{ fontStyle: 'italic' }}
                    >
                      {formatDate(msg.created_at)}
                    </Text>
                    <Text
                      size="md"
                      style={{
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.message}
                    </Text>
                  </div>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="lg"
                    onClick={() => handleDelete(msg.id, msg.name)}
                    title="Padam mesej"
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
