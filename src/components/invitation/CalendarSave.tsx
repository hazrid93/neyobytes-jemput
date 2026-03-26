import { motion } from 'framer-motion';
import type { Invitation } from '../../types';

interface CalendarSaveProps {
  invitation: Invitation;
}

function formatDateForGoogle(date: string, time: string): string {
  // Format: YYYYMMDDTHHMMSS
  const d = date.replace(/-/g, '');
  const t = time.replace(/:/g, '') + '00';
  return `${d}T${t}`;
}

function generateGoogleCalendarUrl(invitation: Invitation): string {
  const start = formatDateForGoogle(invitation.event_date, invitation.event_time_start);
  const end = formatDateForGoogle(invitation.event_date, invitation.event_time_end);
  const title = encodeURIComponent(`Majlis Perkahwinan ${invitation.groom_name} & ${invitation.bride_name}`);
  const location = encodeURIComponent(`${invitation.venue_name}, ${invitation.venue_address}`);
  const details = encodeURIComponent(invitation.invitation_text);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}&details=${details}`;
}

function generateICSContent(invitation: Invitation): string {
  const start = formatDateForGoogle(invitation.event_date, invitation.event_time_start);
  const end = formatDateForGoogle(invitation.event_date, invitation.event_time_end);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jemput//Kad Kahwin Digital//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `DTSTAMP:${now}`,
    `SUMMARY:Majlis Perkahwinan ${invitation.groom_name} & ${invitation.bride_name}`,
    `LOCATION:${invitation.venue_name}\\, ${invitation.venue_address}`,
    `DESCRIPTION:${invitation.invitation_text}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICS(invitation: Invitation): void {
  const content = generateICSContent(invitation);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `majlis-${invitation.slug}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CalendarSave({ invitation }: CalendarSaveProps) {
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
        Peringatan
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
          marginBottom: '8px',
        }}
      >
        Save the Date
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '12px',
          color: 'var(--primary-color, #8B6F4E)',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}
      >
        Simpan tarikh ini dalam kalendar anda supaya tidak terlepas
      </motion.p>

      {/* Calendar buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Google Calendar */}
        <a
          href={generateGoogleCalendarUrl(invitation)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 24px',
            border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
            color: 'var(--text-color, #2C1810)',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '1px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color, #D4AF37)" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Google Calendar
        </a>

        {/* Apple Calendar / ICS */}
        <button
          onClick={() => downloadICS(invitation)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 24px',
            border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.3)',
            color: 'var(--text-color, #2C1810)',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color, #D4AF37)" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Apple Calendar (.ics)
        </button>
      </motion.div>
    </section>
  );
}
