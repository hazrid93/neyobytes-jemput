import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  ActionIcon,
  Accordion,
  ColorInput,
  Select,
  Switch,
  Badge,
  Loader,
  Center,
  Tabs,
  Tooltip,
  Paper,
  Divider,
  ScrollArea,
  Image,
  SimpleGrid,
  Modal,
} from '@mantine/core';
import { TimeInput, DatePickerInput } from '@mantine/dates';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { useDebouncedCallback, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconCalendar,
  IconMapPin,
  IconMessage,
  IconClock,
  IconPhone,
  IconCreditCard,
  IconGift,
  IconPhoto,
  IconPalette,
  IconSettings,
  IconPlus,
  IconTrash,
  IconExternalLink,
  IconZoomIn,
  IconZoomOut,
  IconCheck,
  IconChecklist,
  IconLoader,
  IconUpload,
  IconX,
  IconDeviceFloppy,
  IconRocket,
  IconEdit,
  IconEye,
  IconRobot,
  IconLayoutList,
  IconLock,
  IconCrown,
  IconUserPlus,
  IconArrowRight,
} from '@tabler/icons-react';
import { uploadImage, deleteImage } from '../../lib/upload';
import { useDashboardStore } from '../../stores/dashboardStore';
import { supabase } from '../../lib/supabase';
import { demoInvitation, TRIAL_PREVIEW_STORAGE_KEY } from '../../lib/demo-data';
import ThemeSelector from './ThemeSelector';
import SectionManager from './SectionManager';
import type { Invitation, ItineraryItem, ContactPerson, WishlistItem, InvitationSection, ThemeTemplate } from '../../types';

interface InvitationEditorProps {
  trialMode?: boolean;
}

const MAX_GALLERY_IMAGES = 6;

const FONT_OPTIONS = [
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Lora', label: 'Lora' },
];

const FONT_BODY_OPTIONS = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
];

const FONT_ARABIC_OPTIONS = [
  { value: 'Amiri', label: 'Amiri' },
  { value: 'Scheherazade New', label: 'Scheherazade New' },
  { value: 'Noto Naskh Arabic', label: 'Noto Naskh Arabic' },
];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Helper to populate form values from an invitation object
function invitationToFormValues(inv: Invitation): Partial<Invitation> {
  return {
    bride_name: inv.bride_name,
    groom_name: inv.groom_name,
    bride_parent_names: inv.bride_parent_names,
    groom_parent_names: inv.groom_parent_names,
    couple_photo_url: inv.couple_photo_url,
    cover_photo_url: inv.cover_photo_url,
    event_date: inv.event_date,
    event_time_start: inv.event_time_start,
    event_time_end: inv.event_time_end,
    venue_name: inv.venue_name,
    venue_address: inv.venue_address,
    venue_lat: inv.venue_lat,
    venue_lng: inv.venue_lng,
    venue_google_maps_embed: inv.venue_google_maps_embed,
    invitation_text: inv.invitation_text,
    music_url: inv.music_url,
    music_type: inv.music_type,
    rsvp_enabled: inv.rsvp_enabled,
    rsvp_deadline: inv.rsvp_deadline,
    itinerary: inv.itinerary || [],
    contacts: inv.contacts || [],
    money_gift: inv.money_gift,
    wishlist: inv.wishlist || [],
    theme_config: inv.theme_config,
    sections: inv.sections || [],
    template: inv.template,
    chatbot_enabled: inv.chatbot_enabled ?? false,
    chatbot_context: inv.chatbot_context || '',
    slug: inv.slug,
    status: inv.status,
  };
}

function buildTrialPreviewInvitation(values: Partial<Invitation>, galleryUrls: string[]): Invitation {
  return {
    ...demoInvitation,
    ...values,
    id: demoInvitation.id,
    user_id: demoInvitation.user_id,
    slug: demoInvitation.slug,
    status: demoInvitation.status,
    itinerary: (values.itinerary || demoInvitation.itinerary),
    contacts: (values.contacts || demoInvitation.contacts),
    money_gift: values.money_gift || demoInvitation.money_gift,
    wishlist: (values.wishlist || demoInvitation.wishlist),
    theme_config: values.theme_config || demoInvitation.theme_config,
    sections: (values.sections || demoInvitation.sections),
    gallery_images: galleryUrls.map((url, idx) => ({
      id: `gallery-${idx}`,
      invitation_id: demoInvitation.id,
      url,
      sort_order: idx,
    })),
    updated_at: new Date().toISOString(),
  } as Invitation;
}

function syncTrialPreviewInvitation(values: Partial<Invitation>, galleryUrls: string[]) {
  if (typeof window === 'undefined') return;
  const invitation = buildTrialPreviewInvitation(values, galleryUrls);
  window.localStorage.setItem(TRIAL_PREVIEW_STORAGE_KEY, JSON.stringify(invitation));
}

function getGallerySectionConfig(sections: InvitationSection[] | undefined) {
  const gallerySection = (sections || []).find((section) => section.type === 'gallery');
  return (gallerySection?.config || {}) as { layout?: 'carousel' | 'grid' | 'masonry' };
}

function updateGallerySectionConfig(
  sections: InvitationSection[] | undefined,
  updates: { layout?: 'carousel' | 'grid' | 'masonry' }
) {
  return (sections || []).map((section) => {
    if (section.type !== 'gallery') return section;
    return {
      ...section,
      config: {
        ...(section.config || {}),
        ...updates,
      },
    };
  });
}

