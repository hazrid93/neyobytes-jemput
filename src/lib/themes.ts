import type { ThemeTemplate, InvitationSection } from '../types';

const DEFAULT_SECTIONS: InvitationSection[] = [
  { id: 'cover', type: 'cover', enabled: true, sort_order: 0 },
  { id: 'islamic_greeting', type: 'islamic_greeting', enabled: true, sort_order: 1 },
  { id: 'invitation_text', type: 'invitation_text', enabled: true, sort_order: 2 },
  { id: 'couple', type: 'couple', enabled: true, sort_order: 3 },
  { id: 'event_details', type: 'event_details', enabled: true, sort_order: 4 },
  { id: 'countdown', type: 'countdown', enabled: true, sort_order: 5 },
  { id: 'itinerary', type: 'itinerary', enabled: true, sort_order: 6 },
  { id: 'location', type: 'location', enabled: true, sort_order: 7 },
  { id: 'contact', type: 'contact', enabled: true, sort_order: 8 },
  { id: 'rsvp', type: 'rsvp', enabled: true, sort_order: 9 },
  { id: 'money_gift', type: 'money_gift', enabled: true, sort_order: 10 },
  { id: 'gallery', type: 'gallery', enabled: true, sort_order: 11 },
  { id: 'guestbook', type: 'guestbook', enabled: true, sort_order: 12 },
  { id: 'calendar_save', type: 'calendar_save', enabled: true, sort_order: 13 },
  { id: 'footer', type: 'footer', enabled: true, sort_order: 14 },
];

// ============================================================================
// 10 Full-fledge Wedding Invitation Templates
// Each with unique color palettes, fonts, ornaments, patterns & visual style
// ============================================================================

