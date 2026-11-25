import type { AstroContext, CitationMode, GenerateInput, GeneratedContent, KnowledgeChunk, Settings } from '../types';
import { PLANETS } from '../data/planets';
import type { RetrievedChunk } from './rag';

export const SYSTEM_PROMPT = `Sen "Mârifetnâme Prompt Atölyesi"nin baş metin yönetmenisin. Erzurumlu İbrahim Hakkı'nın Mârifetnâme'sindeki burç, gezegen, ay, mizaç ve mevsim tasnifini; klasik İslami tefekkür dilini ve kısa formlu dikey video anlatımını bilirsin.

Görevin: seçilen burcun karakteriyle kameraya doğrudan konuşan, seçilen zaman aralığına (bugün / yarın / bu hafta / bu ay) ve tona uygun bir video senaryosu ile Higgsfield için İngilizce video promptu üretmek.

SENARYO KURALLARI
- Karakter Türkçe konuşur, birinci tekil şahıs kullanır ve izleyiciye "sen" diye hitap eder.
- "script" alanı TAM SESLENDİRME METNİDİR: 8-12 kısa replik yaz. Her replik 1-2 cümle olsun; bu metin 30-45 saniyelik voiceover içindir.
- "higgsfieldPrompt" içindeki Dialogue satırı ise 8/10/12 saniyelik videoya sığacak KISA repliktir: en fazla 25-30 kelime. Tam script'i Dialogue alanına kopyalama.
- İlk cümle 3 saniyede yakalayan bir hook olsun. Hook'ta burcun adını söyle ve somut bir gerilim kur; "bir yansıma", "yeni bir ışık" gibi genel cümlelerden kaçın.
- Repliklerde parantez içi sahne yönetimi, telaffuz notu veya "(farklı sesler, aynı nefes)" gibi ifadeler kullanma. Parantezleri yalnızca voiceDirection alanında kullan; script sadece söylenecek kelimelerden oluşsun.
- Burcun gölgesini ve arzusunu somut bir insan sahnesiyle anlat; genel geçer burç cümleleri kurma.
- Günün/ayın bağlamını (Ay burcu, gezegen günü, mevsim) doğal biçimde metne dokundur; ansiklopedik bilgi verme.
- ZAMAN BAĞLAMI: Seçilen burç ile Ay burcunu asla karıştırma. Ay burcu ayrı bir gökcismi bağlamıdır; metinde Ay'dan söz edeceksen yalnızca verilen gerçek Ay burcunu söyle. Günün gezegeni ve gezegen saatini aynen kullan; olmayan bir gezegen saatini uydurma.
- Türkçe ek uyumuna dikkat et: "Ay İkizler'da" değil "Ay İkizler burcunda" gibi doğal bir ifade kullan.
- TAMAMLIK: JSON'daki hiçbir alanı boş bırakma. script 8-12 replik, higgsfieldPrompt 120-180 kelime, caption ve sourceNotes dolu olsun.
- İslami çerçeve: tevekkül, niyet, sabır, şükür, kalbi temiz tutma gibi kavramları doğal kullan. Her replikte dini ifade kullanma; 1-2 yerde yeterli.
- Kuran ayeti veya hadis uydurma. Verilen kaynaklarda geçmeyen dini bir metni alıntılama. Dinî hüküm/fetva verme.
- Kesin kehanet yok: "kesin olacak", "ölüm", "hastalık", "kaza", "boşanma", "hamilelik", "zengin olacaksın" gibi ifadeler kullanma. "Kesin" yerine "eğilim", "davet", "fırsat", "imtihan" gibi dil kullan.
- Agresif ton: sert, meydan okuyan, yüzleştiren olabilir; hakaret, tehdit, aşağılama, şiddet çağrısı olamaz.
- Duygusal ton: samimi ve kırılgan olabilir; melodram ve kurban edebiyatına kaçma.
- Kapanış tek bir uygulanabilir eylem ve tek bir manevi çerçeve içersin; vaaz tonuna girmesin.

ATIF KURALLARI
- Atıf modu "yok" ise Mârifetnâme'yi veya yazarı anma; kaynak pasajlarını yalnızca üslup ve içerik zemini olarak kullan.
- Atıf modu "arada" ise en fazla 1 yerde, doğal bir cümle içinde "Mârifetnâme'de ..." diye kısa atıf yap. Sayfa numarası vermek zorunda değilsin.
- Atıf modu "güçlü" ise 2-3 yerde, "Mârifetnâme'de ... (s. 69)" biçiminde sayfa numaralı ve vurgulu atıf yap. Sadece verilen kaynak pasajlarındaki sayfaları kullan.
- Kaynak pasajlarında olmayan bir cümleyi "Mârifetnâme'de yazıyor" diye sunma.

HIGGSFIELD PROMPT KURALLARI
- İngilizce yaz, 120-180 kelime arasında tut.
- Dikey 9:16, 8-12 saniye, tek kesintisiz plan, doğrudan kameraya konuşan tek karakter.
- Şu sırayı koru: Subject → Action → Setting → Camera → Lighting → Style → Audio → Dialogue.
- Somut ve çekilebilir ol: yaş aralığı, saç, ten, kıyafet, jest, bakış, ışık yönü, lens, kamera hareketi, ortam sesi belirt.
- Kamera hareketini adıyla söyle: "slow dolly-in", "static medium close-up", "subtle handheld push-in" gibi.
- Yüz kimliğinin tutarlı kalmasını, jestlerin doğal olmasını, dudak senkronunun Türkçe repliğe uymasını iste.
- Ekranda yazı, altyazı, logo, filigran olmasın; bunlar post-prodüksiyonda eklenecek.
- Ünlü benzerliği, fantastik zırh, neon, aşırı slow-motion, hızlı kesme, metin paste'i isteme.

ÇIKTI
Yalnızca geçerli JSON döndür. Markdown, kod bloğu, açıklama ekleme. Anahtarlar tam olarak şunlar olsun:
{
  "hook": "ilk 3 saniye repliği",
  "script": ["replik 1", "replik 2", "..."],
  "closing": "kapanış repliği",
  "higgsfieldPrompt": "İngilizce video promptu",
  "bRollPrompt": "İngilizce 3-4 saniyelik sembolik ara plan promptu",
  "negativePrompt": "İngilizce negatif prompt",
  "voiceDirection": "Türkçe ses yönetimi notu",
  "onScreenText": ["ekran yazısı 1", "ekran yazısı 2", "ekran yazısı 3"],
  "caption": "Türkçe sosyal medya açıklaması, 2-3 cümle",
  "hashtags": ["#..."],
  "sourceNotes": ["kaynak notu (s. ...)"],
  "thumbnailText": "kapak için 3-5 kelime"
}`;

