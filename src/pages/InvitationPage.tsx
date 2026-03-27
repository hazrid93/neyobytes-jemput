import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../stores/invitationStore';
import { getTemplateVisuals, buildThemeVars } from '../lib/template-styles';
import { resolveTemplateId } from '../lib/themes';
import { getCopy } from '../lib/invitation-copy';
import { getUserSubscriptionFeatures } from '../lib/subscription';
import type { GuestbookMessage, Invitation, InvitationSection } from '../types';

import CoverSection from '../components/invitation/CoverSection';
import IslamicGreeting from '../components/invitation/IslamicGreeting';
import InvitationText from '../components/invitation/InvitationText';
import CoupleSection from '../components/invitation/CoupleSection';
import EventDetails from '../components/invitation/EventDetails';
import CountdownTimer from '../components/invitation/CountdownTimer';
import Itinerary from '../components/invitation/Itinerary';
import LocationSection from '../components/invitation/LocationSection';
import ContactSection from '../components/invitation/ContactSection';
import RSVPForm from '../components/invitation/RSVPForm';
import MoneyGift from '../components/invitation/MoneyGift';
import WishlistSection from '../components/invitation/WishlistSection';
import GallerySection from '../components/invitation/GallerySection';
import Guestbook from '../components/invitation/Guestbook';
import CalendarSave from '../components/invitation/CalendarSave';
import FooterSection from '../components/invitation/FooterSection';
import MusicToggle from '../components/invitation/MusicToggle';
import ChatbotWidget from '../components/invitation/ChatbotWidget';
import EditableCopy from '../components/invitation/EditableCopy';
import { fetchPublicSiteSettings } from '../lib/site-settings';
import type { SiteSettings } from '../types';

