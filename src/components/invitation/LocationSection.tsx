import { motion } from 'framer-motion';
import type { Invitation } from '../../types';

interface LocationSectionProps {
  invitation: Invitation;
}

export default function LocationSection({ invitation }: LocationSectionProps) {
  const googleMapsUrl = invitation.venue_lat && invitation.venue_lng
    ? `https://www.google.com/maps/search/?api=1&query=${invitation.venue_lat},${invitation.venue_lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venue_address)}`;

  const wazeUrl = invitation.venue_lat && invitation.venue_lng
    ? `https://waze.com/ul?ll=${invitation.venue_lat},${invitation.venue_lng}&navigate=yes`
    : `https://waze.com/ul?q=${encodeURIComponent(invitation.venue_address)}`;

  return (
    <section
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Section title */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '10px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'var(--primary-color, #8B6F4E)',
          marginBottom: '8px',
        }}
      >
        Lokasi
      </motion.p>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-display, "Playfair Display"), serif',
          fontSize: '22px',
          fontWeight: 500,
          color: 'var(--text-color, #2C1810)',
          marginBottom: '12px',
        }}
      >
        {invitation.venue_name}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '13px',
          color: 'var(--primary-color, #8B6F4E)',
          lineHeight: 1.7,
          marginBottom: '28px',
        }}
      >
        {invitation.venue_address}
      </motion.p>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        {/* Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            color: 'var(--text-color, #2C1810)',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color, #D4AF37)" strokeWidth="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Google Maps
        </a>

        {/* Waze */}
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            color: 'var(--text-color, #2C1810)',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color, #D4AF37)" strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Waze
        </a>
      </motion.div>
    </section>
  );
}
