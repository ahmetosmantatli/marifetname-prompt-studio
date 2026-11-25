import type { GeneratedContent, Provider, Settings } from '../types';
import { parseModelJson } from './prompt';

export interface ProviderOutput {
  content: Partial<GeneratedContent>;
  model: string;
  raw: string;
}

const TIMEOUT_MS = 120_000;
const STRICT_SUFFIX =
  '\n\nÖNEMLİ: Yanıt YALNIZCA geçerli JSON olsun. Markdown, kod bloğu, açıklama veya JSON dışı metin ekleme. Tüm alanları doldur; script 8-12 replik, higgsfieldPrompt 120-180 kelime olsun.';

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function errorText(res: Response): Promise<string> {
  const text = await res.text().catch(() => '');
  try {
    const data = JSON.parse(text) as { error?: { message?: string } | string; message?: string };
    if (typeof data.error === 'string') return data.error;
    if (data.error?.message) return data.error.message;
    if (data.message) return data.message;
  } catch {
    // düz metin
  }
  return text.slice(0, 300);
}

function effectiveMaxTokens(settings: Settings): number {
  const requested = Math.max(512, settings.maxOutputTokens || 3072);
  if (settings.provider === 'groq' && /qwen/i.test(settings.groqModel)) {
    // Qwen ücretsiz katmanda OTPM 1000; daha yüksek max_tokens istek reddedilir.
    return Math.min(requested, 1000);
  }
  if (settings.provider === 'gemini') return Math.min(requested, 8192);
  return Math.min(requested, 4096);
}

function friendlyGroqError(message: string): string {
  const wait = /try again in ([\d.]+)s/i.exec(message);
  if (/rate limit reached/i.test(message)) {
    return `Groq ücretsiz kota sınırı (TPM 8000).${wait ? ` ${Math.ceil(Number(wait[1]))} saniye` : ' Yaklaşık 1 dakika'} bekleyip tekrar deneyin. Bu sırada Gemini 3.5 Flash veya daha kısa bir çıktı kullanabilirsiniz.`;
  }
  if (/request too large.*output tokens per minute|OTPM/i.test(message)) {
    return 'Bu modelin ücretsiz çıktı kotası (OTPM 1000) aşıldı. Qwen yerine GPT-OSS 20B/120B veya Gemini deneyin.';
  }
  if (/failed to validate json|failed to generate json/i.test(message)) {
    return 'Model JSON formatını doğrulayamadı. Tekrar deneyin; sürerse GPT-OSS 20B/120B veya Gemini 3.5 Flash seçin.';
  }
  return message;
}

async function requestGroq(system: string, user: string, settings: Settings, strict: boolean): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const body = {
    model: settings.groqModel,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: strict ? `${user}${STRICT_SUFFIX}` : user }
    ],
    temperature: strict ? 0.4 : settings.temperature,
    max_tokens: effectiveMaxTokens(settings)
  };
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.groqKey}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Groq hatası: ${friendlyGroqError(await errorText(res))}`);
  const data = (await res.json()) as {
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    error?: { message?: string };
  };
  const choice = data.choices?.[0];
  const raw = choice?.message?.content ?? '';
  if (!raw) throw new Error(friendlyGroqError(data.error?.message || 'Groq boş yanıt döndürdü.'));
  if (choice?.finish_reason === 'length') {
    throw new Error('Groq çıktısı token limitine takıldı. Ayarlardan maksimum çıktı tokenını artırın veya daha kısa bir model seçin.');
  }
  return raw;
}

export async function callGroq(system: string, user: string, settings: Settings): Promise<ProviderOutput> {
  if (!settings.groqKey) throw new Error('Groq API anahtarı ayarlarda yok.');
  let raw = await requestGroq(system, user, settings, false);
  try {
    return { content: parseModelJson(raw), model: settings.groqModel, raw };
  } catch {
    raw = await requestGroq(system, user, settings, true);
    try {
      return { content: parseModelJson(raw), model: settings.groqModel, raw };
    } catch {
      throw new Error('Groq geçerli JSON döndürmedi. Modeli değiştirin veya tekrar deneyin.');
    }
  }
}

function supportsThinkingBudgetZero(model: string): boolean {
  return new Set(['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.5-flash']).has(model);
}

async function requestGemini(system: string, user: string, settings: Settings, strict: boolean): Promise<string> {
  const model = settings.geminiModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(settings.geminiKey)}`;
  const thinking = supportsThinkingBudgetZero(model);
  const text = strict ? `${user}${STRICT_SUFFIX}` : user;
  const makeBody = (withMime: boolean, withThinking: boolean) => ({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text }] }],
    generationConfig: {
      temperature: strict ? 0.4 : settings.temperature,
      maxOutputTokens: effectiveMaxTokens(settings),
      ...(withMime ? { responseMimeType: 'application/json' } : {}),
      ...(withThinking && thinking ? { thinkingConfig: { thinkingBudget: 0 } } : {})
    }
  });

  let res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(makeBody(true, true))
  });
  let firstError = '';
  if (!res.ok) {
    firstError = await errorText(res);
    // 3.5 flash-lite gibi modeller thinkingBudget=0 kabul etmez; düşürüp dene.
    res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makeBody(true, false))
    });
  }
  if (!res.ok) {
    // responseMimeType bazı modellerde desteklenmez; onsuz dene.
    res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makeBody(false, false))
    });
  }
  if (!res.ok) {
    const msg = await errorText(res);
    const friendly = /high demand|overloaded|503/i.test(msg)
      ? 'Gemini modeli şu an yoğun (503). Birkaç saniye sonra tekrar deneyin; uygulama otomatik olarak 3.1 Flash Lite ile de deneyebilir.'
      : msg;
    throw new Error(`Gemini hatası: ${friendly}${firstError ? ` (ilk deneme: ${firstError.slice(0, 120)})` : ''}`);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    error?: { message?: string };
  };
  const candidate = data.candidates?.[0];
  const raw = candidate?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  if (!raw) throw new Error(data.error?.message || 'Gemini boş yanıt döndürdü.');
  if (candidate?.finishReason === 'MAX_TOKENS') {
    throw new Error('Gemini çıktısı token limitine takıldı. Ayarlardan maksimum çıktı tokenını artırın.');
  }
  if (candidate?.finishReason === 'SAFETY' || candidate?.finishReason === 'BLOCKLIST') {
    throw new Error('Gemini içerik filtresine takıldı. Tonu yumuşatıp tekrar deneyin.');
  }
  return raw;
}

