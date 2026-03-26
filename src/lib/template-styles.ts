// ============================================================================
// Template Visual Engine
// Maps each template ID to its unique CSS patterns, SVG ornaments, dividers,
// cover frames, and section borders. All pure CSS + inline SVG — no images.
// ============================================================================

import type { CSSProperties } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface TemplateVisuals {
  /** Extra CSS layers applied to the .invitation-page wrapper */
  pageBackground: (vars: ThemeVars) => CSSProperties;
  /** Background + overlay for the cover section */
  coverBackground: (vars: ThemeVars) => CSSProperties;
  /** CSS for the cover overlay pattern (positioned absolute) */
  coverPattern: (vars: ThemeVars) => CSSProperties;
  /** Cover frame style — border + corner approach */
  coverFrame: 'double-border' | 'arch-top' | 'thin-line' | 'deco-corners' | 'botanical-frame' | 'geometric-frame' | 'ornate-frame' | 'none';
  /** SVG string for corner ornaments (top-left; will be mirrored for others) */
  cornerSvg: (color: string) => string;
  /** Cover top ornament characters/symbols */
  coverTopOrnament: string;
  /** Cover bottom ornament characters/symbols */
  coverBottomOrnament: string;
  /** Section divider approach */
  dividerSvg: (color: string) => string;
  /** Section card border style */
  sectionBorder: (vars: ThemeVars) => CSSProperties;
  /** Open button style overrides */
  buttonStyle: (vars: ThemeVars) => CSSProperties;
}

interface ThemeVars {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
}

// ---------------------------------------------------------------------------
// Helper: hex to rgba
// ---------------------------------------------------------------------------
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ============================================================================
// 1. SAKURA PINK — Soft floral petals
// ============================================================================
const sakuraPink: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 20% 20%, ${hexToRgba(v.secondary, 0.06)} 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, ${hexToRgba(v.primary, 0.04)} 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, ${hexToRgba(v.accent, 0.08)} 0%, transparent 70%),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 30% 20%, ${hexToRgba(v.secondary, 0.12)} 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, ${hexToRgba(v.primary, 0.08)} 0%, transparent 50%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.04,
    backgroundImage: `
      radial-gradient(circle at 25% 25%, ${v.secondary} 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, ${v.secondary} 1.5px, transparent 1.5px),
      radial-gradient(circle at 50% 10%, ${v.primary} 1px, transparent 1px),
      radial-gradient(circle at 15% 85%, ${v.primary} 1.5px, transparent 1.5px)
    `,
    backgroundSize: '120px 120px, 80px 80px, 60px 60px, 100px 100px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'double-border',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M5 55 C5 30 5 20 15 10 C20 5 30 5 55 5" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/><path d="M10 55 C10 35 10 25 18 17 C22 13 35 10 55 10" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.3"/><circle cx="8" cy="8" r="2" fill="${c}" opacity="0.4"/></svg>`,
  coverTopOrnament: '\u2740 \u2740 \u2740',
  coverBottomOrnament: '\u2740 \u2740 \u2740',
  dividerSvg: (c) => `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><path d="M20 10 Q40 2 60 10 Q80 18 100 10 Q120 2 140 10 Q160 18 180 10" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.4"/><circle cx="100" cy="10" r="3" fill="${c}" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.2)}`,
    borderRadius: '12px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '24px',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
  }),
};

// ============================================================================
// 2. TROPICAL DAUN — Botanical leaves
// ============================================================================
const tropicalDaun: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      linear-gradient(180deg, ${hexToRgba(v.secondary, 0.03)} 0%, transparent 30%),
      linear-gradient(0deg, ${hexToRgba(v.secondary, 0.03)} 0%, transparent 30%),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 0%, ${hexToRgba(v.secondary, 0.1)} 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, ${hexToRgba(v.secondary, 0.1)} 0%, transparent 50%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.035,
    backgroundImage: `
      linear-gradient(45deg, ${v.secondary} 25%, transparent 25%),
      linear-gradient(-45deg, ${v.secondary} 25%, transparent 25%),
      linear-gradient(135deg, ${v.secondary} 25%, transparent 25%),
      linear-gradient(-135deg, ${v.secondary} 25%, transparent 25%)
    `,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 0, 20px -20px, 0 20px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'botanical-frame',
  cornerSvg: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M5 75 Q5 40 20 25 Q35 10 75 5" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4"/><path d="M15 70 C15 50 20 35 35 25 C42 20 55 18 70 15" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.25"/><ellipse cx="12" cy="12" rx="4" ry="7" transform="rotate(-45 12 12)" fill="${c}" opacity="0.15"/><ellipse cx="20" cy="8" rx="3" ry="6" transform="rotate(-30 20 8)" fill="${c}" opacity="0.1"/></svg>`,
  coverTopOrnament: '\u2618',
  coverBottomOrnament: '\u2618 \u2618 \u2618',
  dividerSvg: (c) => `<svg viewBox="0 0 200 24" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="12" x2="85" y2="12" stroke="${c}" stroke-width="0.5" opacity="0.3"/><ellipse cx="100" cy="12" rx="5" ry="8" fill="${c}" opacity="0.15"/><ellipse cx="95" cy="10" rx="4" ry="6" transform="rotate(-20 95 10)" fill="${c}" opacity="0.1"/><ellipse cx="105" cy="10" rx="4" ry="6" transform="rotate(20 105 10)" fill="${c}" opacity="0.1"/><line x1="115" y1="12" x2="180" y2="12" stroke="${c}" stroke-width="0.5" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.2)}`,
    borderRadius: '8px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '4px',
    background: `linear-gradient(135deg, ${v.primary}, ${v.secondary})`,
  }),
};

