import type { AstroContext, GenerateInput, GeneratedContent } from '../types';
import { PLANETS } from '../data/planets';
import type { RetrievedChunk } from './rag';

const lower = (s: string) => s.charAt(0).toLocaleLowerCase('tr-TR') + s.slice(1);
const first = (arr: string[]) => arr[0] ?? '';

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const SCOPE_WORD: Record<string, string> = {
  bugun: 'bugün',
  yarin: 'yarın',
  hafta: 'bu hafta',
  ay: 'bu ay'
};

const TONE_EN: Record<string, string> = {
  duygusal: 'intimate and vulnerable',
  agresif: 'sharp and confrontational',
  sakin: 'calm and grounded',
  gizemli: 'hushed and mysterious',
  otoriter: 'authoritative and measured'
};

const TONE_VOICE: Record<string, string> = {
  duygusal: 'Yakın mikrofon, göğüs sesi, cümle aralarında nefes. Son iki kelimede sesi kıs.',
  agresif: 'Net artikülasyon, sert giriş, cümle sonlarında kesme. Bağırma; kontrol edilmiş öfke kullan.',
  sakin: 'Alçak tempolu, yumuşak giriş, eşit nefes. Acele etme; boşlukları bırak.',
  gizemli: 'Fısıltıya yakın, yavaş, aralarda kısa sessizlik. Vurguyu son kelimeye sakla.',
  otoriter: 'Tok, göğüsten, ölçülü. Her cümlenin sonunu bir hüküm gibi değil, bir karar gibi bitir.'
};

const CAMERA: Record<string, string> = {
  duygusal: 'slow dolly-in from a medium shot to a close-up, 50mm lens, shallow depth of field',
  agresif: 'subtle handheld push-in from a low angle, 35mm lens, shallow depth of field',
  sakin: 'static medium close-up on a tripod, 50mm lens, soft background falloff',
  gizemli: 'slow lateral dolly with gentle parallax, 40mm lens, shallow focus',
  otoriter: 'slow low-angle push-in, 35mm lens, deep background shadow'
};

const LIGHT: Record<string, string> = {
  duygusal: 'warm candle key light from the left, soft amber falloff, gentle catchlights',
  agresif: 'hard side key light, deep shadows on half the face, restrained warm rim light',
  sakin: 'soft overcast window light, diffused, low contrast, natural skin tones',
  gizemli: 'low-key teal ambience, a single candle as key, thin silver rim light',
  otoriter: 'top light with a gold rim, strong cheekbone shadow, dark background'
};

const PALETTE: Record<string, string> = {
  ateş: 'amber, deep burgundy and charcoal',
  toprak: 'olive, parchment and aged brass',
  hava: 'slate blue, silver and pale gold',
  su: 'teal, moonstone and indigo'
};

const SETTING: Record<string, string> = {
  ateş: 'an Ottoman-Islamic observatory study with aged zodiac charts, a brass astrolabe, Iznik tile details, a red candle and a tall arched window',
  toprak: 'a stone study with parchment maps, olive branches in a copper vessel, a brass astrolabe, woven textiles and a narrow arched window',
  hava: 'a high-ceilinged study with star charts pinned to the wall, a brass astrolabe, glass inkwells, geometric tilework and an arched window onto a deep indigo sky',
  su: 'a dim study with a moonlit water bowl, indigo silk, a brass astrolabe, weathered charts and an arched window opening onto a dark sea'
};

function characterSheet(input: GenerateInput): string {
  if (input.character === 'kadın') {
    return 'a Turkish woman in her early 30s with dark wavy hair loosely pulled back, warm olive skin, expressive dark eyes, minimal makeup, wearing a deep burgundy silk blouse, a thin gold necklace and a small brass earring';
  }
  return 'a Turkish man in his mid 30s with short dark hair, a neatly trimmed beard, warm olive skin, dark eyes, wearing a charcoal linen shirt, a silver ring and a woven leather bracelet';
}

