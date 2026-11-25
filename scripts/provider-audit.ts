import { buildAstroContext } from '../src/lib/astro';
import { buildUserPrompt, normalizeContent, SYSTEM_PROMPT } from '../src/lib/prompt';
import { retrieveChunks } from '../src/lib/rag';
import { callGemini, callGroq } from '../src/lib/providers';
import { DEFAULT_SETTINGS } from '../src/data/models';
import { getSign } from '../src/data/signs';
import type { GenerateInput, Settings } from '../src/types';

const input: GenerateInput = {
  sign: getSign('yay'),
  scope: 'hafta',
  character: 'erkek',
  tone: 'gizemli',
  citationMode: 'guclu',
  angle: 'yol ve anlam arayışı; görünmez emeğin karşılığı',
  platform: 'tiktok',
  duration: 12
};

const astro = buildAstroContext('hafta', new Date());
const chunks = retrieveChunks(input, astro, 6);
const base: Settings = { ...DEFAULT_SETTINGS, temperature: 0.85 };

const prompt = buildUserPrompt(input, astro, chunks, base);
console.log(`system chars=${SYSTEM_PROMPT.length} user chars=${prompt.length} approxTokens=${Math.round((SYSTEM_PROMPT.length + prompt.length) / 4)}`);

const groqModels = (process.env.GROQ_MODELS || 'openai/gpt-oss-120b,openai/gpt-oss-20b,qwen/qwen3.8-27b,allam-2-7b').split(',');
const geminiModels = (process.env.GEMINI_MODELS || 'gemini-2.5-flash,gemini-2.5-flash-lite,gemini-3.5-flash,gemini-3.8-flash').split(',');

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

for (const model of groqModels) {
  const started = Date.now();
  try {
    const out = await callGroq(SYSTEM_PROMPT, prompt, {
      ...base,
      provider: 'groq',
      groqKey: process.env.GROQ_API_KEY || '',
      groqModel: model
    });
    const content = normalizeContent(out.content, input, chunks);
    console.log(`GROQ ${model} OK ${Date.now() - started}ms raw=${out.raw.length} script=${content.script.length} hfWords=${wordCount(content.higgsfieldPrompt)} sources=${content.sourceNotes.length}`);
  } catch (err) {
    console.log(`GROQ ${model} FAIL ${Date.now() - started}ms ${err instanceof Error ? err.message.slice(0, 240) : err}`);
  }
}

for (const model of geminiModels) {
  const started = Date.now();
  try {
    const out = await callGemini(SYSTEM_PROMPT, prompt, {
      ...base,
      provider: 'gemini',
      geminiKey: process.env.GEMINI_API_KEY || '',
      geminiModel: model
    });
    const content = normalizeContent(out.content, input, chunks);
    console.log(`GEMINI ${model} OK ${Date.now() - started}ms raw=${out.raw.length} script=${content.script.length} hfWords=${wordCount(content.higgsfieldPrompt)} sources=${content.sourceNotes.length}`);
  } catch (err) {
    console.log(`GEMINI ${model} FAIL ${Date.now() - started}ms ${err instanceof Error ? err.message.slice(0, 240) : err}`);
  }
}
