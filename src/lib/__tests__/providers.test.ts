import { afterEach, describe, expect, it, vi } from 'vitest';
import { callGemini, callGroq, listGroqModels, testProvider } from '../providers';
import { buildUserPrompt, SYSTEM_PROMPT } from '../prompt';
import { buildAstroContext } from '../astro';
import { retrieveChunks } from '../rag';
import { DEFAULT_SETTINGS } from '../../data/models';
import { getSign } from '../../data/signs';
import type { GenerateInput, Settings } from '../../types';

const input: GenerateInput = {
  sign: getSign('yay'),
  scope: 'hafta',
  character: 'erkek',
  tone: 'gizemli',
  citationMode: 'guclu',
  angle: 'yol ve anlam arayışı',
  platform: 'tiktok',
  duration: 12
};

const settings: Settings = {
  ...DEFAULT_SETTINGS,
  provider: 'groq',
  groqKey: 'gsk_test',
  geminiKey: 'AIza_test'
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('prompt', () => {
  it('sistem promptu kehanet ve uydurma dini metin yasağını içerir', () => {
    expect(SYSTEM_PROMPT).toContain('Kuran ayeti veya hadis uydurma');
    expect(SYSTEM_PROMPT).toContain('Kesin kehanet yok');
    expect(SYSTEM_PROMPT).toContain('Mârifetnâme');
  });

  it('kullanıcı promptu RAG sayfalarını ve atıf modunu taşır', () => {
    const astro = buildAstroContext('hafta', new Date('2026-11-25T10:00:00Z'));
    const chunks = retrieveChunks(input, astro, 6);
    const prompt = buildUserPrompt(input, astro, chunks, settings);
    expect(prompt).toContain('KAYNAK PASAJLAR');
    expect(prompt).toContain('s. ');
    expect(prompt).toContain('güçlü atıf');
    expect(prompt).toContain('Yay');
    expect(prompt).toContain('yol ve anlam arayışı');
  });
});

describe('providers', () => {
  it('anahtar yoksa anlaşılır hata verir', async () => {
    await expect(callGroq('s', 'u', { ...settings, groqKey: '' })).rejects.toThrow('Groq API anahtarı');
    await expect(callGemini('s', 'u', { ...settings, geminiKey: '' })).rejects.toThrow('Gemini API anahtarı');
  });

  it('Groq JSON yanıtını ayrıştırır', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      choices: [{ message: { content: '{"hook":"Groq hook","script":["a","b"],"closing":"c"}' } }]
    })));
    const out = await callGroq('s', 'u', settings);
    expect(out.model).toBe('llama-3.3-70b-versatile');
    expect(out.content.hook).toBe('Groq hook');
    expect(out.content.script).toEqual(['a', 'b']);
  });

  it('Gemini JSON yanıtını kod bloğundan temizler', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      candidates: [{ content: { parts: [{ text: '```json\n{"hook":"Gemini hook"}\n```' }] } }]
    })));
    const out = await callGemini('s', 'u', { ...settings, provider: 'gemini' });
    expect(out.content.hook).toBe('Gemini hook');
  });

  it('Groq hata mesajını kullanıcıya taşır', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ error: { message: 'invalid key' } }, 401)));
    await expect(callGroq('s', 'u', settings)).rejects.toThrow('Groq hatası');
  });

  it('Groq model listesini döndürür', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ id: 'model-b', active: true }, { id: 'model-a', active: true }, { id: 'off', active: false }]
    })));
    await expect(listGroqModels('gsk_test')).resolves.toEqual(['model-a', 'model-b']);
  });

  it('demo testi anahtarsız geçer', async () => {
    await expect(testProvider({ ...DEFAULT_SETTINGS, provider: 'demo' })).resolves.toContain('Demo');
  });
});