// ============================================================================
// 3. SONGKET EMAS — Malay traditional songket weave
// ============================================================================
const songketEmas: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      repeating-linear-gradient(0deg, transparent, transparent 39px, ${hexToRgba(v.secondary, 0.03)} 39px, ${hexToRgba(v.secondary, 0.03)} 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, ${hexToRgba(v.secondary, 0.03)} 39px, ${hexToRgba(v.secondary, 0.03)} 40px),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 30%, ${hexToRgba(v.secondary, 0.1)} 0%, transparent 60%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.05,
    backgroundImage: `
      linear-gradient(45deg, ${v.secondary} 10%, transparent 10%),
      linear-gradient(-45deg, ${v.secondary} 10%, transparent 10%),
      linear-gradient(45deg, transparent 90%, ${v.secondary} 90%),
      linear-gradient(-45deg, transparent 90%, ${v.secondary} 90%)
    `,
    backgroundSize: '30px 30px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'ornate-frame',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="50" height="50" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/><path d="M5 5 L15 5 L15 15 L5 15Z" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/><path d="M10 5 L10 15 M5 10 L15 10" stroke="${c}" stroke-width="0.5" opacity="0.3"/><path d="M5 5 L5 20 M5 5 L20 5" stroke="${c}" stroke-width="2" opacity="0.6"/></svg>`,
  coverTopOrnament: '\u2726 \u2726 \u2726',
  coverBottomOrnament: '\u2726 \u2726 \u2726',
  dividerSvg: (c) => `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="10" x2="80" y2="10" stroke="${c}" stroke-width="0.8" opacity="0.3"/><rect x="88" y="4" width="12" height="12" transform="rotate(45 94 10)" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><rect x="91" y="7" width="6" height="6" transform="rotate(45 94 10)" fill="${c}" opacity="0.2"/><line x1="120" y1="10" x2="180" y2="10" stroke="${c}" stroke-width="0.8" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `2px solid ${hexToRgba(v.secondary, 0.25)}`,
    borderRadius: '2px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '2px',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
    boxShadow: `0 2px 8px ${hexToRgba(v.secondary, 0.3)}`,
  }),
};

// ============================================================================
// 4. BATIK BIRU — Malay traditional batik (navy + gold)
// ============================================================================
const batikBiru: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      radial-gradient(circle at 20% 50%, ${hexToRgba(v.accent, 0.08)} 0%, transparent 40%),
      radial-gradient(circle at 80% 50%, ${hexToRgba(v.accent, 0.08)} 0%, transparent 40%),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 50%, ${hexToRgba(v.secondary, 0.08)} 0%, transparent 60%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.04,
    backgroundImage: `
      radial-gradient(circle at 50% 50%, ${v.secondary} 8px, transparent 8px),
      radial-gradient(circle at 0% 0%, ${v.secondary} 4px, transparent 4px),
      radial-gradient(circle at 100% 0%, ${v.secondary} 4px, transparent 4px),
      radial-gradient(circle at 0% 100%, ${v.secondary} 4px, transparent 4px),
      radial-gradient(circle at 100% 100%, ${v.secondary} 4px, transparent 4px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'double-border',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><circle cx="10" cy="10" r="3" fill="${c}" opacity="0.2"/><path d="M5 5 L5 25 M5 5 L25 5" stroke="${c}" stroke-width="2" opacity="0.5"/></svg>`,
  coverTopOrnament: '\u2736 \u2736 \u2736',
  coverBottomOrnament: '\u2736 \u2736 \u2736',
  dividerSvg: (c) => `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="10" x2="85" y2="10" stroke="${c}" stroke-width="0.8" opacity="0.3"/><circle cx="100" cy="10" r="6" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><circle cx="100" cy="10" r="2.5" fill="${c}" opacity="0.25"/><line x1="115" y1="10" x2="180" y2="10" stroke="${c}" stroke-width="0.8" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.3)}`,
    borderRadius: '4px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '2px',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
  }),
};

// ============================================================================
// 5. ARABESQUE — Islamic geometric patterns
// ============================================================================
const arabesque: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 0%, ${hexToRgba(v.secondary, 0.04)} 0%, transparent 40%),
      radial-gradient(ellipse at 50% 100%, ${hexToRgba(v.secondary, 0.04)} 0%, transparent 40%),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 30%, ${hexToRgba(v.secondary, 0.1)} 0%, transparent 50%),
      radial-gradient(ellipse at 50% 70%, ${hexToRgba(v.primary, 0.06)} 0%, transparent 50%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.04,
    backgroundImage: `
      linear-gradient(0deg, ${v.secondary} 1px, transparent 1px),
      linear-gradient(60deg, ${v.secondary} 1px, transparent 1px),
      linear-gradient(-60deg, ${v.secondary} 1px, transparent 1px)
    `,
    backgroundSize: '40px 69px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'arch-top',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M5 55 L5 5 L55 5" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/><path d="M10 50 L10 10 L50 10" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.25"/><polygon points="5,5 15,5 10,12" fill="${c}" opacity="0.3"/><polygon points="5,5 5,15 12,10" fill="${c}" opacity="0.3"/></svg>`,
  coverTopOrnament: '\u066D',
  coverBottomOrnament: '\u2726 \u066D \u2726',
  dividerSvg: (c) => `<svg viewBox="0 0 200 24" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="12" x2="80" y2="12" stroke="${c}" stroke-width="0.8" opacity="0.3"/><polygon points="100,2 108,12 100,22 92,12" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><polygon points="100,6 104,12 100,18 96,12" fill="${c}" opacity="0.2"/><line x1="120" y1="12" x2="180" y2="12" stroke="${c}" stroke-width="0.8" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.25)}`,
    borderRadius: '4px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '2px',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
  }),
};

