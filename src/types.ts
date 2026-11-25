export type Element = 'ateş' | 'toprak' | 'hava' | 'su';
export type Modality = 'öncü' | 'sabit' | 'değişken';
export type PlanetKey = 'merih' | 'zuhre' | 'utarit' | 'kamer' | 'sems' | 'musteri' | 'zuhal';
export type Tone = 'duygusal' | 'agresif' | 'sakin' | 'gizemli' | 'otoriter';
export type Character = 'kadın' | 'erkek';
export type Scope = 'bugun' | 'yarin' | 'hafta' | 'ay';
export type CitationMode = 'yok' | 'arada' | 'guclu';
export type Provider = 'groq' | 'gemini' | 'demo';

export interface SignProfile {
  id: string;
  name: string;
  glyph: string;
  dates: string;
  element: Element;
  elementNature: string;
  modality: Modality;
  gender: 'erkek' | 'dişi';
  season: string;
  planet: PlanetKey;
  keyword: string;
  motto: string;
  gift: string;
  shadow: string;
  desire: string;
  wound: string;
  voice: string;
  body: string;
  islamic: string;
  moonElection: string;
  cities: string[];
  palette: string;
  accent: string;
}

export interface PlanetProfile {
  key: PlanetKey;
  name: string;
  glyph: string;
  nature: string;
  humor: string;
  day: string;
  hour: string;
  gifts: string[];
  shadows: string[];
  color: string;
  metal: string;
  voice: string;
}

export type KnowledgeTopic = 'burç' | 'gezegen' | 'ay' | 'mizaç' | 'mevsim' | 'zaman' | 'insan' | 'iklim' | 'çerçeve';

export interface KnowledgeChunk {
  id: string;
  title: string;
  topic: KnowledgeTopic;
  page: number;
  tags: string[];
  text: string;
  quote?: string;
}

export interface Settings {
  provider: Provider;
  groqKey: string;
  groqModel: string;
  geminiKey: string;
  geminiModel: string;
  embeddingModel: string;
  semanticRag: boolean;
  temperature: number;
  maxOutputTokens: number;
}

export interface AstroContext {
  scope: Scope;
  scopeLabel: string;
  dateLabel: string;
  rangeLabel: string;
  referenceISO: string;
  sunSign: SignProfile;
  moonSigns: SignProfile[];
  primaryMoonSign: SignProfile;
  moonPhase: string;
  illumination: number;
  planetaryDay: string;
  planetaryHour: string;
  season: string;
  hijri: string;
  weekday: string;
}

export interface GenerateInput {
  sign: SignProfile;
  scope: Scope;
  character: Character;
  tone: Tone;
  citationMode: CitationMode;
  angle: string;
  platform: 'reels' | 'tiktok' | 'shorts';
  duration: 8 | 10 | 12;
}

export interface GeneratedContent {
  hook: string;
  script: string[];
  closing: string;
  higgsfieldPrompt: string;
  bRollPrompt: string;
  negativePrompt: string;
  voiceDirection: string;
  onScreenText: string[];
  caption: string;
  hashtags: string[];
  sourceNotes: string[];
  thumbnailText: string;
}

export interface GenerationMeta {
  provider: Provider;
  model: string;
  createdAt: string;
  chunks: KnowledgeChunk[];
  astro: AstroContext;
  input: GenerateInput;
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  signId: string;
  signName: string;
  scope: Scope;
  character: Character;
  tone: Tone;
  provider: Provider;
  content: GeneratedContent;
  meta: GenerationMeta;
}