export default function InvitationEditor({ trialMode = false }: InvitationEditorProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentInvitation,
    loadingDetails: loading,
    fetchInvitationDetails,
    updateInvitation,
  } = useDashboardStore();

  const isMobile = useMediaQuery('(max-width: 900px)');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [previewZoom, setPreviewZoom] = useState(0.75);
  const [mobileTab, setMobileTab] = useState<string | null>('edit');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(trialMode ? false : null);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [, setRenderTick] = useState(0);

  // In trial mode, use demo data as initial values directly
  const form = useForm<Partial<Invitation>>({
    initialValues: trialMode ? invitationToFormValues(demoInvitation) : {},
  });

  // The "source" invitation for deriving values — demo data in trial, DB record otherwise
  const sourceInvitation = trialMode ? demoInvitation : currentInvitation;

  // Check if user has an active subscription (skip in trial mode)
  useEffect(() => {
    if (trialMode) return;
    async function checkSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setHasActiveSubscription(false); return; }

        const { data, error } = await supabase
          .from('payments')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'succeeded')
          .limit(1);

        if (error) { setHasActiveSubscription(false); return; }
        setHasActiveSubscription((data ?? []).length > 0);
      } catch {
        setHasActiveSubscription(false);
      }
    }
    checkSubscription();
  }, [trialMode]);

  // Load invitation data (skip in trial mode)
  useEffect(() => {
    if (trialMode) return;
    if (id) {
      fetchInvitationDetails(id);
    }
  }, [id, fetchInvitationDetails, trialMode]);

  // Populate form when data loads (skip in trial mode — already set via initialValues)
  useEffect(() => {
    if (trialMode) return;
    if (currentInvitation) {
      form.setValues(invitationToFormValues(currentInvitation));
      // Populate gallery URLs from existing images
      if (currentInvitation.gallery_images?.length) {
        setGalleryUrls(currentInvitation.gallery_images.map((img) => img.url));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInvitation?.id, trialMode]);

  useEffect(() => {
    if (!trialMode) return;
    syncTrialPreviewInvitation(form.getValues(), galleryUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trialMode]);

  // Debounced auto-save (in trial mode, just refresh preview)
  const debouncedSave = useDebouncedCallback(async (values: Partial<Invitation>) => {
    if (trialMode) {
      syncTrialPreviewInvitation(values, galleryUrls);
      if (previewRef.current) {
        previewRef.current.src = previewRef.current.src;
      }
      return;
    }
    if (!id) return;
    setSaveStatus('saving');
    try {
      // Include gallery_images from local state
      const galleryImages = galleryUrls.map((url, idx) => ({
        id: `gallery-${idx}`,
        invitation_id: currentInvitation?.id || id,
        url,
        sort_order: idx,
      }));
      await updateInvitation(id, {
        ...values,
        gallery_images: galleryImages,
        updated_at: new Date().toISOString(),
      } as Partial<Invitation>);
      setSaveStatus('saved');
      // Update preview
      if (previewRef.current) {
        previewRef.current.src = previewRef.current.src;
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, trialMode ? 300 : 1500);

  const triggerSave = useCallback(() => {
    debouncedSave(form.getValues());
  }, [debouncedSave, form]);

  const handleFieldChange = <K extends keyof Invitation>(
    field: K,
    value: Invitation[K]
  ) => {
    form.setFieldValue(field as string, value);
    setRenderTick((t) => t + 1);

    if (trialMode && field === 'sections') {
      const nextValues = form.getValues();
      syncTrialPreviewInvitation(nextValues, galleryUrls);
      if (previewRef.current) {
        previewRef.current.src = previewRef.current.src;
      }
      return;
    }

    triggerSave();
  };

  const handlePublish = async () => {
    if (trialMode) {
      setSignupModalOpen(true);
      return;
    }
    if (!id) return;
    const newStatus = currentInvitation?.status === 'published' ? 'draft' : 'published';

    // Block publishing if user has no active subscription
    if (newStatus === 'published' && !hasActiveSubscription) {
      setSubModalOpen(true);
      return;
    }

    try {
      await updateInvitation(id, { status: newStatus });
      form.setFieldValue('status', newStatus);
      notifications.show({
        title: newStatus === 'published' ? 'Diterbitkan!' : 'Draf',
        message:
          newStatus === 'published'
            ? 'Kad jemputan anda kini boleh diakses oleh tetamu'
            : 'Kad jemputan telah dikembalikan ke mod draf',
        color: newStatus === 'published' ? 'green' : 'yellow',
      });
    } catch {
      notifications.show({ title: 'Ralat', message: 'Gagal menukar status', color: 'red' });
    }
  };

  const handleManualSave = async () => {
    if (trialMode) {
      setSignupModalOpen(true);
      return;
    }
    if (!id) return;
    setSaveStatus('saving');
    try {
      // Include gallery_images from local state
      const galleryImages = galleryUrls.map((url, idx) => ({
        id: `gallery-${idx}`,
        invitation_id: currentInvitation?.id || id,
        url,
        sort_order: idx,
      }));
      await updateInvitation(id, {
        ...form.getValues(),
        gallery_images: galleryImages,
        updated_at: new Date().toISOString(),
      } as Partial<Invitation>);
      setSaveStatus('saved');
      if (previewRef.current) {
        previewRef.current.src = previewRef.current.src;
      }
      notifications.show({ title: 'Disimpan!', message: 'Perubahan telah disimpan', color: 'green' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      notifications.show({ title: 'Ralat', message: 'Gagal menyimpan', color: 'red' });
    }
  };

  // --- Dynamic list helpers ---
  const addItineraryItem = () => {
    const current = (form.getValues().itinerary || []) as ItineraryItem[];
    handleFieldChange('itinerary', [...current, { time: '', event: '', icon: 'clock' }] as ItineraryItem[]);
  };

  const removeItineraryItem = (index: number) => {
    const current = (form.getValues().itinerary || []) as ItineraryItem[];
    handleFieldChange('itinerary', current.filter((_, i) => i !== index) as ItineraryItem[]);
  };

  const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: string) => {
    const current = [...((form.getValues().itinerary || []) as ItineraryItem[])];
    current[index] = { ...current[index], [field]: value };
    handleFieldChange('itinerary', current as ItineraryItem[]);
  };

  const addContact = () => {
    const current = (form.getValues().contacts || []) as ContactPerson[];
    handleFieldChange('contacts', [...current, { name: '', phone: '', role: '' }] as ContactPerson[]);
  };

  const removeContact = (index: number) => {
    const current = (form.getValues().contacts || []) as ContactPerson[];
    handleFieldChange('contacts', current.filter((_, i) => i !== index) as ContactPerson[]);
  };

  const updateContact = (index: number, field: keyof ContactPerson, value: string) => {
    const current = [...((form.getValues().contacts || []) as ContactPerson[])];
    current[index] = { ...current[index], [field]: value };
    handleFieldChange('contacts', current as ContactPerson[]);
  };

  const addWishlistItem = () => {
    const current = (form.getValues().wishlist || []) as WishlistItem[];
    handleFieldChange('wishlist', [
      ...current,
      { id: Date.now().toString(), name: '', claimed: false },
    ] as WishlistItem[]);
  };

  const removeWishlistItem = (index: number) => {
    const current = (form.getValues().wishlist || []) as WishlistItem[];
    handleFieldChange('wishlist', current.filter((_, i) => i !== index) as WishlistItem[]);
  };

  const updateWishlistItem = (index: number, value: string) => {
    const current = [...((form.getValues().wishlist || []) as WishlistItem[])];
    current[index] = { ...current[index], name: value };
    handleFieldChange('wishlist', current as WishlistItem[]);
  };

  // --- Loading state (skip in trial mode — demo data is immediate) ---
  if (!trialMode && (loading || !currentInvitation)) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed">Memuatkan editor...</Text>
        </Stack>
      </Center>
    );
  }

  const formValues = form.getValues();
  const themeConfig = (formValues.theme_config || sourceInvitation!.theme_config) as Invitation['theme_config'];
  const itinerary = (formValues.itinerary || []) as ItineraryItem[];
  const contacts = (formValues.contacts || []) as ContactPerson[];
  const wishlist = (formValues.wishlist || []) as WishlistItem[];
  const moneyGift = formValues.money_gift || sourceInvitation!.money_gift;
  const gallerySectionConfig = getGallerySectionConfig((formValues.sections || sourceInvitation!.sections) as InvitationSection[]);

  const previewUrl = trialMode ? '/aiman-nadia' : `/${formValues.slug || sourceInvitation!.slug}`;

  // Save status indicator
  const SaveIndicator = () => (
    <Group gap={6}>
      {saveStatus === 'saving' && (
        <>
          <IconLoader size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <Text size="xs" c="dimmed">Menyimpan...</Text>
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <IconCheck size={14} color="green" />
          <Text size="xs" c="green">Disimpan</Text>
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <IconX size={14} color="red" />
          <Text size="xs" c="red">Ralat</Text>
        </>
      )}
    </Group>
  );

  // --- The Form Panel ---
  const FormPanel = (
    <ScrollArea h="calc(100vh - 130px)" offsetScrollbars>
      <Box p="md">
        {/* Trial mode banner */}
        {trialMode && (
          <Box
            mb="md"
            p="sm"
            style={{
              background: 'linear-gradient(135deg, #FFFAF3 0%, #FDF5E6 100%)',
              border: '1px solid #D4AF37',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
            <Group justify="center" gap="xs" mb={6}>
              <Badge
                color="yellow"
                variant="filled"
                size="sm"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #C5A028)', textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Mod Percubaan
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" mb={8}>
              Cuba editor dengan data contoh. Daftar untuk simpan dan terbitkan kad anda.
            </Text>
            <Button
              size="sm"
              leftSection={<IconUserPlus size={16} />}
              rightSection={<IconArrowRight size={14} />}
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)',
                border: 'none',
              }}
            >
              Daftar Sekarang
            </Button>
          </Box>
        )}

        {/* Top actions */}
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <Badge
              color={trialMode ? 'orange' : formValues.status === 'published' ? 'green' : 'yellow'}
              variant="light"
              size="lg"
            >
              {trialMode ? 'Percubaan' : formValues.status === 'published' ? 'Diterbitkan' : 'Draf'}
            </Badge>
            {!trialMode && <SaveIndicator />}
          </Group>
          <Group gap="sm">
            {trialMode ? (
              <Button
                size="sm"
                leftSection={<IconLock size={16} />}
                color="gray"
                variant="light"
                onClick={() => setSignupModalOpen(true)}
              >
                Simpan
              </Button>
            ) : (
              <>
                <Tooltip label="Simpan">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    onClick={handleManualSave}
                    loading={saveStatus === 'saving'}
                  >
                    <IconDeviceFloppy size={18} />
                  </ActionIcon>
                </Tooltip>
                <Button
                  size="sm"
                  leftSection={
                    formValues.status === 'published' ? (
                      <IconEdit size={16} />
                    ) : hasActiveSubscription === false ? (
                      <IconLock size={16} />
                    ) : (
                      <IconRocket size={16} />
                    )
                  }
                  color={formValues.status === 'published' ? 'yellow' : hasActiveSubscription === false ? 'gray' : 'green'}
                  variant="light"
                  onClick={handlePublish}
                >
                  {formValues.status === 'published' ? 'Nyahdraf' : 'Terbitkan'}
                </Button>
              </>
            )}
          </Group>
        </Group>

        <Accordion
          variant="separated"
          multiple
          defaultValue={['couple', 'event', 'text']}
          styles={{
            item: {
              borderRadius: 12,
              border: '1px solid #E8D5B7',
              '&[data-active]': { border: '1px solid #D4AF37' },
            },
          }}
        >
          {/* Couple Info */}
          <Accordion.Item value="couple">
            <Accordion.Control icon={<IconUser size={18} color="#8B6F4E" />}>
              <Text fw={600}>Maklumat Pengantin</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <TextInput
                  label="Nama Pengantin Lelaki"
                  placeholder="cth: Aiman bin Ibrahim"
                  value={formValues.groom_name || ''}
                  onChange={(e) => handleFieldChange('groom_name', e.currentTarget.value)}
                />
                <TextInput
                  label="Nama Pengantin Perempuan"
                  placeholder="cth: Nadia binti Ahmad"
                  value={formValues.bride_name || ''}
                  onChange={(e) => handleFieldChange('bride_name', e.currentTarget.value)}
                />
                <TextInput
                  label="Nama Ibu Bapa Pengantin Lelaki"
                  placeholder="cth: Ibrahim bin Ismail & Zainab binti Omar"
                  value={formValues.groom_parent_names || ''}
                  onChange={(e) => handleFieldChange('groom_parent_names', e.currentTarget.value)}
                />
                <TextInput
                  label="Nama Ibu Bapa Pengantin Perempuan"
                  placeholder="cth: Ahmad bin Mohd Yusof & Fatimah binti Hassan"
                  value={formValues.bride_parent_names || ''}
                  onChange={(e) => handleFieldChange('bride_parent_names', e.currentTarget.value)}
                />
                <div>
                  <Text size="sm" fw={500} mb={4}>
                    Gambar Pengantin
                  </Text>
                  {trialMode ? (
                    <Box
                      p="sm"
                      style={{
                        border: '1px dashed #ccc',
                        borderRadius: 8,
                        background: '#f9f9f9',
                        textAlign: 'center',
                      }}
                    >
                      <IconLock size={20} color="#999" />
                      <Text size="xs" c="dimmed" mt={4}>
                        Muat naik gambar memerlukan akaun
                      </Text>
                    </Box>
                  ) : (
                    <>
                  {formValues.couple_photo_url && (
                    <Box mb="xs" pos="relative" style={{ display: 'inline-block' }}>
                      <Image
                        src={formValues.couple_photo_url}
                        alt="Gambar pengantin"
                        w={120}
                        h={120}
                        radius="md"
                        fit="cover"
                      />
                      <ActionIcon
                        color="red"
                        variant="filled"
                        size="xs"
                        radius="xl"
                        pos="absolute"
                        top={4}
                        right={4}
                        onClick={async () => {
                          try {
                            await deleteImage(formValues.couple_photo_url as string);
                          } catch {
                            // ignore delete errors for external URLs
                          }
                          handleFieldChange('couple_photo_url', '');
                        }}
                      >
                        <IconX size={12} />
                      </ActionIcon>
                    </Box>
                  )}
                  <Dropzone
                    onDrop={async (files) => {
                      if (!files[0] || !currentInvitation) return;
                      try {
                        const url = await uploadImage(files[0], currentInvitation.user_id, 'couple');
                        handleFieldChange('couple_photo_url', url);
                        notifications.show({ title: 'Berjaya!', message: 'Gambar pengantin dimuat naik', color: 'green' });
                      } catch {
                        notifications.show({ title: 'Ralat', message: 'Gagal memuat naik gambar', color: 'red' });
                      }
                    }}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={5 * 1024 ** 2}
                    styles={{
                      root: {
                        borderColor: '#D4AF37',
                        borderStyle: 'dashed',
                        background: 'rgba(253, 248, 240, 0.5)',
                        minHeight: 80,
                      },
                    }}
                  >
                    <Center p="sm">
                      <Stack align="center" gap={4}>
                        <IconUpload size={24} color="#8B6F4E" />
                        <Text size="xs" c="dimmed">
                          Seret gambar atau klik untuk muat naik
                        </Text>
                      </Stack>
                    </Center>
                  </Dropzone>
                    </>
                  )}
                </div>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Event Info */}
          <Accordion.Item value="event">
            <Accordion.Control icon={<IconCalendar size={18} color="#8B6F4E" />}>
              <Text fw={600}>Maklumat Majlis</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <DatePickerInput
                  label="Tarikh Majlis"
                  placeholder="Pilih tarikh"
                  value={formValues.event_date || null}
                  onChange={(d) =>
                    handleFieldChange('event_date', d || '')
                  }
                />
                <Group grow>
                  <TimeInput
                    label="Masa Mula"
                    value={formValues.event_time_start || ''}
                    onChange={(e) =>
                      handleFieldChange('event_time_start', e.currentTarget.value)
                    }
                  />
                  <TimeInput
                    label="Masa Tamat"
                    value={formValues.event_time_end || ''}
                    onChange={(e) =>
                      handleFieldChange('event_time_end', e.currentTarget.value)
                    }
                  />
                </Group>
                <TextInput
                  label="Nama Venue"
                  placeholder="cth: Dewan Seri Angkasa"
                  leftSection={<IconMapPin size={16} />}
                  value={formValues.venue_name || ''}
                  onChange={(e) => handleFieldChange('venue_name', e.currentTarget.value)}
                />
                <Textarea
                  label="Alamat Venue"
                  placeholder="Alamat penuh"
                  value={formValues.venue_address || ''}
                  onChange={(e) => handleFieldChange('venue_address', e.currentTarget.value)}
                  rows={2}
                />
                <Group grow>
                  <NumberInput
                    label="Latitude"
                    placeholder="3.1466"
                    value={formValues.venue_lat || ''}
                    onChange={(v) => handleFieldChange('venue_lat', Number(v) as unknown as number)}
                    decimalScale={6}
                    step={0.0001}
                  />
                  <NumberInput
                    label="Longitude"
                    placeholder="101.7108"
                    value={formValues.venue_lng || ''}
                    onChange={(v) => handleFieldChange('venue_lng', Number(v) as unknown as number)}
                    decimalScale={6}
                    step={0.0001}
                  />
                </Group>
                <TextInput
                  label="Google Maps Embed URL"
                  description="Pergi ke Google Maps > Share > Embed a map > salin URL sahaja"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={formValues.venue_google_maps_embed || ''}
                  onChange={(e) => handleFieldChange('venue_google_maps_embed', e.currentTarget.value)}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Invitation Text */}
          <Accordion.Item value="text">
            <Accordion.Control icon={<IconMessage size={18} color="#8B6F4E" />}>
              <Text fw={600}>Ayat Jemputan</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Textarea
                placeholder="Tulis ayat jemputan anda..."
                value={formValues.invitation_text || ''}
                onChange={(e) => handleFieldChange('invitation_text', e.currentTarget.value)}
                rows={5}
                autosize
                minRows={4}
                maxRows={10}
              />
            </Accordion.Panel>
          </Accordion.Item>

          {/* Itinerary */}
          <Accordion.Item value="itinerary">
            <Accordion.Control icon={<IconClock size={18} color="#8B6F4E" />}>
              <Group gap="xs">
                <Text fw={600}>Tentatif Majlis</Text>
                <Badge size="sm" variant="light" color="gold">
                  {itinerary.length}
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {itinerary.map((item, i) => (
                  <Paper key={i} p="xs" radius="md" withBorder>
                    <Group gap="xs" align="flex-end">
                      <TimeInput
                        label={i === 0 ? 'Masa' : undefined}
                        value={item.time}
                        onChange={(e) => updateItineraryItem(i, 'time', e.currentTarget.value)}
                        style={{ width: 100 }}
                        size="sm"
                      />
                      <TextInput
                        label={i === 0 ? 'Acara' : undefined}
                        placeholder="Nama acara"
                        value={item.event}
                        onChange={(e) => updateItineraryItem(i, 'event', e.currentTarget.value)}
                        style={{ flex: 1 }}
                        size="sm"
                      />
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        size="sm"
                        onClick={() => removeItineraryItem(i)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={addItineraryItem}
                  color="gold"
                >
                  Tambah Acara
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Contacts */}
          <Accordion.Item value="contacts">
            <Accordion.Control icon={<IconPhone size={18} color="#8B6F4E" />}>
              <Group gap="xs">
                <Text fw={600}>Kenalan</Text>
                <Badge size="sm" variant="light" color="gold">
                  {contacts.length}
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {contacts.map((contact, i) => (
                  <Paper key={i} p="xs" radius="md" withBorder>
                    <Group gap="xs" align="flex-end" wrap="wrap">
                      <TextInput
                        label={i === 0 ? 'Nama' : undefined}
                        placeholder="Nama"
                        value={contact.name}
                        onChange={(e) => updateContact(i, 'name', e.currentTarget.value)}
                        style={{ flex: 1, minWidth: 120 }}
                        size="sm"
                      />
                      <TextInput
                        label={i === 0 ? 'Telefon' : undefined}
                        placeholder="+60123456789"
                        value={contact.phone}
                        onChange={(e) => updateContact(i, 'phone', e.currentTarget.value)}
                        style={{ width: 140 }}
                        size="sm"
                      />
                      <TextInput
                        label={i === 0 ? 'Peranan' : undefined}
                        placeholder="cth: Pihak Lelaki"
                        value={contact.role}
                        onChange={(e) => updateContact(i, 'role', e.currentTarget.value)}
                        style={{ width: 130 }}
                        size="sm"
                      />
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        size="sm"
                        onClick={() => removeContact(i)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={addContact}
                  color="gold"
                >
                  Tambah Kenalan
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* RSVP */}
          <Accordion.Item value="rsvp">
            <Accordion.Control icon={<IconChecklist size={18} color="#8B6F4E" />}>
              <Text fw={600}>Tetapan RSVP</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label="RSVP Aktif"
                  description="Jika dimatikan, tetamu tidak boleh menghantar RSVP"
                  checked={formValues.rsvp_enabled ?? true}
                  onChange={(e) =>
                    handleFieldChange('rsvp_enabled', e.currentTarget.checked)
                  }
                  color="green"
                  size="md"
                />
                {(formValues.rsvp_enabled ?? true) && (
                  <DatePickerInput
                    label="Tarikh Tutup RSVP"
                    description="RSVP akan ditutup secara automatik selepas tarikh ini"
                    placeholder="Pilih tarikh tutup"
                    value={formValues.rsvp_deadline || null}
                    onChange={(d) =>
                      handleFieldChange('rsvp_deadline', d || '')
                    }
                    clearable
                  />
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Money Gift */}
          <Accordion.Item value="moneygift">
            <Accordion.Control icon={<IconCreditCard size={18} color="#8B6F4E" />}>
              <Text fw={600}>Salam Kaut</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <TextInput
                  label="Nama Bank"
                  placeholder="cth: Maybank"
                  value={moneyGift?.bank_name || ''}
                  onChange={(e) =>
                    handleFieldChange('money_gift', {
                      ...(moneyGift || { bank_name: '', account_name: '', account_number: '' }),
                      bank_name: e.currentTarget.value,
                    })
                  }
                />
                <TextInput
                  label="Nama Pemegang Akaun"
                  placeholder="cth: Aiman bin Ibrahim"
                  value={moneyGift?.account_name || ''}
                  onChange={(e) =>
                    handleFieldChange('money_gift', {
                      ...(moneyGift || { bank_name: '', account_name: '', account_number: '' }),
                      account_name: e.currentTarget.value,
                    })
                  }
                />
                <TextInput
                  label="Nombor Akaun"
                  placeholder="cth: 1234 5678 9012"
                  value={moneyGift?.account_number || ''}
                  onChange={(e) =>
                    handleFieldChange('money_gift', {
                      ...(moneyGift || { bank_name: '', account_name: '', account_number: '' }),
                      account_number: e.currentTarget.value,
                    })
                  }
                />
                <div>
                  <Text size="sm" fw={500} mb={4}>
                    QR Code
                  </Text>
                  {trialMode ? (
                    <Box
                      p="sm"
                      style={{
                        border: '1px dashed #ccc',
                        borderRadius: 8,
                        background: '#f9f9f9',
                        textAlign: 'center',
                      }}
                    >
                      <IconLock size={20} color="#999" />
                      <Text size="xs" c="dimmed" mt={4}>
                        Muat naik QR code memerlukan akaun
                      </Text>
                    </Box>
                  ) : (
                    <>
                  {moneyGift?.qr_code_url && (
                    <Box mb="xs" pos="relative" style={{ display: 'inline-block' }}>
                      <Image
                        src={moneyGift.qr_code_url}
                        alt="QR Code"
                        w={100}
                        h={100}
                        radius="md"
                        fit="cover"
                      />
                      <ActionIcon
                        color="red"
                        variant="filled"
                        size="xs"
                        radius="xl"
                        pos="absolute"
                        top={4}
                        right={4}
                        onClick={async () => {
                          try {
                            await deleteImage(moneyGift.qr_code_url as string);
                          } catch {
                            // ignore delete errors for external URLs
                          }
                          handleFieldChange('money_gift', {
                            ...(moneyGift || { bank_name: '', account_name: '', account_number: '' }),
                            qr_code_url: '',
                          });
                        }}
                      >
                        <IconX size={12} />
                      </ActionIcon>
                    </Box>
                  )}
                  <Dropzone
                    onDrop={async (files) => {
                      if (!files[0] || !currentInvitation) return;
                      try {
                        const url = await uploadImage(files[0], currentInvitation.user_id, 'qr');
                        handleFieldChange('money_gift', {
                          ...(moneyGift || { bank_name: '', account_name: '', account_number: '' }),
                          qr_code_url: url,
                        });
                        notifications.show({ title: 'Berjaya!', message: 'QR code dimuat naik', color: 'green' });
                      } catch {
                        notifications.show({ title: 'Ralat', message: 'Gagal memuat naik QR code', color: 'red' });
                      }
                    }}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={2 * 1024 ** 2}
                    styles={{
                      root: {
                        borderColor: '#D4AF37',
                        borderStyle: 'dashed',
                        background: 'rgba(253, 248, 240, 0.5)',
                        minHeight: 60,
                      },
                    }}
                  >
                    <Center p="xs">
                      <Group gap="xs">
                        <IconUpload size={18} color="#8B6F4E" />
                        <Text size="xs" c="dimmed">
                          Muat naik gambar QR code
                        </Text>
                      </Group>
                    </Center>
                  </Dropzone>
                    </>
                  )}
                </div>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Wishlist */}
          <Accordion.Item value="wishlist">
            <Accordion.Control icon={<IconGift size={18} color="#8B6F4E" />}>
              <Group gap="xs">
                <Text fw={600}>Senarai Hadiah</Text>
                <Badge size="sm" variant="light" color="gold">
                  {wishlist.length}
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {wishlist.map((item, i) => (
                  <Group key={item.id || i} gap="xs">
                    <TextInput
                      placeholder="Nama hadiah"
                      value={item.name}
                      onChange={(e) => updateWishlistItem(i, e.currentTarget.value)}
                      style={{ flex: 1 }}
                      size="sm"
                    />
                    {item.claimed && (
                      <Badge size="xs" color="green" variant="light">
                        Dituntut
                      </Badge>
                    )}
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      size="sm"
                      onClick={() => removeWishlistItem(i)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={addWishlistItem}
                  color="gold"
                >
                  Tambah Hadiah
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="gallery">
            <Accordion.Control icon={<IconPhoto size={18} color="#8B6F4E" />}>
              <Text fw={600}>Galeri Foto</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Select
                  label="Jenis Paparan Galeri"
                  value={gallerySectionConfig.layout || 'carousel'}
                  onChange={(value) => {
                    const currentSections = (form.getValues().sections || sourceInvitation!.sections || []) as InvitationSection[];
                    handleFieldChange(
                      'sections',
                      updateGallerySectionConfig(currentSections, {
                        layout: (value || 'carousel') as 'carousel' | 'grid' | 'masonry',
                      }) as InvitationSection[]
                    );
                  }}
                  data={[
                    { value: 'carousel', label: 'Carousel / Leret' },
                    { value: 'grid', label: 'Grid Kemas' },
                    { value: 'masonry', label: 'Kolaj / Masonry' },
                  ]}
                  size="sm"
                />

                {!trialMode && (
                  <Text size="xs" c="dimmed">
                    Maksimum {MAX_GALLERY_IMAGES} gambar untuk setiap kad jemputan.
                  </Text>
                )}

              {!trialMode && galleryUrls.length > 0 && (
                <SimpleGrid cols={3} spacing="xs" mb="sm">
                  {galleryUrls.map((url, i) => (
                    <Box key={i} pos="relative">
                      <Image
                        src={url}
                        alt={`Galeri ${i + 1}`}
                        h={80}
                        radius="md"
                        fit="cover"
                      />
                      <ActionIcon
                        color="red"
                        variant="filled"
                        size="xs"
                        radius="xl"
                        pos="absolute"
                        top={4}
                        right={4}
                        onClick={async () => {
                          try {
                            await deleteImage(url);
                          } catch {
                            // ignore delete errors for external URLs
                          }
                          const newUrls = galleryUrls.filter((_, idx) => idx !== i);
                          setGalleryUrls(newUrls);
                          // Persist gallery_images to database
                          if (id) {
                            const galleryImages = newUrls.map((u, idx) => ({
                              id: `gallery-${idx}`,
                              invitation_id: currentInvitation?.id || id,
                              url: u,
                              sort_order: idx,
                            }));
                            updateInvitation(id, {
                              gallery_images: galleryImages,
                              updated_at: new Date().toISOString(),
                            } as Partial<Invitation>).catch(() => {});
                          }
                        }}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
              {trialMode ? (
                <Box
                  p="md"
                  style={{
                    border: '1px dashed #ccc',
                    borderRadius: 10,
                    background: '#f9f9f9',
                    textAlign: 'center',
                  }}
                >
                  <IconLock size={22} color="#999" />
                  <Text size="sm" mt={6} fw={500}>
                    Muat naik galeri memerlukan akaun
                  </Text>
                  <Text size="xs" c="dimmed" mt={4} mb={10}>
                    Daftar untuk tambah gambar pasangan dan galeri majlis anda.
                  </Text>
                  <Button size="xs" variant="light" color="yellow" onClick={() => setSignupModalOpen(true)}>
                    Daftar Untuk Guna Galeri
                  </Button>
                </Box>
              ) : (
                <Dropzone
                  onDrop={async (files) => {
                    if (!currentInvitation) return;
                    const remainingSlots = MAX_GALLERY_IMAGES - galleryUrls.length;
                    if (remainingSlots <= 0) {
                      notifications.show({
                        title: 'Had Galeri Dicapai',
                        message: `Maksimum ${MAX_GALLERY_IMAGES} gambar dibenarkan dalam galeri.`,
                        color: 'yellow',
                      });
                      return;
                    }

                    const filesToUpload = files.slice(0, remainingSlots);

                    try {
                      const uploadedUrls: string[] = [];
                      for (const file of filesToUpload) {
                        const url = await uploadImage(file, currentInvitation.user_id, 'gallery');
                        uploadedUrls.push(url);
                      }
                      const newUrls = [...galleryUrls, ...uploadedUrls];
                      setGalleryUrls(newUrls);
                      // Persist gallery_images to database
                      if (id) {
                        const galleryImages = newUrls.map((u, idx) => ({
                          id: `gallery-${idx}`,
                          invitation_id: currentInvitation.id,
                          url: u,
                          sort_order: idx,
                        }));
                        await updateInvitation(id, {
                          gallery_images: galleryImages,
                          updated_at: new Date().toISOString(),
                        } as Partial<Invitation>);
                      }
                      notifications.show({
                        title: 'Berjaya!',
                        message:
                          filesToUpload.length < files.length
                            ? `${filesToUpload.length} gambar dimuat naik. Had maksimum galeri ialah ${MAX_GALLERY_IMAGES} gambar.`
                            : `${filesToUpload.length} gambar dimuat naik`,
                        color: 'green',
                      });
                    } catch {
                      notifications.show({ title: 'Ralat', message: 'Gagal memuat naik gambar', color: 'red' });
                    }
                  }}
                  accept={IMAGE_MIME_TYPE}
                  maxSize={5 * 1024 ** 2}
                  multiple
                  styles={{
                    root: {
                      borderColor: '#D4AF37',
                      borderStyle: 'dashed',
                      background: 'rgba(253, 248, 240, 0.5)',
                      minHeight: 120,
                    },
                  }}
                >
                  <Center p="lg">
                    <Stack align="center" gap="xs">
                      <IconPhoto size={32} color="#8B6F4E" />
                      <Text size="sm" c="dimmed" ta="center">
                        Seret gambar atau klik untuk muat naik
                      </Text>
                      <Text size="xs" c="dimmed">
                        Maksimum 5MB setiap gambar
                      </Text>
                    </Stack>
                  </Center>
                </Dropzone>
              )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Theme */}
          <Accordion.Item value="theme">
            <Accordion.Control icon={<IconPalette size={18} color="#8B6F4E" />}>
              <Text fw={600}>Tema</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                {/* Theme Selector */}
                <ThemeSelector
                  currentTemplate={formValues.template || sourceInvitation!.template}
                  onSelect={(template: ThemeTemplate) => {
                    handleFieldChange('template', template.id);
                    handleFieldChange('theme_config', template.theme_config);
                  }}
                />

                <Divider
                  label="Sesuaikan Warna"
                  labelPosition="center"
                  my="xs"
                  styles={{ label: { fontWeight: 600, color: '#8B6F4E', fontSize: 13 } }}
                />

                {/* Color overrides */}
                <Group grow>
                  <ColorInput
                    label="Utama"
                    value={themeConfig?.primary_color || '#8B6F4E'}
                    onChange={(v) =>
                      handleFieldChange('theme_config', {
                        ...themeConfig,
                        primary_color: v,
                      })
                    }
                    size="sm"
                  />
                  <ColorInput
                    label="Sekunder"
                    value={themeConfig?.secondary_color || '#D4AF37'}
                    onChange={(v) =>
                      handleFieldChange('theme_config', {
                        ...themeConfig,
                        secondary_color: v,
                      })
                    }
                    size="sm"
                  />
                </Group>
                <Group grow>
                  <ColorInput
                    label="Aksen"
                    value={themeConfig?.accent_color || '#F5E6D3'}
                    onChange={(v) =>
                      handleFieldChange('theme_config', {
                        ...themeConfig,
                        accent_color: v,
                      })
                    }
                    size="sm"
                  />
                  <ColorInput
                    label="Latar"
                    value={themeConfig?.bg_color || '#FDF8F0'}
                    onChange={(v) =>
                      handleFieldChange('theme_config', {
                        ...themeConfig,
                        bg_color: v,
                      })
                    }
                    size="sm"
                  />
                </Group>
                <ColorInput
                  label="Teks"
                  value={themeConfig?.text_color || '#2C1810'}
                  onChange={(v) =>
                    handleFieldChange('theme_config', {
                      ...themeConfig,
                      text_color: v,
                    })
                  }
                  size="sm"
                />
                <Divider my="xs" />
                <Text size="sm" fw={600} c="dimmed">
                  Font
                </Text>
                <Select
                  label="Font Tajuk"
                  data={FONT_OPTIONS}
                  value={themeConfig?.font_display || 'Playfair Display'}
                  onChange={(v) =>
                    handleFieldChange('theme_config', {
                      ...themeConfig,
                      font_display: v || 'Playfair Display',
                    })
                  }
                  size="sm"
                />
                <Select
                  label="Font Badan"
                  data={FONT_BODY_OPTIONS}
                  value={themeConfig?.font_body || 'Poppins'}
                  onChange={(v) =>
                    handleFieldChange('theme_config', {
                      ...themeConfig,
                      font_body: v || 'Poppins',
                    })
                  }
                  size="sm"
                />
                <Select
                  label="Font Arab"
                  data={FONT_ARABIC_OPTIONS}
                  value={themeConfig?.font_arabic || 'Amiri'}
                  onChange={(v) =>
                    handleFieldChange('theme_config', {
                      ...themeConfig,
                      font_arabic: v || 'Amiri',
                    })
                  }
                  size="sm"
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Section Manager */}
          <Accordion.Item value="sections">
            <Accordion.Control icon={<IconLayoutList size={18} color="#8B6F4E" />}>
              <Text fw={600}>Susun Bahagian</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <SectionManager
                sections={(formValues.sections || sourceInvitation!.sections || []) as InvitationSection[]}
                onChange={(sections: InvitationSection[]) => handleFieldChange('sections', sections)}
              />
            </Accordion.Panel>
          </Accordion.Item>

          {/* Chatbot AI (hidden in trial mode) */}
          {!trialMode && (
          <Accordion.Item value="chatbot">
            <Accordion.Control icon={<IconRobot size={18} color="#8B6F4E" />}>
              <Text fw={600}>Chatbot AI</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label="Aktifkan Chatbot"
                  description="Chatbot AI akan membantu tetamu menjawab soalan tentang majlis"
                  checked={formValues.chatbot_enabled ?? false}
                  onChange={(e) =>
                    handleFieldChange('chatbot_enabled', e.currentTarget.checked)
                  }
                  color="yellow"
                  size="md"
                />
                {formValues.chatbot_enabled && (
                  <Textarea
                    label="Konteks Tambahan"
                    description="Maklumat ini akan digunakan oleh chatbot untuk menjawab soalan tetamu"
                    placeholder="Tambah maklumat tentang majlis yang chatbot perlu tahu..."
                    value={formValues.chatbot_context || ''}
                    onChange={(e) =>
                      handleFieldChange('chatbot_context', e.currentTarget.value)
                    }
                    rows={4}
                    autosize
                    minRows={3}
                    maxRows={8}
                  />
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
          )}

          {/* Settings (hidden in trial mode) */}
          {!trialMode && (
          <Accordion.Item value="settings">
            <Accordion.Control icon={<IconSettings size={18} color="#8B6F4E" />}>
              <Text fw={600}>Tetapan</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <TextInput
                  label="Slug URL"
                  description={`Pautan: jemput.neyobytes.com/${formValues.slug || ''}`}
                  value={formValues.slug || ''}
                  onChange={(e) =>
                    handleFieldChange(
                      'slug',
                      e.currentTarget.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-')
                        .replace(/-+/g, '-')
                    )
                  }
                />
                <Switch
                  label="Status Penerbitan"
                  description={
                    formValues.status === 'published'
                      ? 'Kad anda boleh diakses oleh tetamu'
                      : 'Kad anda dalam mod draf'
                  }
                  checked={formValues.status === 'published'}
                  onChange={(e) => {
                    const wantsPublish = e.currentTarget.checked;
                    if (wantsPublish && !hasActiveSubscription) {
                      setSubModalOpen(true);
                      return;
                    }
                    handleFieldChange(
                      'status',
                      wantsPublish ? 'published' : 'draft'
                    );
                  }}
                  color="green"
                  size="md"
                />
                <Select
                  label="Jenis Muzik"
                  data={[
                    { value: 'youtube', label: 'YouTube' },
                    { value: 'direct', label: 'Pautan Langsung (MP3)' },
                  ]}
                  value={formValues.music_type || 'direct'}
                  onChange={(v) =>
                    handleFieldChange('music_type', (v || 'direct') as 'youtube' | 'direct')
                  }
                  size="sm"
                />
                <TextInput
                  label="URL Muzik"
                  placeholder={
                    formValues.music_type === 'youtube'
                      ? 'https://www.youtube.com/watch?v=...'
                      : 'https://example.com/music.mp3'
                  }
                  description={
                    formValues.music_type === 'youtube'
                      ? 'Tampal pautan YouTube untuk muzik latar'
                      : 'Pautan terus ke fail audio'
                  }
                  value={formValues.music_url || ''}
                  onChange={(e) => handleFieldChange('music_url', e.currentTarget.value)}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
          )}
        </Accordion>

        {/* Bottom spacer */}
        <Box h={40} />
      </Box>
    </ScrollArea>
  );

  // --- Phone Preview ---
  const PhonePreview = (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        height: '100%',
        background: '#f0ebe3',
        padding: isMobile ? '1rem 1rem 1.5rem' : '1rem',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Controls */}
      <Group
        gap="xs"
        mb="sm"
        style={{
          position: isMobile ? 'sticky' : 'static',
          top: 0,
          zIndex: 5,
          background: isMobile ? 'rgba(240, 235, 227, 0.96)' : 'transparent',
          backdropFilter: isMobile ? 'blur(6px)' : 'none',
          borderRadius: 999,
          padding: isMobile ? '0.35rem 0.5rem' : 0,
        }}
      >
        <Tooltip label="Zum keluar">
          <ActionIcon
            variant="light"
            size="sm"
            onClick={() => setPreviewZoom((z) => Math.max(0.4, z - 0.1))}
          >
            <IconZoomOut size={16} />
          </ActionIcon>
        </Tooltip>
        <Text size="xs" c="dimmed" w={40} ta="center">
          {Math.round(previewZoom * 100)}%
        </Text>
        <Tooltip label="Zum masuk">
          <ActionIcon
            variant="light"
            size="sm"
            onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))}
          >
            <IconZoomIn size={16} />
          </ActionIcon>
        </Tooltip>
        {formValues.status === 'published' && (
          <Tooltip label="Buka di tab baru">
            <ActionIcon
              variant="light"
              size="sm"
              component="a"
              href={previewUrl}
              target="_blank"
            >
              <IconExternalLink size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      {/* Phone frame */}
      <Box
        style={{
          transform: `scale(${previewZoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
        }}
      >
        <Box
          style={{
            width: 375,
            height: 812,
            borderRadius: 40,
            background: '#1a1a1a',
            padding: 8,
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          {/* Notch */}
          <Box
            style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 150,
              height: 28,
              background: '#1a1a1a',
              borderRadius: '0 0 20px 20px',
              zIndex: 10,
            }}
          />
          {/* Screen */}
          <Box
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 32,
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <iframe
              ref={previewRef}
              src={previewUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Preview"
            />
          </Box>
          {/* Home indicator */}
          <Box
            style={{
              position: 'absolute',
              bottom: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 130,
              height: 4,
              background: '#555',
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  const SubscriptionModal = (
    <Modal
      opened={subModalOpen}
      onClose={() => setSubModalOpen(false)}
      title={
        <Group gap="xs">
          <IconLock size={20} color="#D4AF37" />
          <Text fw={700} style={{ color: '#2C1810' }}>Langganan Diperlukan</Text>
        </Group>
      }
      centered
      radius="md"
      styles={{
        header: { borderBottom: '1px solid #E8D5B7' },
        body: { padding: '1.5rem' },
      }}
    >
      <Stack gap="md">
        <Box
          style={{
            background: 'linear-gradient(135deg, #FFFAF3 0%, #FDF5E6 100%)',
            border: '1px solid #E8D5B7',
            borderRadius: 12,
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <IconCrown size={40} color="#D4AF37" style={{ marginBottom: 8 }} />
          <Text fw={600} size="lg" style={{ color: '#2C1810' }}>
            Terbitkan Kad Anda
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Anda perlu melanggan pelan untuk menerbitkan kad jemputan dan berkongsi pautan
            dengan tetamu anda.
          </Text>
        </Box>

        <Button
          fullWidth
          size="md"
          leftSection={<IconCrown size={18} />}
          onClick={() => {
            setSubModalOpen(false);
            navigate('/dashboard/subscription');
          }}
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)',
            border: 'none',
          }}
        >
          Lihat Pelan Langganan
        </Button>
        <Button
          fullWidth
          variant="default"
          size="md"
          onClick={() => setSubModalOpen(false)}
        >
          Kembali ke Editor
        </Button>
      </Stack>
    </Modal>
  );

  // --- Signup Modal (trial mode only) ---
  const SignupModal = (
    <Modal
      opened={signupModalOpen}
      onClose={() => setSignupModalOpen(false)}
      title={
        <Group gap="xs">
          <IconUserPlus size={20} color="#D4AF37" />
          <Text fw={700} style={{ color: '#2C1810' }}>Daftar Akaun</Text>
        </Group>
      }
      centered
      radius="md"
      styles={{
        header: { borderBottom: '1px solid #E8D5B7' },
        body: { padding: '1.5rem' },
      }}
    >
      <Stack gap="md">
        <Box
          style={{
            background: 'linear-gradient(135deg, #FFFAF3 0%, #FDF5E6 100%)',
            border: '1px solid #E8D5B7',
            borderRadius: 12,
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <IconCrown size={40} color="#D4AF37" style={{ marginBottom: 8 }} />
          <Text fw={600} size="lg" style={{ color: '#2C1810' }}>
            Simpan Kad Anda
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Daftar akaun percuma untuk menyimpan, menyunting, dan menerbitkan kad jemputan digital anda.
          </Text>
        </Box>

        <Button
          fullWidth
          size="md"
          leftSection={<IconUserPlus size={18} />}
          onClick={() => {
            setSignupModalOpen(false);
            navigate('/login');
          }}
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)',
            border: 'none',
          }}
        >
          Daftar Sekarang
        </Button>
        <Button
          fullWidth
          variant="default"
          size="md"
          onClick={() => setSignupModalOpen(false)}
        >
          Kembali ke Editor
        </Button>
      </Stack>
    </Modal>
  );

  // --- Mobile: Tabbed layout ---
  if (isMobile) {
    return (
      <>
        {trialMode ? SignupModal : SubscriptionModal}
        <Box h="calc(100vh - 60px)">
          <Tabs value={mobileTab} onChange={setMobileTab}>
            <Tabs.List grow>
              <Tabs.Tab
                value="edit"
                leftSection={<IconEdit size={16} />}
              >
                Edit
              </Tabs.Tab>
              <Tabs.Tab
                value="preview"
                leftSection={<IconEye size={16} />}
              >
                Preview
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="edit" style={{ height: 'calc(100vh - 120px)' }}>
              {FormPanel}
            </Tabs.Panel>
            <Tabs.Panel value="preview" style={{ height: 'calc(100vh - 120px)' }}>
              {PhonePreview}
            </Tabs.Panel>
          </Tabs>
        </Box>
      </>
    );
  }

  // --- Desktop: Split pane ---
  return (
    <>
      {trialMode ? SignupModal : SubscriptionModal}
      <Box style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
        {/* Left: Editor (60%) */}
        <Box style={{ width: '60%', borderRight: '1px solid #E8D5B7', overflow: 'hidden' }}>
          {FormPanel}
        </Box>
        {/* Right: Preview (40%) */}
        <Box style={{ width: '40%', overflow: 'hidden' }}>
          {PhonePreview}
        </Box>
      </Box>
    </>
  );
}
