import { useState } from 'react';
import type { HistoryItem, KnowledgeChunk } from '../types';
import { Copy, Check, Download, SettingsIcon, Sparkle, Moon, Sun, Clock, Wheel } from './Icons';

interface Props {
  result: HistoryItem | null;
  loading: boolean;
  progress: string;
  error: string;
  onRetry: () => void;
  onOpenSettings: () => void;
  onCopy: (text: string, label: string) => void;
  onDownload: (item: HistoryItem) => void;
  copied: string;
}

type Tab = 'prompt' | 'script' | 'social' | 'sources';

function formatCreated(iso: string): string {
  try {
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  } catch {
    return '';
  }
}

function CopyButton({ text, label, onCopy, copied }: { text: string; label: string; onCopy: Props['onCopy']; copied: string }) {
  const active = copied === label;
  return (
    <button type="button" className={`copy-btn${active ? ' is-copied' : ''}`} onClick={() => onCopy(text, label)}>
      {active ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
      {active ? 'Kopyalandı' : 'Kopyala'}
    </button>
  );
}

function PromptBlock({ title, kicker, text, onCopy, copied, tone }: { title: string; kicker?: string; text: string; onCopy: Props['onCopy']; copied: string; tone?: 'dark' | 'light' }) {
  return (
    <div className={`prompt-block ${tone ?? 'dark'}`}>
      <div className="prompt-block-head">
        <div>
          {kicker && <span className="prompt-kicker">{kicker}</span>}
          <h4>{title}</h4>
        </div>
        <CopyButton text={text} label={title} onCopy={onCopy} copied={copied} />
      </div>
      <pre>{text || '—'}</pre>
    </div>
  );
}

function SourceCard({ chunk, index }: { chunk: KnowledgeChunk; index: number }) {
  return (
    <article className="source-card">
      <div className="source-top">
        <span className="source-page">s. {chunk.page}</span>
        <span className="source-index">M{index + 1}</span>
        <span className="source-topic">{chunk.topic}</span>
      </div>
      <h4>{chunk.title}</h4>
      <p>{chunk.text}</p>
      {chunk.quote && <blockquote>“{chunk.quote}”</blockquote>}
      <div className="source-tags">
        {chunk.tags.slice(0, 5).map((t) => <span key={t}>#{t}</span>)}
      </div>
    </article>
  );
}

function EmptyState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-orb" aria-hidden="true">
        <svg viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="104" className="orb-ring" />
          <circle cx="120" cy="120" r="74" className="orb-ring faint" />
          <circle cx="120" cy="120" r="44" className="orb-ring" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = ((i * 30 - 90) * Math.PI) / 180;
            return <line key={i} x1={120 + Math.cos(a) * 74} y1={120 + Math.sin(a) * 74} x2={120 + Math.cos(a) * 104} y2={120 + Math.sin(a) * 104} className="orb-line" />;
          })}
          <path d="M120 76l9 26 26 9-26 9-9 26-9-26-26-9 26-9 9-26z" className="orb-star" />
        </svg>
      </div>
      <span className="eyebrow">PROMPT BUILDER · RAG</span>
      <h2>Bir burç seç.<br /><em>Gökyüzü konuşsun.</em></h2>
      <p>Mârifetnâme’nin burç, gezegen, ay ve mizaç tasnifinden beslenen; kadın/erkek karakter, zaman aralığı ve ton seçimiyle Higgsfield’a hazır video promptu üretir.</p>
      <div className="empty-features">
        <div><Sparkle width={16} height={16} /><span>RAG ile kitap bağlamı</span></div>
        <div><Wheel width={16} height={16} /><span>12 burç · 5 ton · 4 zaman</span></div>
        <div><Moon width={16} height={16} /><span>Ay burcu ve gezegen saati</span></div>
      </div>
      <button type="button" className="text-link" onClick={onOpenSettings}>Sağlayıcıyı bağla veya demo ile başla →</button>
    </div>
  );
}

