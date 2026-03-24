import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Text,
  Group,
  Box,
  SimpleGrid,
  Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconUser, IconLink, IconCalendar, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuthStore } from '../../stores/authStore';
import { THEME_TEMPLATES } from '../../lib/themes';
import type { Invitation } from '../../types';

interface Props {
  opened: boolean;
  onClose: () => void;
}

function generateSlug(bride: string, groom: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s*bin(ti)?\s*/gi, '-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .split('-')[0];
  const b = clean(bride) || 'pengantin';
  const g = clean(groom) || 'pengantin';
  return `${g}-${b}`;
}

// First 5 theme templates for the selector
const THEME_PREVIEW_LIST = THEME_TEMPLATES.slice(0, 5);

const defaultInvitationText =
  "Dengan segala hormatnya kami menjemput Dato'/Datin/Tuan/Puan/Encik/Cik ke majlis perkahwinan putera dan puteri kami.";

export default function CreateInvitationModal({ opened, onClose }: Props) {
  const navigate = useNavigate();
  const createInvitation = useDashboardStore((s) => s.createInvitation);
  const user = useAuthStore((s) => s.user);

  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [slug, setSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('elegant-gold');

  const autoSlug = generateSlug(brideName, groomName);

  const handleCreate = async () => {
    if (!brideName.trim() || !groomName.trim()) {
      notifications.show({
        title: 'Maklumat tidak lengkap',
        message: 'Sila masukkan nama pengantin lelaki dan perempuan',
        color: 'red',
      });
      return;
    }

    setCreating(true);
    try {
      const selectedTemplate = THEME_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? THEME_TEMPLATES[0];

      const newInv = await createInvitation({
        user_id: user?.id,
        slug: slug.trim() || autoSlug,
        status: 'draft',
        template: selectedTemplate.id,
        bride_name: brideName,
        groom_name: groomName,
        bride_parent_names: '',
        groom_parent_names: '',
        event_date: eventDate ? eventDate.toISOString().split('T')[0] : '',
        event_time_start: '11:00',
        event_time_end: '16:00',
        venue_name: '',
        venue_address: '',
        invitation_text: defaultInvitationText,
        itinerary: [
          { time: '11:00', event: 'Majlis Bermula', icon: 'clock' },
          { time: '12:00', event: 'Ketibaan Pengantin', icon: 'heart' },
          { time: '13:00', event: 'Jamuan Makan', icon: 'utensils' },
          { time: '16:00', event: 'Majlis Berakhir', icon: 'check' },
        ],
        contacts: [],
        wishlist: [],
        sections: selectedTemplate.default_sections,
        rsvp_enabled: true,
        chatbot_enabled: false,
        chatbot_context: '',
        gallery_images: [],
        music_type: 'youtube',
        payment_status: 'free',
        theme_config: selectedTemplate.theme_config,
      } as Partial<Invitation>);

      notifications.show({
        title: 'Berjaya!',
        message: 'Kad jemputan baru telah dicipta',
        color: 'green',
      });
      onClose();
      navigate(`/dashboard/edit/${newInv.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa mencipta kad';
      notifications.show({
        title: 'Ralat',
        message: msg,
        color: 'red',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" style={{ fontFamily: 'Playfair Display, serif' }}>
          Cipta Kad Baru
        </Text>
      }
      size="md"
      centered
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.4, blur: 4 }}
    >
      <Stack gap="md">
        <TextInput
          label="Nama Pengantin Lelaki"
          placeholder="cth: Aiman bin Ibrahim"
          leftSection={<IconUser size={16} />}
          value={groomName}
          onChange={(e) => setGroomName(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Nama Pengantin Perempuan"
          placeholder="cth: Nadia binti Ahmad"
          leftSection={<IconUser size={16} />}
          value={brideName}
          onChange={(e) => setBrideName(e.currentTarget.value)}
          required
        />
        <DatePickerInput
          label="Tarikh Majlis"
          placeholder="Pilih tarikh"
          leftSection={<IconCalendar size={16} />}
          value={eventDate}
          onChange={setEventDate}
          minDate={new Date()}
        />
        <TextInput
          label="Slug URL"
          description={`Pautan kad anda: jemput.neyobytes.com/${slug.trim() || autoSlug || 'slug'}`}
          placeholder={autoSlug || 'cth: aiman-nadia'}
          leftSection={<IconLink size={16} />}
          value={slug}
          onChange={(e) =>
            setSlug(
              e.currentTarget.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
            )
          }
        />
        {/* Theme selector */}
        <Box>
          <Text fw={500} size="sm" mb={8}>
            Pilih Tema
          </Text>
          <SimpleGrid cols={5} spacing="xs">
            {THEME_PREVIEW_LIST.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              return (
                <Tooltip key={tpl.id} label={tpl.name_ms} withArrow>
                  <Box
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 8,
                      border: isSelected
                        ? `2px solid ${tpl.theme_config.primary_color}`
                        : '2px solid #e0e0e0',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'border-color 0.2s ease, transform 0.2s ease',
                      transform: isSelected ? 'scale(1.05)' : 'none',
                    }}
                  >
                    {/* Color swatches preview */}
                    <Box
                      style={{
                        height: 48,
                        background: tpl.theme_config.bg_color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        padding: 6,
                      }}
                    >
                      {tpl.preview_colors.map((c, idx) => (
                        <Box
                          key={idx}
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: c,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </Box>
                    <Text
                      ta="center"
                      size="xs"
                      py={4}
                      fw={isSelected ? 600 : 400}
                      style={{
                        background: isSelected ? tpl.theme_config.primary_color : '#f5f5f5',
                        color: isSelected ? '#fff' : '#555',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {tpl.name_ms}
                    </Text>
                    {isSelected && (
                      <Box
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: tpl.theme_config.primary_color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconCheck size={12} color="#fff" stroke={3} />
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </Box>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose} color="gray">
            Batal
          </Button>
          <Button
            onClick={handleCreate}
            loading={creating}
            style={{
              background: 'linear-gradient(135deg, #8B6F4E, #D4AF37)',
              border: 'none',
            }}
          >
            Cipta Kad
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
