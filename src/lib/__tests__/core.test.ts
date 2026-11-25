import { describe, expect, it } from 'vitest';
import { buildAstroContext, moonLongitude, planetaryDay, signFromLongitude, sunLongitude } from '../astro';
import { getDurationProfile } from '../duration';
import { getSign } from '../../data/signs';
import { generateDemoContent } from '../demo';
import { buildUserPrompt, normalizeContent, parseModelJson } from '../prompt';
import { retrieveChunks } from '../rag';
import type { GenerateInput } from '../../types';

const input: GenerateInput = {
  sign: getSign('koc'),
  scope: 'bugun',
  character: 'kadın',
  tone: 'agresif',
  citationMode: 'yok',
  angle: 'kariyerde görünmez emek',
  platform: 'reels',
  duration: 12,
  sceneMode: 'app',
  referenceNote: ''
};

describe('astro', () => {
  it('burç sınırlarını doğru hesaplar', () => {
    expect(signFromLongitude(0).id).toBe('koc');
    expect(signFromLongitude(29.9).id).toBe('koc');
    expect(signFromLongitude(30).id).toBe('boga');
    expect(signFromLongitude(330).id).toBe('balik');
  });

  it('25 Kasım 2026 için Güneş Yay, Ay bilgisi ve hicri tarih üretir', () => {
    const astro = buildAstroContext('bugun', new Date('2026-11-25T10:00:00Z'));
    expect(astro.sunSign.id).toBe('yay');
    expect(astro.moonSigns.length).toBeGreaterThan(0);
    expect(astro.moonPhase.length).toBeGreaterThan(0);
    expect(astro.hijri).toContain('1448');
    expect(astro.planetaryDay).toContain('Çarşamba');
  });

  it('gezegen gününü klasik sıraya göre verir', () => {
    const d = planetaryDay(new Date('2026-11-25T10:00:00Z'));
    expect(d.dayName).toBe('Çarşamba');
    expect(d.rulerKey).toBe('utarit');
  });

  it('güneş ve ay boylamları 0-360 aralığında', () => {
    const d = new Date('2026-11-25T10:00:00Z');
    expect(sunLongitude(d)).toBeGreaterThanOrEqual(0);
    expect(sunLongitude(d)).toBeLessThan(360);
    expect(moonLongitude(d)).toBeGreaterThanOrEqual(0);
    expect(moonLongitude(d)).toBeLessThan(360);
  });
});

describe('duration and scene', () => {
  it('30 sn üstü tek klip değil, sahne planı üretir', () => {
    const astro = buildAstroContext('bugun', new Date('2026-11-25T10:00:00Z'));
    const chunks = retrieveChunks(input, astro, 6);
    const longInput: GenerateInput = {
      ...input,
      duration: 40,
      sceneMode: 'existing',
      referenceNote: 'Soul ID: elif-01'
    };
    const prompt = buildUserPrompt(longInput, astro, chunks, {
      provider: 'demo', groqKey: '', groqModel: '', geminiKey: '', geminiModel: '',
      embeddingModel: '', semanticRag: false, temperature: 0.8, maxOutputTokens: 4096
    });
    expect(prompt).toContain('MEVCUT KARAKTER/ORTAM');
    expect(prompt).toContain('multi-scene');
    const content = normalizeContent({
      hook: 'İkizler, bugün kendi emeğini gör.',
      script: ['Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On'],
      closing: 'Nefes al.',
      higgsfieldPrompt: 'Existing character in an existing environment. '.repeat(8),
      caption: 'x',
      sourceNotes: []
    }, longInput, chunks);
    expect(content.scenePlan?.length).toBe(2);
    expect(getDurationProfile(40).singleClip).toBe(false);
    expect(getDurationProfile(12).singleClip).toBe(true);
  });
});

describe('rag', () => {
  it('Koç için ateş, Merih ve Ay-Koç pasajlarını getirir', () => {
    const astro = buildAstroContext('bugun', new Date('2026-11-25T10:00:00Z'));
    const chunks = retrieveChunks(input, astro, 6);
    expect(chunks.length).toBe(6);
    const ids = chunks.map((c) => c.chunk.id);
    expect(ids).toContain('unsur-ates');
    expect(ids).toContain('gezegen-merih');
    expect(chunks.some((c) => c.chunk.tags.includes('koç'))).toBe(true);
  });
});

describe('demo', () => {
  it('atıf kapalıyken Mârifetnâme adını anmaz', () => {
    const astro = buildAstroContext('bugun', new Date('2026-11-25T10:00:00Z'));
    const chunks = retrieveChunks(input, astro, 6);
    const content = generateDemoContent(input, astro, chunks);
    expect(content.script.join(' ')).not.toContain('Mârifetnâme');
    expect(content.hook.length).toBeGreaterThan(10);
    expect(content.higgsfieldPrompt).toContain('Vertical 9:16');
    expect(content.script.length).toBeGreaterThanOrEqual(4);
  });

  it('güçlü atıf modunda sayfa numarası verir', () => {
    const astro = buildAstroContext('bugun', new Date('2026-11-25T10:00:00Z'));
    const chunks = retrieveChunks({ ...input, citationMode: 'guclu' }, astro, 6);
    const content = generateDemoContent({ ...input, citationMode: 'guclu' }, astro, chunks);
    expect(content.script.join(' ')).toContain('Mârifetnâme');
    expect(content.script.join(' ')).toMatch(/s\. \d+/);
    expect(content.sourceNotes.length).toBeGreaterThan(0);
  });
});

describe('prompt', () => {
  it('fenced JSON ve Türkçe anahtarları tolere eder', () => {
    const parsed = parseModelJson('```json\n{"hook":"Merhaba","senaryo":["a","b"],"kapanis":"c"}\n```');
    expect(parsed.hook).toBe('Merhaba');
    expect(parsed.script).toEqual(['a', 'b']);
    expect(parsed.closing).toBe('c');
  });

  it('eksik alanları normalize eder', () => {
    const astro = buildAstroContext('bugun', new Date('2026-11-25T10:00:00Z'));
    const chunks = retrieveChunks(input, astro, 6);
    const content = normalizeContent({ hook: 'Test' }, input, chunks);
    expect(content.script.length).toBeGreaterThan(0);
    expect(content.hashtags.length).toBeGreaterThan(0);
    expect(content.higgsfieldPrompt).toBe('');
  });
});
