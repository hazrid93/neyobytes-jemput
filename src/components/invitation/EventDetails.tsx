import { motion } from 'framer-motion';
import type { Invitation } from '../../types';
import TemplateSectionShell from './TemplateSectionShell';
import { getEventDateStyles } from '../../lib/template-ui';
import { getCopy } from '../../lib/invitation-copy';
import EditableCopy from './EditableCopy';

interface EventDetailsProps {
  invitation: Invitation;
  templateId: string;
  styleVariant?: 'classic' | 'plaque' | 'editorial';
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
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

export default function EventDetails({
  invitation,
  templateId,
  styleVariant = 'classic',
  copyOverrides,
  previewEditMode = false,
}: EventDetailsProps) {
  const dateObj = new Date(invitation.event_date + 'T00:00:00');
  const dayNum = dateObj.getDate().toString().padStart(2, '0');
  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
  ];
  const monthName = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const dateStyles = getEventDateStyles(templateId);
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

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
        <EditableCopy
          as="span"
          value={copy('event_details.title', 'Atur Cara Majlis')}
          copyKey="event_details.title"
          editMode={previewEditMode}
        />
      </motion.p>

      {/* Event card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ position: 'relative' }}
      >
        <TemplateSectionShell
          templateId={templateId}
          padding={styleVariant === 'editorial' ? '24px 10px' : '36px 24px'}
          style={styleVariant === 'plaque' ? { borderRadius: '18px', boxShadow: '0 18px 36px color-mix(in srgb, var(--secondary-color, #D4AF37) 14%, transparent)' } : undefined}
        >
          <p
            style={{
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              color: 'var(--primary-color, #8B6F4E)',
              margin: '0 0 8px',
              ...dateStyles.day,
            }}
          >
            {formatMalayDate(invitation.event_date).split(',')[0]}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              color: 'var(--secondary-color, #D4AF37)',
              lineHeight: 1,
              margin: '0 0 4px',
              ...dateStyles.number,
            }}
          >
            {dayNum}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontWeight: 500,
              color: 'var(--text-color, #2C1810)',
              margin: '0 0 20px',
              ...dateStyles.month,
            }}
          >
            {monthName} {year}
          </p>

          {styleVariant === 'editorial' && (
            <p
              style={{
                fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                fontSize: '11px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: 'var(--secondary-color, #D4AF37)',
                margin: '0 0 14px',
              }}
            >
              <EditableCopy
                as="span"
                value={copy('event_details.badge', 'Save The Date')}
                copyKey="event_details.badge"
                editMode={previewEditMode}
              />
            </p>
          )}

          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
              margin: '0 auto 20px',
              ...dateStyles.divider,
            }}
          />

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
        </TemplateSectionShell>
      </motion.div>
    </section>
  );
}
