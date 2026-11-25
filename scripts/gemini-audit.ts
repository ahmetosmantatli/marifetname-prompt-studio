import { buildAstroContext } from '../src/lib/astro';
import { buildUserPrompt, SYSTEM_PROMPT } from '../src/lib/prompt';
import { retrieveChunks } from '../src/lib/rag';
import { DEFAULT_SETTINGS } from '../src/data/models';
import { getSign } from '../src/data/signs';
import type { GenerateInput } from '../src/types';

const input: GenerateInput = {
  sign: getSign('yay'), scope: 'hafta', character: 'erkek', tone: 'gizemli',
  citationMode: 'guclu', angle: 'yol ve anlam arayışı; görünmez emeğin karşılığı',
  platform: 'tiktok', duration: 12
};
const astro = buildAstroContext('hafta', new Date());
const chunks = retrieveChunks(input, astro, 6);
const user = buildUserPrompt(input, astro, chunks, { ...DEFAULT_SETTINGS, provider: 'gemini' });

const models = (process.env.GEMINI_MODELS || 'gemini-3.5-flash,gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-flash-latest').split(',');
const key = process.env.GEMINI_API_KEY || '';

for (const model of models) {
  for (const thinking of [0, undefined] as const) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);
    const started = Date.now();
    try {
      const body: Record<string, unknown> = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
          ...(thinking === 0 ? { thinkingConfig: { thinkingBudget: 0 } } : {})
        }
      };
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal
      });
      const data = await res.json() as any;
      if (!res.ok) {
        console.log(`GEMINI ${model} thinking=${thinking ?? 'default'} HTTP ${res.status} ${Date.now()-started}ms ${JSON.stringify(data.error?.message || data).slice(0,180)}`);
      } else {
        const cand = data.candidates?.[0];
        const text = cand?.content?.parts?.map((p: any) => p.text || '').join('') || '';
        console.log(`GEMINI ${model} thinking=${thinking ?? 'default'} OK ${Date.now()-started}ms finish=${cand?.finishReason} chars=${text.length} usage=${JSON.stringify(data.usageMetadata)} start=${JSON.stringify(text.slice(0,100))}`);
      }
    } catch (err) {
      console.log(`GEMINI ${model} thinking=${thinking ?? 'default'} FAIL ${Date.now()-started}ms ${err instanceof Error ? err.message : err}`);
    } finally {
      clearTimeout(timer);
    }
  }
}
