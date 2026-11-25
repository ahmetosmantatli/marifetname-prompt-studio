import type { AstroContext, GenerateInput, KnowledgeChunk, Settings } from '../types';
import { KNOWLEDGE } from '../data/knowledge';
import { buildEmbeddingIndex, cosine, embedQuery } from './embeddings';

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
  reason: string;
}

const STOPWORDS = new Set(
  've bir bu da de ki mi mu mü için ile olan olarak daha çok gibi ama fakat veya ya en her hem değil ne nasıl neden şu o ben sen biz siz onlar şey şeyler kadar sonra önce üzere göre ise ancak yani böyle şöyle hangi zaman gün bugün yarın hafta ay'.split(/\s+/)
);

export function normalizeText(input: string): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replaceAll('â', 'a')
    .replaceAll('î', 'i')
    .replaceAll('û', 'u')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(input: string): string[] {
  return normalizeText(input)
    .split(' ')
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

type IndexedChunk = {
  chunk: KnowledgeChunk;
  tf: Map<string, number>;
  len: number;
  tokens: string[];
};

function buildIndex(chunks: KnowledgeChunk[]): IndexedChunk[] {
  return chunks.map((chunk) => {
    const tokens = tokenize(`${chunk.title} ${chunk.tags.join(' ')} ${chunk.text} ${chunk.quote ?? ''}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tf, len: tokens.length, tokens };
  });
}

const INDEX = buildIndex(KNOWLEDGE);
const DF = new Map<string, number>();
for (const doc of INDEX) {
  for (const t of new Set(doc.tokens)) DF.set(t, (DF.get(t) ?? 0) + 1);
}
const AVG_LEN = INDEX.reduce((a, b) => a + b.len, 0) / Math.max(1, INDEX.length);

export function buildQuery(input: GenerateInput, astro: AstroContext): string {
  const { sign } = input;
  return [
    sign.name,
    sign.element,
    sign.elementNature,
    sign.modality,
    sign.planet,
    sign.keyword,
    sign.gift,
    sign.shadow,
    sign.desire,
    sign.moonElection,
    input.tone,
    input.character,
    input.scope,
    astro.scopeLabel,
    astro.primaryMoonSign.name,
    astro.moonSigns.map((s) => s.name).join(' '),
    astro.moonPhase,
    astro.planetaryDay,
    astro.planetaryHour,
    astro.season,
    input.angle
  ].join(' ');
}

function bm25(queryTokens: string[], doc: IndexedChunk): number {
  const k1 = 1.5;
  const b = 0.75;
  let score = 0;
  const counts = new Map<string, number>();
  for (const t of queryTokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  for (const [term, qtf] of counts) {
    const df = DF.get(term) ?? 0;
    if (!df) continue;
    const idf = Math.log(1 + (INDEX.length - df + 0.5) / (df + 0.5));
    const tf = doc.tf.get(term) ?? 0;
    if (!tf) continue;
    const denom = tf + k1 * (1 - b + (b * doc.len) / AVG_LEN);
    score += idf * ((tf * (k1 + 1)) / denom) * Math.min(2, qtf);
  }
  return score;
}

function tagBoost(chunk: KnowledgeChunk, input: GenerateInput, astro: AstroContext): number {
  let boost = 0;
  if (chunk.tags.includes(input.sign.id)) boost += 2.2;
  if (chunk.tags.includes(input.sign.planet)) boost += 0.9;
  if (chunk.tags.includes(input.sign.element)) boost += 0.8;
  if (chunk.tags.includes(input.sign.modality)) boost += 0.35;
  if (chunk.tags.includes(astro.primaryMoonSign.id)) boost += 1.4;
  if (chunk.topic === 'çerçeve') boost += 0.25;
  return boost;
}

export function retrieveChunks(input: GenerateInput, astro: AstroContext, k = 6): RetrievedChunk[] {
  const query = buildQuery(input, astro);
  const queryTokens = tokenize(query);
  const scored = INDEX.map((doc) => {
    const base = bm25(queryTokens, doc);
    const boost = tagBoost(doc.chunk, input, astro);
    const score = base + boost;
    const reasons: string[] = [];
    if (doc.chunk.tags.includes(input.sign.id)) reasons.push('burç eşleşmesi');
    if (doc.chunk.tags.includes(input.sign.planet)) reasons.push('gezegen');
    if (doc.chunk.tags.includes(input.sign.element)) reasons.push('unsur');
    if (doc.chunk.tags.includes(astro.primaryMoonSign.id)) reasons.push('ay burcu');
    if (doc.chunk.topic === 'çerçeve') reasons.push('İslami çerçeve');
    return {
      chunk: doc.chunk,
      score,
      reason: reasons.length ? reasons.join(' · ') : 'konu yakınlığı'
    };
  });
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: RetrievedChunk[] = [];
  for (const item of scored) {
    if (seen.has(item.chunk.id)) continue;
    seen.add(item.chunk.id);
    out.push(item);
    if (out.length >= k) break;
  }
  return out;
}

export async function retrieveChunksHybrid(
  input: GenerateInput,
  astro: AstroContext,
  settings: Settings,
  k = 6,
  onProgress?: (ratio: number, message: string) => void
): Promise<RetrievedChunk[]> {
  const lexical = retrieveChunks(input, astro, k + 6);
  if (!settings.semanticRag || !settings.geminiKey) return lexical.slice(0, k);
  try {
    onProgress?.(0.05, 'Semantik RAG hazırlanıyor…');
    const vectors = await buildEmbeddingIndex(KNOWLEDGE, settings, onProgress);
    const q = await embedQuery(buildQuery(input, astro), settings);
    const byId = new Map(lexical.map((r) => [r.chunk.id, r]));
    const semantic = KNOWLEDGE.map((chunk, i) => ({
      chunk,
      cos: cosine(q, vectors[i] ?? [])
    })).sort((a, b) => b.cos - a.cos);

    const merged = new Map<string, { chunk: KnowledgeChunk; score: number; reason: string }>();
    const maxLex = Math.max(0.0001, ...lexical.map((r) => r.score));
    for (const r of lexical) {
      merged.set(r.chunk.id, {
        chunk: r.chunk,
        score: 0.62 * (r.score / maxLex),
        reason: r.reason
      });
    }
    for (const s of semantic.slice(0, 16)) {
      const prev = merged.get(s.chunk.id);
      const semScore = 0.38 * ((s.cos + 1) / 2);
      if (prev) {
        prev.score += semScore;
        prev.reason = `${prev.reason} · anlamsal yakınlık`;
      } else {
        merged.set(s.chunk.id, {
          chunk: s.chunk,
          score: semScore,
          reason: 'anlamsal yakınlık'
        });
      }
    }
    const out = [...merged.values()].sort((a, b) => b.score - a.score).slice(0, k);
    onProgress?.(1, 'Semantik RAG tamam.');
    return out;
  } catch (err) {
    onProgress?.(1, `Semantik RAG atlandı: ${err instanceof Error ? err.message : 'bilinmeyen hata'}`);
    return lexical.slice(0, k);
  }
}
