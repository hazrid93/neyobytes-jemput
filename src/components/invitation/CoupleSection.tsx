import { motion } from 'framer-motion';
import type { Invitation } from '../../types';
import { getPhotoFrameStyles } from '../../lib/template-ui';

interface CoupleSectionProps {
  invitation: Invitation;
  templateId: string;
}

export default function CoupleSection({ invitation, templateId }: CoupleSectionProps) {
  const hasPhoto = invitation.couple_photo_url && invitation.couple_photo_url.length > 0;
  const photoFrame = getPhotoFrameStyles(templateId);

  return (
    <section
      style={{
        padding: '40px 24px 60px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Couple photo / placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        style={{
          width: '180px',
          height: '180px',
          margin: '0 auto 32px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...photoFrame.wrapper,
        }}
      >
        {hasPhoto ? (
          <img
            src={invitation.couple_photo_url}
            alt={`${invitation.groom_name} & ${invitation.bride_name}`}
            style={photoFrame.image}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--secondary-color, #D4AF37) 10%, transparent), color-mix(in srgb, var(--primary-color, #8B6F4E) 10%, transparent))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              ...photoFrame.image,
            }}
          >
            {/* Decorative heart/ring placeholder */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ opacity: 0.4 }}
            >
              <path
                d="M24 42s-18-10.2-18-22.2C6 12.6 11.4 6 18 6c3.6 0 6.6 2.4 6 2.4S27.6 6 30 6c6.6 0 12 6.6 12 13.8C42 31.8 24 42 24 42z"
                stroke="var(--secondary-color, #D4AF37)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                fontSize: '9px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--primary-color, #8B6F4E)',
                opacity: 0.5,
              }}
            >
              Foto Pengantin
            </span>
          </div>
        )}
      </motion.div>

      {/* Couple names */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: 'clamp(24px, 7vw, 32px)',
            fontWeight: 600,
            color: 'var(--text-color, #2C1810)',
            margin: '0 0 4px',
            lineHeight: 1.3,
          }}
        >
          {invitation.groom_name}
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            margin: '8px 0',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37))',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontSize: '24px',
              fontStyle: 'italic',
              color: 'var(--secondary-color, #D4AF37)',
            }}
          >
            &amp;
          </span>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, var(--secondary-color, #D4AF37), transparent)',
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: 'clamp(24px, 7vw, 32px)',
            fontWeight: 600,
            color: 'var(--text-color, #2C1810)',
            margin: '4px 0 0',
            lineHeight: 1.3,
          }}
        >
          {invitation.bride_name}
        </h2>
      </motion.div>
    </section>
  );
}
