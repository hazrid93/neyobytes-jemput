import type { CSSProperties } from 'react';

type TemplateMood =
  | 'romantic'
  | 'botanical'
  | 'heritage'
  | 'batik'
  | 'arch'
  | 'minimal'
  | 'vintage'
  | 'marble'
  | 'rustic'
  | 'midnight';

const TEMPLATE_MOODS: Record<string, TemplateMood> = {
  'sakura-pink': 'romantic',
  'tropical-daun': 'botanical',
  'songket-emas': 'heritage',
  'batik-biru': 'batik',
  arabesque: 'arch',
  'putih-moden': 'minimal',
  'dusty-vintage': 'vintage',
  'marmar-mewah': 'marble',
  'rustic-tanah': 'rustic',
  'malam-berkilau': 'midnight',
  'elegant-gold': 'heritage',
  'sage-garden': 'botanical',
  'royal-navy': 'batik',
  'blush-rose': 'romantic',
  'midnight-luxe': 'midnight',
  'batik-heritage': 'batik',
  'lavender-dream': 'vintage',
  'white-minimal': 'minimal',
};

const secondary = 'var(--secondary-color, #D4AF37)';
const primary = 'var(--primary-color, #8B6F4E)';
const accent = 'var(--accent-color, #F5E6D3)';
const bg = 'var(--bg-color, #FDF8F0)';
const text = 'var(--text-color, #2C1810)';

export function getTemplateMood(templateId: string): TemplateMood {
  return TEMPLATE_MOODS[templateId] ?? 'heritage';
}

