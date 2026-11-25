import type { GeneratedContent, Settings } from '../types';
import { parseModelJson } from './prompt';

export interface ProviderOutput {
  content: Partial<GeneratedContent>;
  model: string;
  raw: string;
}

const TIMEOUT_MS = 75_000;

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

export async function callGroq(system: string, user: string, settings: Settings): Promise<ProviderOutput> {
  if (!settings.groqKey) throw new Error('Groq API anahtarı ayarlarda yok.');
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const base = {
    model: settings.groqModel,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: settings.temperature,
    max_tokens: 2600
  };
  let res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.groqKey}`
    },
    body: JSON.stringify({ ...base, response_format: { type: 'json_object' } })
  });
  if (!res.ok) {
    const firstError = await errorText(res);
    // Bazı modeller json_object desteklemez; bir kez de onsuz dene.
    res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.groqKey}`
      },
      body: JSON.stringify(base)
    });
    if (!res.ok) {
      throw new Error(`Groq hatası: ${await errorText(res)}${firstError ? ` (ilk deneme: ${firstError})` : ''}`);
    }
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };
  const raw = data.choices?.[0]?.message?.content ?? '';
  if (!raw) throw new Error(data.error?.message || 'Groq boş yanıt döndürdü.');
  return { content: parseModelJson(raw), model: settings.groqModel, raw };
}

export async function callGemini(system: string, user: string, settings: Settings): Promise<ProviderOutput> {
  if (!settings.geminiKey) throw new Error('Gemini API anahtarı ayarlarda yok.');
  const model = settings.geminiModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(settings.geminiKey)}`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: {
      temperature: settings.temperature,
      maxOutputTokens: 2600,
      responseMimeType: 'application/json'
    }
  };
  let res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    // responseMimeType bazı modellerde desteklenmez; onsuz dene.
    const firstError = await errorText(res);
    const fallback = {
      ...body,
      generationConfig: { temperature: settings.temperature, maxOutputTokens: 2600 }
    };
    res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fallback)
    });
    if (!res.ok) throw new Error(`Gemini hatası: ${await errorText(res)}${firstError ? ` (ilk deneme: ${firstError})` : ''}`);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    error?: { message?: string };
  };
  const raw = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  if (!raw) throw new Error(data.error?.message || 'Gemini boş yanıt döndürdü.');
  return { content: parseModelJson(raw), model, raw };
}

export async function listGroqModels(key: string): Promise<string[]> {
  if (!key) throw new Error('Groq anahtarı gerekli.');
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${key}` }
  });
  if (!res.ok) throw new Error(`Groq modelleri alınamadı: ${await errorText(res)}`);
  const data = (await res.json()) as { data?: { id: string; active?: boolean }[] };
  return (data.data ?? [])
    .filter((m) => m.active !== false)
    .map((m) => m.id)
    .sort();
}

export async function listGeminiModels(key: string): Promise<string[]> {
  if (!key) throw new Error('Gemini anahtarı gerekli.');
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`
  );
  if (!res.ok) throw new Error(`Gemini modelleri alınamadı: ${await errorText(res)}`);
  const data = (await res.json()) as {
    models?: { name: string; supportedGenerationMethods?: string[] }[];
  };
  return (data.models ?? [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name.replace(/^models\//, ''))
    .sort();
}

export async function testProvider(settings: Settings): Promise<string> {
  if (settings.provider === 'groq') {
    const models = await listGroqModels(settings.groqKey);
    return `Groq bağlantısı tamam. ${models.length} model görünüyor.`;
  }
  if (settings.provider === 'gemini') {
    const models = await listGeminiModels(settings.geminiKey);
    return `Gemini bağlantısı tamam. ${models.length} model görünüyor.`;
  }
  return 'Demo modu yerel olarak çalışıyor; anahtar gerekmez.';
}
