export function getCopy(
  copyOverrides: Record<string, string> | undefined,
  key: string,
  fallback: string
): string {
  const value = copyOverrides?.[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export const COPY_FIELDS = [
  {
    label: 'Cover',
    fields: [
      { key: 'cover.bismillah_arabic', label: 'Bismillah (Arab)', multiline: true },
      { key: 'cover.bismillah_translation', label: 'Terjemahan Bismillah' },
      { key: 'cover.heading_label', label: 'Label Tajuk Cover' },
      { key: 'cover.guest_label', label: 'Label Tetamu' },
      { key: 'cover.guest_heading', label: 'Label Tetamu Halaman' },
      { key: 'cover.open_button', label: 'Teks Butang Buka Jemputan' },
    ],
  },
  {
    label: 'Salam Islamik',
    fields: [
      { key: 'islamic_greeting.arabic', label: 'Ucapan Arab', multiline: true },
      { key: 'islamic_greeting.romanized', label: 'Ucapan Rumi' },
      { key: 'islamic_greeting.translation', label: 'Terjemahan' },
    ],
  },
  {
    label: 'Maklumat Majlis',
    fields: [
      { key: 'event_details.eyebrow', label: 'Label Kecil' },
      { key: 'event_details.title', label: 'Tajuk' },
      { key: 'event_details.badge', label: 'Badge / Save The Date' },
    ],
  },
  {
    label: 'Countdown',
    fields: [
      { key: 'countdown.eyebrow', label: 'Label Kecil' },
      { key: 'countdown.title_active', label: 'Tajuk Sebelum Majlis' },
      { key: 'countdown.title_expired', label: 'Tajuk Selepas Majlis' },
      { key: 'countdown.unit_days', label: 'Unit Hari' },
      { key: 'countdown.unit_hours', label: 'Unit Jam' },
      { key: 'countdown.unit_minutes', label: 'Unit Minit' },
      { key: 'countdown.unit_seconds', label: 'Unit Saat' },
    ],
  },
  {
    label: 'Tentatif',
    fields: [
      { key: 'itinerary.eyebrow', label: 'Label Kecil' },
      { key: 'itinerary.title', label: 'Tajuk' },
    ],
  },
  {
    label: 'Lokasi',
    fields: [
      { key: 'location.eyebrow', label: 'Label Kecil' },
      { key: 'location.google', label: 'Butang Google Maps' },
      { key: 'location.waze', label: 'Butang Waze' },
      { key: 'location.apple', label: 'Butang Apple Maps' },
    ],
  },
  {
    label: 'Hubungi Kami',
    fields: [
      { key: 'contact.eyebrow', label: 'Label Kecil' },
      { key: 'contact.title', label: 'Tajuk' },
      { key: 'contact.phone', label: 'Butang Telefon' },
      { key: 'contact.whatsapp', label: 'Butang WhatsApp' },
    ],
  },
  {
    label: 'RSVP',
    fields: [
      { key: 'rsvp.eyebrow', label: 'Label Kecil' },
      { key: 'rsvp.title', label: 'Tajuk' },
      { key: 'rsvp.closed_title', label: 'Tajuk Bila Ditutup' },
      { key: 'rsvp.closed_message', label: 'Mesej Bila Ditutup', multiline: true },
      { key: 'rsvp.deadline_prefix', label: 'Awalan Tarikh Tutup' },
      { key: 'rsvp.success_title', label: 'Tajuk Berjaya' },
      { key: 'rsvp.success_yes', label: 'Mesej Berjaya (Hadir)', multiline: true },
      { key: 'rsvp.success_no', label: 'Mesej Berjaya (Tidak Hadir)', multiline: true },
      { key: 'rsvp.banner_prefix', label: 'Ayat Peringatan Deadline', multiline: true },
      { key: 'rsvp.attendance_label', label: 'Label Kehadiran' },
      { key: 'rsvp.attend_yes', label: 'Butang Hadir' },
      { key: 'rsvp.attend_no', label: 'Butang Tidak Hadir' },
      { key: 'rsvp.name_label', label: 'Label Nama' },
      { key: 'rsvp.name_placeholder', label: 'Placeholder Nama' },
      { key: 'rsvp.phone_label', label: 'Label Telefon' },
      { key: 'rsvp.phone_placeholder', label: 'Placeholder Telefon' },
      { key: 'rsvp.adults_label', label: 'Label Dewasa' },
      { key: 'rsvp.children_label', label: 'Label Kanak-kanak' },
      { key: 'rsvp.message_label', label: 'Label Ucapan' },
      { key: 'rsvp.message_placeholder', label: 'Placeholder Ucapan' },
      { key: 'rsvp.submit', label: 'Butang Hantar' },
      { key: 'rsvp.submitting', label: 'Butang Menghantar' },
    ],
  },
  {
    label: 'Salam Kaut',
    fields: [
      { key: 'money_gift.eyebrow', label: 'Label Kecil' },
      { key: 'money_gift.title', label: 'Tajuk' },
      { key: 'money_gift.description', label: 'Penerangan', multiline: true },
      { key: 'money_gift.copy', label: 'Butang Salin' },
      { key: 'money_gift.copied', label: 'Butang Disalin' },
      { key: 'money_gift.qr_label', label: 'Label QR' },
    ],
  },
  {
    label: 'Galeri & Buku Tetamu',
    fields: [
      { key: 'guestbook.eyebrow', label: 'Label Kecil Buku Tetamu' },
      { key: 'guestbook.title', label: 'Tajuk Buku Tetamu' },
      { key: 'guestbook.name_placeholder', label: 'Placeholder Nama Buku Tetamu' },
      { key: 'guestbook.message_placeholder', label: 'Placeholder Ucapan Buku Tetamu' },
      { key: 'guestbook.submit', label: 'Butang Hantar Ucapan' },
      { key: 'guestbook.submitting', label: 'Butang Menghantar Ucapan' },
    ],
  },
  {
    label: 'Save The Date & Footer',
    fields: [
      { key: 'calendar.eyebrow', label: 'Label Kecil Calendar' },
      { key: 'calendar.title', label: 'Tajuk Calendar' },
      { key: 'calendar.description', label: 'Penerangan Calendar', multiline: true },
      { key: 'calendar.google', label: 'Butang Google Calendar' },
      { key: 'calendar.apple', label: 'Butang Apple Calendar' },
      { key: 'footer.closing_prefix', label: 'Ayat Penutup' },
      { key: 'footer.closing_family', label: 'Teks Keluarga' },
      { key: 'footer.share_label', label: 'Label Kongsi Jemputan' },
      { key: 'footer.whatsapp', label: 'Butang Kongsi WhatsApp' },
      { key: 'footer.copy', label: 'Butang Salin Pautan' },
      { key: 'footer.copied', label: 'Butang Pautan Disalin' },
      { key: 'footer.credit_prefix', label: 'Kredit Footer' },
    ],
  },
] as const;
