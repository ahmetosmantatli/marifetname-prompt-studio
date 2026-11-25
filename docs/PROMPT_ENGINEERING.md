# Prompt motoru tasarımı

## Amaç

Aynı burç için üretilen içeriklerin birbirine benzemesini engellemek; karakterin sesini, seçilen zaman aralığını ve İslami hassasiyeti tek bir tutarlı çerçevede birleştirmek.

## Katmanlar

### 1. Sistem promptu

`src/lib/prompt.ts` içindeki `SYSTEM_PROMPT` şunları tanımlar:

- Karakter Türkçe konuşur, birinci tekil şahıs kullanır, izleyiciye “sen” diye hitap eder.
- 8-12 kısa replik; ilk 3 saniyede hook.
- Burcun gölgesi ve arzusu somut bir insan sahnesiyle anlatılır.
- Ay burcu, gezegen günü ve mevsim metne doğal biçimde dokunur.
- İslami çerçeve: tevekkül, niyet, sabır, şükür, kalbi temiz tutma; her replikte değil, 1-2 yerde.
- Kuran ayeti/hadis uydurma; dinî hüküm verme; kesin kehanet kurma.
- Agresif ton sert olabilir; hakaret/tehdit/şiddet olamaz.
- Higgsfield promptu İngilizce, 120-180 kelime, tek plan, 9:16.

### 2. Kullanıcı promptu

Şu bloklardan oluşur:

1. **Üretim girdileri**: burç, zaman, karakter, ton, atıf modu, platform, süre, ek açı.
2. **Gök takvimi bağlamı**: tarih, hicri tarih, Güneş/Ay burcu, Ay evresi, gezegen günü/saati, mevsim, Ay’ın o burçtaki iş takvimi.
3. **Burç dosyası**: unsur, modalite, yönetici gezegen, hediye, gölge, arzu, yara, ses, jest, İslami çerçeve.
4. **RAG pasajları**: sayfa numaralı 6 kart.
5. **Görev**: senaryo + Higgsfield promptu + JSON.

## Atıf modları

| Mod | Davranış |
|---|---|
| `yok` | Mârifetnâme adı anılmaz; pasajlar yalnızca üslup ve içerik zemini. |
| `arada` | En fazla 1 doğal atıf; sayfa numarası opsiyonel. |
| `guclu` | 2-3 atıf; her atıfta kaynak pasajındaki sayfa numarası. |

Model, kaynakta olmayan bir cümleyi “Mârifetnâme’de yazıyor” diye sunmamalıdır. `sourceNotes` yalnızca atıf modu açıkken doldurulur.

## Ton matrisi

| Ton | Ses | Jest | Işık | Kamera |
|---|---|---|---|---|
| Duygusal | yakın, kırılgan, nefesli | el kalpte, sonra bırakma | sıcak mum, yumuşak falloff | slow dolly-in, 50mm |
| Agresif | keskin, kontrollü öfke | öne eğilme, tek parmak vurgusu | sert yan ışık, derin gölge | handheld push-in, 35mm |
| Sakin | alçak tempo, eşit nefes | omuzlar rahat, avuç açık | yumuşak pencere ışığı | statik medium close-up |
| Gizemli | fısıltıya yakın, aralıklı | hareketsiz, baş hafif eğik | düşük key, tek mum | yavaş lateral dolly |
| Otoriter | tok, ölçülü, kararlı | eller masada, dik duruş | üst ışık + altın rim | low-angle push-in |

## Higgsfield prompt yapısı

```
Vertical 9:16, N-second single continuous shot, direct-to-camera.
Subject: yaş, cinsiyet, saç, ten, göz, kıyafet, takı.
Action: jest, bakış, duruş, konuşma temposu.
Setting: Osmanlı-İslam astronomi çalışma odası; haritalar, usturlap, çini, kemerli pencere.
Camera: adlandırılmış hareket + lens + alan derinliği.
Lighting: yön, sertlik, renk sıcaklığı.
Style: cinematic realism, palette, film grain.
Audio: oda tonu, ney drone, yakın mikrofon.
Dialogue (Turkish, lip-synced): hook.
```

Negatif prompt: ekran yazısı, logo, filigran, fazla parmak, yüz bozulması, plastik cilt, hızlı kesme, neon, fantezi zırh, ünlü benzerliği, çoklu kişi, lip-sync kayması.

## JSON çıktısı

```json
{
  "hook": "ilk 3 saniye",
  "script": ["replik 1", "replik 2"],
  "closing": "kapanış",
  "higgsfieldPrompt": "İngilizce ana plan",
  "bRollPrompt": "İngilizce ara plan",
  "negativePrompt": "İngilizce negatif",
  "voiceDirection": "Türkçe ses notu",
  "onScreenText": ["..."],
  "caption": "Türkçe caption",
  "hashtags": ["#..."],
  "sourceNotes": ["s. 69 ..."],
  "thumbnailText": "kapak"
}
```

`src/lib/prompt.ts` içindeki `parseModelJson` kod bloğu, fence, Türkçe anahtar ve eksik alan toleransı sağlar. `normalizeContent` boş alanları güvenli varsayılanlarla doldurur.

