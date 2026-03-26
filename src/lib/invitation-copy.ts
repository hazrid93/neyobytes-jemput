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
      { key: 'cover.bismillah_arabic', label: 'Bismillah (Arab)', multiline: true, defaultValue: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ' },
      { key: 'cover.bismillah_translation', label: 'Terjemahan Bismillah', defaultValue: 'Dengan Nama Allah Yang Maha Pemurah Lagi Maha Penyayang' },
      { key: 'cover.heading_label', label: 'Label Tajuk Cover', defaultValue: 'Walimatul Urus' },
      { key: 'cover.guest_label', label: 'Label Tetamu', defaultValue: 'Kepada' },
      { key: 'cover.guest_heading', label: 'Label Tetamu Halaman', defaultValue: 'Kepada yang dihormati' },
      { key: 'cover.open_button', label: 'Teks Butang Buka Jemputan', defaultValue: 'Buka Jemputan' },
    ],
  },
  {
    label: 'Salam Islamik',
    fields: [
      { key: 'islamic_greeting.arabic', label: 'Ucapan Arab', multiline: true, defaultValue: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ' },
      { key: 'islamic_greeting.romanized', label: 'Ucapan Rumi', defaultValue: 'Assalamualaikum Warahmatullahi Wabarakatuh' },
      { key: 'islamic_greeting.translation', label: 'Terjemahan', defaultValue: 'Semoga Sejahtera Ke Atas Kamu Serta Rahmat Dan Berkat-Nya' },
    ],
  },
  {
    label: 'Maklumat Majlis',
    fields: [
      { key: 'event_details.eyebrow', label: 'Label Kecil', defaultValue: '' },
      { key: 'event_details.title', label: 'Tajuk', defaultValue: 'Atur Cara Majlis' },
      { key: 'event_details.badge', label: 'Badge / Save The Date', defaultValue: 'Save The Date' },
    ],
  },
  {
    label: 'Countdown',
    fields: [
      { key: 'countdown.eyebrow', label: 'Label Kecil', defaultValue: 'Menghitung Hari' },
      { key: 'countdown.title_active', label: 'Tajuk Sebelum Majlis', defaultValue: 'Menuju Hari Bahagia' },
      { key: 'countdown.title_expired', label: 'Tajuk Selepas Majlis', defaultValue: 'Hari Bahagia Telah Tiba!' },
      { key: 'countdown.unit_days', label: 'Unit Hari', defaultValue: 'Hari' },
      { key: 'countdown.unit_hours', label: 'Unit Jam', defaultValue: 'Jam' },
      { key: 'countdown.unit_minutes', label: 'Unit Minit', defaultValue: 'Minit' },
      { key: 'countdown.unit_seconds', label: 'Unit Saat', defaultValue: 'Saat' },
    ],
  },
  {
    label: 'Tentatif',
    fields: [
      { key: 'itinerary.eyebrow', label: 'Label Kecil', defaultValue: 'Atur Cara' },
      { key: 'itinerary.title', label: 'Tajuk', defaultValue: 'Tentatif Majlis' },
    ],
  },
  {
    label: 'Lokasi',
    fields: [
      { key: 'location.eyebrow', label: 'Label Kecil', defaultValue: 'Lokasi' },
      { key: 'location.google', label: 'Butang Google Maps', defaultValue: 'Google Maps' },
      { key: 'location.waze', label: 'Butang Waze', defaultValue: 'Waze' },
      { key: 'location.apple', label: 'Butang Apple Maps', defaultValue: 'Apple Maps' },
    ],
  },
  {
    label: 'Hubungi Kami',
    fields: [
      { key: 'contact.eyebrow', label: 'Label Kecil', defaultValue: 'Hubungi Kami' },
      { key: 'contact.title', label: 'Tajuk', defaultValue: 'Sebarang Pertanyaan' },
      { key: 'contact.phone', label: 'Butang Telefon', defaultValue: 'Telefon' },
      { key: 'contact.whatsapp', label: 'Butang WhatsApp', defaultValue: 'WhatsApp' },
    ],
  },
  {
    label: 'RSVP',
    fields: [
      { key: 'rsvp.eyebrow', label: 'Label Kecil', defaultValue: 'RSVP' },
      { key: 'rsvp.title', label: 'Tajuk', defaultValue: 'Pengesahan Kehadiran' },
      { key: 'rsvp.closed_title', label: 'Tajuk Bila Ditutup', defaultValue: 'RSVP Ditutup' },
      { key: 'rsvp.closed_message', label: 'Mesej Bila Ditutup', multiline: true, defaultValue: 'Maaf, tempoh RSVP telah tamat.' },
      { key: 'rsvp.deadline_prefix', label: 'Awalan Tarikh Tutup', defaultValue: 'Tarikh tutup:' },
      { key: 'rsvp.success_title', label: 'Tajuk Berjaya', defaultValue: 'Terima Kasih!' },
      { key: 'rsvp.success_yes', label: 'Mesej Berjaya (Hadir)', multiline: true, defaultValue: 'Pengesahan kehadiran anda telah direkodkan. Kami menantikan kehadiran anda!' },
      { key: 'rsvp.success_no', label: 'Mesej Berjaya (Tidak Hadir)', multiline: true, defaultValue: 'Terima kasih atas maklum balas anda. Semoga kita dapat bertemu di lain masa.' },
      { key: 'rsvp.banner_prefix', label: 'Ayat Peringatan Deadline', multiline: true, defaultValue: 'Sila sahkan kehadiran anda sebelum' },
      { key: 'rsvp.attendance_label', label: 'Label Kehadiran', defaultValue: 'Kehadiran' },
      { key: 'rsvp.attend_yes', label: 'Butang Hadir', defaultValue: 'Hadir' },
      { key: 'rsvp.attend_no', label: 'Butang Tidak Hadir', defaultValue: 'Tidak Hadir' },
      { key: 'rsvp.name_label', label: 'Label Nama', defaultValue: 'Nama' },
      { key: 'rsvp.name_placeholder', label: 'Placeholder Nama', defaultValue: 'Nama penuh anda' },
      { key: 'rsvp.phone_label', label: 'Label Telefon', defaultValue: 'No. Telefon' },
      { key: 'rsvp.phone_placeholder', label: 'Placeholder Telefon', defaultValue: '012-345 6789' },
      { key: 'rsvp.adults_label', label: 'Label Dewasa', defaultValue: 'Dewasa' },
      { key: 'rsvp.children_label', label: 'Label Kanak-kanak', defaultValue: 'Kanak-kanak' },
      { key: 'rsvp.message_label', label: 'Label Ucapan', defaultValue: 'Ucapan (Pilihan)' },
      { key: 'rsvp.message_placeholder', label: 'Placeholder Ucapan', defaultValue: 'Tulis ucapan anda...' },
      { key: 'rsvp.submit', label: 'Butang Hantar', defaultValue: 'Hantar RSVP' },
      { key: 'rsvp.submitting', label: 'Butang Menghantar', defaultValue: 'Menghantar...' },
    ],
  },
  {
    label: 'Salam Kaut',
    fields: [
      { key: 'money_gift.eyebrow', label: 'Label Kecil', defaultValue: 'Salam Kaut' },
      { key: 'money_gift.title', label: 'Tajuk', defaultValue: 'Hadiah Wang' },
      { key: 'money_gift.description', label: 'Penerangan', multiline: true, defaultValue: 'Doa restu anda sudah cukup bermakna. Sekiranya ingin memberi sumbangan, boleh melalui:' },
      { key: 'money_gift.copy', label: 'Butang Salin', defaultValue: 'Salin' },
      { key: 'money_gift.copied', label: 'Butang Disalin', defaultValue: 'Disalin' },
      { key: 'money_gift.qr_label', label: 'Label QR', defaultValue: 'Imbas Kod QR' },
    ],
  },
  {
    label: 'Galeri & Buku Tetamu',
    fields: [
      { key: 'guestbook.eyebrow', label: 'Label Kecil Buku Tetamu', defaultValue: 'Buku Tetamu' },
      { key: 'guestbook.title', label: 'Tajuk Buku Tetamu', defaultValue: 'Ucapan & Doa' },
      { key: 'guestbook.name_placeholder', label: 'Placeholder Nama Buku Tetamu', defaultValue: 'Nama anda' },
      { key: 'guestbook.message_placeholder', label: 'Placeholder Ucapan Buku Tetamu', defaultValue: 'Tulis ucapan anda...' },
      { key: 'guestbook.submit', label: 'Butang Hantar Ucapan', defaultValue: 'Hantar Ucapan' },
      { key: 'guestbook.submitting', label: 'Butang Menghantar Ucapan', defaultValue: 'Menghantar...' },
    ],
  },
  {
    label: 'Save The Date & Footer',
    fields: [
      { key: 'calendar.eyebrow', label: 'Label Kecil Calendar', defaultValue: 'Peringatan' },
      { key: 'calendar.title', label: 'Tajuk Calendar', defaultValue: 'Save the Date' },
      { key: 'calendar.description', label: 'Penerangan Calendar', multiline: true, defaultValue: 'Simpan tarikh ini dalam kalendar anda supaya tidak terlepas' },
      { key: 'calendar.google', label: 'Butang Google Calendar', defaultValue: 'Google Calendar' },
      { key: 'calendar.apple', label: 'Butang Apple Calendar', defaultValue: 'Apple Calendar (.ics)' },
      { key: 'footer.closing_prefix', label: 'Ayat Penutup', defaultValue: 'Dengan hormat,' },
      { key: 'footer.closing_family', label: 'Teks Keluarga', defaultValue: 'Keluarga Pengantin' },
      { key: 'footer.share_label', label: 'Label Kongsi Jemputan', defaultValue: 'Kongsi Jemputan' },
      { key: 'footer.whatsapp', label: 'Butang Kongsi WhatsApp', defaultValue: 'WhatsApp' },
      { key: 'footer.copy', label: 'Butang Salin Pautan', defaultValue: 'Salin Pautan' },
      { key: 'footer.copied', label: 'Butang Pautan Disalin', defaultValue: 'Disalin!' },
      { key: 'footer.credit_prefix', label: 'Kredit Footer', defaultValue: 'Dibuat dengan' },
    ],
  },
];

/** Flat lookup: key → defaultValue for quick access */
export const COPY_DEFAULTS: Record<string, string> = {};
for (const group of COPY_FIELDS) {
  for (const field of group.fields) {
    COPY_DEFAULTS[field.key] = field.defaultValue;
  }
}