export async function callGemini(system: string, user: string, settings: Settings): Promise<ProviderOutput> {
  if (!settings.geminiKey) throw new Error('Gemini API anahtarı ayarlarda yok.');
  let raw = await requestGemini(system, user, settings, false);
  try {
    return { content: parseModelJson(raw), model: settings.geminiModel, raw };
  } catch {
    raw = await requestGemini(system, user, settings, true);
    try {
      return { content: parseModelJson(raw), model: settings.geminiModel, raw };
    } catch {
      throw new Error('Gemini geçerli JSON döndürmedi. Modeli değiştirin veya tekrar deneyin.');
    }
  }
}

const GROQ_PREFERRED = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];

export async function listGroqModels(key: string): Promise<string[]> {
  if (!key) throw new Error('Groq anahtarı gerekli.');
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${key}` }
  });
  if (!res.ok) throw new Error(`Groq modelleri alınamadı: ${await errorText(res)}`);
  const data = (await res.json()) as {
    data?: { id: string; active?: boolean; context_window?: number }[];
  };
  const usable = (data.data ?? [])
    .filter((m) => m.active !== false)
    .filter((m) => (m.context_window ?? 0) >= 16_000)
    .filter((m) => !/(whisper|orpheus|prompt-guard|safeguard)/i.test(m.id))
    .map((m) => m.id);
  const rank = (id: string) => {
    const i = GROQ_PREFERRED.indexOf(id);
    return i === -1 ? GROQ_PREFERRED.length : i;
  };
  return [...new Set(usable)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

const GEMINI_PREFERRED = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-2.5-pro'
];

export async function listGeminiModels(key: string): Promise<string[]> {
  if (!key) throw new Error('Gemini anahtarı gerekli.');
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`
  );
  if (!res.ok) throw new Error(`Gemini modelleri alınamadı: ${await errorText(res)}`);
  const data = (await res.json()) as {
    models?: { name: string; supportedGenerationMethods?: string[]; inputTokenLimit?: number }[];
  };
  const usable = (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .filter((m) => (m.inputTokenLimit ?? 0) >= 16_000)
    .filter((m) => !/(image|tts|transcribe|robotics|computer-use|deep-research|lyria|nano-banana|antigravity|embedding|aqa|veo)/i.test(m.name))
    .map((m) => m.name.replace(/^models\//, ''));
  const rank = (id: string) => {
    const i = GEMINI_PREFERRED.indexOf(id);
    return i === -1 ? GEMINI_PREFERRED.length : i;
  };
  return [...new Set(usable)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

export function recommendedFallback(provider: Provider, current: string): string | null {
  if (provider === 'groq') {
    return current === 'openai/gpt-oss-20b' ? 'openai/gpt-oss-120b' : 'openai/gpt-oss-20b';
  }
  if (provider === 'gemini') {
    return current === 'gemini-3.5-flash' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash';
  }
  return null;
}

export function shouldFallback(message: string): boolean {
  return /(no longer available|not found|decommission|deprecated|503|high demand|overloaded|aborted|zaman aşımı|token limitine)/i.test(message);
}

export async function testProvider(settings: Settings): Promise<string> {
  if (settings.provider === 'groq') {
    const models = await listGroqModels(settings.groqKey);
    return `Groq bağlantısı tamam. ${models.length} metin modeli görünüyor: ${models.join(', ')}`;
  }
  if (settings.provider === 'gemini') {
    const models = await listGeminiModels(settings.geminiKey);
    return `Gemini bağlantısı tamam. ${models.length} metin modeli görünüyor.`;
  }
  return 'Demo modu yerel olarak çalışıyor; anahtar gerekmez.';
}
