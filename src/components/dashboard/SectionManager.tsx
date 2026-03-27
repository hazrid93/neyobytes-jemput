import {
  Box,
  Card,
  Text,
  Switch,
  ActionIcon,
  Group,
  Badge,
  Button,
  Menu,
  Stack,
} from '@mantine/core';
import {
  IconGripVertical,
  IconArrowUp,
  IconArrowDown,
  IconPlus,
  IconPhoto,
  IconTextPlus,
  IconVideo,
  IconTrash,
} from '@tabler/icons-react';
import { SECTION_LABELS } from '../../lib/themes';
import { GOLD, SLATE_200 } from '../../constants/colors';
import type { InvitationSection, SectionType } from '../../types';

interface SectionManagerProps {
  sections: InvitationSection[];
  onChange: (sections: InvitationSection[]) => void;
}

const CUSTOM_SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactNode }[] = [
  { type: 'custom_text', label: 'Teks Khas', icon: <IconTextPlus size={16} /> },
  { type: 'custom_image', label: 'Gambar Khas', icon: <IconPhoto size={16} /> },
  { type: 'custom_video', label: 'Video Khas', icon: <IconVideo size={16} /> },
];

export default function SectionManager({ sections, onChange }: SectionManagerProps) {
  const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  const handleToggle = (id: string, enabled: boolean) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, enabled } : s))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newSorted = [...sorted];
    // Swap sort_order values
    const tempOrder = newSorted[index].sort_order;
    newSorted[index] = { ...newSorted[index], sort_order: newSorted[index - 1].sort_order };
    newSorted[index - 1] = { ...newSorted[index - 1], sort_order: tempOrder };
    onChange(newSorted);
  };

  const handleMoveDown = (index: number) => {
    if (index >= sorted.length - 1) return;
    const newSorted = [...sorted];
    // Swap sort_order values
    const tempOrder = newSorted[index].sort_order;
    newSorted[index] = { ...newSorted[index], sort_order: newSorted[index + 1].sort_order };
    newSorted[index + 1] = { ...newSorted[index + 1], sort_order: tempOrder };
    onChange(newSorted);
  };

  const handleAddSection = (type: SectionType) => {
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.sort_order), 0);
    const newSection: InvitationSection = {
      id: `${type}_${Date.now()}`,
      type,
      enabled: true,
      sort_order: maxOrder + 1,
    };
    onChange([...sections, newSection]);
  };

  const handleDeleteSection = (id: string) => {
    const remaining = sections
      .filter((section) => section.id !== id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((section, index) => ({
        ...section,
        sort_order: index + 1,
      }));
    onChange(remaining);
  };

  return (
    <Box>
      <Stack gap="xs">
        {sorted.map((section, index) => {
          const labelData = SECTION_LABELS[section.type];
          const isFirst = index === 0;
          const isLast = index === sorted.length - 1;
          const isBookend = isFirst || isLast;
          const isCustomSection = section.type === 'custom_text' || section.type === 'custom_image' || section.type === 'custom_video';

          return (
            <Card
              key={section.id}
              padding="xs"
              radius="md"
              withBorder
              style={{
                borderColor: isBookend ? GOLD : SLATE_200,
                borderWidth: isBookend ? 1.5 : 1,
                opacity: section.enabled ? 1 : 0.55,
                transition: 'all 0.2s ease',
                background: isBookend
                  ? 'rgba(212, 175, 55, 0.03)'
                  : section.enabled
                    ? 'white'
                    : '#FAFAFA',
              }}
            >
              <Group gap="xs" wrap="nowrap">
                {/* Drag handle (visual) */}
                <Box style={{ color: '#BBAA88', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <IconGripVertical size={18} />
                </Box>

                {/* Section info */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Group gap={6}>
                      <Text size="sm" fw={600} truncate="end">
                        {labelData?.label || section.type}
                      </Text>
                      {isFirst && (
                        <Badge size="xs" variant="light" color="yellow">
                          Mula
                        </Badge>
                      )}
                      {isLast && (
                        <Badge size="xs" variant="light" color="yellow">
                          Akhir
                        </Badge>
                      )}
                    </Group>
                    {labelData?.description && (
                      <Text size="xs" c="dimmed" truncate="end">
                        {labelData.description}
                      </Text>
                    )}
                  </Box>
                </Box>

                {/* Move buttons */}
                <Group gap={2} style={{ flexShrink: 0 }}>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    color="gray"
                    disabled={isFirst}
                    onClick={() => handleMoveUp(index)}
                    aria-label="Naik"
                  >
                    <IconArrowUp size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    color="gray"
                    disabled={isLast}
                    onClick={() => handleMoveDown(index)}
                    aria-label="Turun"
                  >
                    <IconArrowDown size={14} />
                  </ActionIcon>
                </Group>

                {/* Toggle switch */}
                <Switch
                  checked={section.enabled}
                  onChange={(e) => handleToggle(section.id, e.currentTarget.checked)}
                  color="yellow"
                  size="sm"
                  style={{ flexShrink: 0 }}
                  aria-label={`Togol ${labelData?.label || section.type}`}
                />

                {isCustomSection && (
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    color="red"
                    onClick={() => handleDeleteSection(section.id)}
                    aria-label={`Padam ${labelData?.label || section.type}`}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                )}
              </Group>
            </Card>
          );
        })}
      </Stack>

      {/* Add section button */}
      <Menu shadow="md" width={220} position="top-start" withArrow>
        <Menu.Target>
          <Button
            variant="light"
            size="sm"
            leftSection={<IconPlus size={16} />}
            color="yellow"
            mt="sm"
            fullWidth
          >
            Tambah Bahagian
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Bahagian Khas</Menu.Label>
          {CUSTOM_SECTION_TYPES.map(({ type, label, icon }) => (
            <Menu.Item
              key={type}
              leftSection={icon}
              onClick={() => handleAddSection(type)}
            >
              {label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
