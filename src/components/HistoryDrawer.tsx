import { useEffect } from 'react';
import type { HistoryItem } from '../types';
import { Trash, X } from './Icons';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
  onClear: () => void;
}

function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function HistoryDrawer({ items, onSelect, onClose, onClear }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="history-drawer" onMouseDown={(e) => e.stopPropagation()} aria-label="Üretim geçmişi">
        <div className="drawer-head">
          <div>
            <span className="eyebrow">SON 30 ÜRETİM</span>
            <h2>Geçmiş</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Kapat"><X /></button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Henüz üretim yok.</p>
            <small>İlk promptunu oluşturunca burada görünecek.</small>
          </div>
        ) : (
          <>
            <div className="history-list">
              {items.map((item) => (
                <button key={item.id} type="button" className="history-item" onClick={() => onSelect(item)}>
                  <span className="history-glyph">{item.meta.input.sign.glyph}</span>
                  <span className="history-body">
                    <strong>{item.signName} <em>/ {item.scope === 'bugun' ? 'bugün' : item.scope === 'yarin' ? 'yarın' : item.scope === 'hafta' ? 'bu hafta' : 'bu ay'}</em></strong>
                    <small>{item.meta.input.character} · {item.tone} · {fmt(item.createdAt)}</small>
                    <span className="history-hook">{item.content.hook}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="drawer-foot">
              <button type="button" className="text-link danger" onClick={onClear}><Trash width={14} height={14} /> Geçmişi temizle</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