function action(tone: string, character: string): string {
  const pronoun = character === 'kadın' ? 'She' : 'He';
  if (tone === 'agresif') {
    return `${pronoun} leans slightly forward, holds the viewer's gaze without blinking, jaw tight, one hand flat on the desk, then lifts a finger to make a single decisive point.`;
  }
  if (tone === 'duygusal') {
    return `${pronoun} speaks softly, one hand pressed to the chest, then releases it; the eyes glisten but do not tear.`;
  }
  if (tone === 'gizemli') {
    return `${pronoun} stays very still, tilts the head slightly, and speaks as if sharing a secret; one finger traces the rim of the brass astrolabe.`;
  }
  if (tone === 'otoriter') {
    return `${pronoun} sits upright, hands folded on the desk, and delivers each line with calm finality, never raising the voice.`;
  }
  return `${pronoun} breathes slowly, shoulders relaxed, and speaks with a grounded, unhurried warmth, occasionally glancing at the sky beyond the window.`;
}

function buildScript(input: GenerateInput, astro: AstroContext): { hook: string; lines: string[]; closing: string } {
  const { sign, tone, citationMode } = input;
  const scope = SCOPE_WORD[input.scope];
  const planet = PLANETS[sign.planet];
  const selector = hash(`${sign.id}-${input.scope}-${tone}-${astro.dateLabel}`);
  const moon = astro.primaryMoonSign;

  const hooks: Record<string, string[]> = {
    duygusal: [
      `${sign.name}, ${scope} kendini taşımakta zorlandığın o yeri biliyorum.`,
      `${sign.name}, ${scope} sana kendi kalbinden bir haber getirdim.`,
      `${sign.name}, herkesin güçlü sandığı yer, bazen en yorgun yerindir.`
    ],
    agresif: [
      `${sign.name}, ${scope} sana nazik davranmayacağım. Kalk.`,
      `${sign.name}, ${scope} mazeretini bir kenara bırak. Konuşacağız.`,
      `${sign.name}, ${scope} kendine yalan söylemeyi bırak.`
    ],
    sakin: [
      `${sign.name}, ${scope} acele etmen gerekmiyor.`,
      `${sign.name}, ${scope} önce dur. Sonra nefes al.`,
      `${sign.name}, ${scope} her şeyi aynı anda çözmek zorunda değilsin.`
    ],
    gizemli: [
      `${sign.name}, ${scope} sana gökyüzünün değil, kendi gölgenin haberini getirdim.`,
      `${sign.name}, ${scope} bir kapı aralık. Ama hangi kapı olduğunu henüz bilmiyorsun.`,
      `${sign.name}, ${scope} ışığın nereden geldiğini görmeden perdeyi kaldırma.`
    ],
    otoriter: [
      `${sign.name}, ${scope} karar senin. Ama önce şunu duy.`,
      `${sign.name}, ${scope} sana bir şey söyleyeceğim; sonra kararını sen ver.`,
      `${sign.name}, ${scope} hükmü ben vermiyorum. Sadece aynayı tutuyorum.`
    ]
  };

  const hook = hooks[tone][selector % hooks[tone].length];
  const lines: string[] = [];

  if (tone === 'duygusal') {
    lines.push(`Senin ${lower(sign.gift)} var. Ama kimse bunun ne kadar yorucu olduğunu sormuyor.`);
    lines.push(`${sign.shadow} dedikleri şey, aslında yaralanmış bir ${lower(sign.desire)}.`);
    lines.push(`Bugün Ay ${moon.name} burcunda. ${moon.moonElection}`);
    lines.push(`${planet.name}'in tabiatı ${lower(planet.nature)}. Bu, ${first(planet.shadows)} demek değil; ${first(planet.gifts)} için verilmiş bir güç.`);
    lines.push(`Sen ${lower(sign.desire)} istiyorsun. Ama onu ${lower(sign.shadow)} ile korumaya çalışıyorsun.`);
    lines.push(`Bir şeyi bırakmak, onu kaybetmek değil; yer açmak.`);
  } else if (tone === 'agresif') {
    lines.push(`${sign.shadow} senin hikâyen değil. Alışkanlığın.`);
    lines.push(`${sign.desire} istiyorsan, ${lower(sign.shadow)} bahanesini bırakacaksın.`);
    lines.push(`Ay ${moon.name}'ta. ${moon.moonElection}`);
    lines.push(`${planet.name} sana ${first(planet.gifts)} veriyor. Bunu ${first(planet.shadows)} için harcama.`);
    lines.push(`Kimse seni kurtarmayacak. Ama sen kendini kurtarabilirsin.`);
    lines.push(`${sign.name}, güç yüksek ses değil; doğru anda durmayı bilmektir.`);
  } else if (tone === 'sakin') {
    lines.push(`Bugün ${lower(sign.gift)} sana ağır geliyorsa, bu zayıflık değil.`);
    lines.push(`${sign.shadow} yüzeye çıkıyorsa, altında bir ihtiyaç var.`);
    lines.push(`Ay ${moon.name} burcunda; ${lower(moon.moonElection)}`);
    lines.push(`${planet.name}'in ${lower(planet.nature)} tabiatı, sana acele değil, ölçü öneriyor.`);
    lines.push(`Şu an tek bir doğru adım yeter. Küçük olsun; ama senin olsun.`);
    lines.push(`Bedenini dinle. Omuzların nerede kilitlenmişse, cevap orada.`);
  } else if (tone === 'gizemli') {
    lines.push(`Senin ${lower(sign.gift)} bir ışık; ${sign.shadow} ise o ışığın düşürdüğü gölge.`);
    lines.push(`Gölgeyi kesip atamazsın. Ama nereden geldiğini görebilirsin.`);
    lines.push(`Ay ${moon.name} burcunda. ${moon.moonElection}`);
    lines.push(`${planet.name} ${lower(planet.nature)} bir ayna tutuyor: ${first(planet.gifts)} mi, ${first(planet.shadows)} mi?`);
    lines.push(`Bugün sana fısıldanan şey, bir cevap değil; bir soru.`);
    lines.push(`Soruyu duy. Cevabı zorlamak zorunda değilsin.`);
  } else {
    lines.push(`${sign.gift} senin elinde. ${sign.shadow} ise henüz eğitilmemiş bir güç.`);
    lines.push(`${sign.desire} için önce ${lower(sign.shadow)} ile yüzleşeceksin.`);
    lines.push(`Ay ${moon.name} burcunda. ${moon.moonElection}`);
    lines.push(`${planet.name} ${lower(planet.nature)} tabiatıyla ${first(planet.gifts)} verir; ${first(planet.shadows)} ise onu yanlış kullanmaktır.`);
    lines.push(`Karar anı, duygu yoğunken değil; nefes döndükten sonradır.`);
    lines.push(`Bugün tek bir sınır koy. Sonra o sınırı koru.`);
  }

  if (citationMode === 'arada') {
    lines.push(`Mârifetnâme'de ${sign.element} üçlüsü, ${sign.elementNature} bir tabiatla anılır.`);
  } else if (citationMode === 'guclu') {
    lines.push(`Mârifetnâme'de ${sign.name}, ${sign.element} üçlüsüne bağlanır; tabiatı ${sign.elementNature} (s. 69).`);
    lines.push(`Ay'ın ${moon.name} burcundaki hükmü de ${lower(moon.moonElection)} (s. 127).`);
  }

  if (input.citationMode === 'yok') {
    lines.push(sign.islamic);
  } else {
    lines.push(`Hakiki müessir Allah'tır; yıldızlar ise birer sebep ve aynadır.`);
  }

  const closings: Record<string, string[]> = {
    duygusal: [
      'Bir şeyi zorlamak yerine, bugün bir şeyi bırak. Nefes al; gerisi gelir.',
      'Kendine biraz yer aç. Sevgi, ancak yer olduğunda girer.',
      'Bugün kendine, başkasına gösterdiğin şefkati göster.'
    ],
    agresif: [
      'Bugün mazeret yok. Niyetini yaz, ilk adımı at. Allah’a bırak; ama boş durma.',
      'Kalk, bir şeyi bitir. Küçük olsun; ama bitir.',
      'Söz bitti. Şimdi sıra eylemde.'
    ],
    sakin: [
      'Bir bardak su, üç derin nefes, tek bir doğru adım. Bu kadar.',
      'Bugün kendini kanıtlamak zorunda değilsin. Sadece hazır ol.',
      'Yavaşla. Doğru olan, acele edince kaybolur.'
    ],
    gizemli: [
      'Perdeyi kaldırma; önce ışığın nereden geldiğini gör.',
      'Cevabı değil, soruyu takip et.',
      'Bugün sana görünen şey, henüz tamamlanmadı. Bekle.'
    ],
    otoriter: [
      'Hükmü söyledim. Şimdi uygula.',
      'Kararını verdin. Bundan sonra geri dönüş yok.',
      'Sınırını koy. Sonra onu koruyacak kadar ciddi ol.'
    ]
  };
  const closing = closings[tone][selector % 3];
  return { hook, lines, closing };
}