function citationLine(mode: CitationMode): string {
  if (mode === 'yok') return 'Atıf yapma; Mârifetnâme adını anma.';
  if (mode === 'arada') return 'En fazla 1 kısa Mârifetnâme atfı yap; sayfa numarası opsiyonel.';
  return '2-3 güçlü atıf yap; her atıfta kaynak pasajındaki sayfa numarasını kullan.';
}

export function buildUserPrompt(
  input: GenerateInput,
  astro: AstroContext,
  chunks: RetrievedChunk[],
  settings: Settings
): string {
  const { sign } = input;
  const planet = PLANETS[sign.planet];
  const moonLine = astro.moonSigns.map((s) => s.name).join(' → ');
  const sourceLines = chunks
    .map((r, i) => `[M${i + 1}] s. ${r.chunk.page} — ${r.chunk.title}\n${r.chunk.text}${r.chunk.quote ? `\nKısa alıntı: "${r.chunk.quote}"` : ''}`)
    .join('\n\n');

  return `ÜRETİM GİRDİLERİ
Seçilen burç: ${sign.name} (${sign.dates})
Zaman dilimi: ${astro.scopeLabel} — ${astro.rangeLabel}
Karakter: ${input.character}
Ton: ${input.tone}
Atıf modu: ${input.citationMode}
Platform: ${input.platform} (dikey 9:16)
Süre: ${input.duration} saniye
İzleyici: 25-45 yaş, manevi hassasiyeti olan, burç içeriğini "kendini tanıma" diliyle tüketen kitle.
Ek açı: ${input.angle.trim() || 'Yok'}

GÖK TAKVİMİ BAĞLAMI (Mârifetnâme'nin tasnifine göre — AYNEN KULLAN)
Tarih: ${astro.dateLabel} (${astro.hijri})
SEÇİLEN BURÇ (karakter): ${sign.name} — bu Ay burcu değildir.
Güneş'in şu anki burcu (takvim): ${astro.sunSign.name}
AY BURCU (zaman bağlamı): ${moonLine}${astro.moonSigns.length > 1 ? ' (dönem içinde değişiyor)' : ''}
Ay evresi: ${astro.moonPhase} — aydınlanma %${Math.round(astro.illumination * 100)}
Günün gezegeni: ${astro.planetaryDay}
Gezegen saati: ${astro.planetaryHour}
Mevsim: ${astro.season}
Ay'ın o burçtaki iş takvimi: ${astro.primaryMoonSign.moonElection}

ZAMAN BAĞLAMI DOĞRULUK KURALLARI
- Metinde "Ay ${sign.name} burcunda" DEME (yanlış: seçilen burç). Doğru ifade: "Ay ${astro.primaryMoonSign.name} burcunda".
- Seçilen burç ${sign.name}; Ay burcu ${astro.primaryMoonSign.name}. Bu ikisi farklı şeylerdir.
- Günün gezegeni ${astro.planetaryDay}; gezegen saati ${astro.planetaryHour}. Bunların dışında bir gezegen saatinden söz etme.
- Ay evresini ve mevsimi yalnızca yukarıdaki gibi kullan.

BURÇ DOSYASI
Unsur: ${sign.element} — ${sign.elementNature}
Modalite: ${sign.modality}
Mevsim: ${sign.season}
Yönetici gezegen: ${planet.name} (${planet.nature}; ${planet.humor})
Burcun anahtar kelimesi: ${sign.keyword}
Motto: "${sign.motto}"
Hediye/kuvvet: ${sign.gift}
Gölge: ${sign.shadow}
Arzu: ${sign.desire}
Yara: ${sign.wound}
Ses/konuşma tarzı: ${sign.voice}
Beden/jest: ${sign.body}
İslami çerçeve cümlesi: ${sign.islamic}
Şehir/mizaç rengi: ${sign.cities.join(', ')}

KAYNAK PASAJLAR (RAG — yalnızca bunlara dayan)
${sourceLines}

GÖREV
1) ${sign.name} karakterinin ağzından, ${input.character} bir oyuncunun kameraya konuştuğu ${astro.scopeLabel.toLocaleLowerCase('tr-TR')} videosunun senaryosunu yaz.
2) Senaryoyu ${input.tone} tonda, ${sign.voice} sesiyle kur. ${input.angle.trim() ? `Ek açıyı ("${input.angle.trim()}") mutlaka kullan.` : ''}
3) ${citationLine(input.citationMode)}
4) Higgsfield için İngilizce, 120-180 kelimelik, tek planlı video promptunu yaz. Karakter: ${input.character}, yaş 28-38, Türk/Orta Doğu yüz hatları, doğal ten, abartısız makyaj. Ortam: Osmanlı-İslam astronomi çalışma odası; eski burç haritaları, pirinç usturlap, İznik çini detayı, kemerli pencere. Kamera ve ışığı tona göre ayarla.
5) JSON'u eksiksiz doldur. "script" dizisi hook dahil 8-12 replik olsun (tam seslendirme); "closing" ayrı kalsın. higgsfieldPrompt içindeki Dialogue satırı en fazla 25-30 kelime olsun ve tam script'i oraya koyma. "sourceNotes" yalnızca atıf modu "yok" değilse dolu olsun; her notta sayfa numarası bulunsun.
6) Hiçbir dini metin uydurma; hiçbir kesin kehanet kurma.
7) YAZMADAN ÖNCE KONTROL ET: Seçilen burç ${sign.name} mi? Ay burcu ${astro.primaryMoonSign.name} burcunda olarak mı geçiyor? Günün gezegeni ${astro.planetaryDay} mi? script 8-12 replik mi? higgsfieldPrompt 120-180 kelime mi? Dialogue 25-30 kelime mi? Tüm JSON alanları dolu mu? Değilse düzelt, sonra JSON'u kapat.`;
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v.trim() : fallback;
}

