# Bilgi tabanı kaynak haritası

Bu proje, Mârifetnâme’nin Türkçe sadeleştirilmiş PDF’inden (370 sayfa) seçilen bölümleri kısa bilgi kartlarına dönüştürür. Kartlar birebir metin kopyası değil; özet + sınırlı alıntı + sayfa referansıdır.

## Kaynak bölümler

| Bölüm | Sayfa aralığı | Kullanım |
|---|---|---|
| Burçlar feleği, on iki burç, isimler | 67-69 | Burç tanımı, sıralama, yıldız şekilleri |
| Unsurlar, modalite, erkek/dişi burçlar | 69 | Ateş/toprak/hava/su üçlüleri; öncü/sabit/değişken |
| On iki burç, on iki ay, mevsimler | 77 | Burç-ay-mevsim eşlemesi |
| Yedi gezegenin tabiatı | 88-120 | Zühal, Müşteri, Merih, Şems, Zühre, Utarit, Kamer |
| Ay’ın burçlara göre iş takvimi | 122-127 | Ay burcu, Ay evreleri, günlük/haftalık bağlam |
| Gezegen günleri ve saatleri | 128-129 | Günün hâkimi, zamanî saatler |
| Mevsimlerin mizacı | 144 | Bahar/yaz/sonbahar/kış keyfiyetleri |
| Beldelerin burç/gezegen nispeti | 185-186 | Coğrafya-mizaç renkleri |
| Dört unsur, dört karışım, mizaç | 224-226 | Kan/balgam/safra/sevda; yaş mizaçları |
| Mevsimlere göre beden ve ruh | 231-233 | Mevsimsel sağlık ve ritim |
| Aşkın bedende teşhisi | 234 | Duygusal ton için sahne kaynağı |

## Kartlar

### Burç

| Sayfa | Kart | ID |
|---|---|---|
| 67 | Burçlar feleği ve on iki dilim | `burc-felek` |
| 68 | Burçların yıldızları ve şekilleri | `burc-yildiz` |
| 68 | On iki burcun adları | `burc-isimleri` |
| 69 | Ateş üçlüsü: Koç, Aslan, Yay | `unsur-ates` |
| 69 | Erkek ve dişi burçlar | `burc-cinsiyet` |
| 69 | Hava üçlüsü: İkizler, Terazi, Kova | `unsur-hava` |
| 69 | Su üçlüsü: Yengeç, Akrep, Balık | `unsur-su` |
| 69 | Toprak üçlüsü: Boğa, Başak, Oğlak | `unsur-toprak` |
| 69 | Öncü, sabit ve değişken burçlar | `burc-modality` |

### Gezegen

| Sayfa | Kart | ID |
|---|---|---|
| 67 | Yedi gezegenin sırası | `gezegen-siralama` |
| 88 | Zühal: soğuk, kuru, ağır | `gezegen-zuhal` |
| 92 | Müşteri: sıcak, nemli, cömert | `gezegen-musteri` |
| 98 | Merih: sıcak, kuru, keskin | `gezegen-merih` |
| 102 | Şems: sıcak, kuru, aydınlık | `gezegen-sems` |
| 108 | Zühre: soğuk, nemli, güzel | `gezegen-zuhre` |
| 112 | Utarit: soğuk, kuru, zeki | `gezegen-utarit` |
| 120 | Kamer: soğuk, nemli, yakın | `gezegen-kamer` |

### Ay