export function getSectionShellStyles(templateId: string): {
  wrapper: CSSProperties;
  overlay: CSSProperties;
  content: CSSProperties;
} {
  const mood = getTemplateMood(templateId);

  switch (mood) {
    case 'romantic':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '28px',
          border: `1px solid color-mix(in srgb, ${secondary} 24%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 86%, white), color-mix(in srgb, ${accent} 42%, white))`,
          boxShadow: `0 18px 40px color-mix(in srgb, ${secondary} 12%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.45,
          backgroundImage: `radial-gradient(circle at 16% 18%, color-mix(in srgb, ${secondary} 14%, transparent) 0 8px, transparent 9px), radial-gradient(circle at 82% 14%, color-mix(in srgb, ${primary} 10%, transparent) 0 7px, transparent 8px), radial-gradient(circle at 78% 86%, color-mix(in srgb, ${secondary} 12%, transparent) 0 10px, transparent 11px)`,
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'botanical':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: `1px solid color-mix(in srgb, ${primary} 18%, transparent)`,
          background: `linear-gradient(160deg, color-mix(in srgb, ${bg} 88%, white), color-mix(in srgb, ${accent} 55%, white))`,
          boxShadow: `0 18px 36px color-mix(in srgb, ${primary} 10%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.22,
          backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${secondary} 12%, transparent) 20%, transparent 20%), linear-gradient(45deg, color-mix(in srgb, ${secondary} 10%, transparent) 18%, transparent 18%)`,
          backgroundSize: '42px 42px',
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'heritage':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 92%, white), color-mix(in srgb, ${accent} 35%, white))`,
          boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${secondary} 12%, transparent), 0 16px 36px color-mix(in srgb, ${secondary} 10%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.18,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 18px, color-mix(in srgb, ${secondary} 12%, transparent) 18px, color-mix(in srgb, ${secondary} 12%, transparent) 19px), repeating-linear-gradient(90deg, transparent, transparent 18px, color-mix(in srgb, ${secondary} 12%, transparent) 18px, color-mix(in srgb, ${secondary} 12%, transparent) 19px)`,
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'batik':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '10px',
          border: `1px solid color-mix(in srgb, ${secondary} 28%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 88%, white), color-mix(in srgb, ${accent} 48%, white))`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${primary} 14%, transparent), 0 16px 32px color-mix(in srgb, ${primary} 10%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.16,
          backgroundImage: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${secondary} 18%, transparent) 0 5px, transparent 6px), radial-gradient(circle at 0 0, color-mix(in srgb, ${secondary} 12%, transparent) 0 3px, transparent 4px), radial-gradient(circle at 100% 100%, color-mix(in srgb, ${secondary} 12%, transparent) 0 3px, transparent 4px)`,
          backgroundSize: '54px 54px',
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'arch':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '30px 30px 10px 10px',
          border: `1px solid color-mix(in srgb, ${secondary} 26%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 90%, white), color-mix(in srgb, ${accent} 38%, white))`,
          boxShadow: `0 16px 34px color-mix(in srgb, ${secondary} 10%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.16,
          backgroundImage: `linear-gradient(0deg, color-mix(in srgb, ${secondary} 12%, transparent) 1px, transparent 1px), linear-gradient(60deg, color-mix(in srgb, ${secondary} 10%, transparent) 1px, transparent 1px), linear-gradient(-60deg, color-mix(in srgb, ${secondary} 10%, transparent) 1px, transparent 1px)`,
          backgroundSize: '34px 58px',
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'minimal':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0',
          border: `1px solid color-mix(in srgb, ${primary} 12%, transparent)`,
          background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 78%, white)',
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.05,
          backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${primary} 8%, transparent) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'vintage':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '22px',
          border: `1px dashed color-mix(in srgb, ${secondary} 26%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 84%, white), color-mix(in srgb, ${accent} 45%, white))`,
          boxShadow: `0 18px 40px color-mix(in srgb, ${primary} 8%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.14,
          backgroundImage: `repeating-linear-gradient(0deg, color-mix(in srgb, ${secondary} 10%, transparent) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, color-mix(in srgb, ${secondary} 8%, transparent) 0 1px, transparent 1px 16px)`,
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'marble':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '10px',
          border: `1px solid color-mix(in srgb, ${secondary} 20%, transparent)`,
          background: `linear-gradient(145deg, color-mix(in srgb, ${bg} 92%, white), color-mix(in srgb, ${accent} 26%, white), color-mix(in srgb, ${bg} 96%, white))`,
          boxShadow: `0 20px 44px color-mix(in srgb, ${secondary} 8%, transparent)`,
          backdropFilter: 'blur(6px)',
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.1,
          backgroundImage: `linear-gradient(125deg, transparent 42%, color-mix(in srgb, ${secondary} 14%, transparent) 43%, transparent 44%), linear-gradient(225deg, transparent 35%, color-mix(in srgb, ${primary} 8%, transparent) 36%, transparent 37%)`,
          backgroundSize: '220px 220px, 180px 180px',
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'rustic':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          border: `1px dashed color-mix(in srgb, ${secondary} 28%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 80%, white), color-mix(in srgb, ${accent} 60%, white))`,
          boxShadow: `0 16px 34px color-mix(in srgb, ${primary} 9%, transparent)`,
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.12,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, color-mix(in srgb, ${primary} 8%, transparent) 8px, color-mix(in srgb, ${primary} 8%, transparent) 9px), repeating-linear-gradient(-45deg, transparent, transparent 8px, color-mix(in srgb, ${primary} 8%, transparent) 8px, color-mix(in srgb, ${primary} 8%, transparent) 9px)`,
        },
        content: { position: 'relative', zIndex: 1 },
      };

    case 'midnight':
      return {
        wrapper: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '14px',
          border: `1px solid color-mix(in srgb, ${secondary} 24%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 92%, black), color-mix(in srgb, ${accent} 12%, ${bg}))`,
          boxShadow: `0 18px 42px color-mix(in srgb, ${secondary} 12%, transparent)`,
          backdropFilter: 'blur(8px)',
        },
        overlay: {
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.18,
          backgroundImage: `radial-gradient(circle at 18% 18%, color-mix(in srgb, ${secondary} 24%, transparent) 0 1px, transparent 2px), radial-gradient(circle at 82% 26%, color-mix(in srgb, ${secondary} 24%, transparent) 0 1px, transparent 2px), radial-gradient(circle at 40% 70%, color-mix(in srgb, ${secondary} 18%, transparent) 0 1px, transparent 2px), radial-gradient(circle at 72% 84%, color-mix(in srgb, ${secondary} 18%, transparent) 0 1px, transparent 2px)`,
          backgroundSize: '160px 160px',
        },
        content: { position: 'relative', zIndex: 1 },
      };
  }
}

export function getActionButtonStyle(
  templateId: string,
  mode: 'solid' | 'outline' = 'solid'
): CSSProperties {
  const mood = getTemplateMood(templateId);
  const isSolid = mode === 'solid';

  switch (mood) {
    case 'romantic':
      return {
        borderRadius: '999px',
        border: isSolid ? 'none' : `1px solid color-mix(in srgb, ${secondary} 34%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${secondary}, ${primary})`
          : `color-mix(in srgb, ${bg} 88%, white)`,
        color: isSolid ? 'white' : text,
        boxShadow: isSolid ? `0 12px 24px color-mix(in srgb, ${secondary} 18%, transparent)` : 'none',
      };

    case 'botanical':
      return {
        borderRadius: '16px',
        border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${primary}, ${secondary})`
          : `color-mix(in srgb, ${bg} 86%, white)`,
        color: isSolid ? 'white' : text,
      };

    case 'heritage':
    case 'batik':
      return {
        borderRadius: '6px',
        border: `1px solid color-mix(in srgb, ${secondary} 34%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${secondary}, ${primary})`
          : 'transparent',
        color: isSolid ? 'white' : text,
        boxShadow: isSolid ? `inset 0 0 0 1px color-mix(in srgb, ${secondary} 20%, transparent)` : 'none',
      };

    case 'arch':
      return {
        borderRadius: '18px 18px 8px 8px',
        border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${secondary}, ${primary})`
          : `color-mix(in srgb, ${bg} 88%, white)`,
        color: isSolid ? 'white' : text,
      };

    case 'minimal':
      return {
        borderRadius: '0',
        border: `1px solid color-mix(in srgb, ${primary} 18%, transparent)`,
        background: isSolid ? text : 'transparent',
        color: isSolid ? bg : text,
      };

    case 'vintage':
      return {
        borderRadius: '14px',
        border: `1px dashed color-mix(in srgb, ${secondary} 32%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, color-mix(in srgb, ${secondary} 92%, ${primary}), ${primary})`
          : `color-mix(in srgb, ${bg} 82%, white)`,
        color: isSolid ? 'white' : text,
      };

    case 'marble':
      return {
        borderRadius: '8px',
        border: `1px solid color-mix(in srgb, ${secondary} 26%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${secondary}, ${primary})`
          : `linear-gradient(145deg, color-mix(in srgb, ${bg} 94%, white), color-mix(in srgb, ${accent} 30%, white))`,
        color: isSolid ? 'white' : text,
        boxShadow: isSolid ? `0 10px 22px color-mix(in srgb, ${secondary} 16%, transparent)` : 'none',
      };

    case 'rustic':
      return {
        borderRadius: '10px',
        border: `1px dashed color-mix(in srgb, ${secondary} 34%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${primary}, ${secondary})`
          : `color-mix(in srgb, ${bg} 82%, white)`,
        color: isSolid ? 'white' : text,
      };

    case 'midnight':
      return {
        borderRadius: '12px',
        border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
        background: isSolid
          ? `linear-gradient(135deg, ${secondary}, ${primary})`
          : `color-mix(in srgb, ${bg} 88%, black)`,
        color: isSolid ? 'white' : text,
        boxShadow: isSolid ? `0 0 24px color-mix(in srgb, ${secondary} 18%, transparent)` : 'none',
      };
  }
}

export function getFieldStyle(templateId: string): CSSProperties {
  const mood = getTemplateMood(templateId);

  switch (mood) {
    case 'romantic':
      return {
        border: `1px solid color-mix(in srgb, ${secondary} 26%, transparent)`,
        borderRadius: '18px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 70%, white)',
      };
    case 'botanical':
      return {
        border: `1px solid color-mix(in srgb, ${secondary} 28%, transparent)`,
        borderRadius: '14px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 72%, white)',
      };
    case 'heritage':
    case 'batik':
      return {
        border: `1px solid color-mix(in srgb, ${secondary} 32%, transparent)`,
        borderRadius: '6px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 74%, white)',
      };
    case 'arch':
      return {
        border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
        borderRadius: '16px 16px 8px 8px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 72%, white)',
      };
    case 'minimal':
      return {
        border: `1px solid color-mix(in srgb, ${primary} 16%, transparent)`,
        borderRadius: '0',
        background: 'white',
      };
    case 'vintage':
      return {
        border: `1px dashed color-mix(in srgb, ${secondary} 28%, transparent)`,
        borderRadius: '12px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 70%, white)',
      };
    case 'marble':
      return {
        border: `1px solid color-mix(in srgb, ${secondary} 22%, transparent)`,
        borderRadius: '8px',
        background: 'linear-gradient(145deg, color-mix(in srgb, var(--bg-color, #FDF8F0) 94%, white), color-mix(in srgb, var(--accent-color, #F5E6D3) 24%, white))',
      };
    case 'rustic':
      return {
        border: `1px dashed color-mix(in srgb, ${secondary} 30%, transparent)`,
        borderRadius: '10px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 68%, white)',
      };
    case 'midnight':
      return {
        border: `1px solid color-mix(in srgb, ${secondary} 24%, transparent)`,
        borderRadius: '12px',
        background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 84%, black)',
      };
  }
}

export function getPhotoFrameStyles(templateId: string): {
  wrapper: CSSProperties;
  image: CSSProperties;
} {
  const mood = getTemplateMood(templateId);

  switch (mood) {
    case 'romantic':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '42% 42% 24px 24px / 38% 38% 24px 24px',
          border: `1px solid color-mix(in srgb, ${secondary} 36%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 78%, white), color-mix(in srgb, ${accent} 58%, white))`,
          boxShadow: `0 14px 28px color-mix(in srgb, ${secondary} 14%, transparent)`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '42% 42% 22px 22px / 38% 38% 22px 22px',
          objectFit: 'cover',
        },
      };

    case 'botanical':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '28px',
          border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
          background: `linear-gradient(160deg, color-mix(in srgb, ${bg} 78%, white), color-mix(in srgb, ${accent} 55%, white))`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          objectFit: 'cover',
        },
      };

    case 'heritage':
      return {
        wrapper: {
          padding: '12px',
          borderRadius: '50%',
          border: `2px solid color-mix(in srgb, ${secondary} 44%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${secondary} 26%, transparent), 0 16px 30px color-mix(in srgb, ${secondary} 10%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 78%, white), color-mix(in srgb, ${accent} 42%, white))`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
        },
      };

    case 'batik':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '14px',
          border: `1px solid color-mix(in srgb, ${secondary} 36%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${primary} 20%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 82%, white), color-mix(in srgb, ${accent} 46%, white))`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          objectFit: 'cover',
        },
      };

    case 'arch':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '40% 40% 16px 16px / 22% 22% 16px 16px',
          border: `1px solid color-mix(in srgb, ${secondary} 36%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 78%, white), color-mix(in srgb, ${accent} 45%, white))`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '40% 40% 12px 12px / 22% 22% 12px 12px',
          objectFit: 'cover',
        },
      };

    case 'minimal':
      return {
        wrapper: {
          padding: '8px',
          borderRadius: '0',
          border: `1px solid color-mix(in srgb, ${primary} 12%, transparent)`,
          background: 'white',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '0',
          objectFit: 'cover',
        },
      };

    case 'vintage':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '6px',
          border: `1px dashed color-mix(in srgb, ${secondary} 26%, transparent)`,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95), color-mix(in srgb, var(--accent-color, #F5E6D3) 38%, white))',
          boxShadow: `0 14px 30px color-mix(in srgb, ${primary} 10%, transparent)`,
          transform: 'rotate(-1.5deg)',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '2px',
          objectFit: 'cover',
        },
      };

    case 'marble':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '18px',
          border: `1px solid color-mix(in srgb, ${secondary} 24%, transparent)`,
          background: `linear-gradient(145deg, color-mix(in srgb, ${bg} 95%, white), color-mix(in srgb, ${accent} 20%, white))`,
          boxShadow: `0 16px 34px color-mix(in srgb, ${secondary} 10%, transparent)`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '14px',
          objectFit: 'cover',
        },
      };

    case 'rustic':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '8px',
          border: `1px dashed color-mix(in srgb, ${secondary} 28%, transparent)`,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98), color-mix(in srgb, var(--accent-color, #F5E6D3) 38%, white))',
          boxShadow: `0 14px 28px color-mix(in srgb, ${primary} 10%, transparent)`,
          transform: 'rotate(1deg)',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          objectFit: 'cover',
        },
      };

    case 'midnight':
      return {
        wrapper: {
          padding: '10px',
          borderRadius: '18px',
          border: `1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
          background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 88%, black), color-mix(in srgb, ${accent} 12%, ${bg}))`,
          boxShadow: `0 0 28px color-mix(in srgb, ${secondary} 14%, transparent)`,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: '14px',
          objectFit: 'cover',
        },
      };
  }
}

export function getEventDateStyles(templateId: string): {
  day: CSSProperties;
  number: CSSProperties;
  month: CSSProperties;
  divider: CSSProperties;
} {
  const mood = getTemplateMood(templateId);

  switch (mood) {
    case 'minimal':
      return {
        day: { letterSpacing: '5px', fontSize: '10px', textTransform: 'uppercase' },
        number: { fontSize: '72px', fontWeight: 500, fontFamily: 'var(--font-display, "Playfair Display"), serif' },
        month: { letterSpacing: '2px', textTransform: 'uppercase' },
        divider: { width: '100px' },
      };
    case 'heritage':
    case 'batik':
      return {
        day: { letterSpacing: '4px', fontSize: '11px', textTransform: 'uppercase' },
        number: { fontSize: '68px', fontWeight: 700, textShadow: '0 3px 16px color-mix(in srgb, var(--secondary-color, #D4AF37) 14%, transparent)' },
        month: { fontSize: '19px', letterSpacing: '1px' },
        divider: { width: '72px' },
      };
    case 'arch':
      return {
        day: { letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase' },
        number: { fontSize: '66px', fontWeight: 600 },
        month: { fontSize: '18px', fontStyle: 'italic' },
        divider: { width: '70px' },
      };
    case 'midnight':
      return {
        day: { letterSpacing: '4px', fontSize: '10px', textTransform: 'uppercase' },
        number: { fontSize: '68px', fontWeight: 700, textShadow: '0 0 24px color-mix(in srgb, var(--secondary-color, #D4AF37) 26%, transparent)' },
        month: { fontSize: '18px', letterSpacing: '1px' },
        divider: { width: '76px' },
      };
    default:
      return {
        day: { letterSpacing: '3px', fontSize: '11px', textTransform: 'uppercase' },
        number: { fontSize: '64px', fontWeight: 700 },
        month: { fontSize: '18px' },
        divider: { width: '60px' },
      };
  }
}

export function getCountdownUnitStyle(templateId: string, index: number): CSSProperties {
  const mood = getTemplateMood(templateId);

  switch (mood) {
    case 'romantic':
      return {
        borderRadius: '22px',
        background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 84%, white), color-mix(in srgb, ${accent} 44%, white))`,
        boxShadow: `0 12px 24px color-mix(in srgb, ${secondary} 10%, transparent)`,
      };
    case 'botanical':
      return {
        borderRadius: '18px',
        background: `linear-gradient(160deg, color-mix(in srgb, ${bg} 82%, white), color-mix(in srgb, ${accent} 50%, white))`,
      };
    case 'heritage':
    case 'batik':
      return {
        borderRadius: '6px',
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${secondary} 12%, transparent)`,
      };
    case 'arch':
      return {
        borderRadius: '18px 18px 8px 8px',
        background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 82%, white), color-mix(in srgb, ${accent} 38%, white))`,
      };
    case 'minimal':
      return {
        borderRadius: '0',
        background: 'white',
      };
    case 'vintage':
      return {
        borderRadius: '14px',
        background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 82%, white), color-mix(in srgb, ${accent} 42%, white))`,
      };
    case 'marble':
      return {
        borderRadius: '10px',
        background: `linear-gradient(145deg, color-mix(in srgb, ${bg} 94%, white), color-mix(in srgb, ${accent} 20%, white))`,
        boxShadow: `0 10px 20px color-mix(in srgb, ${secondary} 8%, transparent)`,
      };
    case 'rustic':
      return {
        borderRadius: '10px',
        background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 80%, white), color-mix(in srgb, ${accent} 50%, white))`,
        transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)',
      };
    case 'midnight':
      return {
        borderRadius: '12px',
        background: `linear-gradient(180deg, color-mix(in srgb, ${bg} 88%, black), color-mix(in srgb, ${accent} 14%, ${bg}))`,
        boxShadow: `0 0 20px color-mix(in srgb, ${secondary} 10%, transparent)`,
      };
  }
}

