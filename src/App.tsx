import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  Character,
  CitationMode,
  GenerateInput,
  HistoryItem,
  Scope,
  Settings,
  SignProfile,
  Tone
} from './types';
import { getSign } from './data/signs';
import { KNOWLEDGE } from './data/knowledge';
import { buildAstroContext } from './lib/astro';
import { buildUserPrompt, normalizeContent, SYSTEM_PROMPT } from './lib/prompt';
import { retrieveChunksHybrid } from './lib/rag';
import { generateDemoContent } from './lib/demo';
import { callGemini, callGroq } from './lib/providers';
import { loadHistory, loadSettings, saveHistory, saveSettings, uid } from './lib/storage';
import { buildExportText, downloadText } from './lib/export';
import { SignWheel } from './components/SignWheel';
import { ControlPanel } from './components/ControlPanel';
import { ResultView } from './components/ResultView';
import { SettingsModal } from './components/SettingsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HistoryIcon, SettingsIcon, Sparkle, Moon, GithubIcon } from './components/Icons';

function providerLabel(settings: Settings): string {
  if (settings.provider === 'demo') return 'Demo motoru';
  if (settings.provider === 'groq') return `Groq · ${settings.groqModel}`;
  return `Gemini · ${settings.geminiModel}`;
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());
  const [signId, setSignId] = useState('koc');
  const [scope, setScope] = useState<Scope>('bugun');
  const [character, setCharacter] = useState<Character>('kadın');
  const [tone, setTone] = useState<Tone>('duygusal');
  const [citation, setCitation] = useState<CitationMode>('yok');
  const [platform, setPlatform] = useState<'reels' | 'tiktok' | 'shorts'>('reels');
  const [duration, setDuration] = useState<8 | 10 | 12>(10);
  const [angle, setAngle] = useState('');
  const [astro, setAstro] = useState(() => buildAstroContext('bugun'));
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [copied, setCopied] = useState('');
  const [toast, setToast] = useState('');

  const sign = useMemo(() => getSign(signId), [signId]);

  useEffect(() => {
    setAstro(buildAstroContext(scope));
    const timer = window.setInterval(() => setAstro(buildAstroContext(scope)), 300_000);
    return () => window.clearInterval(timer);
  }, [scope]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleGenerate = useCallback(async () => {
    const input: GenerateInput = {
      sign,
      scope,
      character,
      tone,
      citationMode: citation,
      angle,
      platform,
      duration
    };
    setLoading(true);
    setError('');
    setProgress('RAG pasajları seçiliyor…');
    try {
      const chunks = await retrieveChunksHybrid(input, astro, settings, 6, (ratio, message) => {
        setProgress(`${message} (${Math.round(ratio * 100)}%)`);
      });
      let content;
      let model: string;
      if (settings.provider === 'demo') {
        setProgress('Yerel şablon motoru yazıyor…');
        content = generateDemoContent(input, astro, chunks);
        model = 'yerel şablon v1';
      } else {
        setProgress('Model senaryoyu ve video promptunu yazıyor…');
        const userPrompt = buildUserPrompt(input, astro, chunks, settings);
        const out =
          settings.provider === 'groq'
            ? await callGroq(SYSTEM_PROMPT, userPrompt, settings)
            : await callGemini(SYSTEM_PROMPT, userPrompt, settings);
        content = normalizeContent(out.content, input, chunks);
        model = out.model;
      }
      const item: HistoryItem = {
        id: uid(),
        createdAt: new Date().toISOString(),
        signId: sign.id,
        signName: sign.name,
        scope,
        character,
        tone,
        provider: settings.provider,
        content,
        meta: { provider: settings.provider, model, createdAt: new Date().toISOString(), chunks: chunks.map((r) => r.chunk), astro, input }
      };
      setResult(item);
      setHistory((prev) => {
        const next = [item, ...prev].slice(0, 30);
        saveHistory(next);
        return next;
      });
      setToast('Prompt hazır. Kopyala veya indir.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  }, [sign, scope, character, tone, citation, angle, platform, duration, astro, settings]);

  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(label);
    setToast(`${label} kopyalandı.`);
    window.setTimeout(() => setCopied(''), 2000);
  }, []);

  const handleDownload = useCallback((item: HistoryItem) => {
    const filename = `marifetname-${item.signId}-${item.scope}-${new Date(item.createdAt).toISOString().slice(0, 10)}.txt`;
    downloadText(filename, buildExportText(item));
    setToast('Metin dosyası indirildi.');
  }, []);

  const handleSaveSettings = useCallback((next: Settings) => {
    setSettings(next);
    saveSettings(next);
    setSettingsOpen(false);
    setToast('Ayarlar kaydedildi.');
  }, []);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setResult(item);
    setSignId(item.meta.input.sign.id);
    setScope(item.meta.input.scope);
    setCharacter(item.meta.input.character);
    setTone(item.meta.input.tone);
    setCitation(item.meta.input.citationMode);
    setAngle(item.meta.input.angle);
    setPlatform(item.meta.input.platform);
    setDuration(item.meta.input.duration);
    setAstro(item.meta.astro);
    setHistoryOpen(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
    setHistoryOpen(false);
    setToast('Geçmiş temizlendi.');
  }, []);

  const handleSign = useCallback((s: SignProfile) => {
    setSignId(s.id);
  }, []);

  return (
    <div className="app">
      <div className="starfield" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="./" aria-label="Mârifetnâme Prompt Atölyesi ana sayfa">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" />
              <circle cx="24" cy="24" r="12" />
              <path d="M24 4l3.2 12.8L40 24l-12.8 3.2L24 40l-3.2-12.8L8 24l12.8-3.2L24 4z" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-title">MÂRİFETNÂME</span>
            <span className="brand-sub">PROMPT ATÖLYESİ</span>
          </span>
        </a>
        <div className="top-actions">
          <span className="live-chip"><span className="live-dot" />{astro.primaryMoonSign.glyph} Ay {astro.primaryMoonSign.name}</span>
          <button type="button" className="top-btn" onClick={() => setHistoryOpen(true)}>
            <HistoryIcon width={16} height={16} />
            <span>Geçmiş</span>
            {history.length > 0 && <em>{history.length}</em>}
          </button>
          <button type="button" className="top-btn" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon width={16} height={16} />
            <span className="top-provider">{providerLabel(settings)}</span>
            <i className={`provider-dot ${settings.provider}`} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkle width={14} height={14} /> RAG · MÂRİFETNÂME · HIGGSFIELD</span>
            <h1>Burcun karakteri,<br /><em>kendi sesiyle.</em></h1>
            <p>Mârifetnâme’nin burç, gezegen, ay ve mizaç tasnifinden beslenen; kadın/erkek karakter, zaman aralığı ve ton seçimiyle <strong>Higgsfield’a hazır</strong> dikey video promptu üreten RAG stüdyosu.</p>
          </div>
          <div className="hero-side">
            <div className="hero-orbit" aria-hidden="true">
              <span className="orbit-glyph">{sign.glyph}</span>
              <span className="orbit-label">{sign.name}</span>
            </div>
            <div className="hero-stats">
              <div><strong>{KNOWLEDGE.length}</strong><span>RAG bilgi kartı</span></div>
              <div><strong>12</strong><span>burç profili</span></div>
              <div><strong>7</strong><span>gezegen tabiatı</span></div>
              <div><strong>5</strong><span>karakter tonu</span></div>
            </div>
          </div>
        </section>

        <div className="live-strip">
          <span className="eyebrow">CANLI GÖK TAKVİMİ</span>
          <span>{astro.dateLabel}</span>
          <span><Moon width={14} height={14} /> Ay {astro.moonSigns.map((s) => s.name).join(' → ')}</span>
          <span>{astro.moonPhase}</span>
          <span>{astro.planetaryDay}</span>
          <span>{astro.planetaryHour}</span>
          <span className="hijri">{astro.hijri}</span>
        </div>

        <div className="studio-layout">
          <aside className="left-column">
            <section className="panel wheel-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">01 · BURÇ</span>
                  <h2>Gökyüzü haritası</h2>
                </div>
                <span className="panel-hint">tıklayarak seç</span>
              </div>
              <SignWheel active={sign} onChange={handleSign} />
            </section>

            <section className="panel controls-panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">02 · ÜRETİM</span>
                  <h2>Prompt ayarları</h2>
                </div>
              </div>
              <ControlPanel
                sign={sign}
                scope={scope}
                onScope={setScope}
                character={character}
                onCharacter={setCharacter}
                tone={tone}
                onTone={setTone}
                citation={citation}
                onCitation={setCitation}
                platform={platform}
                onPlatform={setPlatform}
                duration={duration}
                onDuration={setDuration}
                angle={angle}
                onAngle={setAngle}
                onGenerate={handleGenerate}
                loading={loading}
                providerLabel={providerLabel(settings)}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            </section>
          </aside>

          <section className="panel result-panel">
            <ResultView
              result={result}
              loading={loading}
              progress={progress}
              error={error}
              onRetry={handleGenerate}
              onOpenSettings={() => setSettingsOpen(true)}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copied}
            />
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-left">
          <span className="footer-mark">✦</span>
          <span>Erzurumlu İbrahim Hakkı · Mârifetnâme · 1757</span>
        </div>
        <div className="footer-mid">Kehanet değil, tefekkür. Yıldızlar sebep; hakiki müessir Allah.</div>
        <div className="footer-right">
          <a href="https://github.com/ahmetosmantatli/marifetname-prompt-studio" target="_blank" rel="noreferrer"><GithubIcon width={15} height={15} /> GitHub</a>
          <span>·</span>
          <span>Anahtarlar tarayıcında</span>
        </div>
      </footer>

      {settingsOpen && <SettingsModal settings={settings} onSave={handleSaveSettings} onClose={() => setSettingsOpen(false)} />}
      {historyOpen && <HistoryDrawer items={history} onSelect={handleSelectHistory} onClose={() => setHistoryOpen(false)} onClear={handleClearHistory} />}

      <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
