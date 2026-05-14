/**
 * Statik ihale kayıtları.
 *
 * status: "open" | "eval" | "signed"
 * ikn: İhale kayıt numarası (benzersiz anahtar)
 * timeLocal: "HH:mm" (isteğe bağlı, ihale saati)
 *
 * parties:
 *   open   → yalnızca muhtemel katılımcılar
 *   eval   → katılımcılar + muhtemel kazanan (probableWinner: true)
 *   signed → kazanan (winner: true) + diğer katılımcılar
 *
 * contact: telefon, e-posta, adres, web (modalda gösterilir; boş / "—" bırakılabilir)
 * contractDateISO: sadece status "signed" — kartta "Sözleşme tarihi" satırı (YYYY-MM-DD)
 * city: İhalenin ili (kartta kutucukta; görüntü cümle biçimi)
 * bidPdf: Teklif PDF'i (href proje köküne göre; download önerilen dosya adı)
 */
import { germencikAydinParties } from "./data-germencik-parties.js";

function katilimci(name, sira, teklifTr, teknikYuzde) {
  return {
    name,
    role: "Katılımcı",
    winner: false,
    probableWinner: false,
    note: `${sira}. sıra · Teklif: ${teklifTr} TL · Teknik puan: %${teknikYuzde}`,
    contact: { phone: "", email: "", address: "", web: "" },
  };
}

