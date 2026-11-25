import type { KnowledgeChunk } from '../types';

/**
 * Mârifetnâme'nin burç, gezegen, ay, mizaç ve mevsim bölümlerinden
 * derlenmiş kısa, yeniden ifade edilmiş bilgi kartları.
 * Sayfa numaraları Erzurumlu İbrahim Hakkı, Mârifetnâme (Türkçe sadeleştirme)
 * PDF'ine aittir. Uzun alıntılar yerine özet + kısa referans cümlesi tercih edildi.
 */
export const KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: 'burc-felek', title: 'Burçlar feleği ve on iki dilim', topic: 'burç', page: 67,
    tags: ['burç', 'felek', 'astronomi', 'on iki'],
    text: 'Mârifetnâme’ye göre sekizinci felek, sabit yıldızlar feleğidir; üzerinde on iki burç bulunur. Burçlar, bu göğün on iki dilimi gibi tasavvur edilir. Her dilim otuz derecedir; burçlar kuşağı böylece üç yüz altmış dereceye ayrılır. Burç, yıldızların gelişigüzel bir süsü değil, göğün ölçülü bir taksimidir.'
  },
  {
    id: 'burc-isimleri', title: 'On iki burcun adları', topic: 'burç', page: 68,
    tags: ['burç', 'koç', 'boğa', 'ikizler', 'yengeç', 'aslan', 'başak', 'terazi', 'akrep', 'yay', 'oğlak', 'kova', 'balık'],
    text: 'Mârifetnâme on iki burcu şöyle sıralar: Koç, Boğa, İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık. Koç yılın başı sayılır; çünkü güneş ilkbahar eşitliğinde Koç’a girer. Bu sıralama, aynı zamanda güneşin yıl içindeki seyrinin sırasıdır.'
  },
  {
    id: 'unsur-ates', title: 'Ateş üçlüsü: Koç, Aslan, Yay', topic: 'burç', page: 69,
    tags: ['ateş', 'koç', 'aslan', 'yay', 'sıcak', 'kuru', 'erkek'],
    text: 'Mârifetnâme, Koç, Aslan ve Yay burçlarını ateş üçlüsü sayar. Bu üçlünün tabiatı sıcaklık ve kuruluktur. Ateş burçları gündüzsel ve erkek tabiatlı kabul edilir. Ateşin dili cesaret, başlatma, görünürlük ve irade; gölgesi ise acele, hiddet ve kendini fazla merkeze koymaktır.'
  },
  {
    id: 'unsur-toprak', title: 'Toprak üçlüsü: Boğa, Başak, Oğlak', topic: 'burç', page: 69,
    tags: ['toprak', 'boğa', 'başak', 'oğlak', 'soğuk', 'kuru', 'dişi'],
    text: 'Mârifetnâme, Boğa, Başak ve Oğlak burçlarını toprak üçlüsü sayar. Tabiatları soğukluk ve kuruluktur. Toprak burçları gecesel ve dişi tabiatlı kabul edilir. Toprağın dili beden, emek, sabır, dayanıklılık ve somut güven; gölgesi ise katılık, inat ve değişim korkusudur.'
  },
  {
    id: 'unsur-hava', title: 'Hava üçlüsü: İkizler, Terazi, Kova', topic: 'burç', page: 69,
    tags: ['hava', 'ikizler', 'terazi', 'kova', 'sıcak', 'rutubetli', 'erkek'],
    text: 'Mârifetnâme, İkizler, Terazi ve Kova burçlarını hava üçlüsü sayar. Tabiatları sıcaklık ve rutubettir. Hava burçları gündüzsel ve erkek tabiatlıdır. Havanın dili zihin, kelime, bağlantı, fikir ve sosyallik; gölgesi ise dağılma, yüzeysellik ve kararsızlıktır.'
  },
  {
    id: 'unsur-su', title: 'Su üçlüsü: Yengeç, Akrep, Balık', topic: 'burç', page: 69,
    tags: ['su', 'yengeç', 'akrep', 'balık', 'soğuk', 'rutubetli', 'dişi'],
    text: 'Mârifetnâme, Yengeç, Akrep ve Balık burçlarını su üçlüsü sayar. Tabiatları rutubet ve soğukluktur. Su burçları gecesel ve dişi tabiatlıdır. Suyun dili duygu, hafıza, sezgi, şefkat ve derinlik; gölgesi ise alınganlık, kaçış, kontrol ve sınır kaybıdır.'
  },
  {
    id: 'burc-modality', title: 'Öncü, sabit ve değişken burçlar', topic: 'burç', page: 69,
    tags: ['burç', 'öncü', 'sabit', 'değişken', 'mevsim', 'koç', 'yengeç', 'terazi', 'oğlak', 'boğa', 'aslan', 'akrep', 'kova', 'ikizler', 'başak', 'yay', 'balık'],
    text: 'Mârifetnâme, burçları mevsim içindeki konumlarına göre üçe ayırır: Değiştirenler (öncü) Koç, Yengeç, Terazi, Oğlak; sabitler Boğa, Aslan, Akrep, Kova; karıştıranlar (değişken) İkizler, Başak, Yay, Balık. Öncü burçlar mevsimi açar; sabitler mevsimin ortasında direnir; değişkenler mevsimi kapatıp bir sonrakine bağlar.'
  },
  {
    id: 'burc-cinsiyet', title: 'Erkek ve dişi burçlar', topic: 'burç', page: 69,
    tags: ['burç', 'erkek', 'dişi', 'gündüz', 'gece', 'koç', 'ikizler', 'aslan', 'terazi', 'yay', 'kova', 'boğa', 'yengeç', 'başak', 'akrep', 'oğlak', 'balık'],
    text: 'Mârifetnâme’de altı burç erkek, altısı dişi kabul edilir. Koç, İkizler, Aslan, Terazi, Yay ve Kova erkek; Boğa, Yengeç, Başak, Akrep, Oğlak ve Balık dişidir. Ateş ve hava üçlüleri gündüzsel erkek, toprak ve su üçlüleri gecesel dişi sayılır. Bu tasnif, karakterin enerjisini değil, klasik metindeki yön ve zaman nispetini anlatır.'
  },
  {
    id: 'burc-mevsim', title: 'On iki burç, on iki ay ve dört mevsim', topic: 'mevsim', page: 77,
    tags: ['burç', 'mevsim', 'ilkbahar', 'yaz', 'sonbahar', 'kış', 'koç', 'boğa', 'ikizler', 'yengeç', 'aslan', 'başak', 'terazi', 'akrep', 'yay', 'oğlak', 'kova', 'balık'],
    text: 'Mârifetnâme’ye göre on iki burç, on iki aya karşılık gelir. Koç, Boğa, İkizler ilkbahar; Yengeç, Aslan, Başak yaz; Terazi, Akrep, Yay sonbahar; Oğlak, Kova, Balık kış burçlarıdır. Güneş her burçta yaklaşık bir ay kalır. Burç, takvimdeki bir etiket değil, mevsimin taşıdığı mizacın adıdır.'
  },
  {
    id: 'mevsim-tabiat', title: 'Mevsimlerin mizaçları', topic: 'mevsim', page: 144,
    tags: ['mevsim', 'ilkbahar', 'yaz', 'sonbahar', 'kış', 'mizaç', 'hava'],
    text: 'Mârifetnâme, bahar havasını mutedil, yaz havasını sıcak, sonbahar havasını ılıma yakın, kış havasını soğuk sayar. Güneş’in Koç, Boğa, İkizler’de bulunduğu süre ilkbahar; Yengeç, Aslan, Başak’ta yaz; Terazi, Akrep, Yay’da sonbahar; Oğlak, Kova, Balık’ta kıştır. Mevsim, bedenin ve ruhun ritmini değiştiren bir ölçüdür.'
  },
  {
    id: 'mevsim-saglik', title: 'Mevsimlere göre beden ve ruh', topic: 'mevsim', page: 232,
    tags: ['mevsim', 'sağlık', 'beden', 'ilkbahar', 'yaz', 'sonbahar', 'kış', 'mizaç'],
    text: 'Mârifetnâme’nin tıp bölümü, ilkbaharda kanın ve hareketin arttığını, yazın safranın ve susuzluğun yükseldiğini, sonbaharda sevdanın ve kuru hastalıkların çoğaldığını, kışın balgamın ve soğuk algınlığının arttığını söyler. Bu yüzden mevsim geçişlerinde uyku, gıda ve hareketin ölçülü tutulmasını öğütler. Bugünün içeriğinde bu, “bedenini zorlamadan ritmini değiştir” fikrine dönüşür.'
  },
  {
    id: 'ay-hilal', title: 'Ay’ın ilk yarısı: büyüme ve hareket', topic: 'ay', page: 122,
    tags: ['ay', 'hilal', 'büyüyen', 'beden', 'hareket', 'mizaç'],
    text: 'Mârifetnâme’ye göre Ay’ın ilk yarısında sıcaklık ve rutubet artar; bedende kan kabarır, canlılar kuvvet bulur, bitkiler büyür. Bu dönem başlamak, beslemek, büyütmek ve görünür kılmak için elverişlidir. Metin bunu bir sebep olarak anlatır; gerçek müessirin Allah olduğunu ayrıca vurgular.'
  },
  {
    id: 'ay-dolunay', title: 'Dolunay sonrası: azalma ve dinlenme', topic: 'ay', page: 122,
    tags: ['ay', 'dolunay', 'küçülen', 'beden', 'dinlenme', 'mizaç'],
    text: 'Ay’ın ikinci yarısında kuruluk ve soğukluk çoğalır; bedenin rutubeti azalır, güç düşer. Mârifetnâme bu dönemi hasat, sadeleştirme, dinlenme ve gereksiz olanı bırakma vakti olarak yorumlamaya açıktır. İçerikte bu, “toparla ve içine dön” daveti olarak kullanılır.'
  },
  {
    id: 'ay-menazil', title: 'Ay’ın yirmi sekiz menzili', topic: 'ay', page: 69,
    tags: ['ay', 'menzil', 'yıldız', 'takvim', 'zaman'],
    text: 'Mârifetnâme, Ay için yirmi sekiz konak sayar; ilki Şeratin, sonuncusu Reşa’dır. Ay her gece bir konağa yaklaşır ve yirmi sekiz günde burçları dolaşır. Bu menziller, ay takviminin ve tarım, sefer, ticaret gibi işlerin zamanlamasının klasik dilidir. Bugünün içeriğinde menzil bilgisi, “hangi iş hangi havada” sorusuna şiirsel bir arka plan verir.'
  },
  {
    id: 'ay-burc-koc', title: 'Ay Koç’ta: ilk adım', topic: 'ay', page: 127,
    tags: ['ay', 'koç', 'başlangıç', 'cesaret'],
    text: 'Mârifetnâme’nin Ay ihtiyarlarında Koç, “her işe başlamak” için uygun görülür. Bu vakit, niyeti eyleme çevirmek, ilk adımı atmak ve cesareti toplamak içindir. Metin “acele et” demez; bilinçli bir başlangıcı işaret eder.'
  },
  {
    id: 'ay-burc-boga', title: 'Ay Boğa’da: sağlamlaştırma', topic: 'ay', page: 127,
    tags: ['ay', 'boğa', 'nikâh', 'ticaret', 'bina'],
    text: 'Ay Boğa’dayken Mârifetnâme nikâh, ticaret, bina ve hayırlı işleri öne çıkarır. Bu vakit, kurulan şeyi sağlamlaştırmak, sözleşmeyi ciddiye almak ve emeği somut bir zemine oturtmak içindir.'
  },
  {
    id: 'ay-burc-ikizler', title: 'Ay İkizler’de: kelime ve öğrenme', topic: 'ay', page: 127,
    tags: ['ay', 'ikizler', 'ilim', 'elbise', 'iletişim'],
    text: 'Ay İkizler’deyken Mârifetnâme giyinmeyi, ilim okumayı, akar ve hayvan almayı anar. Bu vakit konuşmak, yazmak, öğrenmek ve bağlantı kurmak için canlıdır; dağılmamak şartıyla.'
  },
  {
    id: 'ay-burc-yengec', title: 'Ay Yengeç’te: haber ve yuva', topic: 'ay', page: 127,
    tags: ['ay', 'yengeç', 'haber', 'sefer', 'aile'],
    text: 'Ay Yengeç’teyken Mârifetnâme haber göndermeyi, seferi, nakli ve sindirim ilaçlarını anar. Bu vakit, evle, aileyle, hatırayla ve bedenin iç dengesiyle ilgilenmek için uygundur.'
  },
  {
    id: 'ay-burc-aslan', title: 'Ay Aslan’da: görünür olmak', topic: 'ay', page: 127,
    tags: ['ay', 'aslan', 'ihtiyaç', 'tamir', 'görünürlük'],
    text: 'Ay Aslan’dayken Mârifetnâme ihtiyaç arz etmeyi, ekin, tamir ve hacamatı anar. Bu vakit, görünür olmak, emeğini göstermek, onarım ve bakım yapmak için uygundur; gösterişe kaçmadan.'
  },
  {
    id: 'ay-burc-basak', title: 'Ay Başak’ta: düzen ve hizmet', topic: 'ay', page: 127,
    tags: ['ay', 'başak', 'düzen', 'hizmet', 'sohbet'],
    text: 'Ay Başak’tayken Mârifetnâme yeni düzeni, eşya yenilemeyi ve sakin sohbeti anar. Bu vakit, dağınıklığı toplamak, küçük bir iyileştirme yapmak ve hizmet etmek için uygundur.'
  },
  {
    id: 'ay-burc-terazi', title: 'Ay Terazi’de: denge ve alışveriş', topic: 'ay', page: 127,
    tags: ['ay', 'terazi', 'alışveriş', 'sohbet', 'müzik'],
    text: 'Ay Terazi’deyken Mârifetnâme alışverişi, sohbeti, güzel ses dinlemeyi ve ilaç almayı anar. Bu vakit, iki tarafı dinlemek, estetik bir düzen kurmak ve ilişkide dengeyi yeniden ayarlamak için uygundur.'
  },
  {
    id: 'ay-burc-akrep', title: 'Ay Akrep’te: içe dönüş', topic: 'ay', page: 127,
    tags: ['ay', 'akrep', 'inziva', 'temizlik', 'iffet'],
    text: 'Ay Akrep’teyken Mârifetnâme temizliği, iffetı, uzleti, inzivayı ve itikafı anar. Bu vakit, kalabalıktan çekilmek, içini temizlemek ve gizli olanı görmek için uygundur; intikam ve kontrol için değil.'
  },
  {
    id: 'ay-burc-yay', title: 'Ay Yay’da: bakım ve genişleme', topic: 'ay', page: 127,
    tags: ['ay', 'yay', 'bakım', 'giyinme', 'yıkanma'],
    text: 'Ay Yay’dayken Mârifetnâme giyinmeyi, yıkanmayı ve bakımı anar. Bu vakit, kendini toparlamak, ufku genişletmek, yol ve anlam üzerine konuşmak için uygundur; kaçışa değil, hazırlanmaya.'
  },
  {
    id: 'ay-burc-oglak', title: 'Ay Oğlak’ta: emek ve sabır', topic: 'ay', page: 127,
    tags: ['ay', 'oğlak', 'av', 'ziraat', 'sabır'],
    text: 'Ay Oğlak’tayken Mârifetnâme avlanmayı, kuyu kazmayı ve ziraatı anar. Bu vakit, uzun vadeli bir işe eğilmek, sabırla emek vermek ve sonucu acele etmemek için uygundur.'
  },
  {
    id: 'ay-burc-kova', title: 'Ay Kova’da: yeni bir yapı', topic: 'ay', page: 127,
    tags: ['ay', 'kova', 'bina', 'şehir', 'topluluk'],
    text: 'Ay Kova’dayken Mârifetnâme bina kurmayı ve şehre girmeyi anar. Bu vakit, yeni bir yapı, topluluk veya sistem kurmak; alışılmışın dışında bir çözüm denemek için uygundur.'
  },
  {
    id: 'ay-burc-balik', title: 'Ay Balık’ta: teslimiyet ve ortaklık', topic: 'ay', page: 127,
    tags: ['ay', 'balık', 'deniz', 'ortaklık', 'ticaret'],
    text: 'Ay Balık’tayken Mârifetnâme denizde seferi, anlaşmayı, ortaklığı ve ticareti anar. Bu vakit, sezgiyle hareket etmek, affetmek ve başkasıyla bağ kurmak için uygundur; sınırları kaybetmeden.'
  },
  {
    id: 'gezegen-zuhal', title: 'Zühal: soğuk, kuru, ağır', topic: 'gezegen', page: 88,
    tags: ['zühal', 'satürn', 'soğuk', 'kuru', 'sevdavi', 'oğlak', 'kova'],
    text: 'Mârifetnâme Zühal’in tabiatını son derece soğuk ve kuru sayar; onu “en büyük uğursuz” olarak anar. Vasıfları arasında keder, cimrilik, kıskançlık, tembellik ve gam sayılır. Ama aynı metin ona hıfz, sabır, zaman ve dayanıklılık da yükler. Zühal’in gölgesi ağırdır; olgunlaştığında ise insana zamana dayanmayı öğretir.'
  },
  {
    id: 'gezegen-musteri', title: 'Müşteri: sıcak, nemli, cömert', topic: 'gezegen', page: 92,
    tags: ['müşteri', 'jüpiter', 'sıcak', 'rutubetli', 'demevi', 'yay', 'balık'],
    text: 'Mârifetnâme Müşteri’yi itidal üzere sıcak ve rutubetli, gündüz erkeği ve “büyük uğurlu” sayar. Vasıfları din gayreti, ilim, hilim, haya, cömertlik, tevazu, akıl, iffet ve fasihliktir. Müşteri’nin gölgesi kendini beğenme ve aşırı iyimserliktir; olgunlaştığında insana anlam, adalet ve cömertlik verir.'
  },
  {
    id: 'gezegen-merih', title: 'Merih: sıcak, kuru, keskin', topic: 'gezegen', page: 98,
    tags: ['merih', 'mars', 'sıcak', 'kuru', 'safravi', 'koç', 'akrep'],
    text: 'Mârifetnâme Merih’in tabiatını aşırı sıcaklık ve kuruluk sayar; onu gece erkeği ve “küçük uğursuz” olarak anar. Vasıfları şenlik, şecaat, hiddet, kuvvet, inat ve baş olma hırsıdır. Merih’in gölgesi öfke ve edepsizliktir; olgunlaştığında insana cesaret, keskinlik ve gerektiğinde savaşma gücü verir.'
  },
  {
    id: 'gezegen-sems', title: 'Şems: sıcak, kuru, aydınlık', topic: 'gezegen', page: 102,
    tags: ['şems', 'güneş', 'sıcak', 'kuru', 'safravi', 'aslan'],
    text: 'Mârifetnâme Şems’in tabiatını orta derecede sıcak ve kuru, gündüz erkeği sayar. Vasıfları kuvvet, şiddet, kahr, gazap, rağbet, haya ve iffetttir. Güneş görünürlük, hüküm ve hayat verir; gölgesi kibir ve görünme ihtiyacıdır. Olgunlaştığında insana açıklık, onur ve sorumluluk verir.'
  },
  {
    id: 'gezegen-zuhre', title: 'Zühre: soğuk, nemli, güzel', topic: 'gezegen', page: 108,
    tags: ['zühre', 'venüs', 'soğuk', 'rutubetli', 'balgami', 'boğa', 'terazi'],
    text: 'Mârifetnâme Zühre’nin tabiatını orta derecede soğuk ve rutubetli sayar; ona “küçük kutlu” der. Vasıfları yumuşaklık, sevgi, rikkat, ferah, oyun, teganni, cinsel güç ve güzel yaratılıştır. Zühre’ye bakmanın kalbe sürur verdiği söylenir. Gölgesi gösteriş ve onay bağımlılığıdır; olgunlaştığında insana güzellik, şefkat ve haz verme sanatı verir.'
  },
  {
    id: 'gezegen-utarit', title: 'Utarit: soğuk, kuru, zeki', topic: 'gezegen', page: 112,
    tags: ['utarit', 'merkür', 'soğuk', 'kuru', 'sevdavi', 'ikizler', 'başak'],
    text: 'Mârifetnâme Utarit’in tabiatını soğukluk ve kuruluk sayar; onu gündüz erkeği ve “uyuşan” olarak anar. Vasıfları edep, zeyreklik, anlayışlılık, feraset, zihin, dirayet, nutuk, belagat, nakış, kitabet ve hesaptır. Gölgesi kurnazlık ve dağınık zihindir; olgunlaştığında insana zekâ, dil ve el becerisi verir.'
  },
  {
    id: 'gezegen-kamer', title: 'Kamer: soğuk, nemli, yakın', topic: 'gezegen', page: 120,
    tags: ['kamer', 'ay', 'soğuk', 'rutubetli', 'balgami', 'yengeç'],
    text: 'Mârifetnâme Kamer’in tabiatını itidal üzere soğuk ve rutubetli, gece dişisi sayar. Vasıfları zaaf, acz, hıfz, cehl, hakaret, acele, nemime, ihbar, deliller, hareket ve sestir. Ay, yakınlık ve besleme getirir; gölgesi kararsızlık ve dedikodudur. Olgunlaştığında insana sezgi, hafıza ve şefkat verir.'
  },
  {
    id: 'gezegen-saatleri', title: 'Gezegen saatleri ve günlerin hâkimi', topic: 'zaman', page: 129,
    tags: ['gezegen', 'saat', 'gün', 'pazar', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'zühal', 'müşteri', 'merih', 'şems', 'zühre', 'utarit', 'kamer'],
    text: 'Mârifetnâme, her günün bir gezegene hâkim olduğunu ve günün saatlerinin sırayla yedi gezegen arasında döndüğünü anlatır: Zühal, Müşteri, Merih, Şems, Zühre, Utarit, Kamer. Pazar Şems’e, Pazartesi Kamer’e, Salı Merih’e, Çarşamba Utarit’e, Perşembe Müşteri’ye, Cuma Zühre’ye, Cumartesi Zühal’e nispet edilir. Bu saatler, klasik metinde iş seçimi için bir ölçüdür; bugünün içeriğinde “günün havası” olarak kullanılır.'
  },
  {
    id: 'mizac-tanim', title: 'Mizaç nedir?', topic: 'mizaç', page: 224,
    tags: ['mizaç', 'unsur', 'ateş', 'hava', 'su', 'toprak', 'sıcak', 'soğuk', 'kuru', 'rutubetli'],
    text: 'Mârifetnâme’ye göre insan bedeni dört unsurdan bileşir: ateş, hava, su, toprak. Bunların dört keyfiyeti sıcaklık, soğukluk, rutubet ve kuruluktur. Bu zıt keyfiyetlerin dengelenmesiyle “mizaç” doğar. Mizaç, bir insanın beden ve ruh yapısının eğilimidir; kaderi değil, üslubudur.'
  },
  {
    id: 'mizac-kan', title: 'Kan mizacı: sıcak ve nemli', topic: 'mizaç', page: 226,
    tags: ['mizaç', 'kan', 'demevi', 'hava', 'sıcak', 'rutubetli', 'ikizler', 'terazi', 'kova'],
    text: 'Mârifetnâme’de tabiî kan sıcak ve rutubetlidir; rengi kırmızı, tadı tatlıdır. Kan mizacı (demevi) neşe, sosyallik, konuşma, bağlantı ve hareket getirir. Gölgesi dağılma, yüzeysellik ve sürekli uyarılma ihtiyacıdır. Hava burçlarının klasik mizacı bu yöne yakındır.'
  },
  {
    id: 'mizac-balgam', title: 'Balgam mizacı: soğuk ve nemli', topic: 'mizaç', page: 226,
    tags: ['mizaç', 'balgam', 'balgami', 'su', 'soğuk', 'rutubetli', 'yengeç', 'akrep', 'balık'],
    text: 'Mârifetnâme’de tabiî balgam soğukça, rengi yumurta akı gibidir; faydası kanın yerini tutup uzuvları beslemesidir. Balgam mizacı sakinlik, yumuşaklık, sabır ve besleme getirir. Gölgesi ağırlık, isteksizlik ve kendini geri çekmedir. Su burçlarının klasik mizacı bu yöne yakındır.'
  },
  {
    id: 'mizac-safra', title: 'Safra mizacı: sıcak ve kuru', topic: 'mizaç', page: 226,
    tags: ['mizaç', 'safra', 'safravi', 'ateş', 'sıcak', 'kuru', 'koç', 'aslan', 'yay'],
    text: 'Mârifetnâme’de tabiî safra sıcak, kırmızıya yakın ve yapışkandır; kana karışıp bedenin cüzlerine yardım eder. Safra mizacı cesaret, hız, kararlılık ve görünürlük getirir. Gölgesi hiddet, acele ve yakıcılıktır. Ateş burçlarının klasik mizacı bu yöne yakındır.'
  },
  {
    id: 'mizac-sevda', title: 'Sevda mizacı: soğuk ve kuru', topic: 'mizaç', page: 226,
    tags: ['mizaç', 'sevda', 'sevdavi', 'toprak', 'soğuk', 'kuru', 'boğa', 'başak', 'oğlak'],
    text: 'Mârifetnâme’de siyah köpük (sevda), tabiî kanın altında kalan tortudur; yeri dalaktır, faydası açlığı ve şehveti tahrik etmektir. Sevda mizacı derinlik, dayanıklılık, ciddiyet ve hafıza getirir. Gölgesi keder, katılık, kıskançlık ve karamsarlıktır. Toprak burçlarının klasik mizacı bu yöne yakındır.'
  },
  {
    id: 'insan-yas', title: 'İnsanın yaşları ve mizaçları', topic: 'insan', page: 225,
    tags: ['insan', 'yaş', 'mizaç', 'gençlik', 'ihtiyarlık', 'beden'],
    text: 'Mârifetnâme insan ömrünü dört yaşa ayırır: büyüme çağı (otuz yaşa kadar), duraklama/gençlik (altmışa kadar), iniş ve ihtiyarlık. Çocuk mizacı mutedil, delikanlılık sıcak ve rutubetli, gençlik sıcak ve hiddetli, ihtiyarlık soğuk ve kurudur. Kadınların mizacı erkeklerden daha soğuk ve rutubetli bulunmuştur. Bu tasnif, karakter içeriğinde “hangi yaşın diliyle konuşuyorsun” sorusuna zemin olur.'
  },
  {
    id: 'ask-teshis', title: 'Aşkın bedende teşhisi', topic: 'insan', page: 234,
    tags: ['aşk', 'duygu', 'beden', 'gençlik', 'arzu', 'kalp'],
    text: 'Mârifetnâme, mecazi aşkı bir hastalık gibi tarif eder: renk sararması, beden zayıflığı, uykusuzluk, dalgın bakış ve nabzın sevgilinin adı anıldığında değişmesi. Tabip, hastanın nabzını dinleyerek sevdiğinin adını bulur. Metin aşkın ilacının kavuşma değil, kalbi doğru yöne çevirmek olduğunu ima eder. Duygusal tonlu içerik için güçlü bir sahne kaynağıdır.'
  },
  {
    id: 'yildiz-tesir', title: 'Yıldızlar sebep, müessir Allah', topic: 'çerçeve', page: 185,
    tags: ['yıldız', 'tesir', 'Allah', 'sebep', 'tevekkül', 'çerçeve'],
    text: 'Mârifetnâme’nin en önemli çerçevesi şudur: Felekler, yıldızlar ve unsurlar Hak’kın emriyle tesir eder; fakat hakiki müessir Allah’tır. Yıldızlar ve felekler birer alet ve sebeptir. Bu yüzden burç yorumu, “yıldız beni yönetiyor” değil, “mizacımı tanıyorum, işimi Allah’a bırakıyorum” diline çevrilmelidir. İçerikte kesin kehanet değil, tefekkür ve öz farkındalık öne çıkar.'
  },
  {
    id: 'iklim-burc', title: 'Beldelerin burç ve gezegen nispeti', topic: 'iklim', page: 186,
    tags: ['iklim', 'belde', 'burç', 'gezegen', 'koç', 'boğa', 'ikizler', 'aslan', 'başak', 'yay', 'oğlak', 'kova', 'akrep'],
    text: 'Mârifetnâme, beldeleri burç ve gezegenlerle ilişkilendirir: İngiltere ve Nemçe Koç/Merih’e, Roma ve Fransa Aslan/Şems’e, İspanya ve Portekiz Yay/Müşteri’ye, İstanbul Oğlak/Zühal’e, Acem beldeleri Boğa/Zühre’ye, Bağdat çevresi Başak/Utarit’e, Mısır ve İskenderiye İkizler/Utarit’e, Habeş Kova/Zühal’e benzetilir. Bu, kişisel kader değil; klasik coğrafya-mizaç tasnifidir. İçerikte “burcun şehri” gibi hafif bir renk olarak kullanılabilir.'
  },
  {
    id: 'turk-yili', title: 'Türk yılı ve on iki hayvan', topic: 'zaman', page: 187,
    tags: ['türk yılı', 'hayvan', 'takvim', 'zaman', 'hikâye'],
    text: 'Mârifetnâme, Türkistan’da yaygın olan on iki hayvanlı takvimi anlatır: Zaman on iki hayvan üzerinde döner ve her yıl birinin huyuyla nitelenir. Metin bu hükümlere temkinle yaklaşır; “akıl ve tecrübe ile bulunmuş” der. İçerikte yılın hayvanı, burcun ana karakterine ek bir hikâye katmanı olarak kullanılabilir; kesin hüküm olarak değil.'
  },
  {
    id: 'ruzgar', title: 'Rüzgârların mizacı', topic: 'mevsim', page: 148,
    tags: ['rüzgâr', 'mevsim', 'hava', 'mizaç', 'kuzey', 'güney', 'doğu', 'batı'],
    text: 'Mârifetnâme’ye göre kuzey rüzgârları soğuk ve kurudur; doğu rüzgârları sıcaklık-soğuklukta mutedil, biraz kurudur; batı rüzgârları mutedil ve nemlidir; güney rüzgârları sıcak ve rutubetlidir. Sabah rüzgârı bedene safa ve uykuya lezzet verir. Bu tasnif, sahne atmosferi ve karakterin “hava durumu” metaforu için kullanılabilir.'
  },
  {
    id: 'hicri-aylar', title: 'Hicri aylar ve mübarek geceler', topic: 'zaman', page: 152,
    tags: ['hicri', 'ay', 'muharrem', 'ramazan', 'kandil', 'zaman', 'islam'],
    text: 'Mârifetnâme hicri ayları sayar: Muharrem, Safer, Rebiülevvel, Rebiülahir, Cemaziyelevvel, Cemaziyelahir, Receb, Şaban, Ramazan, Şevval, Zilkade, Zilhicce. Aşure, Regaib, Berat, Kadir ve iki bayram bu takvimin içindedir. Zaman bağlamı, içeriğe “hangi mevsimde ve hangi manevi iklimdeyiz” sorusunu ekler.'
  },
  {
    id: 'gun-saat', title: 'Gün ve saat ölçüsü', topic: 'zaman', page: 150,
    tags: ['gün', 'saat', 'gece', 'gündüz', 'zaman', 'takvim'],
    text: 'Mârifetnâme’de gün, güneşin gün yarısı dairesinden ayrılıp yine ona dönmesiyle ölçülür; halk arasında ise gün batımından yine batışına kadardır. Gece ve gündüz on ikişer saat sayılır; yazın gündüz saatleri uzar, kışın kısalır. Bu “zamanî saat” anlayışı, gezegen saatleri hesabının temelidir.'
  },
  {
    id: 'gezegen-siralama', title: 'Yedi gezegenin sırası', topic: 'gezegen', page: 67,
    tags: ['gezegen', 'zühal', 'müşteri', 'merih', 'şems', 'zühre', 'utarit', 'kamer', 'sıra'],
    text: 'Mârifetnâme’de yedi gezegen, yerden yukarı doğru Kamer, Utarit, Zühre, Şems, Merih, Müşteri, Zühal sırasıyla dizilir. Her biri bir felekte bulunur; birbirlerine nispetle tabiatları ve tesirleri farklıdır. Bu sıra, gezegen saatlerinin ve karakter mizaçlarının arka planıdır.'
  },
  {
    id: 'burc-yildiz', title: 'Burçların yıldızları ve şekilleri', topic: 'burç', page: 68,
    tags: ['burç', 'yıldız', 'şekil', 'takımyıldız', 'astronomi'],
    text: 'Mârifetnâme’ye göre on iki burcun her biri, gökyüzündeki yıldızların bir şekle benzetilmesiyle ad alır. Koç burcundaki yıldızlar birleştirildiğinde koç şekli görünür; diğer burçlar da böyledir. Burç, yıldızların değil, insanın gökyüzüne baktığında gördüğü anlamın adıdır. Bu, içerikte “gökyüzü ayna” metaforunu besler.'
  }
];

export const KNOWLEDGE_VERSION = '2026-11-25-v1';