export const THEME_TEMPLATES: ThemeTemplate[] = [
  // 1. Sakura Merah Jambu — Soft floral petals
  {
    id: 'sakura-pink',
    name: 'Sakura Pink',
    name_ms: 'Sakura Merah Jambu',
    description: 'Kelopak sakura lembut dengan nuansa merah jambu — romantis dan feminin',
    preview_colors: ['#C77B8B', '#E8A0B0', '#FFF5F7', '#4A2030'],
    theme_config: {
      primary_color: '#C77B8B',
      secondary_color: '#E8A0B0',
      accent_color: '#F5E0E5',
      bg_color: '#FFF5F7',
      text_color: '#4A2030',
      font_display: 'Cormorant Garamond',
      font_body: 'Poppins',
      font_arabic: 'Amiri',
      ornament_style: 'floral',
      bg_pattern: 'petals',
      border_style: 'double',
      divider_style: 'floral',
      cover_style: 'framed',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 2. Tropika Hijau — Botanical leaves
  {
    id: 'tropical-daun',
    name: 'Tropical Daun',
    name_ms: 'Tropika Hijau',
    description: 'Daun tropika hijau segar dengan keanggunan botanikal — semulajadi dan tenang',
    preview_colors: ['#4A7C59', '#7BAF6E', '#F2F7F0', '#1E3A1E'],
    theme_config: {
      primary_color: '#4A7C59',
      secondary_color: '#7BAF6E',
      accent_color: '#D6E8D0',
      bg_color: '#F2F7F0',
      text_color: '#1E3A1E',
      font_display: 'Lora',
      font_body: 'Open Sans',
      font_arabic: 'Amiri',
      ornament_style: 'tropical',
      bg_pattern: 'leaves',
      border_style: 'thin',
      divider_style: 'leaf',
      cover_style: 'botanical',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 3. Songket Emas — Malay traditional songket weave
  {
    id: 'songket-emas',
    name: 'Songket Emas',
    name_ms: 'Songket Emas',
    description: 'Tenunan songket emas tradisional Melayu — megah dan berbudaya',
    preview_colors: ['#8B6F4E', '#D4AF37', '#FDF8F0', '#2C1810'],
    theme_config: {
      primary_color: '#8B6F4E',
      secondary_color: '#D4AF37',
      accent_color: '#F5E6D3',
      bg_color: '#FDF8F0',
      text_color: '#2C1810',
      font_display: 'Playfair Display',
      font_body: 'Poppins',
      font_arabic: 'Amiri',
      ornament_style: 'classic',
      bg_pattern: 'songket-weave',
      border_style: 'ornate',
      divider_style: 'diamond',
      cover_style: 'ornate',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 4. Batik Nusantara — Malay traditional batik (navy + gold)
  {
    id: 'batik-biru',
    name: 'Batik Biru',
    name_ms: 'Batik Nusantara',
    description: 'Motif batik kawung dengan biru dan emas — warisan Nusantara',
    preview_colors: ['#1B3A5C', '#C9A96E', '#F0EDE6', '#0D1F33'],
    theme_config: {
      primary_color: '#1B3A5C',
      secondary_color: '#C9A96E',
      accent_color: '#E8E2D6',
      bg_color: '#F0EDE6',
      text_color: '#0D1F33',
      font_display: 'Georgia',
      font_body: 'Inter',
      font_arabic: 'Amiri',
      ornament_style: 'batik',
      bg_pattern: 'kawung',
      border_style: 'double',
      divider_style: 'geometric',
      cover_style: 'framed',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 5. Seni Islamik — Islamic geometric patterns
  {
    id: 'arabesque',
    name: 'Arabesque',
    name_ms: 'Seni Islamik',
    description: 'Corak geometri Islam dengan lengkungan gerbang — spiritual dan anggun',
    preview_colors: ['#1A5E4A', '#C5A55A', '#F5F2EC', '#152A22'],
    theme_config: {
      primary_color: '#1A5E4A',
      secondary_color: '#C5A55A',
      accent_color: '#E8E0D0',
      bg_color: '#F5F2EC',
      text_color: '#152A22',
      font_display: 'Amiri',
      font_body: 'Poppins',
      font_arabic: 'Amiri',
      ornament_style: 'islamic',
      bg_pattern: 'tessellation',
      border_style: 'ornate',
      divider_style: 'islamic',
      cover_style: 'arch',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 6. Moden Minimalis — Modern minimal
  {
    id: 'putih-moden',
    name: 'Putih Moden',
    name_ms: 'Moden Minimalis',
    description: 'Reka bentuk moden minimalis — bersih, ringkas dan kontemporari',
    preview_colors: ['#333333', '#888888', '#FFFFFF', '#111111'],
    theme_config: {
      primary_color: '#333333',
      secondary_color: '#888888',
      accent_color: '#F0F0F0',
      bg_color: '#FFFFFF',
      text_color: '#111111',
      font_display: 'Inter',
      font_body: 'Inter',
      font_arabic: 'Amiri',
      ornament_style: 'minimal',
      bg_pattern: 'dots',
      border_style: 'thin',
      divider_style: 'line',
      cover_style: 'minimal',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 7. Vintaj Lembut — Vintage romantic
  {
    id: 'dusty-vintage',
    name: 'Dusty Vintage',
    name_ms: 'Vintaj Lembut',
    description: 'Gaya vintaj romantis dengan warna lembut — klasik dan bermimpi',
    preview_colors: ['#8C6B5D', '#B8977A', '#FAF5EF', '#3A2820'],
    theme_config: {
      primary_color: '#8C6B5D',
      secondary_color: '#B8977A',
      accent_color: '#EDE3D8',
      bg_color: '#FAF5EF',
      text_color: '#3A2820',
      font_display: 'Cormorant Garamond',
      font_body: 'Roboto',
      font_arabic: 'Amiri',
      ornament_style: 'vintage',
      bg_pattern: 'crosshatch',
      border_style: 'ornate',
      divider_style: 'wave',
      cover_style: 'ornate',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 8. Marmar & Emas — Luxury marble
  {
    id: 'marmar-mewah',
    name: 'Marmar Mewah',
    name_ms: 'Marmar & Emas',
    description: 'Tekstur marmar putih dengan sentuhan emas — mewah dan eksklusif',
    preview_colors: ['#8B7355', '#D4AF37', '#FAF8F5', '#2A1F15'],
    theme_config: {
      primary_color: '#8B7355',
      secondary_color: '#D4AF37',
      accent_color: '#E8DDD0',
      bg_color: '#FAF8F5',
      text_color: '#2A1F15',
      font_display: 'Playfair Display',
      font_body: 'Poppins',
      font_arabic: 'Amiri',
      ornament_style: 'classic',
      bg_pattern: 'marble-veins',
      border_style: 'deco',
      divider_style: 'diamond',
      cover_style: 'geometric',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 9. Desa Hangat — Rustic earth tones
  {
    id: 'rustic-tanah',
    name: 'Rustic Tanah',
    name_ms: 'Desa Hangat',
    description: 'Warna tanah rustic yang hangat — sederhana dan mesra',
    preview_colors: ['#7A5C3E', '#A0845C', '#F8F4ED', '#3A2A1A'],
    theme_config: {
      primary_color: '#7A5C3E',
      secondary_color: '#A0845C',
      accent_color: '#E8DCC8',
      bg_color: '#F8F4ED',
      text_color: '#3A2A1A',
      font_display: 'Lora',
      font_body: 'Open Sans',
      font_arabic: 'Amiri',
      ornament_style: 'rustic',
      bg_pattern: 'linen',
      border_style: 'dotted',
      divider_style: 'wave',
      cover_style: 'framed',
    },
    default_sections: DEFAULT_SECTIONS,
  },

  // 10. Malam Berkilau — Dark glamour with shimmer
  {
    id: 'malam-berkilau',
    name: 'Malam Berkilau',
    name_ms: 'Malam Berkilau',
    description: 'Latar gelap dengan kilauan emas — dramatik dan moden',
    preview_colors: ['#D4AF37', '#C9A96E', '#1A1A2E', '#F0E6D3'],
    theme_config: {
      primary_color: '#C9A96E',
      secondary_color: '#D4AF37',
      accent_color: '#2A2A3E',
      bg_color: '#1A1A2E',
      text_color: '#F0E6D3',
      font_display: 'Playfair Display',
      font_body: 'Poppins',
      font_arabic: 'Amiri',
      ornament_style: 'glamour',
      bg_pattern: 'stars',
      border_style: 'thin',
      divider_style: 'star',
      cover_style: 'geometric',
    },
    default_sections: DEFAULT_SECTIONS,
  },
];

// ============================================================================
// Legacy theme ID mapping — old IDs redirect to closest new template
// ============================================================================
const LEGACY_ALIASES: Record<string, string> = {
  'elegant-gold': 'songket-emas',
  'sage-garden': 'tropical-daun',
  'royal-navy': 'batik-biru',
  'blush-rose': 'sakura-pink',
  'midnight-luxe': 'malam-berkilau',
  'batik-heritage': 'batik-biru',
  'lavender-dream': 'dusty-vintage',
  'white-minimal': 'putih-moden',
};

/**
 * Look up a theme template by ID.
 * Supports both new IDs and legacy aliases from the old 8-theme system.
 */
export function getThemeById(id: string): ThemeTemplate | undefined {
  const resolvedId = LEGACY_ALIASES[id] ?? id;
  return THEME_TEMPLATES.find((t) => t.id === resolvedId);
}

/**
 * Resolve a potentially-legacy theme ID to the canonical new template ID.
 */
export function resolveTemplateId(id: string): string {
  return LEGACY_ALIASES[id] ?? id;
}

// Section labels in Malay
export const SECTION_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  cover: { label: 'Muka Depan', icon: 'image', description: 'Halaman pembukaan dengan nama & tarikh' },
  islamic_greeting: { label: 'Salam Pembukaan', icon: 'heart', description: 'Assalamualaikum / Bismillah' },
  invitation_text: { label: 'Ayat Jemputan', icon: 'message', description: 'Teks jemputan rasmi' },
  couple: { label: 'Pengantin', icon: 'users', description: 'Nama dan gambar pengantin' },
  event_details: { label: 'Butiran Majlis', icon: 'calendar', description: 'Tarikh, masa dan tempat' },
  countdown: { label: 'Hitung Mundur', icon: 'clock', description: 'Kira detik ke hari majlis' },
  itinerary: { label: 'Tentatif', icon: 'list', description: 'Aturcara majlis' },
  location: { label: 'Lokasi', icon: 'map-pin', description: 'Peta dan navigasi' },
  contact: { label: 'Hubungi', icon: 'phone', description: 'Nombor telefon & WhatsApp' },
  rsvp: { label: 'RSVP', icon: 'check', description: 'Borang pengesahan kehadiran' },
  money_gift: { label: 'Salam Kaut', icon: 'credit-card', description: 'Hadiah wang / DuitNow' },
  gallery: { label: 'Galeri', icon: 'photo', description: 'Gambar-gambar pengantin' },
  guestbook: { label: 'Buku Tamu', icon: 'book', description: 'Ucapan dari tetamu' },
  calendar_save: { label: 'Simpan Tarikh', icon: 'calendar-plus', description: 'Tambah ke kalendar' },
  footer: { label: 'Penutup', icon: 'chevron-down', description: 'Hashtag & kredit' },
  custom_text: { label: 'Teks Khas', icon: 'text-plus', description: 'Tambah teks bebas' },
  custom_image: { label: 'Gambar Khas', icon: 'photo-plus', description: 'Tambah gambar bebas' },
  custom_video: { label: 'Video Khas', icon: 'video-plus', description: 'Tambah video (YouTube/URL)' },
};
