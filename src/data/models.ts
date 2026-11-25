import type { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  provider: 'demo',
  groqKey: '',
  groqModel: 'llama-3.3-70b-versatile',
  geminiKey: '',
  geminiModel: 'gemini-2.5-flash',
  embeddingModel: 'gemini-embedding-001',
  semanticRag: false,
  temperature: 0.85
};

export const GROQ_SUGGESTIONS = [
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3-32b',
  'meta-llama/llama-4-scout-17b-16e-instruct'
];

export const GEMINI_SUGGESTIONS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash'
];
