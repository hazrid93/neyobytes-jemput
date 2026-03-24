import { motion } from 'framer-motion';
import type { Invitation } from '../../types';

interface CoverSectionProps {
  invitation: Invitation;
  guestName?: string;
  onOpen: () => void;
}

function formatMalayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
  ];
  const day = days[date.getDay()];
  const d = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${d} ${month} ${year}`;
}

export default function CoverSection({ invitation, guestName, onOpen }: CoverSectionProps) {
  const groomFirst = invitation.groom_name.split(' ')[0];
  const brideFirst = invitation.bride_name.split(' ')[0];

  return (
    <section
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 80%, rgba(139,111,78,0.05) 0%, transparent 50%),
          var(--bg-color, #FDF8F0)
        `,
      }}
    >
      {/* Geometric pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(30deg, var(--secondary-color, #D4AF37) 12%, transparent 12.5%, transparent 87%, var(--secondary-color, #D4AF37) 87.5%, var(--secondary-color, #D4AF37)),
            linear-gradient(150deg, var(--secondary-color, #D4AF37) 12%, transparent 12.5%, transparent 87%, var(--secondary-color, #D4AF37) 87.5%, var(--secondary-color, #D4AF37)),
            linear-gradient(30deg, var(--secondary-color, #D4AF37) 12%, transparent 12.5%, transparent 87%, var(--secondary-color, #D4AF37) 87.5%, var(--secondary-color, #D4AF37)),
            linear-gradient(150deg, var(--secondary-color, #D4AF37) 12%, transparent 12.5%, transparent 87%, var(--secondary-color, #D4AF37) 87.5%, var(--secondary-color, #D4AF37)),
            linear-gradient(60deg, rgba(139,111,78,0.5) 25%, transparent 25.5%, transparent 75%, rgba(139,111,78,0.5) 75%, rgba(139,111,78,0.5)),
            linear-gradient(60deg, rgba(139,111,78,0.5) 25%, transparent 25.5%, transparent 75%, rgba(139,111,78,0.5) 75%, rgba(139,111,78,0.5))
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
          pointerEvents: 'none',
        }}
      />

      {/* Ornamental gold border frame */}
      <div
        style={{
          position: 'absolute',
          inset: '16px',
          border: '1px solid var(--secondary-color, #D4AF37)',
          borderRadius: '2px',
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '22px',
          border: '1px solid var(--secondary-color, #D4AF37)',
          borderRadius: '2px',
          pointerEvents: 'none',
          opacity: 0.2,
        }}
      />

      {/* Corner ornaments */}
      {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => {
        const isTop = corner.includes('top');
        const isLeft = corner.includes('Left');
        return (
          <div
            key={corner}
            style={{
              position: 'absolute',
              [isTop ? 'top' : 'bottom']: '30px',
              [isLeft ? 'left' : 'right']: '30px',
              width: '40px',
              height: '40px',
              borderTop: isTop ? '2px solid var(--secondary-color, #D4AF37)' : 'none',
              borderBottom: !isTop ? '2px solid var(--secondary-color, #D4AF37)' : 'none',
              borderLeft: isLeft ? '2px solid var(--secondary-color, #D4AF37)' : 'none',
              borderRight: !isLeft ? '2px solid var(--secondary-color, #D4AF37)' : 'none',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 24px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          maxWidth: '480px',
        }}
      >
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            color: 'var(--secondary-color, #D4AF37)',
            fontSize: '28px',
            marginBottom: '8px',
            letterSpacing: '8px',
          }}
        >
          &#10022; &#10022; &#10022;
        </motion.div>

        {/* Bismillah */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-arabic, "Amiri"), serif',
            fontSize: '22px',
            color: 'var(--secondary-color, #D4AF37)',
            margin: '16px 0 8px',
            lineHeight: 1.8,
            direction: 'rtl',
          }}
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '10px',
            color: 'var(--primary-color, #8B6F4E)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          Dengan Nama Allah Yang Maha Pemurah Lagi Maha Penyayang
        </motion.p>

        {/* Thin gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            width: '120px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
            marginBottom: '28px',
          }}
        />

        {/* "Walimatul Urus" heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--primary-color, #8B6F4E)',
            marginBottom: '12px',
          }}
        >
          Walimatul Urus
        </motion.p>

        {/* Couple names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: 600,
            color: 'var(--text-color, #2C1810)',
            lineHeight: 1.2,
            margin: '0 0 4px',
          }}
        >
          {groomFirst}
        </motion.h1>

        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: '28px',
            fontStyle: 'italic',
            color: 'var(--secondary-color, #D4AF37)',
            display: 'block',
            margin: '4px 0',
          }}
        >
          &amp;
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: 600,
            color: 'var(--text-color, #2C1810)',
            lineHeight: 1.2,
            margin: '0 0 20px',
          }}
        >
          {brideFirst}
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
            marginBottom: '20px',
          }}
        />

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--primary-color, #8B6F4E)',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}
        >
          {formatMalayDate(invitation.event_date)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '12px',
            color: 'var(--primary-color, #8B6F4E)',
            marginBottom: '32px',
            opacity: 0.8,
          }}
        >
          {invitation.venue_name}
        </motion.p>

        {/* Guest name */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            style={{
              marginBottom: '28px',
              padding: '12px 24px',
              borderTop: '1px solid rgba(212,175,55,0.3)',
              borderBottom: '1px solid rgba(212,175,55,0.3)',
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
              Kepada
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display, "Playfair Display"), serif',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text-color, #2C1810)',
              }}
            >
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Open button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--bg-color, #FDF8F0)',
            background: 'linear-gradient(135deg, var(--secondary-color, #D4AF37), #C5A028, var(--secondary-color, #D4AF37))',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '2px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          Buka Jemputan
        </motion.button>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
          style={{
            color: 'var(--secondary-color, #D4AF37)',
            fontSize: '18px',
            marginTop: '32px',
            letterSpacing: '12px',
            opacity: 0.5,
          }}
        >
          &#9674; &#9674; &#9674;
        </motion.div>
      </div>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
