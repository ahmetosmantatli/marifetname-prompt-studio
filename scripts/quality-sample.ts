import { writeFileSync } from 'node:fs';
import { buildAstroContext } from '../src/lib/astro';
import { buildUserPrompt, SYSTEM_PROMPT } from '../src/lib/prompt';
import { retrieveChunks } from '../src/lib/rag';
import { callGroq } from '../src/lib/providers';
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
const base: Settings = { ...DEFAULT_SETTINGS, temperature: 0.85 };
const user = buildUserPrompt(input, astro, chunks, base);

const groq = await callGroq(SYSTEM_PROMPT, user, { ...base, provider: 'groq', groqKey: process.env.GROQ_API_KEY || '', groqModel: 'openai/gpt-oss-20b' });
writeFileSync('/tmp/sample-groq.json', JSON.stringify(groq.content, null, 2));

const body = {
  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  contents: [{ role: 'user', parts: [{ text: user }] }],
  generationConfig: { temperature: 0.85, maxOutputTokens: 4096, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } }
};
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY || '')}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
});
const data = await res.json() as any;
const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '';
writeFileSync('/tmp/sample-gemini.json', text);
console.log('groq keys', Object.keys(groq.content));
console.log('gemini finish', data.candidates?.[0]?.finishReason, 'chars', text.length);
