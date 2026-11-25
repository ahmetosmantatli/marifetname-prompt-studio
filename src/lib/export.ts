import type { HistoryItem } from '../types';

export function buildExportText(item: HistoryItem): string {
  const { content, meta } = item;
  const sign = meta.input.sign;
  const astro = meta.astro;
  const lines = content.script[0] === content.hook ? content.script.slice(1) : content.script;
  return [
    'MÂRİFETNÂME PROMPT ATÖLYESİ',
    '================================',
    `${sign.name} · ${astro.scopeLabel} · ${astro.rangeLabel}`,
    `Karakter: ${meta.input.character} · Ton: ${meta.input.tone} · Süre: ${meta.input.duration} sn · Sahne: ${meta.input.sceneMode === 'existing' ? 'mevcut karakter/ortam' : 'app tarifi'} · Sağlayıcı: ${meta.provider} / ${meta.model}`,
    `Üretim: ${new Date(item.createdAt).toLocaleString('tr-TR')}`,
    '',
    'HOOK',
    content.hook,
    '',
    'SENARYO',
    ...lines.map((l, i) => `${String(i + 1).padStart(2, '0')}. ${l}`),
    '',
    'KAPANIŞ',
    content.closing,
    '',
    'HIGGSFIELD · ANA PLAN',
    content.higgsfieldPrompt,
    '',
    'SAHNE PLANI',
    ...(content.scenePlan?.length
      ? content.scenePlan.map((p) => `- ${p.range}\n  ${p.visual}\n  ${p.dialogue}`)
      : ['- Tek klip / sahne planı yok']),
    '',
    'HIGGSFIELD · B-ROLL',
    content.bRollPrompt,
    '',
    'NEGATİF PROMPT',
    content.negativePrompt,
    '',
    'SES YÖNETİMİ',
    content.voiceDirection,
    '',
    'EKRAN YAZILARI',
    content.onScreenText.join(' · '),
    '',
    'CAPTION',
    content.caption,
    content.hashtags.join(' '),
    '',
    'KAYNAK NOTLARI',
    ...content.sourceNotes.map((s) => `- ${s}`),
    '',
    'RAG PASajLARI',
    ...meta.chunks.map((c) => `- s. ${c.page} · ${c.title}\n  ${c.text}`),
    '',
    'Not: Bu çıktı kehanet değil; Mârifetnâme’nin burç, gezegen ve mizaç tasnifinden hareketle üretilmiş bir tefekkür ve içerik taslağıdır.'
  ].join('\n');
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
