import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCountdownUnitStyle } from '../../lib/template-ui';
import { getCopy } from '../../lib/invitation-copy';
import EditableCopy from './EditableCopy';

interface CountdownTimerProps {
  eventDate: string;
  eventTime: string;
  templateId: string;
  styleVariant?: 'cards' | 'pill' | 'minimal';
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(eventDate: string, eventTime: string): TimeLeft {
  const target = new Date(`${eventDate}T${eventTime}:00`).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const units: { key: keyof TimeLeft; label: string; copyKey: string }[] = [
  { key: 'days', label: 'Hari', copyKey: 'countdown.unit_days' },
  { key: 'hours', label: 'Jam', copyKey: 'countdown.unit_hours' },
  { key: 'minutes', label: 'Minit', copyKey: 'countdown.unit_minutes' },
  { key: 'seconds', label: 'Saat', copyKey: 'countdown.unit_seconds' },
];

export default function CountdownTimer({
  eventDate,
  eventTime,
  templateId,
  styleVariant = 'cards',
  copyOverrides,
  previewEditMode = false,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(eventDate, eventTime)
  );
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate, eventTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <section
      style={{
        padding: '48px 24px',
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
        <EditableCopy
          as="span"
          value={copy('countdown.eyebrow', 'Menghitung Hari')}
          copyKey="countdown.eyebrow"
          editMode={previewEditMode}
        />
      </motion.p>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-display, "Playfair Display"), serif',
          fontSize: '20px',
          fontWeight: 500,
          color: 'var(--text-color, #2C1810)',
          marginBottom: '28px',
        }}
      >
        <EditableCopy
          as="span"
          value={copy(
            isExpired ? 'countdown.title_expired' : 'countdown.title_active',
            isExpired ? 'Hari Bahagia Telah Tiba!' : 'Menuju Hari Bahagia'
          )}
          copyKey={isExpired ? 'countdown.title_expired' : 'countdown.title_active'}
          editMode={previewEditMode}
        />
      </motion.h3>

      {/* Countdown boxes */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        {units.map(({ key, label, copyKey }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            style={{
              flex: '0 0 auto',
              minWidth: '68px',
              padding: '16px 8px',
              border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
              background: 'rgba(255,255,255,0.4)',
              position: 'relative',
              ...getCountdownUnitStyle(templateId, index),
              ...(styleVariant === 'pill'
                ? { borderRadius: '999px' }
                : styleVariant === 'minimal'
                  ? {
                      borderRadius: '0',
                      background: 'transparent',
                      boxShadow: 'none',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderBottom: '2px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 35%, transparent)',
                    }
                  : {}),
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display, "Playfair Display"), serif',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--secondary-color, #D4AF37)',
                margin: '0 0 4px',
                lineHeight: 1,
              }}
            >
              {String(timeLeft[key]).padStart(2, '0')}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                fontSize: '9px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--primary-color, #8B6F4E)',
                margin: 0,
              }}
            >
              <EditableCopy
                as="span"
                value={copy(copyKey, label)}
                copyKey={copyKey}
                editMode={previewEditMode}
              />
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
