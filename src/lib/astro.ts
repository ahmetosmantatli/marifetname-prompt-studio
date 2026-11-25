import type { AstroContext, Scope } from '../types';
import { SIGNS } from '../data/signs';
import { PLANETS } from '../data/planets';

const DAY_MS = 86_400_000;
const ISTANBUL = { lat: 41.0082, lon: 28.9784, utcOffsetMinutes: 180 };

const WEEKDAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const CHALDEAN = ['zuhal', 'musteri', 'merih', 'sems', 'zuhre', 'utarit', 'kamer'] as const;

export const normalizeDeg = (x: number): number => ((x % 360) + 360) % 360;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function julianDay(date: Date): number {
  return date.getTime() / DAY_MS + 2440587.5;
}

export function sunLongitude(date: Date): number {
  const n = julianDay(date) - 2451545.0;
  const L = normalizeDeg(280.46 + 0.9856474 * n);
  const g = rad(normalizeDeg(357.528 + 0.9856003 * n));
  return normalizeDeg(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
}

export function moonLongitude(date: Date): number {
  const n = julianDay(date) - 2451545.0;
  const Lp = normalizeDeg(218.316 + 13.176396 * n);
  const M = rad(normalizeDeg(134.963 + 13.064993 * n));
  const Ms = rad(normalizeDeg(357.529 + 0.98560028 * n));
  const D = rad(normalizeDeg(297.85 + 12.190749 * n));
  const F = rad(normalizeDeg(93.272 + 13.22935 * n));
  return normalizeDeg(
    Lp +
      6.289 * Math.sin(M) +
      1.274 * Math.sin(2 * D - M) +
      0.658 * Math.sin(2 * D) +
      0.214 * Math.sin(2 * M) -
      0.186 * Math.sin(Ms) -
      0.114 * Math.sin(2 * F)
  );
}

export function signFromLongitude(lon: number) {
  const idx = Math.floor(normalizeDeg(lon) / 30) % 12;
  return SIGNS[idx];
}

export function moonPhaseInfo(date: Date): { name: string; illumination: number; angle: number } {
  const angle = normalizeDeg(moonLongitude(date) - sunLongitude(date));
  const illumination = (1 - Math.cos(rad(angle))) / 2;
  let name = 'Yeni Ay';
  if (angle >= 11.25 && angle < 78.75) name = 'Büyüyen Hilal';
  else if (angle >= 78.75 && angle < 101.25) name = 'İlk Dördün';
  else if (angle >= 101.25 && angle < 168.75) name = 'Büyüyen Şişkin Ay';
  else if (angle >= 168.75 && angle < 191.25) name = 'Dolunay';
  else if (angle >= 191.25 && angle < 258.75) name = 'Küçülen Şişkin Ay';
  else if (angle >= 258.75 && angle < 281.25) name = 'Son Dördün';
  else if (angle >= 281.25 && angle < 348.75) name = 'Küçülen Hilal';
  return { name, illumination, angle };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** NOAA yaklaşımı; İstanbul için dakika cinsinden yerel (UTC+3) doğuş/batış. */
export function solarTimes(date: Date): { sunrise: number; sunset: number } {
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start) / DAY_MS) + 1;
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + 0.5);
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);
  const lat = rad(ISTANBUL.lat);
  const cosHA =
    Math.cos(rad(90.833)) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl);
  const ha = deg(Math.acos(clamp(cosHA, -1, 1)));
  const sunriseUTC = 720 - 4 * (ISTANBUL.lon + ha) - eqtime;
  const sunsetUTC = 720 - 4 * (ISTANBUL.lon - ha) - eqtime;
  return {
    sunrise: sunriseUTC + ISTANBUL.utcOffsetMinutes,
    sunset: sunsetUTC + ISTANBUL.utcOffsetMinutes
  };
}

export function istanbulParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short'
  }).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour === '24' ? '0' : map.hour),
    minute: Number(map.minute),
    weekday: map.weekday
  };
}

export function localNoon(year: number, month: number, day: number): Date {
  // 12:00 İstanbul = 09:00 UTC
  return new Date(Date.UTC(year, month - 1, day, 9, 0, 0));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function formatDateTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatDateShortTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'short'
  }).format(date);
}

export function formatTimeTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

export function weekdayTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    weekday: 'long'
  }).format(date);
}

