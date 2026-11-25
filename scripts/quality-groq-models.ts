import { writeFileSync } from 'node:fs';
import { buildAstroContext } from '../src/lib/astro';
import { buildUserPrompt, SYSTEM_PROMPT } from '../src/lib/prompt';
import { retrieveChunks } from '../src/lib/rag';
import { callGroq } from '../src/lib/providers';
import { DEFAULT_SETTINGS } from '../src/data/models';
import { getSign } from '../src/data/signs';
import type { GenerateInput, Settings } from '../src/types';
const input: GenerateInput = { sign: getSign('yay'), scope: 'hafta', character: 'erkek', tone: 'gizemli', citationMode: 'guclu', angle: 'yol ve anlam arayışı; görünmez emeğin karşılığı', platform: 'tiktok', duration: 12 };
const astro = buildAstroContext('hafta', new Date());
const chunks = retrieveChunks(input, astro, 6);
const base: Settings = { ...DEFAULT_SETTINGS, temperature: 0.85 };
const user = buildUserPrompt(input, astro, chunks, base);
for (const model of ['openai/gpt-oss-120b','qwen/qwen3.8-27b']) {
  const out = await callGroq(SYSTEM_PROMPT, user, { ...base, provider: 'groq', groqKey: process.env.GROQ_API_KEY || '', groqModel: model });
  writeFileSync(`/tmp/sample-${model.replace(/[\/.]/g,'-')}.json`, JSON.stringify(out.content, null, 2));
  console.log(model, 'ok', out.raw.length);
}
