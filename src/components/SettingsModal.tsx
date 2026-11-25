import { useEffect, useState } from 'react';
import type { Provider, Settings } from '../types';
import { GEMINI_SUGGESTIONS, GROQ_SUGGESTIONS } from '../data/models';
import { listGeminiModels, listGroqModels, testProvider } from '../lib/providers';
import { Check, Key, Sparkle, X } from './Icons';

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

const PROVIDERS: { id: Provider; title: string; tag: string; desc: string }[] = [
  { id: 'demo', title: 'Demo', tag: 'anahtarsız', desc: 'Yerel şablon motoru. Canlı siteyi hemen denemek ve yapıyı görmek için.' },
  { id: 'groq', title: 'Groq', tag: 'ücretsiz katman', desc: 'GPT-OSS 20B/120B ve Qwen 3.8. Hızlı ve JSON disiplini iyi; 131k bağlam.' },
  { id: 'gemini', title: 'Gemini', tag: 'ücretsiz katman', desc: '3.5 Flash / 3.1 Flash Lite. Türkçe kalitesi en iyi; 1M bağlam + embedding.' }
];

export function SettingsModal({ settings, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Settings>(settings);
  const [showKeys, setShowKeys] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key === 'provider') setModels([]);
    setMessage('');
    setError('');
  };

  const fetchModels = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (draft.provider === 'groq') {
        const list = await listGroqModels(draft.groqKey.trim());
        setModels(list);
        setMessage(`${list.length} Groq modeli bulundu. Listeden seç veya model kimliğini yaz.`);
        if (list.length && !list.includes(draft.groqModel)) update('groqModel', list[0]);
      } else if (draft.provider === 'gemini') {
        const list = await listGeminiModels(draft.geminiKey.trim());
        setModels(list);
        setMessage(`${list.length} Gemini modeli bulundu. Listeden seç veya model kimliğini yaz.`);
        if (list.length && !list.includes(draft.geminiModel)) update('geminiModel', list.find((m) => m.includes('flash')) ?? list[0]);
      } else {
        setMessage('Demo modu yerel çalışır; model listesi gerekmez.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Modeller alınamadı.');
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const msg = await testProvider(draft);
      setMessage(msg);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bağlantı kurulamadı.');
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    onSave({
      ...draft,
      groqKey: draft.groqKey.trim(),
      geminiKey: draft.geminiKey.trim(),
      groqModel: draft.groqModel.trim() || 'openai/gpt-oss-20b',
      geminiModel: draft.geminiModel.trim() || 'gemini-3.5-flash',
      embeddingModel: draft.embeddingModel.trim() || 'gemini-embedding-001'
    });
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">BAĞLANTI · MODEL · RAG</span>
            <h2 id="settings-title">Ayarlar</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Kapat"><X /></button>
        </div>

        <div className="modal-body">
          <section>
            <h3 className="settings-section-title">Sağlayıcı</h3>
            <div className="provider-cards">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`provider-card${draft.provider === p.id ? ' is-active' : ''}`}
                  onClick={() => update('provider', p.id)}
                >
                  <span className="provider-radio">{draft.provider === p.id ? <Check width={13} height={13} /> : null}</span>
                  <span className="provider-card-body">
                    <span className="provider-card-top"><strong>{p.title}</strong><em>{p.tag}</em></span>
                    <small>{p.desc}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {draft.provider === 'groq' && (
            <section className="settings-fields">
              <label>
                <span>Groq API anahtarı</span>
                <div className="key-input">
                  <Key width={16} height={16} />
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={draft.groqKey}
                    onChange={(e) => update('groqKey', e.target.value)}
                    placeholder="gsk_..."
                    autoComplete="off"
                  />
                  <button type="button" onClick={() => setShowKeys((v) => !v)}>{showKeys ? 'gizle' : 'göster'}</button>
                </div>
                <small className="field-hint">Anahtarı <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys</a> adresinden alabilirsin. Ücretsiz katman yeterli.</small>
              </label>
              <label>
                <span>Model</span>
                <div className="model-row">
                  <input list="groq-model-list" value={draft.groqModel} onChange={(e) => update('groqModel', e.target.value)} placeholder="openai/gpt-oss-20b" />
                  <button type="button" className="ghost-small" onClick={fetchModels} disabled={busy || !draft.groqKey.trim()}>{busy ? '…' : 'Modelleri getir'}</button>
                </div>
                <datalist id="groq-model-list">
                  {(models.length ? models : GROQ_SUGGESTIONS).map((m) => <option key={m} value={m} />)}
                </datalist>
                <div className="model-chips">
                  {GROQ_SUGGESTIONS.map((m) => (
                    <button key={m} type="button" className={`model-chip${draft.groqModel === m ? ' is-active' : ''}`} onClick={() => update('groqModel', m)}>{m}</button>
                  ))}
                </div>
                <small className="field-hint">Öneri: <code>openai/gpt-oss-20b</code> hızlı; <code>openai/gpt-oss-120b</code> daha kaliteli; <code>qwen/qwen3.8-27b</code> en hızlı. Eski <code>llama-3.3-70b</code> artık bu anahtarda yok.</small>
              </label>
            </section>
          )}

          {draft.provider === 'gemini' && (
            <section className="settings-fields">
              <label>
                <span>Gemini API anahtarı</span>
                <div className="key-input">
                  <Key width={16} height={16} />
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={draft.geminiKey}
                    onChange={(e) => update('geminiKey', e.target.value)}
                    placeholder="AIza..."
                    autoComplete="off"
                  />
                  <button type="button" onClick={() => setShowKeys((v) => !v)}>{showKeys ? 'gizle' : 'göster'}</button>
                </div>
                <small className="field-hint">Anahtarı <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">aistudio.google.com/app/apikey</a> adresinden alabilirsin.</small>
              </label>
              <label>
                <span>Üretim modeli</span>
                <div className="model-row">
                  <input list="gemini-model-list" value={draft.geminiModel} onChange={(e) => update('geminiModel', e.target.value)} placeholder="gemini-3.5-flash" />
                  <button type="button" className="ghost-small" onClick={fetchModels} disabled={busy || !draft.geminiKey.trim()}>{busy ? '…' : 'Modelleri getir'}</button>
                </div>
                <datalist id="gemini-model-list">
                  {(models.length ? models : GEMINI_SUGGESTIONS).map((m) => <option key={m} value={m} />)}
                </datalist>
                <div className="model-chips">
                  {GEMINI_SUGGESTIONS.map((m) => (
                    <button key={m} type="button" className={`model-chip${draft.geminiModel === m ? ' is-active' : ''}`} onClick={() => update('geminiModel', m)}>{m}</button>
                  ))}
                </div>
                <small className="field-hint">Öneri: <code>gemini-3.5-flash</code> (Türkçe kalitesi en iyi). Daha hızlı/ucuz: <code>gemini-3.1-flash-lite</code>. <code>2.5-flash</code> yeni anahtarlara kapalı.</small>
              </label>
              <label>
                <span>Semantik RAG (embedding)</span>
                <div className="switch-row">
                  <button
                    type="button"
                    className={`switch${draft.semanticRag ? ' is-on' : ''}`}
                    onClick={() => update('semanticRag', !draft.semanticRag)}
                    aria-pressed={draft.semanticRag}
                  ><span /></button>
                  <div>
                    <strong>{draft.semanticRag ? 'Açık' : 'Kapalı'}</strong>
                    <small>Gemini embedding ile anlamsal arama; BM25 + vektör hibrit. İlk çalıştırmada indeks kurulur ve tarayıcıda saklanır.</small>
                  </div>
                </div>
              </label>
              <label>
                <span>Embedding modeli</span>
                <input value={draft.embeddingModel} onChange={(e) => update('embeddingModel', e.target.value)} placeholder="gemini-embedding-001" />
                <small className="field-hint">Alternatif: <code>text-embedding-004</code>. Model yoksa semantik RAG sessizce BM25’e döner.</small>
              </label>
            </section>
          )}

          <section className="settings-fields">
            <label>
              <span>Maksimum çıktı tokenı</span>
              <select value={draft.maxOutputTokens} onChange={(e) => update('maxOutputTokens', Number(e.target.value))}>
                <option value={2048}>2048 — kısa / riskli</option>
                <option value={4096}>4096 — önerilen</option>
                <option value={6144}>6144 — uzun senaryo</option>
                <option value={8192}>8192 — maksimum</option>
              </select>
              <small className="field-hint">Eksik JSON'u önlemek için <strong>4096</strong> önerilir. Çıktı yarıda kalırsa 6144'e çıkar. Girdi ~3.000 token; önerilen modellerin bağlamı 131k/1M.</small>
            </label>
          </section>

          <div className="capacity-note">
            <strong>Kapasite kontrolü</strong>
            <p>Tipik istek: ~3.000 girdi + ~1.000-1.500 çıktı tokenı. Bağlam limiti rahat; asıl sınır Groq ücretsiz <strong>TPM 8.000</strong>. Tek üretim ~6-7k token tuttuğu için art arda üretimde ~1 dakika bekleyin. Qwen’de <strong>OTPM 1.000</strong> olduğundan max çıktı 1.000’e sabitlenir. 4k bağlamlı <code>allam-2-7b</code> ve ses/görsel modelleri listeden çıkarıldı.</p>
          </div>

          {draft.provider === 'demo' && (
            <section className="demo-note">
              <Sparkle width={18} height={18} />
              <div>
                <strong>Demo modu anahtarsız çalışır.</strong>
                <p>Yerel şablon motoru, seçtiğin burç ve gök takvimi bağlamıyla örnek bir senaryo + Higgsfield promptu üretir. Canlı siteyi test etmek ve arkadaşlarına göstermek için ideal; gerçek model çeşitliliği için Groq veya Gemini bağla.</p>
              </div>
            </section>
          )}

          <section className="settings-fields">
            <label>
              <span>Yaratıcılık · {draft.temperature.toFixed(2)}</span>
              <input
                type="range"
                min={0.2}
                max={1.1}
                step={0.05}
                value={draft.temperature}
                onChange={(e) => update('temperature', Number(e.target.value))}
              />
              <small className="field-hint">Düşük = daha kontrollü ve tekrarlı; yüksek = daha cesur ve beklenmedik. 0.8-0.9 önerilir.</small>
            </label>
          </section>

          {message && <div className="settings-message success">{message}</div>}
          {error && <div className="settings-message error">{error}</div>}

          <div className="privacy-box">
            <strong>Gizlilik</strong>
            <p>Anahtarlar yalnızca bu tarayıcının <code>localStorage</code> alanında tutulur. İstekler doğrudan Groq veya Google sunucularına gider; bu sitenin bir arka ucu yoktur. Ortak bir bilgisayarda “anahtarları temizle” ile sil.</p>
          </div>
        </div>

        <div className="modal-foot">
          <button
            type="button"
            className="text-link danger"
            onClick={() => setDraft({ ...draft, groqKey: '', geminiKey: '' })}
          >Anahtarları temizle</button>
          <div className="modal-foot-actions">
            <button type="button" className="ghost-small" onClick={test} disabled={busy || draft.provider === 'demo'}>{busy ? 'Test ediliyor…' : 'Bağlantıyı test et'}</button>
            <button type="button" className="primary-small" onClick={save}>Kaydet ve kullan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