export const tenders = [
  {
    ikn: "2026/811450",
    city: "Bingöl",
    title: "Aşağı Bazmana Köprüsü Yapımı",
    status: "open",
    dateISO: "2026-05-21",
    timeLocal: "10:30",
    products: [
      { name: "Ön germeli kiriş (L=28 m, H=120 cm)", qty: "9 adet" },
      { name: "Prekast cephe panelleri", qty: "25 m³" },
    ],
    bidPdf: {
      href: "assets/pdf/teklif-taslak.pdf",
      download: "Tork-Moduler-Teklif-IKN-2026-811450.pdf",
    },
    parties: [
      {
        name: "Tork Moduler Yapı",
        role: "Muhtemel katılımcı",
        winner: false,
        probableWinner: false,
        note: "Temsilî kayıt — firma profili, iletişim ve teknik özet araştırma sonrası güncellenecek.",
        contact: {
          phone: "— güncellenecek",
          email: "— güncellenecek",
          address: "— güncellenecek",
          web: "",
        },
        detail: {
          intro:
            "Bu ihale teklif vermeye açık aşamada; aşağıdaki bilgiler yer tutucudur. EKAP dokümanı ve firma araştırması tamamlandığında güncellenir.",
          rows: [
            { label: "Teklif stratejisi", value: "Belirlenecek" },
            { label: "Kapasite notu", value: "Köprü ön germeli kiriş ve prekast cephe işleri için değerlendirilecek" },
          ],
          paragraphs: [
            "Muhtemel katılımcı listesi yalnızca ön tarama amaçlıdır; resmi katılımcı listesi ihale kapanışına kadar kesin değildir.",
          ],
        },
      },
    ],
  },
  {
    ikn: "2026/687709",
    city: "Kayseri",
    title:
      "15 Temmuz Bulvarı Ve Mehmet Özhaseki Bulvarı Arası İmar Yolu Ve Katlı Kavşak Yapım İşi",
    status: "eval",
    dateISO: "2026-05-13",
    timeLocal: "10:00",
    products: [
      { name: "Prefabrik kiriş", qty: "1000 ton" },
      { name: "Prekast cephe panelleri", qty: "1.185 + 72 ton" },
    ],
    bidPdf: {
      href: "assets/pdf/teklif-taslak.pdf",
      download: "Tork-Moduler-Teklif-IKN-2026-687709.pdf",
    },
    parties: [
      {
        name:
          "BORHAS İNŞAAT TAAH. TUR. ENER. SAN. VE TİC. A.Ş. + İKAŞ GRUP HAFRİYAT İNŞ. NAK. SAN. TİC. LTD. ŞTİ. İş Ortaklığı",
        role: "Muhtemel kazanan",
        winner: false,
        probableWinner: true,
        note: "1. sıra · Teklif: 264.223.343,06 TL · Tenzilat: %27,95",
        contact: {
          phone: "",
          email: "",
          address:
            "İKAŞ GRUP: Esentepe Mah. 294.Sok. Hacer Apt. No:2/2 Karaköprü / Şanlıurfa",
          web: "",
        },
        detail: {
          intro:
            "Sınır değerin altındaki teklifler için 4734 sayılı Kanunun 38. maddesi uyarınca açıklama istenebileceği EKAP ekranında belirtilmiştir.",
          rows: [
            { label: "Yaklaşık maliyet", value: "366.701.715,41 TL" },
            { label: "Sınır değer", value: "218.236.803,65 TL" },
            { label: "İşin süresi", value: "365 gün" },
            { label: "Katsayı (N)", value: "1,20" },
            { label: "Teklif", value: "264.223.343,06 TL" },
            { label: "Tenzilat", value: "%27,95" },
            { label: "Telefon", value: "(0-545) 689 17 17 · (0-532) 154 67 84" },
          ],
          paragraphs: [],
        },
      },
      {
        name: "GLS MÜHENDİSLİK + YERGİNLER HAFRİYAT İş Ortaklığı",
        role: "Katılımcı",
        winner: false,
        probableWinner: false,
        note: "2. sıra · Teklif: 278.979.645,00 TL · Tenzilat: %23,92",
        contact: { phone: "", email: "", address: "", web: "" },
        detail: {
          rows: [
            { label: "Teklif", value: "278.979.645,00 TL" },
            { label: "Tenzilat", value: "%23,92" },
          ],
          paragraphs: [],
        },
      },
      {
        name: "ERK İNŞAAT + AÇIKALIN ALTYAPI İş Ortaklığı",
        role: "Katılımcı",
        winner: false,
        probableWinner: false,
        note: "3. sıra · Teklif: 279.999.999,98 TL · Tenzilat: %23,64",
        contact: { phone: "", email: "", address: "", web: "" },
        detail: {
          rows: [
            { label: "Teklif", value: "279.999.999,98 TL" },
            { label: "Tenzilat", value: "%23,64" },
          ],
          paragraphs: [],
        },
      },
    ],
  },
  {
    ikn: "2025/2473742",
    city: "Aydın",
    title:
      "Aydın Germencik Turanlar Mahallesi Alangüllü Deresi ve Neşetiye Mahallesi Köy Deresi Islahı 1. Kısım",
    status: "eval",
    dateISO: "2026-04-27",
    timeLocal: "10:30",
    products: [
      { name: "Prefabrik cephe panelleri", qty: "25 m³" },
      { name: "Prefabrik kiriş", qty: "67 ton" },
    ],
    bidPdf: {
      href: "assets/pdf/teklif-taslak.pdf",
      download: "Tork-Moduler-Teklif-IKN-2025-2473742.pdf",
    },
    parties: germencikAydinParties,
  },
  {
    ikn: "2026/260973",
    city: "Bursa",
    title:
      "17-52 KKNolu (Ezine-Ayvacık) (550-05) DYA- (Ayvacık-Edremit) (550-05) DYA İl Yolu Km:44+856' da bulunan Tuzla Köprüsü Yapım İşi",
    status: "signed",
    dateISO: "2026-04-29",
    contractDateISO: "2026-04-29",
    timeLocal: "",
    products: [
      { name: "Prekast cephe panelleri", qty: "10 m³" },
      { name: "Prefabrik kiriş", qty: "868 ton" },
    ],
    bidPdf: {
      href: "assets/pdf/teklif-taslak.pdf",
      download: "Tork-Moduler-Teklif-IKN-2026-260973.pdf",
    },
    parties: [
      {
        name:
          "DEHA ALTYAPI ANONİM ŞİRKETİ, ÇELİKTAN YAPI TURİZM ELEKTRİK İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ İş Ortaklığı",
        role: "İhaleyi kazanan",
        winner: true,
        probableWinner: false,
        note: "2. sıra · Teklif: 141.706.510,00 TL · Teknik puan: %36,85 — sözleşme imzalandı.",
        contact: {
          phone: "— güncellenecek",
          email: "— güncellenecek",
          address: "— güncellenecek",
          web: "",
        },
        detail: {
          intro:
            "İhale sıralamasında ikinci sırada yer alan iş ortaklığı; değerlendirme sonucu sözleşmeye davet edilen ve sözleşmesi imzalanan yüklenici.",
          rows: [
            { label: "Sözleşme tarihi", value: "29.04.2026" },
            { label: "Teklif (EKAP özeti)", value: "141.706.510,00 TL" },
            { label: "Teknik puan", value: "%36,85" },
          ],
          paragraphs: [
            "Tedarik kapsamındaki prekast cephe ve prefabrik kiriş kalemleri Tork Moduler takip listesinde; detaylı sözleşme maddeleri EKAP dokümanından işlenebilir.",
          ],
        },
      },
      katilimci("EKAF İNŞAAT", 1, "136.582.369,00", "39,13"),
      katilimci("DILLINGHAM ULUSLARARASI, MUK İNŞAAT", 3, "142.633.870,40", "36,43"),
      katilimci("KARABULUT GRUP MADENCİLİK", 4, "144.827.364,00", "35,46"),
      katilimci("SOLMAZ TAAHHÜT İNŞAAT", 5, "145.223.000,00", "35,28"),
      katilimci("ALSA GRUP İNŞAAT", 6, "145.382.875,00", "35,21"),
      katilimci("ARSLANLAR MÜHENDİSLİK", 7, "146.803.575,00", "34,58"),
      katilimci("HALPEK İNŞAAT, SONTEK GRUP İNŞAAT", 8, "147.213.300,00", "34,39"),
      katilimci("KARFEN İNŞAAT, NAMIK ÇEBİ İNŞAAT", 9, "147.335.070,00", "34,34"),
      katilimci("ÖZHA GRUP İNŞAAT, ÇINAR DOĞAN İNŞAAT", 10, "147.664.800,00", "34,19"),
      katilimci("BEKİRHAN İNŞAAT", 11, "148.616.650,00", "33,77"),
      katilimci("ÖZKOÇ PETROL ÜRÜNLERİ, ZİDA YAPI", 12, "148.802.456,00", "33,69"),
      katilimci("UYB ALTYAPI, MSM ALTYAPI", 13, "148.919.000,00", "33,63"),
      katilimci("CESUR KARDOĞAN", 14, "148.998.898,60", "33,60"),
      katilimci("YAPIYOL ALTYAPI İNŞAAT", 15, "149.249.020,50", "33,49"),
      katilimci("58YAPI İNŞAAT", 16, "149.559.000,00", "33,35"),
      katilimci("KRB YOL YAPI, İLKGÜN İNŞAAT", 17, "149.883.814,00", "33,20"),
      katilimci("TANMAK YOL YAPI, ÖK-BİL ELEKTRİK", 18, "150.054.752,40", "33,13"),
      katilimci("BARANKALE İNŞAAT", 19, "150.280.797,00", "33,03"),
      katilimci("İLKAR MÜHENDİSLİK, KARBİN YAPI", 20, "150.475.725,00", "32,94"),
      katilimci("ZARA TAAHHÜT İNŞAAT", 21, "151.200.000,00", "32,62"),
      katilimci("MENGA İNŞAAT TAAHHÜT", 22, "151.556.350,00", "32,46"),
      katilimci("HZL GLOBAL İNŞAAT, BİLYOL İNŞAAT", 23, "151.562.131,00", "32,46"),
      katilimci("ALİ AKIN NEVRUZ, AYSU YAPI", 24, "152.761.945,00", "31,92"),
      katilimci("İKRAZ İNŞAAT", 25, "155.771.570,00", "30,58"),
      katilimci("TEKYOL TAAHHÜT İNŞAAT", 26, "157.575.000,00", "29,78"),
      katilimci("MAPEK İNŞAAT, HÜSAMETTİN PEKER İNŞAAT", 27, "158.812.847,80", "29,22"),
      katilimci("KARAHANLI GRUP MADENCİLİK", 28, "200.001.942,61", "10,87"),
      katilimci("FATİH ÇİFTÇİ", 29, "201.271.000,00", "10,30"),
    ],
  },
];