export function ResultView(props: Props) {
  const [tab, setTab] = useState<Tab>('prompt');
  const { result, loading, error } = props;

  if (loading && !result) {
    return (
      <div className="result-panel-inner loading-state">
        <div className="loading-orb"><span /><span /><span /></div>
        <span className="eyebrow">PROMPT ÜRETİLİYOR</span>
        <h2>Gökyüzü taranıyor…</h2>
        <p>{props.progress || 'RAG pasajları seçiliyor, karakter sesi kuruluyor.'}</p>
        <div className="loading-bar"><span /></div>
        <div className="skeleton-lines" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="result-panel-inner error-state">
        <span className="eyebrow">ÜRETİM DURDU</span>
        <h2>Bir şey ters gitti.</h2>
        <p className="error-message">{error}</p>
        <div className="error-actions">
          <button type="button" className="primary-small" onClick={props.onRetry}>Tekrar dene</button>
          <button type="button" className="ghost-small" onClick={props.onOpenSettings}>Ayarları aç</button>
        </div>
        <p className="hint">Anahtar yoksa Demo sağlayıcısıyla anahtarsız devam edebilirsin.</p>
      </div>
    );
  }

  if (!result) return <EmptyState onOpenSettings={props.onOpenSettings} />;

  const { content, meta } = result;
  const sign = meta.input.sign;
  const astro = meta.astro;
  const lines = content.script.length && content.script[0] === content.hook ? content.script.slice(1) : content.script;

  const allText = [
    `MÂRİFETNÂME PROMPT ATÖLYESİ`,
    `${sign.name} · ${astro.scopeLabel} · ${astro.rangeLabel}`,
    `Karakter: ${meta.input.character} · Ton: ${meta.input.tone} · Sağlayıcı: ${meta.provider} / ${meta.model}`,
    ``,
    `HOOK`,
    content.hook,
    ``,
    `SENARYO`,
    ...lines.map((l, i) => `${i + 1}. ${l}`),
    ``,
    `KAPANIŞ`,
    content.closing,
    ``,
    `HIGGSFIELD PROMPT`,
    content.higgsfieldPrompt,
    ``,
    `B-ROLL`,
    content.bRollPrompt,
    ``,
    `NEGATİF`,
    content.negativePrompt,
    ``,
    `SES YÖNETİMİ`,
    content.voiceDirection,
    ``,
    `EKran YAZILARI`,
    content.onScreenText.join(' · '),
    ``,
    `CAPTION`,
    content.caption,
    content.hashtags.join(' '),
    ``,
    `KAYNAKLAR`,
    ...content.sourceNotes.map((s) => `- ${s}`)
  ].join('\n');

  return (
    <div className="result-panel-inner">
      <div className="result-head">
        <div className="result-identity">
          <span className="result-glyph" style={{ color: sign.accent }}>{sign.glyph}</span>
          <div>
            <span className="eyebrow">ÜRETİLEN PROMPT · {formatCreated(result.createdAt)}</span>
            <h2>{sign.name} <span>/ {astro.scopeLabel.toLocaleLowerCase('tr-TR')}</span></h2>
            <div className="result-sub">
              <span className={`provider-badge ${meta.provider}`}>{meta.provider === 'demo' ? 'DEMO' : meta.provider.toUpperCase()}</span>
              <span>{meta.model}</span>
              <span>·</span>
              <span>{meta.input.character} karakter</span>
              <span>·</span>
              <span>{meta.input.tone}</span>
            </div>
          </div>
        </div>
        <div className="result-actions">
          <CopyButton text={allText} label="Tüm çıktı" onCopy={props.onCopy} copied={props.copied} />
          <button type="button" className="icon-btn" title="Tümünü indir" onClick={() => props.onDownload(result)}><Download width={17} height={17} /></button>
          <button type="button" className="icon-btn" title="Ayarlar" onClick={props.onOpenSettings}><SettingsIcon width={17} height={17} /></button>
        </div>
      </div>

      {error && <div className="inline-error">{error}</div>}

      <div className="astro-strip">
        <div><Moon width={15} height={15} /><span>Ay</span><strong>{astro.primaryMoonSign.name}</strong></div>
        <div><Sparkle width={15} height={15} /><span>Evre</span><strong>{astro.moonPhase}</strong></div>
        <div><Sun width={15} height={15} /><span>Gün</span><strong>{astro.planetaryDay}</strong></div>
        <div><Clock width={15} height={15} /><span>Saat</span><strong>{astro.planetaryHour}</strong></div>
        <div className="wide"><span>Hicri</span><strong>{astro.hijri}</strong></div>
      </div>

      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'prompt'} className={tab === 'prompt' ? 'is-active' : ''} onClick={() => setTab('prompt')}>Video Prompt</button>
        <button type="button" role="tab" aria-selected={tab === 'script'} className={tab === 'script' ? 'is-active' : ''} onClick={() => setTab('script')}>Konuşma Metni</button>
        <button type="button" role="tab" aria-selected={tab === 'social'} className={tab === 'social' ? 'is-active' : ''} onClick={() => setTab('social')}>Sosyal Medya</button>
        <button type="button" role="tab" aria-selected={tab === 'sources'} className={tab === 'sources' ? 'is-active' : ''} onClick={() => setTab('sources')}>Kaynaklar <span>{meta.chunks.length}</span></button>
      </div>

      {tab === 'prompt' && (
        <div className="tab-body">
          <PromptBlock title="Higgsfield · Ana Plan" kicker="9:16 · tek plan · lip-sync" text={content.higgsfieldPrompt} onCopy={props.onCopy} copied={props.copied} />
          <PromptBlock title="B-roll · Ara Plan" kicker="4 sn · sembolik kesme" text={content.bRollPrompt} onCopy={props.onCopy} copied={props.copied} tone="light" />
          <div className="prompt-two-col">
            <PromptBlock title="Negatif Prompt" text={content.negativePrompt} onCopy={props.onCopy} copied={props.copied} tone="light" />
            <PromptBlock title="Ses Yönetimi" text={content.voiceDirection} onCopy={props.onCopy} copied={props.copied} tone="light" />
          </div>
          <div className="mini-note">
            <strong>Higgsfield ipucu:</strong> Ana plan promptunu 8-12 saniyelik tek çekim olarak kullan; sesi ayrı yükle. Ekran yazılarını post-prodüksiyonda {content.onScreenText.join(' · ')} olarak yerleştir.
          </div>
        </div>
      )}

      {tab === 'script' && (
        <div className="tab-body">
          <div className="hook-card">
            <span className="hook-label">HOOK · 0-3 sn</span>
            <p>{content.hook}</p>
          </div>
          <div className="script-list">
            {lines.map((line, i) => (
              <div className="script-line" key={`${line}-${i}`}>
                <span className="line-no">{String(i + 1).padStart(2, '0')}</span>
                <p>{line}</p>
              </div>
            ))}
          </div>
          <div className="closing-card">
            <span className="hook-label">KAPANIŞ</span>
            <p>{content.closing}</p>
          </div>
          <div className="screen-text-row">
            {content.onScreenText.map((t) => <span key={t} className="screen-chip">{t}</span>)}
          </div>
          <div className="script-actions">
            <CopyButton text={[content.hook, ...lines, content.closing].join('\n')} label="Senaryo" onCopy={props.onCopy} copied={props.copied} />
          </div>
        </div>
      )}

      {tab === 'social' && (
        <div className="tab-body">
          <div className="social-card">
            <div className="social-card-head">
              <span className="eyebrow">CAPTION</span>
              <CopyButton text={content.caption} label="Caption" onCopy={props.onCopy} copied={props.copied} />
            </div>
            <p>{content.caption}</p>
            <div className="hashtags">
              {content.hashtags.map((h) => <span key={h}>{h}</span>)}
            </div>
          </div>
          <div className="social-grid">
            <div className="social-card">
              <span className="eyebrow">KAPAK YAZISI</span>
              <p className="thumb-text">{content.thumbnailText}</p>
            </div>
            <div className="social-card">
              <span className="eyebrow">EKran YAZILARI</span>
              <ul className="on-screen-list">
                {content.onScreenText.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
          {content.sourceNotes.length > 0 && (
            <div className="social-card">
              <span className="eyebrow">KAYNAK NOTLARI</span>
              <ul className="source-notes">
                {content.sourceNotes.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === 'sources' && (
        <div className="tab-body">
          <div className="sources-intro">
            <p>Bu üretimde RAG tarafından seçilen Mârifetnâme pasajları. Sayfa numaraları yüklediğin Türkçe PDF’e aittir.</p>
            <span>{meta.chunks.length} pasaj · {meta.input.citationMode === 'yok' ? 'atıf modu kapalı' : `atıf: ${meta.input.citationMode}`}</span>
          </div>
          <div className="sources-list">
            {meta.chunks.map((c, i) => <SourceCard key={c.id} chunk={c} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
