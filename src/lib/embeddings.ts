import type { KnowledgeChunk, Settings } from '../types';
import { KNOWLEDGE_VERSION } from '../data/knowledge';

const DB_NAME = 'marifetname-studio';
const STORE = 'embeddings';

type CacheRecord = {
  key: string;
  model: string;
  version: string;
  vectors: number[][];
  createdAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readCache(key: string): Promise<CacheRecord | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as CacheRecord) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function writeCache(record: CacheRecord): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function embedBatch(
  texts: string[],
  model: string,
  apiKey: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'
): Promise<number[][]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:batchEmbedContents?key=${encodeURIComponent(apiKey)}`;
  const body = {
    requests: texts.map((text) => ({
      model: `models/${model}`,
      content: { parts: [{ text }] },
      taskType,
      outputDimensionality: 768
    }))
  };
  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    // Bazı embedding modelleri outputDimensionality kabul etmez; boyutsuz tekrar dene.
    const fallback = {
      requests: texts.map((text) => ({
        model: `models/${model}`,
        content: { parts: [{ text }] },
        taskType
      }))
    };
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fallback)
    });
  }
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Embedding isteği başarısız (${res.status}). ${err.slice(0, 180)}`);
  }
  const data = (await res.json()) as { embeddings?: { values: number[] }[] };
  if (!data.embeddings?.length) throw new Error('Embedding yanıtı boş döndü.');
  return data.embeddings.map((e) => e.values);
}

export async function buildEmbeddingIndex(
  chunks: KnowledgeChunk[],
  settings: Settings,
  onProgress?: (ratio: number, message: string) => void
): Promise<number[][]> {
  if (!settings.geminiKey) throw new Error('Semantik RAG için Gemini API anahtarı gerekli.');
  const model = settings.embeddingModel || 'gemini-embedding-001';
  const key = `${model}:${KNOWLEDGE_VERSION}`;
  const cached = await readCache(key);
  if (cached?.vectors?.length === chunks.length) {
    onProgress?.(1, 'Yerel semantik indeks hazır.');
    return cached.vectors;
  }
  const vectors: number[][] = [];
  const batchSize = 16;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    onProgress?.(i / chunks.length, `Semantik indeks: ${Math.min(i + batch.length, chunks.length)}/${chunks.length}`);
    const result = await embedBatch(batch.map((c) => `${c.title}\n${c.text}`), model, settings.geminiKey, 'RETRIEVAL_DOCUMENT');
    vectors.push(...result);
  }
  await writeCache({
    key,
    model,
    version: KNOWLEDGE_VERSION,
    vectors,
    createdAt: new Date().toISOString()
  });
  onProgress?.(1, 'Semantik indeks kaydedildi.');
  return vectors;
}

export async function embedQuery(text: string, settings: Settings): Promise<number[]> {
  if (!settings.geminiKey) throw new Error('Gemini anahtarı yok.');
  const model = settings.embeddingModel || 'gemini-embedding-001';
  const result = await embedBatch([text], model, settings.geminiKey, 'RETRIEVAL_QUERY');
  return result[0];
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}
