/**
 * Statik ihale / müşteri kayıtları.
 * Ekleme ve güncelleme: bu dosyadaki diziyi düzenleyin.
 *
 * status: "open" | "eval" | "signed"
 *   open   → Teklif vermeye açık
 *   eval   → Değerlendirme aşamasında
 *   signed → Sözleşme imzalanmış
 */
export const tenders = [
  {
    id: "EKAP-2026-0142",
    title: "Geçici sağlık ünitesi ve konteyner yapıları temini",
    status: "open",
    dateISO: "2026-06-18",
    products: [
      { name: "Modüler acil müdahale ünitesi", qty: "2 set" },
      { name: "Ofis / idari konteyner (30 m²)", qty: "4 adet" },
      { name: "WC-duş konteyner bloğu", qty: "1 adet" },
    ],
    parties: [
      {
        name: "Anadolu Prefabrik A.Ş.",
        role: "Muhtemel katılımcı",
        winner: false,
        note: "Son üç yılda benzer kapasitede iki ihale tamamlamış; bölgede lojistik avantajı.",
      },
      {
        name: "Kuzey Modüler Ltd.",
        role: "Muhtemel katılımcı",
        winner: false,
        note: "Fiyat politikası agresif; teslimat süreleri genelde uzuyor.",
      },
    ],
  },
  {
    id: "EKAP-2026-0098",
    title: "Okul genişlemesi — prefabrik sınıf modülleri",
    status: "eval",
    dateISO: "2026-05-02",
    products: [
      { name: "Eğitim modülü (24 öğrenci kapasiteli)", qty: "6 adet" },
      { name: "Koridor bağlantı üniteleri", qty: "3 adet" },
    ],
    parties: [
      {
        name: "Eğitim Yapı Sistemleri A.Ş.",
        role: "Muhtemel katılımcı",
        winner: false,
        note: "MEB onaylı tip projelerle çalışıyor.",
      },
      {
        name: "Tork Moduler Yapı",
        role: "Teklif sahibi",
        winner: false,
        note: "Teknik şartnameye uygun alternatif çözüm önerildi.",
      },
      {
        name: "ModülPark İnşaat",
        role: "Muhtemel katılımcı",
        winner: false,
        note: "İhale dokümanında istenen sertifikalar eksik bildirilmişti (düzeltme yapıldı).",
      },
    ],
  },
  {
    id: "EKAP-2025-2211",
    title: "Afet lojistik kampı — yaşam ve hizmet konteynerleri",
    status: "signed",
    dateISO: "2025-11-20",
    products: [
      { name: "Yaşam konteyneri (çift katlı blok)", qty: "20 adet" },
      { name: "Mutfak / yemekhane modülü", qty: "2 adet" },
      { name: "Jeneratör ve teknik altyapı kabini", qty: "3 adet" },
    ],
    parties: [
      {
        name: "Tork Moduler Yapı",
        role: "İhaleyi kazanan",
        winner: true,
        note: "Sözleşme imzalandı; teslimat 120 takvim günü, 3 kısmi ödeme planı.",
      },
      {
        name: "Balkan Konteyner San.",
        role: "İkinci en uygun teklif",
        winner: false,
        note: "Fiyat avantajı vardı; teknik puanlama sonucu elendi.",
      },
    ],
  },
];
