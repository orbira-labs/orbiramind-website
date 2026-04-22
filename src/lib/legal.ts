/**
 * OrbiraMind — Yasal ve Satıcı Bilgileri
 *
 * Bu dosya tüm yasal sayfalar (mesafeli satış, iade, KVKK, iletişim vb.)
 * ve footer tarafından kullanılır. Sat\u0131c\u0131 bilgileri de\u011fi\u015fti\u011finde
 * sadece bu dosyay\u0131 g\u00fcncellemek yeterlidir.
 */

export const LEGAL_LAST_UPDATED = "22 Nisan 2026";

export const SELLER = {
  // Satıcı türü: "individual" = Gerçek kişi (vergi mükellefi değil)
  // "sole_proprietor" = Şahıs şirketi
  // "company" = Tüzel kişi (Ltd./A.Ş.)
  type: "individual" as "individual" | "sole_proprietor" | "company",

  // Yasal isim (sözleşmede geçecek ad)
  legalName: "Seyyit Ali Perse",

  // Marka / platform adı
  brandName: "OrbiraMind",

  // İşletici
  operatedBy: "Seyyit Ali Perse",

  // Adres
  address: {
    street: "Siteler Mah., Yunus Nadi Cad. No: 121A/3",
    district: "Marmaris",
    city: "Muğla",
    country: "Türkiye",
    full: "Siteler Mah., Yunus Nadi Cad. No: 121A/3, Marmaris / Muğla, Türkiye",
  },

  // İletişim
  phone: "+90 553 624 39 70",
  phoneRaw: "+905536243970",
  supportEmail: "info@orbiralabs.com",
  legalEmail: "info@orbiralabs.com",

  // Web
  website: "https://orbiramind.com",
  domain: "orbiramind.com",

  // Vergi bilgileri (bireysel satıcı için geçerli değil, şahıs/şirket oldu\u011fumda doldurulacak)
  taxOffice: null as string | null,
  taxNumber: null as string | null,
  mersisNumber: null as string | null,
  tradeRegistryNumber: null as string | null,

  // KDV durumu — bireysel satıcı olduğu için KDV mükellefi değildir
  vatStatus: "Satıcı bireysel olduğundan 3065 sayılı KDV Kanunu kapsamında KDV mükellefi değildir; fiyatlar nihai tutardır." as string,
} as const;

/**
 * Kredi paketleri — /pricing, mesafeli satış, iade ve teslimat sayfalarında
 * tutarlı bilgi göstermek için tek kaynak.
 */
export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Başlangıç",
    credits: 5,
    pricePerCredit: 32.99,
    total: 164.95,
    description: "Yeni başlayanlar için küçük paket",
  },
  {
    id: "popular",
    name: "Popüler",
    credits: 15,
    pricePerCredit: 27.99,
    total: 419.85,
    description: "En sık tercih edilen paket",
  },
  {
    id: "pro",
    name: "Profesyonel",
    credits: 45,
    pricePerCredit: 23.99,
    total: 1079.55,
    description: "Yoğun kullanım için en ekonomik paket",
  },
] as const;

/**
 * Para biçimi yardımcısı.
 */
export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Footer ve yasal sayfalar için telefon görüntü formatı.
 */
export const SELLER_DISPLAY = {
  addressLines: [
    SELLER.address.street,
    `${SELLER.address.district} / ${SELLER.address.city}`,
    SELLER.address.country,
  ],
  addressSingle: SELLER.address.full,
  phoneDisplay: SELLER.phone,
  phoneHref: `tel:${SELLER.phoneRaw}`,
  emailDisplay: SELLER.supportEmail,
  emailHref: `mailto:${SELLER.supportEmail}`,
} as const;
