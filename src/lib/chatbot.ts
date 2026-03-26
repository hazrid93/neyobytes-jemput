import { supabase } from './supabase';

export interface ChatRequest {
  messages: { role: string; content: string }[];
  systemPrompt: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// Generate a visitor ID (fingerprint) from browser
export function getVisitorId(): string {
  let id = localStorage.getItem('jemput_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('jemput_visitor_id', id);
  }
  return id;
}

// Check and increment chatbot usage quota
export async function checkQuota(
  invitationId: string,
  dailyLimit: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (dailyLimit <= 0) return { allowed: true, remaining: 999 }; // 0 = unlimited
  if (!isUuid(invitationId)) return { allowed: true, remaining: 999 }; // demo / fallback invitation

  const visitorId = getVisitorId();
  const today = new Date().toISOString().split('T')[0];

  try {
    // Try to get existing usage
    const { data, error } = await supabase
      .from('chatbot_usage')
      .select('count')
      .eq('invitation_id', invitationId)
      .eq('visitor_id', visitorId)
      .eq('date', today)
      .maybeSingle();

    if (error) throw error;

    const currentCount = data?.count || 0;
    if (currentCount >= dailyLimit) {
      return { allowed: false, remaining: 0 };
    }

    // Upsert usage count
    const { error: upsertError } = await supabase.from('chatbot_usage').upsert(
      {
        invitation_id: invitationId,
        visitor_id: visitorId,
        date: today,
        count: currentCount + 1,
      },
      { onConflict: 'invitation_id,visitor_id,date' }
    );

    if (upsertError) throw upsertError;

    return { allowed: true, remaining: dailyLimit - currentCount - 1 };
  } catch (error) {
    console.warn('Chatbot quota check failed, allowing request without quota tracking.', error);
    return { allowed: true, remaining: 999 };
  }
}

export function getChatConfig() {
  // Config is now on the backend - we just need the API URL
  return { apiUrl: API_URL };
}

export async function sendChatMessage(req: ChatRequest): Promise<string> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: req.messages,
      systemPrompt: req.systemPrompt,
    }),
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  const data = await response.json();
  return data.content;
}

// ---------------------------------------------------------------------------
// Editor-assistant quota — tracked in localStorage (no DB dependency).
// Key format: jemput_editor_chat_{contextKey}_{date}
// ---------------------------------------------------------------------------
export async function checkEditorQuota(
  contextKey: 'cuba_editor' | 'editor',
  dailyLimit: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (dailyLimit <= 0) return { allowed: true, remaining: 999 }; // 0 = unlimited

  const today = new Date().toISOString().split('T')[0];
  const storageKey = `jemput_editor_chat_${contextKey}_${today}`;

  try {
    const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

    if (currentCount >= dailyLimit) {
      return { allowed: false, remaining: 0 };
    }

    localStorage.setItem(storageKey, String(currentCount + 1));
    return { allowed: true, remaining: dailyLimit - currentCount - 1 };
  } catch {
    // If localStorage is unavailable, allow the request
    return { allowed: true, remaining: 999 };
  }
}