| Sayfa | Kart | ID |
|---|---|---|
| 69 | Ay’ın yirmi sekiz menzili | `ay-menazil` |
| 122 | Ay’ın ilk yarısı: büyüme ve hareket | `ay-hilal` |
| 122 | Dolunay sonrası: azalma ve dinlenme | `ay-dolunay` |
| 127 | Ay Akrep’te: içe dönüş | `ay-burc-akrep` |
| 127 | Ay Aslan’da: görünür olmak | `ay-burc-aslan` |
| 127 | Ay Balık’ta: teslimiyet ve ortaklık | `ay-burc-balik` |
| 127 | Ay Başak’ta: düzen ve hizmet | `ay-burc-basak` |
| 127 | Ay Boğa’da: sağlamlaştırma | `ay-burc-boga` |
| 127 | Ay Kova’da: yeni bir yapı | `ay-burc-kova` |
| 127 | Ay Koç’ta: ilk adım | `ay-burc-koc` |
| 127 | Ay Oğlak’ta: emek ve sabır | `ay-burc-oglak` |
| 127 | Ay Terazi’de: denge ve alışveriş | `ay-burc-terazi` |
| 127 | Ay Yay’da: bakım ve genişleme | `ay-burc-yay` |
| 127 | Ay Yengeç’te: haber ve yuva | `ay-burc-yengec` |
| 127 | Ay İkizler’de: kelime ve öğrenme | `ay-burc-ikizler` |

### Mizaç

| Sayfa | Kart | ID |
|---|---|---|
| 224 | Mizaç nedir? | `mizac-tanim` |
| 226 | Balgam mizacı: soğuk ve nemli | `mizac-balgam` |
| 226 | Kan mizacı: sıcak ve nemli | `mizac-kan` |
| 226 | Safra mizacı: sıcak ve kuru | `mizac-safra` |
| 226 | Sevda mizacı: soğuk ve kuru | `mizac-sevda` |

### Mevsim

| Sayfa | Kart | ID |
|---|---|---|
| 77 | On iki burç, on iki ay ve dört mevsim | `burc-mevsim` |
| 144 | Mevsimlerin mizaçları | `mevsim-tabiat` |
| 148 | Rüzgârların mizacı | `ruzgar` |
| 232 | Mevsimlere göre beden ve ruh | `mevsim-saglik` |

### Zaman

| Sayfa | Kart | ID |
|---|---|---|
| 129 | Gezegen saatleri ve günlerin hâkimi | `gezegen-saatleri` |
| 150 | Gün ve saat ölçüsü | `gun-saat` |
| 152 | Hicri aylar ve mübarek geceler | `hicri-aylar` |
| 187 | Türk yılı ve on iki hayvan | `turk-yili` |

### İnsan

| Sayfa | Kart | ID |
|---|---|---|
| 225 | İnsanın yaşları ve mizaçları | `insan-yas` |
| 234 | Aşkın bedende teşhisi | `ask-teshis` |

### İklim

| Sayfa | Kart | ID |
|---|---|---|
| 186 | Beldelerin burç ve gezegen nispeti | `iklim-burc` |

### İslami çerçeve

| Sayfa | Kart | ID |
|---|---|---|
| 185 | Yıldızlar sebep, müessir Allah | `yildiz-tesir` |

## Yöntem

1. PDF, `pypdf` ile sayfa sayfa metne çevrildi (`scripts/extract_pdf.py`).
2. Burç, gezegen, Ay, mizaç ve mevsim başlıkları taranarak ilgili sayfa aralıkları belirlendi.
3. Her kart için metin yeniden ifade edildi; yalnızca kritik yerlerde kısa alıntı korundu.
4. Kartlara konu, sayfa ve RAG etiketleri eklendi.
5. `KNOWLEDGE_VERSION` artırılarak semantik indeks önbelleği geçersiz kılınır.

## Genişletme

- Yeni kart: `src/data/knowledge.ts` içine `id`, `title`, `topic`, `page`, `tags`, `text` alanlarıyla ekle.
- Yeni burç/gezegen: `src/data/signs.ts` veya `src/data/planets.ts` güncelle.
- Yeni zaman/ton: `src/types.ts` ve `src/components/ControlPanel.tsx` içindeki seçenekleri genişlet.
- Embedding önbelleği: `KNOWLEDGE_VERSION` değerini artır; tarayıcı yeni indeksi kurar.

## Telif

Özgün eser kamu malıdır. Kullanılan Türkçe sadeleştirme metninden yalnızca kısa özet ve alıntılar alınmıştır; PDF depoda yer almaz. Ayrıntı: [`NOTICE.md`](../NOTICE.md).