export function getGalleryFrameStyle(templateId: string, index: number): CSSProperties {
  const mood = getTemplateMood(templateId);

  switch (mood) {
    case 'romantic':
      return {
        borderRadius: '24px',
        boxShadow: `0 14px 28px color-mix(in srgb, ${secondary} 10%, transparent)`,
      };
    case 'botanical':
      return {
        borderRadius: '20px',
      };
    case 'heritage':
    case 'batik':
      return {
        borderRadius: '6px',
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${secondary} 14%, transparent)`,
      };
    case 'arch':
      return {
        borderRadius: '26px 26px 10px 10px',
      };
    case 'minimal':
      return {
        borderRadius: '0',
      };
    case 'vintage':
      return {
        borderRadius: '4px',
        padding: '8px',
        background: 'rgba(255,255,255,0.92)',
        transform: index % 2 === 0 ? 'rotate(-1.2deg)' : 'rotate(1.2deg)',
      };
    case 'marble':
      return {
        borderRadius: '12px',
        boxShadow: `0 14px 28px color-mix(in srgb, ${secondary} 8%, transparent)`,
      };
    case 'rustic':
      return {
        borderRadius: '6px',
        padding: '8px',
        background: 'rgba(255,255,255,0.96)',
        transform: index % 3 === 0 ? 'rotate(-1.5deg)' : 'rotate(1deg)',
      };
    case 'midnight':
      return {
        borderRadius: '14px',
        boxShadow: `0 0 24px color-mix(in srgb, ${secondary} 10%, transparent)`,
      };
  }
}