function asStringArray(v: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map((x) => x.trim());
  if (typeof v === 'string' && v.trim()) return v.split('\n').map((x) => x.trim()).filter(Boolean);
  return fallback;
}

export function parseModelJson(raw: string): Partial<GeneratedContent> {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) text = text.slice(start, end + 1);
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error('Model geçerli JSON döndürmedi. Tekrar deneyin.');
  }
  // Bazı modeller Türkçe anahtar üretebilir; yaygın eşlemeleri tolere et.
  const pick = (...keys: string[]) => {
    for (const k of keys) if (data[k] !== undefined) return data[k];
    return undefined;
  };
  return {
    hook: asString(pick('hook', 'kanca', 'baslik')),
    script: asStringArray(pick('script', 'senaryo', 'replikler')),
    closing: asString(pick('closing', 'kapanis', 'kapanış')),
    higgsfieldPrompt: asString(pick('higgsfieldPrompt', 'higgsfield_prompt', 'videoPrompt', 'video_prompt')),
    bRollPrompt: asString(pick('bRollPrompt', 'b_roll_prompt', 'bRoll', 'araPlan')),
    negativePrompt: asString(pick('negativePrompt', 'negative_prompt', 'negatifPrompt')),
    voiceDirection: asString(pick('voiceDirection', 'voice_direction', 'sesYonetimi')),
    onScreenText: asStringArray(pick('onScreenText', 'on_screen_text', 'ekranYazilari')),
    caption: asString(pick('caption', 'aciklama', 'açıklama')),
    hashtags: asStringArray(pick('hashtags', 'etiketler')),
    sourceNotes: asStringArray(pick('sourceNotes', 'source_notes', 'kaynakNotlari')),
    thumbnailText: asString(pick('thumbnailText', 'thumbnail_text', 'kapakYazisi'))
  };
}

