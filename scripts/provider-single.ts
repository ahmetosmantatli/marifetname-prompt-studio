import { buildAstroContext } from '../src/lib/astro';
import { buildUserPrompt, normalizeContent, SYSTEM_PROMPT, validateContent } from '../src/lib/prompt';
import { retrieveChunks } from '../src/lib/rag';
import { callGemini, callGroq } from '../src/lib/providers';
import { DEFAULT_SETTINGS } from '../src/data/models';
import { getSign } from '../src/data/signs';
import type { GenerateInput, Settings } from '../src/types';
const input: GenerateInput = { sign: getSign('yay'), scope: 'hafta', character: 'erkek', tone: 'gizemli', citationMode: 'guclu', angle: 'yol ve anlam arayışı; görünmez emeğin karşılığı', platform: 'tiktok', duration: 12 };
const astro = buildAstroContext('hafta', new Date());
const chunks = retrieveChunks(input, astro, 6);
const base: Settings = { ...DEFAULT_SETTINGS, temperature: 0.85 };
const user = buildUserPrompt(input, astro, chunks, base);
const which = process.argv[2] || 'groq';
const s: Settings = which === 'gemini'
  ? { ...base, provider: 'gemini', geminiKey: process.env.GEMINI_API_KEY || '', geminiModel: process.env.MODEL || 'gemini-3.5-flash' }
  : { ...base, provider: 'groq', groqKey: process.env.GROQ_API_KEY || '', groqModel: process.env.MODEL || 'openai/gpt-oss-20b' };
const started = Date.now();
try {
  const out = which === 'gemini' ? await callGemini(SYSTEM_PROMPT, user, s) : await callGroq(SYSTEM_PROMPT, user, s);
  const content = normalizeContent(out.content, input, chunks);
  const issues = validateContent(content, input);
  const text = [content.hook, ...content.script, content.closing, content.caption].join(' ');
  console.log(`${which}/${s.provider === 'groq' ? s.groqModel : s.geminiModel} OK ${Date.now()-started}ms script=${content.script.length} hf=${content.higgsfieldPrompt.split(/\s+/).length}w issues=${issues.length ? issues.join('|') : 'none'} moon=${new RegExp(`Ay\\s+${astro.primaryMoonSign.name}`, 'i').test(text)} wrongMoon=${new RegExp(`Ay\\s+${input.sign.name}`, 'i').test(text)}`);
  console.log('HOOK:', content.hook);
} catch (err) {
  console.log(`${which} FAIL ${Date.now()-started}ms`, err instanceof Error ? err.message : err);
}