// ---------------------------------------------------------------------------
// Helper: build wedding context string for chatbot
// ---------------------------------------------------------------------------
function buildWeddingContext(inv: Invitation): string {
  const lines: string[] = [
    `Majlis Perkahwinan ${inv.groom_name} & ${inv.bride_name}`,
    `Tarikh: ${inv.event_date}`,
    `Masa: ${inv.event_time_start} - ${inv.event_time_end}`,
    `Tempat: ${inv.venue_name}, ${inv.venue_address}`,
  ];

  if (inv.venue_lat && inv.venue_lng) {
    lines.push(`Koordinat: ${inv.venue_lat}, ${inv.venue_lng}`);
  }

  if (inv.groom_parent_names) {
    lines.push(`Waris lelaki: ${inv.groom_parent_names}`);
  }
  if (inv.bride_parent_names) {
    lines.push(`Waris perempuan: ${inv.bride_parent_names}`);
  }

  if (inv.itinerary && inv.itinerary.length > 0) {
    lines.push('');
    lines.push('Aturcara:');
    inv.itinerary.forEach((item) => {
      lines.push(`  ${item.time} - ${item.event}`);
    });
  }

  if (inv.contacts && inv.contacts.length > 0) {
    lines.push('');
    lines.push('Hubungi:');
    inv.contacts.forEach((c) => {
      lines.push(`  ${c.name} (${c.role}): ${c.phone}`);
    });
  }

  if (inv.rsvp_enabled && inv.rsvp_deadline) {
    lines.push('');
    lines.push(`RSVP sebelum: ${inv.rsvp_deadline}`);
  }

  if (inv.money_gift) {
    lines.push('');
    lines.push(`Sumbangan/Hadiah wang: ${inv.money_gift.bank_name} - ${inv.money_gift.account_name} (${inv.money_gift.account_number})`);
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Template-aware ornament divider
// ---------------------------------------------------------------------------
function OrnamentDivider({ templateId, secondaryColor }: { templateId: string; secondaryColor: string }) {
  const visuals = getTemplateVisuals(templateId);
  const svgString = visuals.dividerSvg(secondaryColor);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 24px',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: svgString }}
        style={{ width: '200px', height: '24px' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section types that should have a divider rendered BEFORE them
// ---------------------------------------------------------------------------
const DIVIDER_BEFORE: Set<string> = new Set([
  'event_details',
  'rsvp',
  'money_gift',
  'gallery',
  'guestbook',
  'calendar_save',
  'footer',
]);

function getBackgroundImages(invitation: Invitation) {
  return {
    globalUrl: invitation.theme_config.backgrounds?.global_url || '',
    perSection: invitation.theme_config.backgrounds?.per_section || {},
  };
}

function getSectionBackgroundUrl(invitation: Invitation, sectionId: string) {
  const backgrounds = getBackgroundImages(invitation);
  if (sectionId === 'cover') {
    return backgrounds.perSection.cover || invitation.cover_photo_url || backgrounds.globalUrl || '';
  }
  return backgrounds.perSection[sectionId] || backgrounds.globalUrl || '';
}

function wrapWithSectionBackground(
  invitation: Invitation,
  sectionId: string,
  content: ReactNode,
) {
  if (!content) return null;

  const backgroundUrl = getSectionBackgroundUrl(invitation, sectionId);
  if (!backgroundUrl) return content;

  return (
    <div
      key={`background-${sectionId}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(color-mix(in srgb, var(--bg-color, #FDF8F0) 80%, transparent), color-mix(in srgb, var(--bg-color, #FDF8F0) 80%, transparent)), url("${backgroundUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div style={{ position: 'relative' }}>{content}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Render a single section by type
// ---------------------------------------------------------------------------
function renderSection(
  section: InvitationSection,
  invitation: Invitation,
  guestbook: GuestbookMessage[],
  templateId: string,
  previewEditMode: boolean,
) {
  const content = (() => {
    switch (section.type) {
    case 'islamic_greeting':
      return <IslamicGreeting key={section.id} copyOverrides={invitation.theme_config.copy_overrides} previewEditMode={previewEditMode} />;

    case 'invitation_text':
      return (
        <InvitationText
          key={section.id}
          invitation={invitation}
          templateId={templateId}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'couple':
      return (
        <CoupleSection
          key={section.id}
          invitation={invitation}
          templateId={templateId}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'event_details':
      return (
        <EventDetails
          key={section.id}
          invitation={invitation}
          templateId={templateId}
          styleVariant={((section.config as { style?: 'classic' | 'plaque' | 'editorial' } | undefined)?.style) || 'classic'}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'countdown':
      return (
        <CountdownTimer
          key={section.id}
          eventDate={invitation.event_date}
          eventTime={invitation.event_time_start}
          templateId={templateId}
          styleVariant={((section.config as { style?: 'cards' | 'pill' | 'minimal' } | undefined)?.style) || 'cards'}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'itinerary':
      return invitation.itinerary.length > 0 ? (
        <Itinerary
          key={section.id}
          items={invitation.itinerary}
          styleVariant={((section.config as { style?: 'timeline' | 'cards' | 'split' } | undefined)?.style) || 'timeline'}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      ) : null;

    case 'location':
      return <LocationSection key={section.id} invitation={invitation} templateId={templateId} copyOverrides={invitation.theme_config.copy_overrides} previewEditMode={previewEditMode} />;

    case 'contact':
      return invitation.contacts.length > 0 ? (
        <ContactSection
          key={section.id}
          contacts={invitation.contacts}
          templateId={templateId}
          styleVariant={((section.config as { style?: 'cards' | 'compact' } | undefined)?.style) || 'cards'}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      ) : null;

    case 'rsvp':
      return (
        <RSVPForm
          key={section.id}
          invitationId={invitation.id}
          rsvpDeadline={invitation.rsvp_deadline}
          rsvpEnabled={invitation.rsvp_enabled}
          templateId={templateId}
          styleVariant={((section.config as { style?: 'form-card' | 'soft-panel' } | undefined)?.style) || 'form-card'}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'money_gift':
      return invitation.money_gift ? (
        <MoneyGift key={section.id} moneyGift={invitation.money_gift} templateId={templateId} copyOverrides={invitation.theme_config.copy_overrides} previewEditMode={previewEditMode} />
      ) : null;

    case 'wishlist':
      return invitation.wishlist?.length ? (
        <WishlistSection key={section.id} wishlist={invitation.wishlist} templateId={templateId} copyOverrides={invitation.theme_config.copy_overrides} previewEditMode={previewEditMode} />
      ) : null;

    case 'gallery':
      return (
        <GallerySection
          key={section.id}
          images={invitation.gallery_images}
          layout={((section.config as { layout?: 'carousel' | 'grid' | 'masonry' } | undefined)?.layout) || 'carousel'}
          templateId={templateId}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'guestbook':
      return (
        <Guestbook
          key={section.id}
          invitationId={invitation.id}
          messages={guestbook}
          templateId={templateId}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
        />
      );

    case 'calendar_save':
      return <CalendarSave key={section.id} invitation={invitation} templateId={templateId} copyOverrides={invitation.theme_config.copy_overrides} previewEditMode={previewEditMode} />;

    case 'footer':
      return <FooterSection key={section.id} invitation={invitation} templateId={templateId} copyOverrides={invitation.theme_config.copy_overrides} previewEditMode={previewEditMode} />;

    // ---- Custom section types ----
    case 'custom_text': {
      const config = (section.config as Record<string, string> | undefined) || {};
      const content = config.content;
      const align = config.align || 'center';
      const maxWidth = config.width === 'narrow' ? '340px' : config.width === 'wide' ? '560px' : '480px';
      return content ? (
        <div
          key={section.id}
          style={{
            maxWidth,
            margin: '0 auto',
            padding: '24px',
            textAlign: align as 'left' | 'center' | 'right',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'var(--text-color, #2C1810)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {config.title && (
            <div style={{ marginBottom: 8, fontFamily: 'var(--font-display, "Playfair Display"), serif', fontSize: 24, fontWeight: 600 }}>
              {config.title}
            </div>
          )}
          {config.subtitle && (
            <div style={{ marginBottom: 14, color: 'var(--primary-color, #8B6F4E)', fontSize: 13 }}>
              {config.subtitle}
            </div>
          )}
          {content}
        </div>
      ) : null;
    }

    case 'custom_image': {
      const config = (section.config as Record<string, string> | undefined) || {};
      const imageUrl = config.image_url;
      const align = config.align || 'center';
      const frame = config.frame || 'soft';
      return imageUrl ? (
        <div
          key={section.id}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '24px',
            textAlign: align as 'left' | 'center' | 'right',
          }}
        >
          {config.title && (
            <div style={{ marginBottom: 10, fontFamily: 'var(--font-display, "Playfair Display"), serif', fontSize: 24, fontWeight: 600 }}>
              {config.title}
            </div>
          )}
          <img
            src={imageUrl}
            alt={config.title || 'Custom'}
            style={{
              maxWidth: '100%',
              borderRadius: frame === 'square' ? '4px' : frame === 'polaroid' ? '2px' : '16px',
              padding: frame === 'polaroid' ? '10px 10px 26px' : undefined,
              background: frame === 'polaroid' ? 'white' : undefined,
              boxShadow: frame === 'polaroid' ? '0 16px 28px rgba(44,24,16,0.12)' : undefined,
            }}
          />
          {config.caption && (
            <div style={{ marginTop: 10, color: 'var(--primary-color, #8B6F4E)', fontSize: 13 }}>
              {config.caption}
            </div>
          )}
        </div>
      ) : null;
    }

    case 'custom_video': {
      const config = (section.config as Record<string, string> | undefined) || {};
      const videoUrl = config.video_url;
      const align = config.align || 'center';
      return videoUrl ? (
        <div
          key={section.id}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '24px',
            textAlign: align as 'left' | 'center' | 'right',
          }}
        >
          {config.title && (
            <div style={{ marginBottom: 8, fontFamily: 'var(--font-display, "Playfair Display"), serif', fontSize: 24, fontWeight: 600 }}>
              {config.title}
            </div>
          )}
          {config.subtitle && (
            <div style={{ marginBottom: 14, color: 'var(--primary-color, #8B6F4E)', fontSize: 13 }}>
              {config.subtitle}
            </div>
          )}
          <iframe
            src={videoUrl}
            title="Custom video"
            style={{
              width: '100%',
              aspectRatio: config.aspect_ratio || '16 / 9',
              border: 'none',
              borderRadius: '8px',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null;
    }

    default:
      return null;
    }
  })();

  return wrapWithSectionBackground(invitation, section.id, content);
}

// ---------------------------------------------------------------------------
// Default section order for backward compatibility when invitation.sections
// is empty or undefined.
// ---------------------------------------------------------------------------
const DEFAULT_SECTION_ORDER: InvitationSection[] = [
  { id: 'default-islamic_greeting', type: 'islamic_greeting', enabled: true, sort_order: 1 },
  { id: 'default-invitation_text', type: 'invitation_text', enabled: true, sort_order: 2 },
  { id: 'default-couple', type: 'couple', enabled: true, sort_order: 3 },
  { id: 'default-event_details', type: 'event_details', enabled: true, sort_order: 4 },
  { id: 'default-countdown', type: 'countdown', enabled: true, sort_order: 5 },
  { id: 'default-itinerary', type: 'itinerary', enabled: true, sort_order: 6 },
  { id: 'default-location', type: 'location', enabled: true, sort_order: 7 },
  { id: 'default-contact', type: 'contact', enabled: true, sort_order: 8 },
  { id: 'default-rsvp', type: 'rsvp', enabled: true, sort_order: 9 },
  { id: 'default-money_gift', type: 'money_gift', enabled: true, sort_order: 10 },
  { id: 'default-wishlist', type: 'wishlist', enabled: true, sort_order: 11 },
  { id: 'default-gallery', type: 'gallery', enabled: true, sort_order: 12 },
  { id: 'default-guestbook', type: 'guestbook', enabled: true, sort_order: 13 },
  { id: 'default-calendar_save', type: 'calendar_save', enabled: true, sort_order: 14 },
  { id: 'default-footer', type: 'footer', enabled: true, sort_order: 15 },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || undefined;
  const previewEditMode = searchParams.get('previewEdit') === '1';
  const [previewDrafts, setPreviewDrafts] = useState<Record<string, string>>({});
  const [previewSaveState, setPreviewSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { invitation, guestbook, loading, fetchInvitation, toggleMusic } =
    useInvitationStore();

  const [coverOpen, setCoverOpen] = useState(false);
  const [ownerHasSubscription, setOwnerHasSubscription] = useState(false);
  const [ownerInvitationChatEnabled, setOwnerInvitationChatEnabled] = useState(true);
  const [ownerInvitationChatLimit, setOwnerInvitationChatLimit] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      fetchInvitation(slug);
    }
  }, [slug, fetchInvitation]);

  // Check if the invitation owner has an active subscription (for chatbot gating)
  // Skip for demo data — no real user to query
  useEffect(() => {
    if (!invitation?.user_id || !invitation.chatbot_enabled) return;
    if (invitation.user_id === 'demo-user') {
      setOwnerHasSubscription(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const subscription = await getUserSubscriptionFeatures(invitation.user_id);
        if (!cancelled) {
          setOwnerHasSubscription(subscription.is_active);
          setOwnerInvitationChatEnabled(subscription.invitation_chatbot_enabled);
          setOwnerInvitationChatLimit(subscription.invitation_chat_daily_limit);
        }
      } catch {
        if (!cancelled) {
          setOwnerHasSubscription(false);
          setOwnerInvitationChatEnabled(false);
          setOwnerInvitationChatLimit(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [invitation?.user_id, invitation?.chatbot_enabled]);

  // Fetch site settings for /cuba preview chatbot admin config
  const isDemoInvitation = invitation?.user_id === 'demo-user';
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  useEffect(() => {
    if (!isDemoInvitation) return;
    fetchPublicSiteSettings().then(setSiteSettings);
  }, [isDemoInvitation]);

  // Resolve template ID and get visuals
  const templateId = useMemo(
    () => resolveTemplateId(invitation?.template ?? 'songket-emas'),
    [invitation?.template],
  );
  const visuals = useMemo(() => getTemplateVisuals(templateId), [templateId]);
  const themeVars = useMemo(
    () =>
      invitation
        ? buildThemeVars(invitation.theme_config)
        : { primary: '#8B6F4E', secondary: '#D4AF37', accent: '#F5E6D3', bg: '#FDF8F0', text: '#2C1810' },
    [invitation],
  );

  // Set CSS variables from theme config
  useEffect(() => {
    if (!invitation) return;
    const root = document.documentElement;
    const t = invitation.theme_config;
    root.style.setProperty('--primary-color', t.primary_color);
    root.style.setProperty('--secondary-color', t.secondary_color);
    root.style.setProperty('--accent-color', t.accent_color);
    root.style.setProperty('--bg-color', t.bg_color);
    root.style.setProperty('--text-color', t.text_color);
    root.style.setProperty('--font-display', t.font_display);
    root.style.setProperty('--font-body', t.font_body);
    root.style.setProperty('--font-arabic', t.font_arabic);
    // Additional variables consumed by section components
    root.style.setProperty('--border-color', t.secondary_color);
    root.style.setProperty('--template-id', templateId);

    // Set page title
    document.title = `${invitation.groom_name} & ${invitation.bride_name} | Jemput`;

    return () => {
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--secondary-color');
      root.style.removeProperty('--accent-color');
      root.style.removeProperty('--bg-color');
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--font-display');
      root.style.removeProperty('--font-body');
      root.style.removeProperty('--font-arabic');
      root.style.removeProperty('--border-color');
      root.style.removeProperty('--template-id');
    };
  }, [invitation, templateId]);

  useEffect(() => {
    if (!coverOpen) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToTop();
    const rafId = window.requestAnimationFrame(scrollToTop);
    const timeoutId = window.setTimeout(scrollToTop, 120);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [coverOpen]);

  useEffect(() => {
    if (!previewEditMode) {
      setPreviewDrafts({});
      setPreviewSaveState('idle');
      return;
    }

    const handleLocalDraft = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string; value?: string }>;
      if (!customEvent.detail?.key) return;
      setPreviewDrafts((current) => ({
        ...current,
        [customEvent.detail.key as string]: customEvent.detail.value || '',
      }));
      setPreviewSaveState('idle');
    };

    const handleParentMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; success?: boolean };
      if (data.type !== 'preview-edit-save-result') return;

      if (data.success) {
        setPreviewDrafts({});
        setPreviewSaveState('saved');
        window.setTimeout(() => setPreviewSaveState('idle'), 1600);
      } else {
        setPreviewSaveState('error');
      }
    };

    window.addEventListener('preview-edit-local-change', handleLocalDraft as EventListener);
    window.addEventListener('message', handleParentMessage);
    return () => {
      window.removeEventListener('preview-edit-local-change', handleLocalDraft as EventListener);
      window.removeEventListener('message', handleParentMessage);
    };
  }, [previewEditMode]);

  const handleOpenCover = () => {
    setCoverOpen(true);

    // Start music if URL provided
    if (invitation?.music_url && invitation.music_url.length > 0) {
      toggleMusic();
    }
  };

  // Loading screen
  if (loading || !invitation) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDF8F0',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(212,175,55,0.2)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            marginBottom: '24px',
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#8B6F4E',
          }}
        >
          Memuatkan jemputan...
        </motion.p>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Template-aware page background
  // -----------------------------------------------------------------------
  const pageBackgroundStyle = visuals.pageBackground(themeVars);

  // -----------------------------------------------------------------------
  // Template-aware top ornament divider SVG
  // -----------------------------------------------------------------------
  const topDividerSvg = visuals.dividerSvg(themeVars.secondary);

  // -----------------------------------------------------------------------
  // Determine which sections to render (dynamic or fallback)
  // -----------------------------------------------------------------------
  const sectionsToRender: InvitationSection[] =
    invitation.sections && invitation.sections.length > 0
      ? [...invitation.sections]
          .filter((s) => s.enabled && s.type !== 'cover') // cover handled separately
          .sort((a, b) => a.sort_order - b.sort_order)
      : DEFAULT_SECTION_ORDER;

  return (
    <div
      className="invitation-page"
      style={{
        ...pageBackgroundStyle,
        color: 'var(--text-color, #2C1810)',
        minHeight: '100dvh',
      overflowX: 'hidden',
      }}
    >
      {previewEditMode && (
        <div
          style={{
            position: 'sticky',
            top: 12,
            zIndex: 30,
            padding: '12px 16px 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '999px',
              background: 'rgba(253,248,240,0.92)',
              border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 28%, transparent)',
              boxShadow: '0 10px 30px rgba(44,24,16,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                fontSize: '11px',
                letterSpacing: '1px',
                color: previewSaveState === 'error' ? '#C92A2A' : 'var(--primary-color, #8B6F4E)',
              }}
            >
              {previewSaveState === 'saving'
                ? 'Menyimpan perubahan...'
                : previewSaveState === 'saved'
                  ? 'Perubahan disimpan'
                  : previewSaveState === 'error'
                    ? 'Gagal simpan perubahan'
                    : Object.keys(previewDrafts).length > 0
                      ? 'Perubahan belum disimpan'
                      : 'Mod edit preview aktif'}
            </span>
            <button
              type="button"
              disabled={previewSaveState === 'saving' || Object.keys(previewDrafts).length === 0}
              onClick={() => {
                setPreviewSaveState('saving');
                window.parent.postMessage({ type: 'preview-edit-save' }, window.location.origin);
              }}
              style={{
                border: 'none',
                borderRadius: '999px',
                padding: '8px 14px',
                background:
                  previewSaveState === 'saving' || Object.keys(previewDrafts).length === 0
                    ? 'color-mix(in srgb, var(--secondary-color, #D4AF37) 24%, transparent)'
                    : 'linear-gradient(135deg, var(--secondary-color, #D4AF37), var(--primary-color, #8B6F4E))',
                color: 'var(--bg-color, #FDF8F0)',
                cursor:
                  previewSaveState === 'saving' || Object.keys(previewDrafts).length === 0
                    ? 'not-allowed'
                    : 'pointer',
                fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              {previewSaveState === 'saving' ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {/* Cover Section */}
      <AnimatePresence>
        {!coverOpen && (
          <motion.div
            key="cover"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
        <CoverSection
          invitation={invitation}
          guestName={guestName}
          onOpen={handleOpenCover}
          templateId={templateId}
          copyOverrides={invitation.theme_config.copy_overrides}
          previewEditMode={previewEditMode}
          backgroundPhotoUrl={getSectionBackgroundUrl(invitation, 'cover')}
        />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Only visible after cover is opened */}
      {coverOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Personalized greeting for guest */}
          {guestName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                textAlign: 'center',
                padding: '40px 24px 0',
                maxWidth: '480px',
                margin: '0 auto',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '10px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--primary-color, #8B6F4E)',
                  marginBottom: '4px',
                }}
              >
                <EditableCopy
                  as="span"
                  value={getCopy(invitation.theme_config.copy_overrides, 'cover.guest_heading', 'Kepada yang dihormati')}
                  copyKey="cover.guest_heading"
                  editMode={previewEditMode}
                />
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display, "Playfair Display"), serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-color, #2C1810)',
                }}
              >
                {guestName}
              </p>
              <div
                style={{
                  width: '60px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
                  margin: '16px auto 0',
                }}
              />
            </motion.div>
          )}

          {/* Template-aware top ornament divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 24px 0',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: topDividerSvg }}
              style={{ width: '200px', height: '24px' }}
            />
          </div>

          {/* Dynamic sections */}
          {sectionsToRender.map((section) => (
            <div key={section.id}>
              {DIVIDER_BEFORE.has(section.type) && (
                <OrnamentDivider
                  templateId={templateId}
                  secondaryColor={themeVars.secondary}
                />
              )}
              {renderSection(section, invitation, guestbook, templateId, previewEditMode)}
            </div>
          ))}
        </motion.div>
      )}

      {/* Music toggle - always visible after cover opened */}
      {coverOpen && (
        <MusicToggle musicUrl={invitation.music_url} musicType={invitation.music_type} />
      )}

      {/* Chatbot widget - visible after cover opened and when enabled */}
      {coverOpen && invitation.chatbot_enabled && (
        <ChatbotWidget
          invitationId={invitation.id}
          enabled={
            isDemoInvitation
              ? (siteSettings?.cuba_preview_chat_enabled ?? true)
              : invitation.chatbot_enabled && ownerInvitationChatEnabled
          }
          weddingContext={buildWeddingContext(invitation)}
          extraContext={invitation.chatbot_context}
          dailyLimit={
            isDemoInvitation
              ? (siteSettings?.cuba_preview_chat_daily_limit ?? 10)
              : (ownerInvitationChatLimit ?? siteSettings?.invitation_chat_daily_limit ?? 20)
          }
          subscriptionActive={
            isDemoInvitation
              ? (siteSettings?.cuba_preview_chat_enabled ?? true)
              : ownerHasSubscription
          }
        />
      )}
    </div>
  );
}