// ============================================================================
// 6. PUTIH MODEN — Modern minimalist
// ============================================================================
const putihModen: TemplateVisuals = {
  pageBackground: (v) => ({
    background: v.bg,
  }),
  coverBackground: (v) => ({
    background: v.bg,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.03,
    backgroundImage: `radial-gradient(circle, ${v.primary} 0.5px, transparent 0.5px)`,
    backgroundSize: '24px 24px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'thin-line',
  cornerSvg: (c) => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M2 38 L2 2 L38 2" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4"/></svg>`,
  coverTopOrnament: '\u2014',
  coverBottomOrnament: '\u2014',
  dividerSvg: (c) => `<svg viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg"><line x1="60" y1="5" x2="140" y2="5" stroke="${c}" stroke-width="0.5" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.primary, 0.1)}`,
    borderRadius: '0',
  }),
  buttonStyle: (v) => ({
    borderRadius: '0',
    background: v.text,
    color: v.bg,
  }),
};

// ============================================================================
// 7. DUSTY VINTAGE — Vintage romantic
// ============================================================================
const dustyVintage: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 30% 20%, ${hexToRgba(v.secondary, 0.06)} 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, ${hexToRgba(v.primary, 0.06)} 0%, transparent 50%),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 40%, ${hexToRgba(v.secondary, 0.1)} 0%, transparent 60%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.03,
    backgroundImage: `
      repeating-linear-gradient(0deg, ${v.secondary} 0px, ${v.secondary} 1px, transparent 1px, transparent 20px),
      repeating-linear-gradient(90deg, ${v.secondary} 0px, ${v.secondary} 1px, transparent 1px, transparent 20px)
    `,
    backgroundSize: '20px 20px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'ornate-frame',
  cornerSvg: (c) => `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><path d="M5 65 C5 35 5 20 20 10 C30 3 40 5 65 5" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.45"/><path d="M5 55 C8 35 12 25 22 18 C30 12 42 10 65 10" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.25"/><path d="M5 45 C10 35 15 28 25 22" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.15"/><circle cx="8" cy="8" r="2.5" fill="${c}" opacity="0.3"/><circle cx="18" cy="5" r="1.5" fill="${c}" opacity="0.2"/></svg>`,
  coverTopOrnament: '\u2766 \u2767',
  coverBottomOrnament: '\u2766 \u2767',
  dividerSvg: (c) => `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg"><path d="M30 10 Q50 2 70 10 Q85 16 100 10 Q115 4 130 10 Q150 18 170 10" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.35"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.2)}`,
    borderRadius: '8px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '24px',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
  }),
};

