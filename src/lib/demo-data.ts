import type { Invitation, RSVP, GuestbookMessage } from '../types';

export const TRIAL_PREVIEW_STORAGE_KEY = 'jemput_trial_preview_invitation';
export const EDITOR_PREVIEW_STORAGE_KEY = 'jemput_editor_preview_invitation';

export const demoInvitation: Invitation = {
  id: 'demo-001',
  user_id: 'demo-user',
  slug: 'aiman-nadia',
  status: 'published',
  template: 'songket-emas',

  bride_name: 'Nadia binti Ahmad',
  groom_name: 'Aiman bin Ibrahim',
  bride_parent_names: 'Ahmad bin Mohd Yusof & Fatimah binti Hassan',
  groom_parent_names: 'Ibrahim bin Ismail & Zainab binti Omar',
  couple_photo_url: '',
  cover_photo_url: '',

  event_date: '2026-06-20',
  event_time_start: '11:00',
  event_time_end: '16:00',
  venue_name: 'Dewan Seri Angkasa',
  venue_address: 'Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia',
  venue_lat: 3.1466,
  venue_lng: 101.7108,
  venue_google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.786!2d101.7108!3d3.1466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDgnNDcuOCJOIDEwMcKwNDInMzguOSJF!5e0!3m2!1sen!2smy!4v1616161616161',

  rsvp_deadline: '2026-06-18T23:59:00',
  rsvp_enabled: true,

  invitation_text:
    'Dengan segala hormatnya kami menjemput Dato\'/Datin/Tuan/Puan/Encik/Cik ke majlis perkahwinan putera dan puteri kami.',

  music_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  music_type: 'youtube' as const,

  itinerary: [
    { time: '11:00', event: 'Majlis Bermula', icon: 'clock' },
    { time: '11:30', event: 'Ketibaan Tetamu', icon: 'users' },
    { time: '12:00', event: 'Ketibaan Pengantin', icon: 'heart' },
    { time: '12:30', event: 'Majlis Bersanding', icon: 'crown' },
    { time: '13:00', event: 'Jamuan Makan', icon: 'utensils' },
    { time: '15:00', event: 'Sesi Bergambar', icon: 'camera' },
    { time: '16:00', event: 'Majlis Berakhir', icon: 'check' },
  ],

  contacts: [
    { name: 'Ibrahim (Bapa Pengantin Lelaki)', phone: '+60123456789', role: 'Pihak Lelaki' },
    { name: 'Ahmad (Bapa Pengantin Perempuan)', phone: '+60198765432', role: 'Pihak Perempuan' },
  ],

  money_gift: {
    bank_name: 'Maybank',
    account_name: 'Aiman bin Ibrahim',
    account_number: '1234 5678 9012',
    qr_code_url: '',
  },

  wishlist: [
    { id: '1', name: 'Set Periuk Noxxa', claimed: false },
    { id: '2', name: 'Blender Philips', claimed: true, claimed_by: 'Mak Cik Zaiton' },
    { id: '3', name: 'Tuala Mandi Set', claimed: false },
    { id: '4', name: 'Rice Cooker Panasonic', claimed: false },
  ],

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

  sections: [
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
  ],

  chatbot_enabled: true,
  chatbot_context: 'Majlis bermula jam 11 pagi. Dress code: baju Melayu / baju kurung. Parking tersedia di basement Dewan Seri Angkasa. Majlis di tingkat 3.',

  gallery_images: [],

  payment_status: 'paid',
  expires_at: '2026-08-20T00:00:00Z',

  created_at: '2026-01-15T00:00:00Z',
  updated_at: '2026-03-20T00:00:00Z',
};

export const demoRSVPs: RSVP[] = [
  {
    id: '1',
    invitation_id: 'demo-001',
    guest_name: 'Siti Aminah',
    phone: '+60112223344',
    attending: true,
    num_adults: 2,
    num_children: 1,
    message: 'Tahniah! Semoga berbahagia hingga ke Jannah.',
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: '2',
    invitation_id: 'demo-001',
    guest_name: 'Mohd Razak',
    phone: '+60133445566',
    attending: true,
    num_adults: 3,
    num_children: 2,
    created_at: '2026-03-02T14:30:00Z',
  },
  {
    id: '3',
    invitation_id: 'demo-001',
    guest_name: 'Nurul Huda',
    attending: false,
    num_adults: 0,
    num_children: 0,
    message: 'Maaf tak dapat hadir. Selamat pengantin baru!',
    created_at: '2026-03-05T09:15:00Z',
  },
];

export const demoGuestbook: GuestbookMessage[] = [
  {
    id: '1',
    invitation_id: 'demo-001',
    name: 'Kak Leha',
    message: 'Barakallahu lakuma wa baraka alaikuma. Semoga kekal hingga ke syurga!',
    created_at: '2026-03-10T08:00:00Z',
  },
  {
    id: '2',
    invitation_id: 'demo-001',
    name: 'Abang Zul',
    message: 'Tahniah adik! Selamat pengantin baru. Semoga dipermudahkan segala urusan.',
    created_at: '2026-03-11T12:00:00Z',
  },
  {
    id: '3',
    invitation_id: 'demo-001',
    name: 'Mira & Family',
    message: 'So happy for you both! Wishing you a lifetime of love and happiness.',
    created_at: '2026-03-12T16:30:00Z',
  },
];
