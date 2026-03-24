import { supabase } from './supabase';

export interface ChatRequest {
  messages: { role: string; content: string }[];
  systemPrompt: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

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

  const visitorId = getVisitorId();
  const today = new Date().toISOString().split('T')[0];

  // Try to get existing usage
  const { data } = await supabase
    .from('chatbot_usage')
    .select('count')
    .eq('invitation_id', invitationId)
    .eq('visitor_id', visitorId)
    .eq('date', today)
    .single();

  const currentCount = data?.count || 0;
  if (currentCount >= dailyLimit) {
    return { allowed: false, remaining: 0 };
  }

  // Upsert usage count
  await supabase.from('chatbot_usage').upsert(
    {
      invitation_id: invitationId,
      visitor_id: visitorId,
      date: today,
      count: currentCount + 1,
    },
    { onConflict: 'invitation_id,visitor_id,date' }
  );

  return { allowed: true, remaining: dailyLimit - currentCount - 1 };
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
