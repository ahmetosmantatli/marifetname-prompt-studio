import type { PlanetKey, PlanetProfile } from '../types';

export const PLANETS: Record<PlanetKey, PlanetProfile> = {
  merih: {
    key: 'merih', name: 'Merih', glyph: '♂\uFE0E',
    nature: 'Aşırı sıcak ve kuru', humor: 'Safravi',
    day: 'Salı', hour: 'Salı günü ve cumartesi gecesi',
    gifts: ['şecaat', 'kuvvet', 'şenlik', 'keskinlik', 'başlatma'],
    shadows: ['hiddet', 'inat', 'baş olma hırsı', 'edepsizlik'],
    color: 'kızıl', metal: 'demir',
    voice: 'Keskin, kısa, mızrak gibi. Cümlenin arkasında bir tehdit değil, bir kararlılık vardır.'
  },
  zuhre: {
    key: 'zuhre', name: 'Zühre', glyph: '♀\uFE0E',
    nature: 'Orta derecede soğuk ve rutubetli', humor: 'Balgami',
    day: 'Cuma', hour: 'Cuma günü ve salı gecesi',
    gifts: ['yumuşaklık', 'sevgi', 'rikkat', 'ferah', 'oyun', 'teganni', 'güzellik'],
    shadows: ['şehvet', 'gösteriş', 'dağılma', 'onay bağımlılığı'],
    color: 'bakır yeşili', metal: 'bakır',
    voice: 'Yumuşak, tatlı, davet eden. Sesi bir dokunuş gibi yaklaşır, sonra geri çekilir.'
  },
  utarit: {
    key: 'utarit', name: 'Utarit', glyph: '☿\uFE0E',
    nature: 'Soğuk ve kuru', humor: 'Sevdavi',
    day: 'Çarşamba', hour: 'Çarşamba günü ve perşembe gecesi',
    gifts: ['edep', 'zeyreklik', 'feraset', 'nutuk', 'belagat', 'kitabet', 'hesap'],
    shadows: ['kurnazlık', 'kararsızlık', 'dağınık zihin', 'kelime oyunu'],
    color: 'mavi', metal: 'cıva',
    voice: 'Hızlı, net, zekice. Cümleyi tamamlar, sonra bir soruyla açar.'
  },
  kamer: {
    key: 'kamer', name: 'Kamer', glyph: '☽\uFE0E',
    nature: 'İtidal üzere soğuk ve rutubetli', humor: 'Balgami',
    day: 'Pazartesi', hour: 'Pazartesi günü ve cuma gecesi',
    gifts: ['hıfz', 'haber', 'hareket', 'ses', 'sezgi', 'besleme'],
    shadows: ['zaaf', 'acele', 'nemime', 'cehl', 'kararsızlık'],
    color: 'gümüş', metal: 'gümüş',
    voice: 'Dalgalı, alçak, yakın. Sanki aynı odada değil de kalbinin içinde konuşur.'
  },
  sems: {
    key: 'sems', name: 'Şems', glyph: '☉\uFE0E',
    nature: 'Orta derecede sıcak ve kuru', humor: 'Safravi',
    day: 'Pazar', hour: 'Pazar günü ve perşembe gecesi',
    gifts: ['kuvvet', 'şiddet', 'hüküm', 'haya', 'iffet', 'açıklık'],
    shadows: ['kibir', 'kahır', 'gazap', 'görünme ihtiyacı'],
    color: 'altın', metal: 'altın',
    voice: 'Tok, aydınlık, otoriter. Cümleleri bir hüküm gibi değil, bir davet gibi söyler.'
  },
  musteri: {
    key: 'musteri', name: 'Müşteri', glyph: '♃\uFE0E',
    nature: 'İtidal üzere sıcak ve rutubetli', humor: 'Demevi',
    day: 'Perşembe', hour: 'Perşembe günü ve pazartesi gecesi',
    gifts: ['din gayreti', 'ilim', 'hilim', 'cömertlik', 'tevazu', 'akıl', 'iffet', 'fasihlik'],
    shadows: ['kendini beğenme', 'aşırı iyimserlik', 'vaaz verme'],
    color: 'mor', metal: 'kalay',
    voice: 'Geniş, sıcak, öğretmen gibi. Cümlenin sonunda bir kapı açar, kapatmaz.'
  },
  zuhal: {
    key: 'zuhal', name: 'Zühal', glyph: '♄\uFE0E',
    nature: 'Son derece soğuk ve kuru', humor: 'Sevdavi',
    day: 'Cumartesi', hour: 'Cumartesi günü ve çarşamba gecesi',
    gifts: ['hıfz', 'sabır', 'derinlik', 'zaman', 'dayanıklılık'],
    shadows: ['keder', 'cimrilik', 'kıskançlık', 'tembellik', 'gam'],
    color: 'kurşun', metal: 'kurşun',
    voice: 'Ağır, alçak, zamana yayılan. Sözünü bitirmeden önce bir sessizlik bırakır.'
  }
};

export const getPlanet = (key: PlanetKey): PlanetProfile => PLANETS[key];
