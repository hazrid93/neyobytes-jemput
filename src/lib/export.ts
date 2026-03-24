import * as XLSX from 'xlsx';
import type { RSVP } from '../types';

export function exportRSVPsToExcel(rsvps: RSVP[], coupleName: string) {
  const wb = XLSX.utils.book_new();

  // --- Summary sheet ---
  const totalRSVPs = rsvps.length;
  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalAdults = rsvps.reduce((sum, r) => sum + r.num_adults, 0);
  const totalChildren = rsvps.reduce((sum, r) => sum + r.num_children, 0);

  const summaryData = [
    ['Ringkasan RSVP', ''],
    ['', ''],
    ['Jumlah RSVP', totalRSVPs],
    ['Hadir', attending.length],
    ['Tidak Hadir', notAttending.length],
    ['', ''],
    ['Jumlah Dewasa', totalAdults],
    ['Jumlah Kanak-kanak', totalChildren],
    ['Jumlah Keseluruhan Tetamu', totalAdults + totalChildren],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 28 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan');

  // --- Guest List sheet ---
  const guestHeaders = [
    'Nama',
    'Telefon',
    'Status',
    'Dewasa',
    'Kanak-kanak',
    'Mesej',
    'Tarikh',
  ];

  const guestRows = rsvps.map((r) => [
    r.guest_name,
    r.phone || '-',
    r.attending ? 'Hadir' : 'Tidak Hadir',
    r.num_adults,
    r.num_children,
    r.message || '-',
    new Date(r.created_at).toLocaleDateString('ms-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  ]);

  const guestSheet = XLSX.utils.aoa_to_sheet([guestHeaders, ...guestRows]);
  guestSheet['!cols'] = [
    { wch: 24 },
    { wch: 16 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 40 },
    { wch: 28 },
  ];
  XLSX.utils.book_append_sheet(wb, guestSheet, 'Senarai Tetamu');

  // Generate filename and trigger download
  const dateStr = new Date().toISOString().split('T')[0];
  const safeName = coupleName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  const filename = `RSVP_${safeName}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, filename);
}