// ============================================================================
// 8. MARMAR MEWAH — Marble & gold luxury
// ============================================================================
const marmarMewah: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 20% 30%, ${hexToRgba(v.accent, 0.15)} 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, ${hexToRgba(v.accent, 0.1)} 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, ${hexToRgba(v.secondary, 0.03)} 0%, transparent 60%),
      linear-gradient(160deg, ${v.bg} 0%, ${hexToRgba(v.accent, 0.2)} 50%, ${v.bg} 100%)
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 30% 40%, ${hexToRgba(v.accent, 0.2)} 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, ${hexToRgba(v.accent, 0.15)} 0%, transparent 50%),
      linear-gradient(135deg, ${v.bg}, ${hexToRgba(v.accent, 0.3)}, ${v.bg})
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.025,
    backgroundImage: `
      linear-gradient(125deg, transparent 40%, ${v.secondary} 40.5%, transparent 41%),
      linear-gradient(235deg, transparent 40%, ${v.secondary} 40.5%, transparent 41%),
      linear-gradient(55deg, transparent 45%, ${v.accent} 45.2%, transparent 45.4%)
    `,
    backgroundSize: '200px 200px, 150px 150px, 180px 180px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'deco-corners',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M5 55 L5 5 L55 5" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/><path d="M5 45 L5 15 L5 5 L15 5 L45 5" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/><rect x="3" y="3" width="8" height="8" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/></svg>`,
  coverTopOrnament: '\u2727 \u2726 \u2727',
  coverBottomOrnament: '\u2726 \u2727 \u2726',
  dividerSvg: (c) => `<svg viewBox="0 0 200 16" xmlns="http://www.w3.org/2000/svg"><line x1="30" y1="8" x2="85" y2="8" stroke="${c}" stroke-width="0.8" opacity="0.3"/><rect x="90" y="3" width="10" height="10" transform="rotate(45 95 8)" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><line x1="108" y1="8" x2="170" y2="8" stroke="${c}" stroke-width="0.8" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.2)}`,
    borderRadius: '2px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '0',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
    boxShadow: `0 4px 16px ${hexToRgba(v.secondary, 0.3)}`,
  }),
};

// ============================================================================
// 9. RUSTIC TANAH — Rustic earth tone
// ============================================================================
const rusticTanah: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      repeating-linear-gradient(
        0deg,
        transparent, transparent 3px,
        ${hexToRgba(v.primary, 0.01)} 3px,
        ${hexToRgba(v.primary, 0.01)} 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent, transparent 3px,
        ${hexToRgba(v.primary, 0.01)} 3px,
        ${hexToRgba(v.primary, 0.01)} 4px
      ),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 50%, ${hexToRgba(v.accent, 0.1)} 0%, transparent 60%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.04,
    backgroundImage: `
      repeating-linear-gradient(45deg, transparent, transparent 10px, ${v.primary} 10px, ${v.primary} 10.5px),
      repeating-linear-gradient(-45deg, transparent, transparent 10px, ${v.primary} 10px, ${v.primary} 10.5px)
    `,
    backgroundSize: '30px 30px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'double-border',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M8 52 C8 30 8 15 15 8 C22 3 35 5 52 8" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4" stroke-dasharray="3 2"/><circle cx="10" cy="10" r="2" fill="${c}" opacity="0.3"/></svg>`,
  coverTopOrnament: '\u2058 \u2058 \u2058',
  coverBottomOrnament: '\u2058 \u2058 \u2058',
  dividerSvg: (c) => `<svg viewBox="0 0 200 14" xmlns="http://www.w3.org/2000/svg"><path d="M30 7 Q65 3 100 7 Q135 11 170 7" fill="none" stroke="${c}" stroke-width="1" opacity="0.3" stroke-dasharray="4 3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px dashed ${hexToRgba(v.secondary, 0.25)}`,
    borderRadius: '8px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '6px',
    background: `linear-gradient(135deg, ${v.primary}, ${v.secondary})`,
  }),
};