export function hijriTR(date: Date): string {
  try {
    return new Intl.DateTimeFormat('tr-TR-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date).replace(/^Hicri\s+/i, '');
  } catch {
    return '';
  }
}

export function planetaryDay(date: Date): { dayName: string; rulerKey: string; rulerName: string } {
  const wd = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Istanbul',
    weekday: 'short'
  }).format(date);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const idx = map[wd] ?? 0;
  const rulers = ['sems', 'kamer', 'merih', 'utarit', 'musteri', 'zuhre', 'zuhal'] as const;
  const key = rulers[idx];
  return { dayName: WEEKDAYS_TR[idx], rulerKey: key, rulerName: PLANETS[key].name };
}

export function planetaryHour(date: Date): { key: string; name: string; period: string; index: number } {
  const p = istanbulParts(date);
  const localMinutes = p.hour * 60 + p.minute;
  const { sunrise, sunset } = solarTimes(date);
  const dayLen = Math.max(1, sunset - sunrise);
  const nightLen = Math.max(1, 1440 - dayLen);
  const dayRuler = planetaryDay(date).rulerKey as (typeof CHALDEAN)[number];
  const startIdx = CHALDEAN.indexOf(dayRuler);
  let hourIndex: number;
  let period: string;
  if (localMinutes >= sunrise && localMinutes < sunset) {
    hourIndex = Math.min(11, Math.floor(((localMinutes - sunrise) / dayLen) * 12));
    period = 'gündüz';
  } else {
    const sinceSunset = localMinutes >= sunset ? localMinutes - sunset : localMinutes + (1440 - sunset);
    hourIndex = Math.min(11, Math.floor((sinceSunset / nightLen) * 12));
    period = 'gece';
  }
  const key = CHALDEAN[(startIdx + hourIndex) % 7];
  return { key, name: PLANETS[key].name, period, index: hourIndex + 1 };
}

export function seasonFromSun(date: Date): string {
  const lon = sunLongitude(date);
  if (lon < 90) return 'İlkbahar';
  if (lon < 180) return 'Yaz';
  if (lon < 270) return 'Sonbahar';
  return 'Kış';
}

function uniqueSigns(dates: Date[]) {
  const seen = new Set<string>();
  const out = [];
  for (const d of dates) {
    const s = signFromLongitude(moonLongitude(d));
    if (!seen.has(s.id)) {
      seen.add(s.id);
      out.push(s);
    }
  }
  return out;
}

export function buildAstroContext(scope: Scope, now = new Date()): AstroContext {
  const today = istanbulParts(now);
  let reference = now;
  let start = now;
  let end = now;
  let scopeLabel = 'Bugün';
  let rangeLabel = `${formatDateTR(now)} · ${weekdayTR(now)}`;

  if (scope === 'yarin') {
    reference = localNoon(today.year, today.month, today.day);
    reference = addDays(reference, 1);
    start = end = reference;
    scopeLabel = 'Yarın';
    rangeLabel = `${formatDateTR(reference)} · ${weekdayTR(reference)}`;
  } else if (scope === 'hafta') {
    start = now;
    end = addDays(now, 7);
    reference = addDays(now, 3);
    scopeLabel = 'Bu Hafta';
    rangeLabel = `${formatDateShortTR(start)} – ${formatDateShortTR(end)}`;
  } else if (scope === 'ay') {
    start = now;
    end = addDays(now, 30);
    reference = addDays(now, 15);
    scopeLabel = 'Bu Ay';
    rangeLabel = `${formatDateShortTR(start)} – ${formatDateShortTR(end)}`;
  }

  const sampleDates: Date[] = [];
  if (scope === 'hafta' || scope === 'ay') {
    const totalDays = scope === 'hafta' ? 7 : 30;
    for (let i = 0; i <= totalDays; i++) {
      const d = addDays(start, i);
      const lp = istanbulParts(d);
      sampleDates.push(localNoon(lp.year, lp.month, lp.day));
    }
  } else {
    sampleDates.push(reference);
  }

  const moonSigns = uniqueSigns(sampleDates);
  const primaryMoonSign = signFromLongitude(moonLongitude(reference));
  const phase = moonPhaseInfo(reference);
  const pDay = planetaryDay(reference);
  const pHour = planetaryHour(reference);
  const sunSign = signFromLongitude(sunLongitude(reference));

  return {
    scope,
    scopeLabel,
    dateLabel: `${formatDateTR(reference)} · ${weekdayTR(reference)}`,
    rangeLabel,
    referenceISO: reference.toISOString(),
    sunSign,
    moonSigns,
    primaryMoonSign,
    moonPhase: phase.name,
    illumination: phase.illumination,
    planetaryDay: `${pDay.dayName} · ${pDay.rulerName}`,
    planetaryHour: `${pHour.name} saati (${pHour.period} ${pHour.index}. saat)`,
    season: seasonFromSun(reference),
    hijri: hijriTR(reference),
    weekday: weekdayTR(reference)
  };
}
