import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../stores/invitationStore';
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
import GallerySection from '../components/invitation/GallerySection';
import Guestbook from '../components/invitation/Guestbook';
import CalendarSave from '../components/invitation/CalendarSave';
import FooterSection from '../components/invitation/FooterSection';
import MusicToggle from '../components/invitation/MusicToggle';
import ChatbotWidget from '../components/invitation/ChatbotWidget';

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
// Ornament divider used between sections
// ---------------------------------------------------------------------------
function OrnamentDivider() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25))' }} />
      <span style={{ padding: '0 12px', color: 'var(--secondary-color, #D4AF37)', fontSize: '12px', opacity: 0.5 }}>
        &#9674; &#9674; &#9674;
      </span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.25), transparent)' }} />
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

// ---------------------------------------------------------------------------
// Render a single section by type
// ---------------------------------------------------------------------------
function renderSection(
  section: InvitationSection,
  invitation: Invitation,
  guestbook: GuestbookMessage[],
) {
  switch (section.type) {
    case 'islamic_greeting':
      return <IslamicGreeting key={section.id} />;

    case 'invitation_text':
      return <InvitationText key={section.id} invitation={invitation} />;

    case 'couple':
      return <CoupleSection key={section.id} invitation={invitation} />;

    case 'event_details':
      return <EventDetails key={section.id} invitation={invitation} />;

    case 'countdown':
      return (
        <CountdownTimer
          key={section.id}
          eventDate={invitation.event_date}
          eventTime={invitation.event_time_start}
        />
      );

    case 'itinerary':
      return invitation.itinerary.length > 0 ? (
        <Itinerary key={section.id} items={invitation.itinerary} />
      ) : null;

    case 'location':
      return <LocationSection key={section.id} invitation={invitation} />;

    case 'contact':
      return invitation.contacts.length > 0 ? (
        <ContactSection key={section.id} contacts={invitation.contacts} />
      ) : null;

    case 'rsvp':
      return (
        <RSVPForm
          key={section.id}
          invitationId={invitation.id}
          rsvpDeadline={invitation.rsvp_deadline}
          rsvpEnabled={invitation.rsvp_enabled}
        />
      );

    case 'money_gift':
      return invitation.money_gift ? (
        <MoneyGift key={section.id} moneyGift={invitation.money_gift} />
      ) : null;

    case 'gallery':
      return <GallerySection key={section.id} images={invitation.gallery_images} />;

    case 'guestbook':
      return (
        <Guestbook
          key={section.id}
          invitationId={invitation.id}
          messages={guestbook}
        />
      );

    case 'calendar_save':
      return <CalendarSave key={section.id} invitation={invitation} />;

    case 'footer':
      return <FooterSection key={section.id} invitation={invitation} />;

    // ---- Custom section types ----
    case 'custom_text': {
      const content = (section.config as Record<string, string> | undefined)?.content;
      return content ? (
        <div
          key={section.id}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '24px',
            textAlign: 'center',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'var(--text-color, #2C1810)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {content}
        </div>
      ) : null;
    }

    case 'custom_image': {
      const imageUrl = (section.config as Record<string, string> | undefined)?.image_url;
      return imageUrl ? (
        <div
          key={section.id}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <img
            src={imageUrl}
            alt="Custom"
            style={{
              maxWidth: '100%',
              borderRadius: '8px',
            }}
          />
        </div>
      ) : null;
    }

    case 'custom_video': {
      const videoUrl = (section.config as Record<string, string> | undefined)?.video_url;
      return videoUrl ? (
        <div
          key={section.id}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <iframe
            src={videoUrl}
            title="Custom video"
            style={{
              width: '100%',
              aspectRatio: '16/9',
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
  { id: 'default-gallery', type: 'gallery', enabled: true, sort_order: 11 },
  { id: 'default-guestbook', type: 'guestbook', enabled: true, sort_order: 12 },
  { id: 'default-calendar_save', type: 'calendar_save', enabled: true, sort_order: 13 },
  { id: 'default-footer', type: 'footer', enabled: true, sort_order: 14 },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || undefined;

  const { invitation, guestbook, loading, fetchInvitation, toggleMusic } =
    useInvitationStore();

  const [coverOpen, setCoverOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      fetchInvitation(slug);
    }
  }, [slug, fetchInvitation]);

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

    // Set page title
    document.title = `${invitation.groom_name} & ${invitation.bride_name} | Jemput`;

    return () => {
      // Cleanup CSS variables
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--secondary-color');
      root.style.removeProperty('--accent-color');
      root.style.removeProperty('--bg-color');
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--font-display');
      root.style.removeProperty('--font-body');
      root.style.removeProperty('--font-arabic');
    };
  }, [invitation]);

  const handleOpenCover = () => {
    setCoverOpen(true);

    // Start music if URL provided
    if (invitation?.music_url && invitation.music_url.length > 0) {
      toggleMusic();
    }

    // Smooth scroll to content
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
        background: 'var(--bg-color, #FDF8F0)',
        color: 'var(--text-color, #2C1810)',
        minHeight: '100dvh',
        overflowX: 'hidden',
      }}
    >
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Only visible after cover is opened */}
      {coverOpen && (
        <motion.div
          ref={contentRef}
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
                Kepada yang dihormati
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

          {/* Gold top border ornament */}
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
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37))',
              }}
            />
            <span
              style={{
                padding: '0 16px',
                color: 'var(--secondary-color, #D4AF37)',
                fontSize: '16px',
              }}
            >
              &#10022;
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, var(--secondary-color, #D4AF37), transparent)',
              }}
            />
          </div>

          {/* Dynamic sections */}
          {sectionsToRender.map((section) => (
            <div key={section.id}>
              {DIVIDER_BEFORE.has(section.type) && <OrnamentDivider />}
              {renderSection(section, invitation, guestbook)}
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
          enabled={invitation.chatbot_enabled}
          weddingContext={buildWeddingContext(invitation)}
          extraContext={invitation.chatbot_context}
          dailyLimit={20}
        />
      )}
    </div>
  );
}
