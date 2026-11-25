import { writeFileSync } from 'node:fs';
import { buildAstroContext } from '../src/lib/astro';
import { buildUserPrompt, normalizeContent, SYSTEM_PROMPT, validateContent } from '../src/lib/prompt';
import { retrieveChunks } from '../src/lib/rag';
import { callGemini, callGroq } from '../src/lib/providers';
import { DEFAULT_SETTINGS } from '../src/data/models';
import { getSign } from '../src/data/signs';
import type { GenerateInput, Settings } from '../src/types';

const input: GenerateInput = {
  sign: getSign('yay'), scope: 'hafta', character: 'erkek', tone: 'gizemli',
  citationMode: 'guclu', angle: 'yol ve anlam arayışı; görünmez emeğin karşılığı',
  platform: 'tiktok', duration: 12
};
const astro = buildAstroContext('hafta', new Date());
const chunks = retrieveChunks(input, astro, 6);
const base: Settings = { ...DEFAULT_SETTINGS, temperature: 0.85, maxOutputTokens: 4096 };
const user = buildUserPrompt(input, astro, chunks, base);
console.log(`MOON=${astro.primaryMoonSign.name} DAY=${astro.planetaryDay} HOUR=${astro.planetaryHour}`);

const run = async (label: string, s: Settings) => {
  const started = Date.now();
  try {
    const out = s.provider === 'groq' ? await callGroq(SYSTEM_PROMPT, user, s) : await callGemini(SYSTEM_PROMPT, user, s);
    const content = normalizeContent(out.content, input, chunks);
    const issues = validateContent(content, input);
    const text = [content.hook, ...content.script, content.closing, content.caption].join(' ');
    const wrongMoon = new RegExp(`Ay\\s+${input.sign.name}`, 'i').test(text);
    const correctMoon = new RegExp(`Ay\\s+${astro.primaryMoonSign.name}`, 'i').test(text);
    const wrongPlanet = /Zühal|Merih/.test(text) && !/Utarit|Zühre/.test(text);
    console.log(`${label} OK ${Date.now()-started}ms script=${content.script.length} hf=${content.higgsfieldPrompt.split(/\s+/).length}w issues=${issues.length ? issues.join('|') : 'none'} correctMoon=${correctMoon} wrongMoon=${wrongMoon} wrongPlanet=${wrongPlanet}`);
    writeFileSync(`/tmp/new-${label.replace(/[^a-z0-9]/gi,'-')}.json`, JSON.stringify(content, null, 2));
  } catch (err) {
    console.log(`${label} FAIL ${Date.now()-started}ms ${err instanceof Error ? err.message : err}`);
  }
};

await run('groq-20b', { ...base, provider: 'groq', groqKey: process.env.GROQ_API_KEY || '', groqModel: 'openai/gpt-oss-20b' });
await run('groq-120b', { ...base, provider: 'groq', groqKey: process.env.GROQ_API_KEY || '', groqModel: 'openai/gpt-oss-120b' });
await run('qwen', { ...base, provider: 'groq', groqKey: process.env.GROQ_API_KEY || '', groqModel: 'qwen/qwen3.8-27b' });
await run('gemini-35-flash', { ...base, provider: 'gemini', geminiKey: process.env.GEMINI_API_KEY || '', geminiModel: 'gemini-3.5-flash' });
