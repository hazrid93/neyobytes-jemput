import { motion } from 'framer-motion';
import type { Invitation } from '../../types';

interface EventDetailsProps {
  invitation: Invitation;
}

function formatMalayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'petang' : 'pagi';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${period}`;
}

export default function EventDetails({ invitation }: EventDetailsProps) {
  const dateObj = new Date(invitation.event_date + 'T00:00:00');
  const dayNum = dateObj.getDate().toString().padStart(2, '0');
  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
  ];
  const monthName = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

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
          marginBottom: '24px',
        }}
      >
        Atur Cara Majlis
      </motion.p>

      {/* Event card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '4px',
          padding: '36px 24px',
          position: 'relative',
          background: 'rgba(255,255,255,0.3)',
        }}
      >
        {/* Corner dots */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
          <div
            key={pos}
            style={{
              position: 'absolute',
              [pos.includes('top') ? 'top' : 'bottom']: '-3px',
              [pos.includes('left') ? 'left' : 'right']: '-3px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--secondary-color, #D4AF37)',
            }}
          />
        ))}

        {/* Day name */}
        <p
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--primary-color, #8B6F4E)',
            margin: '0 0 8px',
          }}
        >
          {formatMalayDate(invitation.event_date).split(',')[0]}
        </p>

        {/* Large date number */}
        <p
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: '64px',
            fontWeight: 700,
            color: 'var(--secondary-color, #D4AF37)',
            lineHeight: 1,
            margin: '0 0 4px',
          }}
        >
          {dayNum}
        </p>

        {/* Month and year */}
        <p
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--text-color, #2C1810)',
            margin: '0 0 20px',
          }}
        >
          {monthName} {year}
        </p>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
            margin: '0 auto 20px',
          }}
        />

        {/* Time */}
        <p
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--text-color, #2C1810)',
            margin: '0 0 6px',
          }}
        >
          {formatTime(invitation.event_time_start)} &mdash; {formatTime(invitation.event_time_end)}
        </p>

        {/* Venue */}
        <p
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-color, #2C1810)',
            margin: '16px 0 8px',
          }}
        >
          {invitation.venue_name}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '12px',
            color: 'var(--primary-color, #8B6F4E)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {invitation.venue_address}
        </p>
      </motion.div>
    </section>
  );
}