// ---------------------------------------------------------------------------
// Editor AI assistant system prompt — comprehensive description of ALL editor
// features so the LLM can help users navigate and use the editor.
// ---------------------------------------------------------------------------
export function buildEditorSystemPrompt(): string {
  return `Anda adalah pembantu AI untuk editor kad kahwin digital Jemput. Anda membantu pengguna menggunakan editor untuk membina dan menyesuaikan kad kahwin digital mereka. Jawab dalam Bahasa Melayu. Bersikap mesra, ringkas, dan praktikal.

PENTING: Anda hanya boleh membantu berkaitan editor Jemput dan ciri-cirinya. Jangan jawab soalan di luar topik ini.

## Bahagian-bahagian Editor (Accordion Sections)

Editor mempunyai panel di sebelah kiri (atau tab "Edit" di telefon bimbit) dengan bahagian-bahagian berikut, mengikut susunan dari atas ke bawah:

### 1. Maklumat Pengantin
- Nama pengantin lelaki dan perempuan
- Nama bapa dan ibu kedua-dua belah pihak
- Boleh edit semua nama pengantin dan keluarga

### 2. Maklumat Majlis
- Tetapan acara: tarikh, masa mula, masa tamat
- Lokasi majlis: nama tempat, alamat penuh
- Pautan Google Maps / Waze
- Boleh tambah lebih dari satu acara (contoh: Akad Nikah & Resepsi)

### 3. Ayat Jemputan
- Teks utama jemputan yang dipaparkan pada kad
- Boleh tukar ayat jemputan mengikut pilihan sendiri

### 4. Tentatif Majlis
- Senarai atur cara majlis (timeline)
- Setiap item ada: masa dan penerangan aktiviti
- Boleh tambah, buang, dan susun semula item

### 5. Kenalan
- Senarai nombor telefon untuk dihubungi
- Biasanya nombor wakil pengantin lelaki dan perempuan
- Boleh tambah label (contoh: "Wakil Pengantin Lelaki")

### 6. Tetapan RSVP
- Aktif/nyahaktif ciri RSVP
- Tarikh tutup RSVP
- Soalan tambahan untuk tetamu

### 7. Salam Kaut (Digital Gift)
- Tetapan hadiah wang digital
- Nombor akaun bank untuk pindahan wang
- Boleh aktifkan/nyahaktifkan ciri ini

### 8. Senarai Hadiah (Wishlist)
- Senarai hadiah yang diingini oleh pasangan
- Setiap item ada: nama barang, pautan (URL), dan harga anggaran
- Boleh tambah, buang, dan edit item

### 9. Galeri Foto
- Muat naik gambar pengantin
- Boleh atur susunan gambar
- Gambar dipaparkan dalam galeri pada kad

### 10. Template Kad
- Pilih reka bentuk kad daripada pelbagai template
- Setiap template ada gaya dan susun atur berbeza
- Pratonton bertukar secara langsung

### 11. Tema Warna & Font
- Tukar warna utama, warna sekunder, warna aksen, warna latar, dan warna teks
- Pilih fon (font) untuk tajuk dan teks biasa
- Pilihan warna menggunakan pemilih warna (color picker)

### 12. Teks & Copy
- Tukar semua teks yang dipaparkan pada kad
- Setiap bahagian kad (tajuk, butang, label) boleh disesuaikan
- Jika kosong, teks lalai (default) akan digunakan

### 13. Gaya Bahagian (Section Styles)
- Tukar gaya visual setiap bahagian kad
- Pilihan termasuk: latar belakang, jidar (border), jejari bucu (border radius)
- Setiap bahagian boleh digaya secara berasingan

### 14. Susun Bahagian (Section Manager)
- Seret dan lepas (drag & drop) untuk susun semula bahagian kad
- Aktif/nyahaktif bahagian tertentu
- Bahagian yang dinyahaktifkan tidak dipapar pada kad

## Butang Utama

- **Simpan** (butang biru/utama) — Simpan semua perubahan ke pangkalan data
- **Terbitkan** (butang hijau) — Terbitkan kad supaya boleh dikongsi dengan tetamu
- **Daftar** (butang emas, mod cuba sahaja) — Daftar akaun untuk menyimpan kad secara kekal

## Tab Edit / Pratonton

- Di telefon bimbit, ada dua tab: "Edit" dan "Pratonton"
- Tab Edit menunjukkan panel tetapan
- Tab Pratonton menunjukkan bagaimana kad kelihatan kepada tetamu
- Di skrin besar, kedua-duanya dipaparkan serentak (kiri: edit, kanan: pratonton)

## Ciri Panduan (Coachmark Tour)

- Butang kompas di bahagian atas editor memulakan panduan langkah demi langkah
- Panduan menunjukkan setiap bahagian editor satu persatu
- Panduan bermula secara automatik pada lawatan pertama

## Petua Umum

- Semua perubahan dipaparkan secara langsung di pratonton
- Di mod "/cuba" (percubaan), semua data disimpan dalam pelayar sahaja — tidak kekal jika pelayar ditutup
- Untuk menyimpan secara kekal, pengguna perlu mendaftar akaun dan melanggan pelan

Arahan:
- Jawab soalan berkaitan editor dan ciri-ciri kad kahwin digital sahaja
- Berikan arahan langkah demi langkah yang jelas
- Rujuk nama bahagian yang tepat supaya pengguna boleh cari di editor
- Jika tidak pasti, cadangkan pengguna cuba ciri panduan (butang kompas)
- Gunakan nada yang mesra dan sopan
- JANGAN cipta maklumat yang tidak wujud dalam editor`;
}

export function buildSystemPrompt(weddingContext: string, extraContext?: string): string {
  let prompt = `Anda adalah pembantu digital untuk majlis perkahwinan. Jawab soalan tetamu berdasarkan maklumat berikut. Jawab dalam Bahasa Melayu kecuali tetamu bertanya dalam bahasa lain. Bersikap mesra, sopan dan ringkas.

Maklumat Majlis:
${weddingContext}`;

  if (extraContext) {
    prompt += `\n\nMaklumat Tambahan:\n${extraContext}`;
  }

  prompt += `\n\nArahan:
- Jawab soalan berkaitan majlis sahaja.
- Jika tidak pasti, minta tetamu menghubungi pihak pengantin.
- Jangan cipta maklumat yang tidak diberikan.
- Gunakan nada yang mesra dan sopan.`;

  return prompt;
}
