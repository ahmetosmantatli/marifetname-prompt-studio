import type { SignProfile } from '../types';
import { SIGNS } from '../data/signs';
import { PLANETS } from '../data/planets';

interface Props {
  active: SignProfile;
  onChange: (sign: SignProfile) => void;
}

export function SignWheel({ active, onChange }: Props) {
  return (
    <div className="sign-wheel-wrap">
      <div className="sign-wheel" style={{ ['--accent' as string]: active.accent }}>
        <svg className="wheel-svg" viewBox="0 0 360 360" aria-hidden="true">
          <circle cx="180" cy="180" r="170" className="wheel-ring outer" />
          <circle cx="180" cy="180" r="116" className="wheel-ring inner" />
          <circle cx="180" cy="180" r="104" className="wheel-ring faint" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = ((i * 30 - 90) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={180 + Math.cos(a) * 116}
                y1={180 + Math.sin(a) * 116}
                x2={180 + Math.cos(a) * 170}
                y2={180 + Math.sin(a) * 170}
                className="wheel-spoke"
              />
            );
          })}
          {Array.from({ length: 72 }).map((_, i) => {
            const a = ((i * 5 - 90) * Math.PI) / 180;
            const r1 = i % 6 === 0 ? 160 : 165;
            return (
              <line
                key={`t${i}`}
                x1={180 + Math.cos(a) * r1}
                y1={180 + Math.sin(a) * r1}
                x2={180 + Math.cos(a) * 170}
                y2={180 + Math.sin(a) * 170}
                className="wheel-tick"
              />
            );
          })}
        </svg>

        {SIGNS.map((s, i) => {
          const angle = ((i * 30 - 90) * Math.PI) / 180;
          const isActive = s.id === active.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`wheel-sign${isActive ? ' is-active' : ''}`}
              style={{
                left: `${(50 + Math.cos(angle) * 38.5).toFixed(3)}%`,
                top: `${(50 + Math.sin(angle) * 38.5).toFixed(3)}%`,
                ['--sign-accent' as string]: s.accent
              }}
              onClick={() => onChange(s)}
              aria-pressed={isActive}
              title={`${s.name} · ${s.dates}`}
            >
              <span className="wheel-glyph">{s.glyph}</span>
              <span className="wheel-name">{s.name}</span>
            </button>
          );
        })}

        <div className="wheel-center">
          <span className="center-glyph">{active.glyph}</span>
          <strong>{active.name}</strong>
          <span className="center-dates">{active.dates}</span>
          <span className="center-meta">{active.element} · {active.modality}</span>
        </div>
      </div>

      <div className="sign-dossier">
        <div className="dossier-head">
          <span className="dossier-element" style={{ color: active.accent }}>{active.element}</span>
          <span className="dossier-dot">·</span>
          <span>{active.elementNature}</span>
          <span className="dossier-dot">·</span>
          <span>{active.gender} burç</span>
        </div>
        <p className="dossier-motto">“{active.motto}”</p>
        <div className="dossier-grid">
          <div>
            <label>Yönetici</label>
            <strong>{PLANETS[active.planet].glyph} {PLANETS[active.planet].name}</strong>
          </div>
          <div>
            <label>Mizaç</label>
            <strong>{PLANETS[active.planet].humor}</strong>
          </div>
          <div>
            <label>Mevsim</label>
            <strong>{active.season}</strong>
          </div>
          <div>
            <label>Anahtar</label>
            <strong>{active.keyword}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
