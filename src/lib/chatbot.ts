import { supabase } from './supabase';

export interface ChatRequest {
  messages: { role: string; content: string }[];
  systemPrompt: string;
}

export interface ChatConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
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

export function getChatConfig(): ChatConfig | null {
  const baseUrl = import.meta.env.VITE_LLM_BASE_URL;
  const apiKey = import.meta.env.VITE_LLM_API_KEY;
  const model = import.meta.env.VITE_LLM_MODEL;

  if (!baseUrl || !apiKey || !model) {
    return null;
  }

  return {
    baseUrl,
    apiKey,
    model,
    maxTokens: Number(import.meta.env.VITE_LLM_MAX_TOKENS) || 512,
    temperature: Number(import.meta.env.VITE_LLM_TEMPERATURE) || 0.7,
  };
}

export async function sendChatMessage(req: ChatRequest): Promise<string> {
  const config = getChatConfig();

  if (!config) {
    throw new Error('Chatbot belum dikonfigurasi. Sila tetapkan pemboleh ubah persekitaran LLM.');
  }

  const { baseUrl, apiKey, model, maxTokens, temperature } = config;

  // Build messages array with system prompt at the front
  const messages = [
    { role: 'system', content: req.systemPrompt },
    ...req.messages,
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`LLM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // OpenAI-compatible response format
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Respons tidak sah daripada API.');
  }

  return content;
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