export function generateDemoContent(
  input: GenerateInput,
  astro: AstroContext,
  chunks: RetrievedChunk[]
): GeneratedContent {
  const { sign, tone, character, citationMode } = input;
  const { hook, lines, closing } = buildScript(input, astro);
  const planet = PLANETS[sign.planet];
  const pronoun = character === 'kadın' ? 'She' : 'He';
  const voice = TONE_VOICE[tone];
  const setting = SETTING[sign.element];
  const palette = PALETTE[sign.element];
  const camera = CAMERA[tone];
  const light = LIGHT[tone];
  const actionLine = action(tone, character);

  const higgsfieldPrompt = [
    `Vertical 9:16, ${input.duration}-second single continuous shot, direct-to-camera.`,
    `Subject: ${characterSheet(input)}.`,
    `Action: ${actionLine} ${pronoun} speaks Turkish with a ${TONE_EN[tone]} cadence, lips synced to the line: "${hook}"`,
    `Setting: ${setting}. The room feels lived-in, not theatrical; dust motes in the air, a thin curl of candle smoke.`,
    `Camera: ${camera}. Eye-level, no cuts, slow and intentional movement.`,
    `Lighting: ${light}. Natural skin texture, no beauty filter.`,
    `Style: cinematic realism, muted ${palette} palette, subtle 35mm film grain, shallow depth of field, no fantasy elements.`,
    `Audio: quiet room tone, a very low ney drone, close-mic Turkish voice, no music drop.`,
    `Dialogue (Turkish, lip-synced): "${hook}"`,
    `Keep the same face, hair, wardrobe and jewelry throughout. Hand gestures must be natural and anatomically correct.`
  ].join(' ');

  const bRollPrompt = `Vertical 9:16, 4-second symbolic insert, no people, no text. Macro shot of a brass astrolabe rotating slowly above aged zodiac parchment, a single candle flame reflected in the metal, dust motes drifting through a shaft of ${sign.element === 'su' ? 'moonlight' : 'warm light'}, muted ${palette} palette, shallow depth of field, cinematic realism, subtle film grain.`;

  const sourceNotes = citationMode === 'yok'
    ? []
    : chunks.slice(0, 4).map((r) => `${r.chunk.title} (s. ${r.chunk.page})`);

  const onScreenText = [
    `${sign.name} · ${sign.keyword}`,
    astro.scopeLabel.toLocaleUpperCase('tr-TR'),
    'Niyet · Sabır · Adım'
  ];

  const caption = `${sign.name} ${SCOPE_WORD[input.scope]}: ${lower(sign.keyword)}. ${sign.islamic} Bu bir kehanet değil; kendini tanımak için bir ayna.`;
  const hashtags = ['#marifetname', '#burç', '#islami', '#tefekkür', '#kişiselgelişim', `#${sign.id}`];

  return {
    hook,
    script: [hook, ...lines],
    closing,
    higgsfieldPrompt,
    bRollPrompt,
    negativePrompt:
      'No on-screen text, no captions, no logo, no watermark, no extra fingers, no deformed hands, no face morphing, no plastic skin, no jump cuts, no fast zoom, no neon, no fantasy armor, no crown, no celebrity likeness, no multiple people, no lip-sync drift.',
    voiceDirection: `${character === 'kadın' ? 'Kadın' : 'Erkek'} ses, 30’lu yaşlar. ${voice}`,
    onScreenText,
    caption,
    hashtags,
    sourceNotes,
    thumbnailText: `${sign.name}: ${sign.keyword}`
  };
}
