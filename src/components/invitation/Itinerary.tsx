import { motion } from 'framer-motion';
import type { ItineraryItem } from '../../types';

interface ItineraryProps {
  items: ItineraryItem[];
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${period}`;
}

function getIcon(icon?: string): string {
  const icons: Record<string, string> = {
    clock: '\u23F0',
    users: '\u{1F465}',
    heart: '\u2665',
    crown: '\u{1F451}',
    utensils: '\u{1F374}',
    camera: '\u{1F4F7}',
    check: '\u2713',
    music: '\u266B',
    ring: '\u{1F48D}',
    gift: '\u{1F381}',
  };
  return icon && icons[icon] ? icons[icon] : '\u25C7';
}

export default function Itinerary({ items }: ItineraryProps) {
  if (!items || items.length === 0) return null;

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: index * 0.1 },
    }),
  };

  const lineVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: (index: number) => ({
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.45, delay: index * 0.1 + 0.15 },
    }),
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, delay: index * 0.1 + 0.1 },
    }),
  };

  return (
    <section
      style={{
        padding: '60px 24px',
        maxWidth: '480px',
        margin: '0 auto',
        textAlign: 'center',
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
        Atur Cara
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
          marginBottom: '36px',
        }}
      >
        Tentatif Majlis
      </motion.h3>

      {/* Timeline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          textAlign: 'left',
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true, margin: '-30px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 32px 1fr',
              alignItems: 'center',
              minHeight: '60px',
              position: 'relative',
            }}
          >
            {/* Time */}
            <div
              style={{
                textAlign: 'right',
                paddingRight: '12px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--primary-color, #8B6F4E)',
                  margin: 0,
                }}
              >
                {formatTime(item.time)}
              </p>
            </div>

            {/* Timeline dot and line */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                height: '100%',
                minHeight: '60px',
              }}
            >
              {/* Vertical line */}
              {index < items.length - 1 && (
                <motion.div
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true, margin: '-30px' }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    bottom: '-50%',
                    width: '1px',
                    background: 'linear-gradient(180deg, var(--secondary-color, #D4AF37), color-mix(in srgb, var(--secondary-color, #D4AF37) 20%, transparent))',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transformOrigin: 'top center',
                  }}
                />
              )}
              {/* Top line segment for non-first items */}
              {index > 0 && (
                <motion.div
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true, margin: '-30px' }}
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    bottom: '50%',
                    width: '1px',
                    background: 'linear-gradient(180deg, color-mix(in srgb, var(--secondary-color, #D4AF37) 20%, transparent), var(--secondary-color, #D4AF37))',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transformOrigin: 'bottom center',
                  }}
                />
              )}
              {/* Dot */}
              <motion.div
                variants={dotVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, margin: '-30px' }}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--secondary-color, #D4AF37)',
                  position: 'relative',
                  zIndex: 1,
                  flexShrink: 0,
                  boxShadow: '0 0 0 3px color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)',
                }}
              />
            </div>

            {/* Event name */}
            <div style={{ paddingLeft: '12px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--text-color, #2C1810)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '14px', opacity: 0.7 }}>
                  {getIcon(item.icon)}
                </span>
                {item.event}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