// ============================================================================
// 10. MALAM BERKILAU — Dark glamour with shimmer
// ============================================================================
const malamBerkilau: TemplateVisuals = {
  pageBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 0%, ${hexToRgba(v.secondary, 0.06)} 0%, transparent 40%),
      radial-gradient(ellipse at 20% 60%, ${hexToRgba(v.secondary, 0.04)} 0%, transparent 30%),
      radial-gradient(ellipse at 80% 80%, ${hexToRgba(v.secondary, 0.04)} 0%, transparent 30%),
      ${v.bg}
    `,
  }),
  coverBackground: (v) => ({
    background: `
      radial-gradient(ellipse at 50% 30%, ${hexToRgba(v.secondary, 0.12)} 0%, transparent 50%),
      radial-gradient(ellipse at 30% 80%, ${hexToRgba(v.accent, 0.06)} 0%, transparent 40%),
      ${v.bg}
    `,
  }),
  coverPattern: (v) => ({
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.06,
    backgroundImage: `
      radial-gradient(circle at 15% 15%, ${v.secondary} 1px, transparent 1px),
      radial-gradient(circle at 85% 25%, ${v.secondary} 0.5px, transparent 0.5px),
      radial-gradient(circle at 45% 55%, ${v.secondary} 0.8px, transparent 0.8px),
      radial-gradient(circle at 75% 85%, ${v.secondary} 1px, transparent 1px),
      radial-gradient(circle at 25% 75%, ${v.secondary} 0.5px, transparent 0.5px),
      radial-gradient(circle at 55% 35%, ${v.secondary} 0.3px, transparent 0.3px),
      radial-gradient(circle at 35% 95%, ${v.secondary} 0.6px, transparent 0.6px),
      radial-gradient(circle at 65% 65%, ${v.secondary} 0.4px, transparent 0.4px)
    `,
    backgroundSize: '200px 200px, 150px 150px, 180px 180px, 160px 160px, 140px 140px, 120px 120px, 170px 170px, 130px 130px',
    pointerEvents: 'none' as const,
  }),
  coverFrame: 'geometric-frame',
  cornerSvg: (c) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M5 55 L5 5 L55 5" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/><path d="M12 48 L12 12 L48 12" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/><circle cx="5" cy="5" r="2" fill="${c}" opacity="0.5"/></svg>`,
  coverTopOrnament: '\u2729 \u2729 \u2729',
  coverBottomOrnament: '\u2729 \u2729 \u2729',
  dividerSvg: (c) => `<svg viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg"><line x1="30" y1="6" x2="90" y2="6" stroke="${c}" stroke-width="0.5" opacity="0.3"/><circle cx="97" cy="6" r="1.5" fill="${c}" opacity="0.4"/><circle cx="103" cy="6" r="1.5" fill="${c}" opacity="0.4"/><line x1="110" y1="6" x2="170" y2="6" stroke="${c}" stroke-width="0.5" opacity="0.3"/></svg>`,
  sectionBorder: (v) => ({
    border: `1px solid ${hexToRgba(v.secondary, 0.2)}`,
    borderRadius: '4px',
  }),
  buttonStyle: (v) => ({
    borderRadius: '2px',
    background: `linear-gradient(135deg, ${v.secondary}, ${v.primary})`,
    boxShadow: `0 0 20px ${hexToRgba(v.secondary, 0.3)}`,
  }),
};

// ============================================================================
// Template registry
// ============================================================================
const TEMPLATE_VISUALS: Record<string, TemplateVisuals> = {
  'sakura-pink': sakuraPink,
  'tropical-daun': tropicalDaun,
  'songket-emas': songketEmas,
  'batik-biru': batikBiru,
  'arabesque': arabesque,
  'putih-moden': putihModen,
  'dusty-vintage': dustyVintage,
  'marmar-mewah': marmarMewah,
  'rustic-tanah': rusticTanah,
  'malam-berkilau': malamBerkilau,
  // Legacy aliases
  'elegant-gold': songketEmas,
  'sage-garden': tropicalDaun,
  'royal-navy': batikBiru,
  'blush-rose': sakuraPink,
  'midnight-luxe': malamBerkilau,
  'batik-heritage': batikBiru,
  'lavender-dream': dustyVintage,
  'white-minimal': putihModen,
};

/** Get the visual engine for a template, with fallback to songket-emas */
export function getTemplateVisuals(templateId: string): TemplateVisuals {
  return TEMPLATE_VISUALS[templateId] ?? songketEmas;
}

/** Build ThemeVars from CSS variable values or direct config */
export function buildThemeVars(config: {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  text_color: string;
}): ThemeVars {
  return {
    primary: config.primary_color,
    secondary: config.secondary_color,
    accent: config.accent_color,
    bg: config.bg_color,
    text: config.text_color,
  };
}

export type { ThemeVars };
