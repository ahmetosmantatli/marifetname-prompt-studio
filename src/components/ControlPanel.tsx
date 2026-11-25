import type { Character, CitationMode, Scope, SignProfile, Tone } from '../types';
import { Sparkle, ArrowRight, Key } from './Icons';

interface Props {
  sign: SignProfile;
  scope: Scope;
  onScope: (s: Scope) => void;
  character: Character;
  onCharacter: (c: Character) => void;
  tone: Tone;
  onTone: (t: Tone) => void;
  citation: CitationMode;
  onCitation: (c: CitationMode) => void;
  platform: 'reels' | 'tiktok' | 'shorts';
  onPlatform: (p: 'reels' | 'tiktok' | 'shorts') => void;
  duration: 8 | 10 | 12;
  onDuration: (d: 8 | 10 | 12) => void;
  angle: string;
  onAngle: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
  providerLabel: string;
  onOpenSettings: () => void;
}

const SCOPES: { id: Scope; label: string; hint: string }[] = [
  { id: 'bugun', label: 'Bugün', hint: 'anlık hava' },
  { id: 'yarin', label: 'Yarın', hint: '24 saat sonrası' },
  { id: 'hafta', label: 'Bu Hafta', hint: '7 günlük eğilim' },
  { id: 'ay', label: 'Bu Ay', hint: '30 günlük tema' }
];

const TONES: { id: Tone; label: string; hint: string }[] = [
  { id: 'duygusal', label: 'Duygusal', hint: 'kırılgan, samimi' },
  { id: 'agresif', label: 'Agresif', hint: 'sert, yüzleştiren' },
  { id: 'sakin', label: 'Sakin', hint: 'ölçülü, grounding' },
  { id: 'gizemli', label: 'Gizemli', hint: 'fısıltılı, meraklı' },
  { id: 'otoriter', label: 'Otoriter', hint: 'kararlı, net' }
];

const CITATIONS: { id: CitationMode; label: string; hint: string }[] = [
  { id: 'yok', label: 'Yok', hint: 'metin tamamen karakterin' },
  { id: 'arada', label: 'Ara sıra', hint: '1 doğal atıf' },
  { id: 'guclu', label: 'Güçlü', hint: 'sayfa numaralı vurgu' }
];

export function ControlPanel(props: Props) {
  return (
    <div className="controls">
      <section className="control-section">
        <div className="control-title">
          <span>01</span>
          <h3>Zaman aralığı</h3>
        </div>
        <div className="segmented four">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={props.scope === s.id ? 'is-active' : ''}
              onClick={() => props.onScope(s.id)}
              title={s.hint}
            >
              <strong>{s.label}</strong>
              <small>{s.hint}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="control-section">
        <div className="control-title">
          <span>02</span>
          <h3>Karakter</h3>
        </div>
        <div className="segmented two">
          <button type="button" className={props.character === 'kadın' ? 'is-active' : ''} onClick={() => props.onCharacter('kadın')}>
            <span className="char-glyph">♀</span>
            <strong>Kadın</strong>
            <small>kadın oyuncu sesi</small>
          </button>
          <button type="button" className={props.character === 'erkek' ? 'is-active' : ''} onClick={() => props.onCharacter('erkek')}>
            <span className="char-glyph">♂</span>
            <strong>Erkek</strong>
            <small>erkek oyuncu sesi</small>
          </button>
        </div>
      </section>

      <section className="control-section">
        <div className="control-title">
          <span>03</span>
          <h3>Ton</h3>
        </div>
        <div className="tone-grid">
          {TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tone-chip${props.tone === t.id ? ' is-active' : ''}`}
              onClick={() => props.onTone(t.id)}
            >
              <strong>{t.label}</strong>
              <small>{t.hint}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="control-section two-col">
        <div>
          <div className="control-title compact">
            <span>04</span>
            <h3>Atıf</h3>
          </div>
          <div className="select-wrap">
            <select value={props.citation} onChange={(e) => props.onCitation(e.target.value as CitationMode)}>
              {CITATIONS.map((c) => <option key={c.id} value={c.id}>{c.label} — {c.hint}</option>)}
            </select>
          </div>
        </div>
        <div>
          <div className="control-title compact">
            <span>05</span>
            <h3>Format</h3>
          </div>
          <div className="inline-fields">
            <select value={props.platform} onChange={(e) => props.onPlatform(e.target.value as Props['platform'])}>
              <option value="reels">Reels</option>
              <option value="tiktok">TikTok</option>
              <option value="shorts">Shorts</option>
            </select>
            <select value={props.duration} onChange={(e) => props.onDuration(Number(e.target.value) as Props['duration'])}>
              <option value={8}>8 sn</option>
              <option value={10}>10 sn</option>
              <option value={12}>12 sn</option>
            </select>
          </div>
        </div>
      </section>

      <section className="control-section">
        <div className="control-title">
          <span>06</span>
          <h3>Ek açı <em>(opsiyonel)</em></h3>
        </div>
        <textarea
          className="angle-input"
          rows={2}
          maxLength={220}
          placeholder="Örn. “kariyerde görünmez emek”, “ilişkide sınır koymak”, “aile içinde susmak”…"
          value={props.angle}
          onChange={(e) => props.onAngle(e.target.value)}
        />
        <div className="char-count">{props.angle.length}/220</div>
      </section>

      <button type="button" className={`generate-btn${props.loading ? ' is-loading' : ''}`} onClick={props.onGenerate} disabled={props.loading}>
        <span className="generate-icon"><Sparkle width={20} height={20} /></span>
        <span>
          <strong>{props.loading ? 'Prompt üretiliyor…' : 'Promptu üret'}</strong>
          <small>{props.providerLabel} · {props.sign.name} · {props.scope === 'bugun' ? 'bugün' : props.scope === 'yarin' ? 'yarın' : props.scope === 'hafta' ? 'bu hafta' : 'bu ay'}</small>
        </span>
        <ArrowRight width={20} height={20} />
      </button>

      <button type="button" className="provider-line" onClick={props.onOpenSettings}>
        <Key width={14} height={14} />
        <span>{props.providerLabel} bağlı · anahtarı değiştir</span>
      </button>
      <p className="privacy-note">API anahtarları yalnızca bu tarayıcıda saklanır; sunucuya gitmez.</p>
    </div>
  );
}