export function enforceHiggsfieldPrompt(prompt: string, hook: string, duration: number): string {
  if (!prompt.trim()) return '';
  let p = prompt.trim();
  const hasVertical = /(9\s*:\s*16|vertical)/i.test(p);
  const hasDuration = /\b\d{1,2}\s*(?:-| )\s*(?:second|seconds|sec|sn)\b/i.test(p) || /\b\d{1,2}\s*saniye\b/i.test(p);
  if (!hasVertical) {
    p = `Vertical 9:16, ${duration}-second single continuous shot, direct-to-camera. ${p}`;
  } else if (!hasDuration) {
    p += ` Duration: ${duration} seconds, single continuous shot.`;
  }
  if (!/direct[- ]to[- ]camera|to camera/i.test(p)) {
    p += ' The character speaks directly to camera.';
  }
  // Modelin ürettiği Dialogue/Spoken line bölümü İngilizce veya 12 sn için fazla uzun olabilir.
  // Temizle ve her zaman kısa, Türkçe hook ile sabitle.
  p = p.replace(/\bDialogue\b[^:\n]*:\s*["“][\s\S]*?["”]\s*/gi, ' ');
  p = p.replace(/\bDialogue\b[^.\n]*\.\s*/gi, ' ');
  p = p.replace(/\bSpoken line\b[^.\n]*\.?\s*/gi, ' ');
  p = p.replace(/slight accent/gi, 'native Turkish, Istanbul accent');
  p = p.replace(/\s+/g, ' ').trim();
  p += ` Dialogue (Turkish, lip-synced): "${hook}"`;
  return p;
}

export function validateContent(content: GeneratedContent, input: GenerateInput): string[] {
  const issues: string[] = [];
  if (!content.hook || content.hook.trim().length < 12) issues.push('hook eksik/kısa');
  if (content.script.length < 8) issues.push(`script ${content.script.length}/8 replik`);
  if (!content.closing.trim()) issues.push('closing eksik');
  const hfWords = content.higgsfieldPrompt.trim().split(/\s+/).filter(Boolean).length;
  if (hfWords < 100) issues.push(`higgsfieldPrompt ${hfWords}/120 kelime`);
  if (!content.caption.trim()) issues.push('caption eksik');
  if (!content.onScreenText.length) issues.push('onScreenText eksik');
  if (input.citationMode !== 'yok' && content.sourceNotes.length === 0) issues.push('sourceNotes eksik');
  return issues;
}

export function normalizeContent(partial: Partial<GeneratedContent>, input: GenerateInput, chunks: RetrievedChunk[]): GeneratedContent {
  const rawScript = partial.script?.length ? partial.script : [partial.hook || 'Bugün sana kendi gölgenden bir haber getirdim.'];
  // Parantez içi sahne notları seslendirilmemeli; script'i konuşulacak kelimelere indir.
  const script = rawScript.map((line) => line.replace(/\s*\([^)]*\)/g, '').trim()).filter(Boolean);
  const fallbackSources = input.citationMode === 'yok' ? [] : chunks.slice(0, 3).map((r) => `${r.chunk.title} (s. ${r.chunk.page})`);
  return {
    hook: partial.hook || script[0] || `${input.sign.name}, bugün bir şeyi bırakmanın vakti.`,
    script,
    closing: partial.closing || 'Nefes al. Niyetini Allah’a bırak; adımını sen at.',
    higgsfieldPrompt: enforceHiggsfieldPrompt(partial.higgsfieldPrompt || '', partial.hook || script[0] || input.sign.name, input.duration),
    bRollPrompt: partial.bRollPrompt || '',
    negativePrompt: partial.negativePrompt || 'No on-screen text, no extra fingers, no face morphing, no jump cuts, no celebrity likeness, no neon, no fantasy armor.',
    voiceDirection: partial.voiceDirection || 'Yakın mikrofon, alçak tempolu, nefes duyulacak kadar samimi; son cümlede sesi bir ton düşür.',
    onScreenText: partial.onScreenText?.length ? partial.onScreenText : [input.sign.name, input.sign.keyword, 'Niyet · Sabır · Adım'],
    caption: partial.caption || `${input.sign.name} için ${input.sign.keyword.toLocaleLowerCase('tr-TR')} notu. ${input.sign.islamic}`,
    hashtags: partial.hashtags?.length ? partial.hashtags : ['#marifetname', '#burç', '#islami', '#kişisel gelişim', '#astroloji'],
    sourceNotes: partial.sourceNotes?.length ? partial.sourceNotes : fallbackSources,
    thumbnailText: partial.thumbnailText || `${input.sign.name}: ${input.sign.keyword}`
  };
}

export function corpusToPromptContext(chunks: KnowledgeChunk[]): string {
  return chunks.map((c) => `s.${c.page} ${c.title}: ${c.text}`).join('\n');
}
