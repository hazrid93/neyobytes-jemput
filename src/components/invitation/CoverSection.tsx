import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getTemplateVisuals, buildThemeVars } from '../../lib/template-styles';
import { getCopy } from '../../lib/invitation-copy';
import type { Invitation } from '../../types';
import EditableCopy from './EditableCopy';

interface CoverSectionProps {
  invitation: Invitation;
  guestName?: string;
  onOpen: () => void;
  templateId: string;
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
  const day = days[date.getDay()];
  const d = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${d} ${month} ${year}`;
}

// ---------------------------------------------------------------------------
// Cover frame renderer — different visual frames per template
// ---------------------------------------------------------------------------
function CoverFrame({ frameType, color }: { frameType: string; color: string }) {
  switch (frameType) {
    case 'double-border':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '16px',
              border: `1px solid ${color}`,
              borderRadius: '2px',
              pointerEvents: 'none',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '22px',
              border: `1px solid ${color}`,
              borderRadius: '2px',
              pointerEvents: 'none',
              opacity: 0.2,
            }}
          />
        </>
      );

    case 'arch-top':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              bottom: '16px',
              border: `1px solid ${color}`,
              borderRadius: '50% 50% 2px 2px / 20% 20% 2px 2px',
              pointerEvents: 'none',
              opacity: 0.35,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '22px',
              left: '22px',
              right: '22px',
              bottom: '22px',
              border: `1px solid ${color}`,
              borderRadius: '50% 50% 2px 2px / 18% 18% 2px 2px',
              pointerEvents: 'none',
              opacity: 0.15,
            }}
          />
        </>
      );

    case 'thin-line':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            border: `1px solid ${color}`,
            borderRadius: '0',
            pointerEvents: 'none',
            opacity: 0.25,
          }}
        />
      );

    case 'deco-corners':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '16px',
              border: `1px solid ${color}`,
              borderRadius: '0',
              pointerEvents: 'none',
              opacity: 0.3,
            }}
          />
          {/* Art deco corner squares */}
          {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => {
            const isTop = corner.includes('top');
            const isLeft = corner.includes('Left');
            return (
              <div
                key={corner}
                style={{
                  position: 'absolute',
                  [isTop ? 'top' : 'bottom']: '12px',
                  [isLeft ? 'left' : 'right']: '12px',
                  width: '16px',
                  height: '16px',
                  border: `2px solid ${color}`,
                  pointerEvents: 'none',
                  opacity: 0.5,
                }}
              />
            );
          })}
        </>
      );

    case 'botanical-frame':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '18px',
              border: `1px solid ${color}`,
              borderRadius: '8px',
              pointerEvents: 'none',
              opacity: 0.3,
            }}
          />
        </>
      );

    case 'geometric-frame':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '16px',
              border: `1.5px solid ${color}`,
              borderRadius: '0',
              pointerEvents: 'none',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '24px',
              border: `0.5px solid ${color}`,
              borderRadius: '0',
              pointerEvents: 'none',
              opacity: 0.15,
            }}
          />
        </>
      );

    case 'ornate-frame':
      return (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '14px',
              border: `2px solid ${color}`,
              borderRadius: '2px',
              pointerEvents: 'none',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '20px',
              border: `1px solid ${color}`,
              borderRadius: '2px',
              pointerEvents: 'none',
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '26px',
              border: `0.5px solid ${color}`,
              borderRadius: '2px',
              pointerEvents: 'none',
              opacity: 0.1,
            }}
          />
        </>
      );

    default: // 'none'
      return null;
  }
}

// ---------------------------------------------------------------------------
// Corner ornaments rendered from template SVG
// ---------------------------------------------------------------------------
function CornerOrnaments({ svgFn, color }: { svgFn: (c: string) => string; color: string }) {
  const svgString = svgFn(color);
  const corners = [
    { top: '24px', left: '24px', transform: 'none' },
    { top: '24px', right: '24px', transform: 'scaleX(-1)' },
    { bottom: '24px', left: '24px', transform: 'scaleY(-1)' },
    { bottom: '24px', right: '24px', transform: 'scale(-1, -1)' },
  ];

  return (
    <>
      {corners.map((pos, i) => (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: svgString }}
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            pointerEvents: 'none',
            ...pos,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

export default function CoverSection({
  invitation,
  guestName,
  onOpen,
  templateId,
  copyOverrides,
  previewEditMode = false,
}: CoverSectionProps) {
  const groomFirst = invitation.groom_name.split(' ')[0];
  const brideFirst = invitation.bride_name.split(' ')[0];

  const visuals = useMemo(() => getTemplateVisuals(templateId), [templateId]);
  const themeVars = useMemo(() => buildThemeVars(invitation.theme_config), [invitation.theme_config]);

  const coverBgStyle = visuals.coverBackground(themeVars);
  const coverPatternStyle = visuals.coverPattern(themeVars);
  const buttonOverrides = visuals.buttonStyle(themeVars);
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

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
        ...coverBgStyle,
      }}
    >
      {/* Template-specific pattern overlay */}
      <div style={coverPatternStyle} />

      {/* Template-specific frame */}
      <CoverFrame frameType={visuals.coverFrame} color={themeVars.secondary} />

      {/* Template-specific corner ornaments */}
      <CornerOrnaments svgFn={visuals.cornerSvg} color={themeVars.secondary} />

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
        {/* Top ornament — template-specific characters */}
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
          {visuals.coverTopOrnament}
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
          <EditableCopy
            as="span"
            value={copy('cover.bismillah_arabic', 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ')}
            copyKey="cover.bismillah_arabic"
            editMode={previewEditMode}
          />
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
          <EditableCopy
            as="span"
            value={copy('cover.bismillah_translation', 'Dengan Nama Allah Yang Maha Pemurah Lagi Maha Penyayang')}
            copyKey="cover.bismillah_translation"
            editMode={previewEditMode}
          />
        </motion.p>

        {/* Thin divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            width: '120px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${themeVars.secondary}, transparent)`,
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
          <EditableCopy
            as="span"
            value={copy('cover.heading_label', 'Walimatul Urus')}
            copyKey="cover.heading_label"
            editMode={previewEditMode}
          />
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

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          style={{
            width: '80px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${themeVars.secondary}, transparent)`,
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
              borderTop: `1px solid var(--border-color, ${themeVars.secondary})`,
              borderBottom: `1px solid var(--border-color, ${themeVars.secondary})`,
              opacity: 0.6,
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
              <EditableCopy
                as="span"
                value={copy('cover.guest_label', 'Kepada')}
                copyKey="cover.guest_label"
                editMode={previewEditMode}
              />
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

        {/* Open button — template-styled */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(event) => {
            if ((event.target as HTMLElement).isContentEditable) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            onOpen();
          }}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--bg-color, #FDF8F0)',
            background: `linear-gradient(135deg, ${themeVars.secondary}, ${themeVars.primary})`,
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite',
            border: 'none',
            padding: '14px 40px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            ...buttonOverrides,
          }}
        >
          <EditableCopy
            as="span"
            value={copy('cover.open_button', 'Buka Jemputan')}
            copyKey="cover.open_button"
            editMode={previewEditMode}
          />
        </motion.button>

        {/* Bottom ornament — template-specific characters */}
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
          {visuals.coverBottomOrnament}
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
