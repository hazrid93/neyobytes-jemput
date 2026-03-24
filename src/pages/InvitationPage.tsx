import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../stores/invitationStore';

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

          <IslamicGreeting />
          <InvitationText invitation={invitation} />
          <CoupleSection invitation={invitation} />

          {/* Divider */}
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

          <EventDetails invitation={invitation} />
          <CountdownTimer
            eventDate={invitation.event_date}
            eventTime={invitation.event_time_start}
          />

          {invitation.itinerary.length > 0 && (
            <Itinerary items={invitation.itinerary} />
          )}

          <LocationSection invitation={invitation} />

          {invitation.contacts.length > 0 && (
            <ContactSection contacts={invitation.contacts} />
          )}

          {/* Divider */}
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

          <RSVPForm
            invitationId={invitation.id}
            rsvpDeadline={invitation.rsvp_deadline}
            rsvpEnabled={invitation.rsvp_enabled}
          />

          {invitation.money_gift && (
            <MoneyGift moneyGift={invitation.money_gift} />
          )}

          <GallerySection images={invitation.gallery_images} />
          <Guestbook
            invitationId={invitation.id}
            messages={guestbook}
          />
          <CalendarSave invitation={invitation} />
          <FooterSection invitation={invitation} />
        </motion.div>
      )}

      {/* Music toggle - always visible after cover opened */}
      {coverOpen && (
        <MusicToggle musicUrl={invitation.music_url} musicType={invitation.music_type} />
      )}
    </div>
  );
}