## Süre ve sahne modu

### Süre profili

`src/lib/duration.ts` süreye göre replik ve kelime hedefi tutar:

- 8 sn: 3-4 replik, ~24 kelime
- 12 sn: 4-6 replik, ~36 kelime (kısa video; tam metin ayrı voiceover)
- 18 sn: 5-7 replik, ~55 kelime
- 24 sn: 7-9 replik, ~80 kelime
- 30 sn: 8-10 replik, ~85 kelime
- 40 sn: 10-12 replik, ~110 kelime
- 50 sn: 12-14 replik, ~135 kelime
- 60 sn: 14-16 replik, ~160 kelime

12 sn ve altında `script` tam voiceover metni olarak uzun kalabilir; `higgsfieldPrompt` içindeki `Dialogue` kısa hook’tur. 18 sn ve üstünde script süreye göre kısaltılır ve `Dialogue` tam metni taşır. 30 sn üstünde `scenePlan` 2-3 parçaya bölünür.

### Sahne modu

- `app`: uygulama karakteri, kıyafeti ve ortamı tarif eder.
- `existing`: kullanıcı Higgsfield’da kendi karakterini/ortamını kullanır. Prompt yaş, saç, kıyafet, mekân tarif etmez; yalnızca mevcut referans, aksiyon, jest, kamera, ışık, ses ve diyalog verir.

### Higgsfield gerçekleri

- Cinema Studio 4.0 / Kling 4.0: tek klip **30 sn**.
- 40-60 sn: 2 sahne/uzatma; tek üretimde konuşma 30 sn ile sınırlı olabilir.
- Explainer gibi araçlar 1-10 dk üretebilir; bu, konuşan karakter formatından farklıdır.

## Zaman bağlamı koruması

Modeller ilk testlerde seçilen burç ile Ay burcunu karıştırdı (ör. Yay karakteri için “Ay Yay'da” yazdı). Bunu önlemek için:

- Kullanıcı promptunda “SEÇİLEN BURÇ” ve “AY BURCU” ayrı etiketlenir.
- “Ay X'te deme; doğru ifade Ay Y'de” kuralı açıkça yazılır.
- Günün gezegeni ve gezegen saati aynen verilir; başka gezegen uydurma yasağı eklenir.
- Görev sonunda “yazmadan önce kontrol et” listesi bulunur.

## Çıktı tamamlama ve doğrulama

1. `maxOutputTokens` varsayılan 4096; modelin izin verdiği üst sınıra göre kırpılır.
2. Gemini 3.5 Flash'ta `thinkingBudget: 0` kullanılır; düşünme tokenları çıktıyı yemesin.
3. JSON ayrıştırma başarısız olursa düşük sıcaklıkla bir “sadece JSON” denemesi yapılır.
4. `validateContent`; hook, 8+ replik, kapanış, 120+ kelime Higgsfield promptu, caption ve ekran yazılarını kontrol eder.
5. Eksik varsa bir “tam çıktı” turu daha çalışır; yine eksikse sonuç yine gösterilir ve kullanıcı uyarılır.
6. `enforceHiggsfieldPrompt`; 9:16, süre, doğrudan kamera ve diyalog satırı eksikse tamamlar.

## Model önerileri

- **Groq / `openai/gpt-oss-20b`**: hızlı, dengeli, varsayılan.
- **Groq / `openai/gpt-oss-120b`**: daha kaliteli, daha yavaş.
- **Groq / `qwen/qwen3.8-27b`**: en hızlı; OTPM 1.000 nedeniyle max çıktı 1.000.
- **Groq / `openai/gpt-oss-120b`**: daha yaratıcı, daha yavaş.
- **Gemini / `gemini-3.5-flash`**: en iyi Türkçe kalitesi; `thinkingBudget: 0` ile ~8 sn. Semantik RAG için aynı anahtar kullanılabilir.
- **Gemini / `gemini-3.1-flash-lite`**: hızlı yedek; yoğun saatlerde 503 dönebilir.
- **Sıcaklık**: 0.8-0.9. Daha düşük değerler tekrara, daha yüksek değerler format bozulmasına yol açabilir.

## İçerik güvenliği

- Ölüm, hastalık, kaza, boşanma, hamilelik, zenginlik garantisi yasak.
- “Kesin”, “mutlaka”, “garanti” yerine “eğilim”, “davet”, “fırsat”, “imtihan”.
- Dinî hüküm/fetva yok; ayet/hadis uydurma yok.
- Nefret, hedef gösterme, tehdit, şiddet çağrısı yok.
- Kullanıcıya suçluluk yükleyen “kurban edebiyatı” yerine somut, uygulanabilir tek adım.

## Genişletme fikirleri

- Zaman dilimini kullanıcının konumuna göre hesaplama (şu an İstanbul sabit).
- Gerçek efemeris (Swiss Ephemeris) ile Ay burcunu netleştirme.
- Çoklu sahne / diyalog dizisi üretimi.
- Higgsfield karakter referansı (`soul-id`) alanı.
- Marka sesi profili ve yasaklı kelime listesi.
- Aylık içerik takvimi üretimi (12 burç × 30 gün).
