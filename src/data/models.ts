import type { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  provider: 'demo',
  groqKey: '',
  groqModel: 'openai/gpt-oss-20b',
  geminiKey: '',
  geminiModel: 'gemini-3.5-flash',
  embeddingModel: 'gemini-embedding-001',
  semanticRag: false,
  temperature: 0.85,
  maxOutputTokens: 4096
};

export const GROQ_SUGGESTIONS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b'
];

export const GEMINI_SUGGESTIONS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-pro'
];
