# Orbira Mind — Responsive Design Specification

> **Versiyon:** 1.0  
> **Tarih:** 15 Nisan 2026  
> **Kapsam:** Tüm Pro Panel sayfaları (authenticated area)  
> **Hedef:** Her sayfanın mobil deneyimini web kalitesine eşitlemek  

---

## Kullanım Kılavuzu

Bu döküman **indekslenmiş** sayfa bazlı görev listesidir.  
Bir agent'a şu şekilde talimat verin:

> **"Bu dökümanı oku. INDEX 3'teki sayfayı (Randevular) uygula."**

Her INDEX bağımsızdır; sırayla veya paralel çalışılabilir.

---

## Global Kurallar (Tüm Sayfalar İçin Geçerli)

Bu kurallar **her INDEX'te** uygulanmalıdır. Sayfa bazlı kabul kriterlerine ek olarak bunlar her zaman geçerlidir.

### Breakpoint Sistemi

| Token | Değer | Kullanım |
|-------|-------|----------|
| `mobile` | < 640px | Telefon (tek kolon, bottom nav) |
| `sm` | 640px | Büyük telefon / küçük tablet |
| `md` | 768px | Tablet — `mobile-only` / `desktop-only` sınır noktası |
| `lg` | 1024px | Laptop — `Sidebar` / `BottomNav` geçiş noktası |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Geniş ekran |

**Kritik:** 768px–1023px aralığı "tablet bandı"dır. Bu aralıkta `desktop-only` içerik görünür AMA sidebar gizlidir ve BottomNav hâlâ gösterilir. Her sayfada bu aralığın düzgün çalıştığı doğrulanmalıdır.

### Touch Target Kuralları

| Element Tipi | Minimum Boyut | CSS Sınıfı |
|-------------|---------------|------------|
| Primary buton (CTA) | 48×48px | `mobile-btn` veya `min-h-[48px]` |
| Sekonder buton | 44×44px | `touch-target` veya `min-h-[44px] min-w-[44px]` |
| Liste satırı | 56px height | `mobile-list-item` |
| İkon butonu | 44×44px | `touch-target` veya `p-2.5` + ikon |
| Chip/Tag | 36px height | `mobile-chip` |
| Input alanı | 48px height | `mobile-input` veya `min-h-[48px]` |

### Modal Kuralları

| Ekran | Davranış |
|-------|----------|
| Mobile (< 768px) | **Full-screen sheet** — `.mobile-modal` + `pt-safe` + `pb-safe` |
| Tablet/Desktop (≥ 768px) | **Centered overlay** — `max-w-lg`, `max-h-[90vh]`, `rounded-2xl` |

Her modal'da:
- Kapatma butonu minimum **44×44px**
- Backdrop tap ile kapatma
- `overscroll-contain` ile arka scroll engelleme
- Form modal'larda keyboard açıldığında content'in görünür kalması

### Typography Scale (Mobile)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title (h1) | `text-base` (16px) | `font-semibold` | 1.25 |
| Section Title (h2) | `text-sm` (14px) | `font-semibold` | 1.25 |
| Body text | `text-sm` (14px) | `font-normal` | 1.5 |
| Caption/meta | `text-xs` (12px) | `font-medium` | 1.4 |
| Micro label | `text-[10px]` | `font-medium` | 1.2 |

### Safe Area

Her sayfanın mobile layout'unda:
- **Üst:** `pt-[env(safe-area-inset-top)]` — TopBar'da zaten var
- **Alt:** `pb-[env(safe-area-inset-bottom)]` — BottomNav spacer (ProShell `h-20`) 
- **FAB kullanılan sayfalarda:** FAB, BottomNav'ın **üstünde** konumlanmalı → `bottom-24` veya `bottom-[calc(5rem+env(safe-area-inset-bottom))]`

### Scroll & Performance

- `touch-action: manipulation` tüm interaktif elementlerde
- `-webkit-overflow-scrolling: touch` scroll container'larda
- `overscroll-behavior: contain` modal ve sheet'lerde
- Image/heavy component'larda **lazy loading**
- Skeleton loading state'ler her sayfada mevcut olmalı

---

## INDEX 0 — ProShell, TopBar, BottomNav, Sidebar (Global Layout)

**Dosyalar:**
- `src/components/layout/ProShell.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/NotificationCenter.tsx`

### Mevcut Durum

Web'de mükemmel: Sol sidebar (collapse edilebilir 200px/64px), üst header bar, 3 kolonlu dashboard grid.

Mobilde:
- BottomNav 5 tab ile çalışıyor
- TopBar mobilde ayrı render (h-14)
- Sidebar tamamen gizli (lg:hidden → lg:flex)

### Tespit Edilen Sorunlar

1. **BottomNav tab label'ları `text-[10px]` — okunması zor**, özellikle yaşlı kullanıcılar için
2. **BottomNav ikonları `h-5 w-5` (20px)** — sorun yok ama label'sız tanınması güç; icon+label birlikte olmalı (zaten var, ama boyut küçük)
3. **TopBar mobil "+" butonu `w-9 h-9` (36px)** — 44px altında
4. **TopBar NotificationCenter trigger `w-9 h-9` (36px)** — 44px altında
5. **NotificationCenter dropdown'u mobilde `absolute right-0 w-80`** — küçük ekranlarda sol kenardan taşabilir; mobilde full-screen sheet olmalı
6. **NotificationCenter açıldığında otomatik "tümünü okundu" işaretliyor** — kullanıcı sadece göz atmak isteyebilir
7. **Sidebar'daki "Ödevler" placeholder** (`href="#"`, `cursor-not-allowed`) — sidebar'da OK ama mobil BottomNav'da yok → tutarsızlık kabul edilebilir (henüz aktif değil)
8. **Sidebar label "Danışanlar" vs BottomNav "Danışan"** — tutarsız isimlendirme
9. **TopBar'da `formatWeekday`, `formatDayMonth`, `currentTime`, `Send`, `Clock` import'ları** JSX'te kullanılmıyor — dead code

### Kabul Kriterleri

- [ ] BottomNav label font size `text-[11px]` olarak güncellenmeli
- [ ] TopBar mobil "+" butonu `w-10 h-10` (40px) veya `min-w-[44px] min-h-[44px]` olmalı
- [ ] TopBar NotificationCenter trigger `min-w-[44px] min-h-[44px]` olmalı
- [ ] NotificationCenter mobilde (< 768px) `fixed inset-0` full-screen sheet olarak render edilmeli, `absolute` dropdown yerine
- [ ] NotificationCenter açıldığında **otomatik okundu işaretleme kaldırılmalı**; bunun yerine "Tümünü Okundu İşaretle" butonu açıkça görünmeli
- [ ] Dead code temizliği: TopBar'daki kullanılmayan import'lar kaldırılmalı
- [ ] BottomNav ve Sidebar label'ları tutarlı hale getirilmeli (ikisi de "Danışanlar" veya ikisi de "Danışan")
- [ ] Tablet bandı (768–1023px) kontrol: TopBar desktop header + BottomNav birlikte sorunsuz çalışmalı

---

## INDEX 1 — Dashboard / Ofisim

**Dosyalar:**
- `src/app/(panel)/dashboard/page.tsx`
- `src/app/(panel)/dashboard/DashboardClient.tsx`
- `src/components/dashboard/QuickStats.tsx`
- `src/components/dashboard/NotesCard.tsx`
- `src/components/dashboard/ActionCenter.tsx`
- `src/components/dashboard/SessionPreviewCard.tsx`

### Mevcut Durum

**Web:** 3 üst istatistik kartı → 3 kolonlu grid (Yaklaşan Randevular, Notlarım, Bekleyen Analizler). Temiz, dengeli, güçlü görsel hiyerarşi.

**Mobil:** 3 stat kartı horizontal scroll → Yaklaşan Randevular listesi → Bekleyen Analizler listesi → NotesCard. Temel işlevsellik tamam.

### Tespit Edilen Sorunlar

1. **QuickStats mobile kartlarında "Bekleyen Analizler" label'ı KIRILMIYOR ama `min-w-[140px]` kartlarda 3 kart sığdırmak için scroll gerekiyor** — scroll affordance (kaydırma ipucu) eksik
2. **Mobilde "Yaklaşan Randevular" section header ile "Oluştur" butonu** — `touch-target` class'ı var ama buton görsel olarak küçük (`text-xs`, `h-3.5 w-3.5` ikon)
3. **Bekleyen Analizler mobilde "Gönder" butonu** — aynı boyut sorunu
4. **Share popover mobilde `absolute right-0 w-52`** — küçük ekranda taşma riski
5. **NotesCard mobilde** — Modal kapatma butonu `w-8 h-8` (32px) → 44px altında
6. **NotesCard "Ekle" butonu** — küçük hit area
7. **NotesCard priority noktaları** `w-5 h-5` — gruplandığında yanlış tıklama riski
8. **SessionPreviewCard'daki `isSoon` hesaplaması** — `parseInt("2 saat")` → `2` döner (yanlış); `parseInt("Geçmiş")` → `NaN` — logic bug
9. **SessionPreviewCard mobilde "Raporu Gör" linki yok** — desktop'ta var, mobilde eksik
10. **Mobilde ilk 3 item gösteriliyor**, "Tümünü Gör" linki yok

### Kabul Kriterleri

- [ ] QuickStats scroll-snap kartlarının ilk yüklemede 2.5 kart göstermesi (son kartın yarısının görünmesi ile scroll affordance sağlanır) — `min-w-[120px]` veya viewport-relative width denenebilir
- [ ] Dashboard section header butonları ("Oluştur", "Gönder") minimum 44px touch target
- [ ] Share popover mobilde bottom sheet olarak açılmalı (absolute dropdown yerine)
- [ ] NotesCard modal close butonu 44×44px
- [ ] NotesCard "Ekle" butonu 44×44px touch target
- [ ] `SessionPreviewCard` `isSoon` logic fix: `timeUntil` string parse yerine raw minute değeri kullanılmalı
- [ ] SessionPreviewCard mobilde "Raporu Gör" aksiyonu eklenmeli (tıklama ile detail modal veya navigation)
- [ ] Her section'da 3+ item varsa "Tümünü Gör" linki eklenmeli (ilgili sayfaya yönlendirme)
- [ ] Loading skeleton state'ler mobilde de gösterilmeli (zaten var, doğrulanacak)

---

## INDEX 2 — Danışanlar (Clients)

**Dosyalar:**
- `src/app/(panel)/clients/page.tsx`
- `src/components/clients/ClientCard.tsx`
- `src/components/clients/ClientFilters.tsx`
- `src/components/clients/ClientRowActions.tsx`
- `src/components/clients/EditClientModal.tsx`

### Mevcut Durum

**Web:** Arama barı + filtreler → tablo/grid görünümü (row/card toggle) + pagination. İstatistik kartları üstte. "Danışan Kaydet" butonu TopBar'da.

**Mobil:** Üst arama + horizontal chip filtreler → basit liste (Avatar + isim + badge) + FAB (sağ alt "+" butonu). Silme full-screen panel.

### Tespit Edilen Sorunlar

1. **Mobil liste item'larında "Bekliyor" badge'i çok kalabalık** — "Aktif" + "Bekliyor" yan yana sıkışık
2. **Mobil liste item'larına tıklanınca client detail'e gidiyor AMA geri dönüş deneyimi belirsiz** — back button/gesture
3. **Mobil listede email/telefon bilgisi gösterilmiyor** — hızlı arama veya iletişim için ek dokunuş gerekiyor
4. **FAB pozisyonu** — BottomNav ile çakışma riski (`pb-24` var ama FAB'ın kendisi `bottom-6 right-4` → BottomNav h-16 + safe area ile örtüşebilir)
5. **Mobilde pagination** — sadece ok ikonları, sayfa numarası yok; kaçıncı sayfada olduğu belli değil
6. **Horizontal scroll filtreler** — scroll ipucu (affordance) eksik; kullanıcı "Tümü" filtresini görmeyebilir
7. **Yeni danışan formu mobile'da full-screen** — harika, ANCAK form içindeki `grid-cols-2` (isim/soyisim, telefon/email) dar ekranlarda sıkışık
8. **Silme confirmation** — mobilde özel panel var (iyi) ama animasyon yok

### Kabul Kriterleri

- [ ] Mobil liste item'larında badge overflow durumunda sadece en önemli badge gösterilmeli, diğerleri `+1` şeklinde collapse edilmeli
- [ ] Client detail sayfasında mobilde geri butonu (← ikonu) açıkça görünmeli
- [ ] Mobil liste item'ına uzun basma (long press) veya swipe ile hızlı aksiyonlar (ara, mesaj at) eklenebilir (opsiyonel, nice-to-have)
- [ ] FAB pozisyonu: `bottom-[calc(5rem+env(safe-area-inset-bottom)+0.5rem)]` — BottomNav'ın kesinlikle üstünde
- [ ] Mobil pagination: mevcut sayfa / toplam sayfa göstergesi eklenmeli (örn: "2/5")
- [ ] Filter chip container'ın sağ kenarında hafif gradient fade eklenip scroll affordance sağlanmalı
- [ ] Yeni danışan formu: ekran genişliği < 380px'de `grid-cols-2` → `grid-cols-1` olmalı
- [ ] Silme paneli `slide-in-from-bottom` animasyonu eklenmeli

---

## INDEX 3 — Randevular (Appointments)

**Dosyalar:**
- `src/app/(panel)/appointments/page.tsx`
- `src/components/appointments/AppointmentCalendar.tsx`
- `src/components/appointments/CreateAppointmentModal.tsx`
- `src/components/appointments/AppointmentDetailModal.tsx`
- `src/components/appointments/EditAppointmentModal.tsx`

### Mevcut Durum

**Web:** Takvim görünümü (aylık grid) + liste toggle. Tarih hücresine hover ile quick-add. Detay modal centered overlay.

**Mobil:** Haftalık strip takvim (seçili haftanın günleri) + günlük randevu listesi + FAB.

### Tespit Edilen Sorunlar

1. **`WEEKDAYS_MOBILE` ambiguity** — `["P", "S", "Ç", "P", "C", "C", "P"]` → Pazartesi ve Perşembe ikisi de "P", Cumartesi ve Cuma ikisi de "C", Pazar da "P" — **7 günden 3'ü aynı harf**; kullanıcı hangi gün olduğunu ayırt edemez
2. **Hafta strip + ay navigasyonu bağlantısızlığı** — Ay değiştirilince hafta strip'i eski haftada kalıyor; kullanıcı "navigasyon bozuk" sanabilir
3. **Mobil takvimde loading state yok** — `loading` ve `refresh` state'ler JSX'te kullanılmıyor
4. **Tab filtreler (Yaklaşan, Geçmiş, Tümü)** — mobilde `touch-manipulation` var ama `min-height` yok → küçük dokunma alanı
5. **Randevu kartında tarih gösterimi** — gün numarası büyük kutu içinde (güzel) ama "NİS" (ay kısaltması) `text-[10px]` ile çok küçük
6. **Desktop'ta takvim görünümü var ama mobilde YOK** — mobilde sadece haftalık strip; aylık genel görünüm eksik
7. **AppointmentDetailModal mobilde 4 buton yan yana** — dar ekranda buton label'ları kırpılabilir
8. **CreateAppointmentModal mobilde native date/time picker** — iOS ve Android arasında tutarsız davranış
9. **Boş gün state** — güzel empty state var ama tekrarlayan geçmiş günlerde gereksiz "Randevu Ekle" butonu gizleniyor (doğru davranış)
10. **Randevu listesinde FAB ile "Yaklaşan (0)" filter tab çakışması** — filtre "Yaklaşan" gösteriyorsa ve 0 randevu varsa, empty state + FAB birlikte iyi çalışmalı

### Kabul Kriterleri

- [ ] `WEEKDAYS_MOBILE` düzeltilmeli: `["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"]` — 2 harfli kısaltmalar kullanılmalı
- [ ] Ay değiştirildiğinde `selectedDate` yeni ayın 1'ine (veya bugünün ayı ise bugüne) set edilmeli → hafta strip'i senkronize olsun
- [ ] Mobil takvimde loading state eklenmeli (hafta strip'inde skeleton dots, listede skeleton cards)
- [ ] Tab filter chip'leri `min-h-[36px]` + `px-4` olmalı
- [ ] Randevu kartında ay kısaltması `text-[11px]` + `font-semibold` olmalı
- [ ] AppointmentDetailModal mobilde: 4 buton yerine 2 satır düzeni (üstte primary aksiyonlar, altta secondary) veya bottom action sheet pattern'i kullanılmalı
- [ ] Mobil takvime aylık mini-calendar toggle eklenebilir (opsiyonel, nice-to-have): haftalık strip'in üstünde ay grid'i açılıp kapanan bir bölüm
- [ ] Empty state'lerde CTA butonları `min-h-[48px]` `mobile-btn` class'ı kullanmalı

---

## INDEX 4 — Seans Paketleri (Sessions)

**Dosyalar:**
- `src/app/(panel)/sessions/page.tsx`
- `src/components/sessions/CreateSessionPackageModal.tsx`
- `src/components/sessions/AddPaymentModal.tsx`

### Mevcut Durum

**Web & Mobil:** Tek layout (mobile-only/desktop-only ayrımı YOK). Seans ücreti kartı → paket şablonları grid → paketler. Responsive grid: `sm:grid-cols-2 lg:grid-cols-3`.

### Tespit Edilen Sorunlar

1. **Mobile-only/desktop-only ayrımı yok** — tek layout hem web hem mobilde render ediliyor; mobile optimizasyonu eksik
2. **Base price display row** — `justify-between` ile fiyat ve "Değiştir" butonu yan yana; çok dar ekranlarda (< 360px) sıkışabilir
3. **Paket kartlarında edit/delete ikonları** küçük (`p-2` ile yaklaşık 36px) — touch target yetersiz
4. **`autoFocus` base price input'unda** — mobilde keyboard aniden açılıyor, kullanıcı bunu beklemeyebilir
5. **AddPaymentModal'da `grid-cols-4` ödeme yöntemi** — 4 kolon 360px ekranda sütun başına ~80px → çok dar, yanlış dokunma riski yüksek
6. **CreateSessionPackageModal her zaman centered Modal** — mobilde full-screen sheet olmalı
7. **Paket fiyatı gösterimi** `text-2xl font-bold` — mobilde yeterli ama TL sembolü ve sayı bitişik olabiliyor
8. **"Yeni Paket" butonu** — `flex-shrink-0` ama yanındaki metin uzunsa sıkışıyor

### Kabul Kriterleri

- [ ] Sayfa için mobile-only / desktop-only ayrımı eklenmeli VEYA mevcut tek layout mobile-first olarak optimize edilmeli
- [ ] Base price row: `flex-col` fallback eklenip dar ekranlarda fiyat üstte, buton altta olmalı (`flex-col sm:flex-row`)
- [ ] Paket kartı edit/delete butonları `min-w-[44px] min-h-[44px]` olmalı
- [ ] `autoFocus` mobilde kaldırılmalı (sadece desktop'ta aktif — `useMediaQuery` ile kontrol)
- [ ] AddPaymentModal: ödeme yöntemleri mobilde `grid-cols-2` (4 yerine 2), tablet+ `grid-cols-4`
- [ ] CreateSessionPackageModal: mobilde (< 768px) full-screen `.mobile-modal` pattern'i kullanılmalı
- [ ] "Yeni Paket" butonu: container `flex-wrap` olmalı; dar ekranda buton alt satıra düşmeli
- [ ] Fiyat gösteriminde TL sembolü ve sayı arasında `gap-1` veya non-breaking space olmalı

---

## INDEX 5 — Analizler (Tests)

**Dosyalar:**
- `src/app/(panel)/tests/page.tsx`
- `src/components/tests/AnalysisCard.tsx`
- `src/components/tests/SendTestModal.tsx`
- `src/components/tests/AnalysisDetailModal.tsx`
- `src/components/tests/AnalysisPipeline.tsx`
- `src/components/tests/ReportPreviewModal.tsx`

### Mevcut Durum

**Web:** 3 stat kartı (Kalan Test, Bekleyen, Tamamlanan) → filter tab'ları → analiz listesi (zengin bilgili kartlar: status, tarih, aksiyonlar).

**Mobil:** Horizontal scroll stat kartları → chip filtreler → basit liste (Avatar + isim + badge + göz ikonu).

### Tespit Edilen Sorunlar

1. **`showSendModal` state'i tanımlı ama hiçbir yerde `setShowSendModal(true)` çağrılmıyor** — "MindTest Gönder" butonu bu sayfada erişilemez; sadece TopBar'dan ve Dashboard'dan erişilebilir → bu sayfada da CTA olmalı
2. **Mobil listede aksiyon eksikliği** — Desktop'ta "Yeniden Gönder", "Sonuçları Gör", "Link Kopyala" butonları var; mobilde sadece copy link (pending için) ve chevron (completed için) var
3. **Göz ikonu `h-3.5 w-3.5`** — çok küçük, dokunmak zor
4. **Filter chip'leri** — `mobile-chip` class'ı kullanılıyor (iyi) ama scroll affordance yine eksik
5. **Stat kartlarında "Kalan Test" label'ı kafa karıştırıcı** — "kalan kredi" veya "kullanılabilir test" daha net
6. **Mobilde "Tamamlanan" filtre ile tüm test'lerin aynı kişi (Ayçin Perse) olduğu durumda** — gruplama veya tarih separator'ü yok, hepsi aynı görünüyor

### Kabul Kriterleri

- [ ] Sayfa header'ına veya uygun bir konuma "MindTest Gönder" CTA butonu eklenmeli — `setShowSendModal(true)` çağıracak şekilde wiring yapılmalı
- [ ] Mobil liste item'larında swipe-to-action veya tap'te aksiyonlar (Gör, Kopyala, Yeniden Gönder) erişilebilir olmalı
- [ ] Göz (Eye) ikonu en az `h-5 w-5` + `p-2` padding ile 44px touch target sağlanmalı
- [ ] Filter chip container sağ kenarında gradient fade scroll affordance
- [ ] Mobil listede tarih gruplaması (bugün, dün, bu hafta, vs.) eklenmeli
- [ ] Desktop stat kartları `grid-cols-3` — tablet bandında (768–1023px) hâlâ 3 kolon mu? Kontrol edilmeli; gerekirse `md:grid-cols-3` kullanılmalı
- [ ] SendTestModal mobilde full-screen pattern (zaten var, doğrulanacak)
- [ ] AnalysisDetailModal mobilde header close button 44×44px

---

## INDEX 6 — Danışan Detay (Client Detail)

**Dosyalar:**
- `src/app/(panel)/clients/[id]/page.tsx`
- `src/components/clients/EditClientModal.tsx`
- `src/components/sessions/CreateSessionPackageModal.tsx`
- `src/components/sessions/AddPaymentModal.tsx`

### Mevcut Durum

Bu sayfa tek layout kullanıyor (mobile-only/desktop-only ayrımı OLMAMALI — zaten content-driven).  
İçerik: Danışan profil kartı → Seans paketleri → Randevu geçmişi → Test geçmişi.

### Tespit Edilen Sorunlar

1. **Geri navigasyon** — mobilde TopBar'da sadece sayfa title var; `← Geri` butonu eklenmeli
2. **Profil kartı** — iletişim bilgileri (email, telefon) gösteriliyorsa "Ara" ve "E-posta Gönder" butonları mobilde `tel:` ve `mailto:` link olarak çalışmalı
3. **Seans paketi kartları** — ödeme ekleme ve düzenleme butonları desktop boyutunda kalabilir
4. **Düzenle modal** — EditClientModal'ın mobilde full-screen pattern kullanması gerekir
5. **Uzun sayfa scroll'u** — çok section, mobilde kullanıcı kaybolabilir; sticky section navigator veya jump links düşünülmeli

### Kabul Kriterleri

- [ ] TopBar'a mobil geri butonu eklenmeli (← ikonu, `router.back()`)
- [ ] İletişim bilgileri satırlarında telefon → `tel:` link, email → `mailto:` link; butonlar mobilde `mobile-btn` boyutunda
- [ ] Seans paket kartlarındaki aksiyon butonları `touch-target` class'ı ile 44px minimum
- [ ] EditClientModal mobilde (< 768px) full-screen `.mobile-modal`
- [ ] Scroll pozisyonunu gösteren bir section indicator eklenmesi (opsiyonel, nice-to-have)
- [ ] Randevu ve test geçmişi listeleri lazy-load / "Daha Fazla Göster" pattern'i kullanmalı (ilk yüklemede max 5 item)

---

## INDEX 7 — Analiz Detay / Rapor (Test Detail)

**Dosyalar:**
- `src/app/(panel)/tests/[id]/page.tsx`
- `src/components/results/WellnessGauge.tsx`
- `src/components/results/ProfileCard.tsx`
- `src/components/results/StrengthWeaknessGrid.tsx`
- `src/components/results/CharacterAnalysis.tsx`
- `src/components/results/ClinicianInsights.tsx`
- `src/components/results/CoachingTimeline.tsx`
- `src/components/results/DimensionRadar.tsx`
- `src/components/results/BlindSpotCard.tsx`
- `src/components/results/InferenceCards.tsx`

### Mevcut Durum

Tab yapılı rapor görüntüleyici: Genel Bakış, Güçlü & Gelişim, Klinisyen Görüşleri, Yol Haritası.

### Tespit Edilen Sorunlar

1. **Tab navigasyonu** — 4 tab mobilde horizontal scroll gerektirebilir
2. **Radar chart (DimensionRadar)** — SVG/Canvas boyutu mobilde viewport'a sığmalı
3. **WellnessGauge** — circular gauge mobilde yeterli büyüklükte render edilmeli
4. **Geri navigasyon** — Analiz listesine veya danışan detayına geri dönüş
5. **Rapor paylaşım/indirme** — mobilde daha belirgin CTA olmalı

### Kabul Kriterleri

- [ ] Tab bar mobilde horizontal scroll + active tab center'a scroll animasyonu
- [ ] Tab bar `sticky top-14` (TopBar h-14 altında) yapışkan olmalı
- [ ] DimensionRadar: mobilde `max-w-[300px] mx-auto` ile center; touch ile zoom-in yapılabilir (opsiyonel)
- [ ] WellnessGauge: mobilde minimum `h-48 w-48`
- [ ] Geri butonu TopBar'da açıkça görünmeli
- [ ] "Raporu Paylaş" veya "PDF İndir" butonu mobilde floating veya sticky footer olarak eklenebilir
- [ ] Her result component'in kendi mobile padding/spacing'i `p-3 sm:p-5` pattern'ini takip etmeli
- [ ] Text-heavy component'lar (ClinicianInsights, CoachingTimeline) mobilde uygun `text-sm leading-relaxed` ile okunabilir olmalı

---

## INDEX 8 — Ayarlar (Settings)

**Dosyalar:**
- `src/app/(panel)/settings/page.tsx`

### Mevcut Durum

Tek layout, `max-w-2xl`. Profil bilgileri formu + uzmanlık alanları dropdown'u + hesap silme bölümü.

### Tespit Edilen Sorunlar

1. **Form `grid-cols-2` HER YERDE** — isim/soyisim OK ama telefon/email ve şehir/ilçe 360px'de çok sıkışık
2. **Uzmanlık alanları dropdown** — `absolute` panel geniş, ama `max-height` belirsiz; çok uzmanlık alanı varsa scroll gerekiyor
3. **"Hesabı Sil" bölümü** — buton ve açıklama flex-row'da; dar ekranda kötü wrap oluyor
4. **Kaydet butonu** — sayfa altında; uzun formda scroll gerektirir; sticky footer olabilir

### Kabul Kriterleri

- [ ] Form grid'leri: `grid-cols-1 sm:grid-cols-2` olarak güncellenmeli — mobilde tek kolon
- [ ] Uzmanlık dropdown: `max-h-[50vh]` + `overflow-y-auto` olmalı
- [ ] "Hesabı Sil" bölümü: mobilde `flex-col` → açıklama üstte, buton altta
- [ ] Kaydet butonu: mobilde sticky bottom bar olarak konumlandırılmalı (`fixed bottom-0` + safe-area padding + BottomNav üstünde)
- [ ] Tüm input'lar `min-h-[48px]` mobile-input standardına uymalı
- [ ] Sayfa yüklenirken skeleton loading state olmalı (zaten kısmen var; tam kapsam doğrulanacak)

---

## INDEX 9 — Abonelik / Faturalandırma (Billing)

**Dosyalar:**
- `src/app/(panel)/billing/page.tsx`

### Mevcut Durum

Kredi bilgisi kartı + Paket karşılaştırma + Fiyat kartları (Başlangıç, Pro, Kurumsal) + Karşılaştırma tablosu.

### Tespit Edilen Sorunlar

1. **3 fiyat kartı `sm:grid-cols-3`** — mobilde tek kolonda çok uzun sayfa
2. **"En Popüler" ribbon** — `absolute -right-[30px]` rotated → parent `overflow-hidden` var ama küçük ekranlarda clip olabilir
3. **Karşılaştırma tablosu** — `overflow-x-auto` ile horizontal scroll → scroll affordance yok
4. **Pro modal** — `fixed inset-0` full screen, `max-w-lg` — mobilde OK ama close butonu kontrolü gerekli
5. **CTA butonları** fiyat kartlarında — mobilde yeterli touch target kontrolü gerekli

### Kabul Kriterleri

- [ ] Fiyat kartları: mobilde horizontal scroll/snap carousel veya tek kolonlu stack (mevcut stack OK; ama en popüler kart vurgulanarak üste taşınmalı)
- [ ] Ribbon: mobilde `overflow-hidden` border-radius ile kesilme kontrolü (visual QA)
- [ ] Karşılaştırma tablosu: ilk kolonu (özellik adı) `sticky left-0` yaparak scroll sırasında görünür kalmalı
- [ ] Scroll affordance: tablo container'ın sağ kenarında fade gradient
- [ ] Pro modal close butonu 44×44px
- [ ] CTA butonları mobilde `min-h-[48px]` `mobile-btn`
- [ ] Tablet bandında (768–1023px) 3 kolon fiyat kartları sıkışık olabilir — `md:grid-cols-2 lg:grid-cols-3` veya `grid-cols-1 md:grid-cols-3` doğrulanmalı

---

## INDEX 10 — Motor Açıklama Sayfası (Engines)

**Dosyalar:**
- `src/app/(panel)/engines/page.tsx`

### Mevcut Durum

2 engine kartı (AQE ve HAE) yan yana `sm:grid-cols-2`. Step list timeline. Dış link butonları.

### Tespit Edilen Sorunlar

1. **Mobile-only/desktop-only ayrımı yok** — tek responsive layout (bu sayfa için kabul edilebilir)
2. **Step indicator `h-8 w-8` (`text-[10px]`)** — çok küçük; step numarası zor okunuyor
3. **Dış link butonları** — `py-3 px-4` OK ama `hover:` efektleri mobilde çalışmaz
4. **Engine header'daki versiyon badge** — `text-[10px]` çok küçük

### Kabul Kriterleri

- [ ] Step indicator font size `text-xs` (12px) olarak güncellenmeli
- [ ] Dış link butonlarına `active:` state eklenmeli (mobilde hover yerine)
- [ ] Versiyon badge `text-[11px]` veya `text-xs`
- [ ] Engine kartları mobilde tam genişlik stack (zaten `sm:grid-cols-2` → mobilde tek kolon; doğrulanacak)
- [ ] Kartlar arası boşluk mobilde `gap-4` yeterli
- [ ] Step timeline connector line mobilde daha kalın olabilir (`w-px` → `w-0.5`) görünürlük için

---

## INDEX 11 — Onboarding

**Dosyalar:**
- `src/app/onboarding/page.tsx`

### Tespit Edilen Sorunlar (Genel)

Onboarding akışı yeni kullanıcıların ilk deneyimidir. Mobilde kusursuz olmalı.

### Kabul Kriterleri

- [ ] Tüm form adımları mobilde tek kolonlu
- [ ] İleri/Geri butonları `min-h-[48px]` `mobile-btn`
- [ ] Progress indicator mobilde görünür ve anlaşılır
- [ ] Keyboard açıldığında form içeriğinin view'dan kaybolmaması
- [ ] Input'lar `min-h-[48px]`
- [ ] Safe area padding uygulanmalı

---

## INDEX 12 — Auth (Login / Register / Verify)

**Dosyalar:**
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`
- `src/app/auth/verify/page.tsx`
- `src/components/auth/AuthLayout.tsx`

### Kabul Kriterleri

- [ ] Auth form'lar `max-w-md` ile centered, mobilde tam genişlik `px-4`
- [ ] Submit butonları `min-h-[48px]` `mobile-btn`
- [ ] Input'lar `min-h-[48px]`
- [ ] Password toggle ikonu 44×44px
- [ ] Error message'lar inline ve görünür
- [ ] Logo/branding üst kısımda mobilde daha kompakt (ama görünür)
- [ ] Keyboard açıldığında submit butonu erişilebilir (scroll veya sticky)
- [ ] Social login butonları (varsa) full-width ve 48px height

---

## Feature Parity Kontrol Listesi

Aşağıdaki özellikler web'de var ama mobilde eksik veya eksik olabilir. Her INDEX'te ilgili item kontrol edilmelidir.

| Özellik | Web | Mobil | İlgili INDEX | Öncelik |
|---------|-----|-------|-------------|---------|
| NotesCard (Notlarım) | Dashboard'da kart | Dashboard'da var ama altta | 1 | Orta |
| Calendar view (aylık takvim) | Appointments'ta grid | Sadece haftalık strip | 3 | Yüksek |
| "MindTest Gönder" butonu | Tests sayfasında ve Dashboard'da | Tests sayfasında **erişilemez** | 5 | Yüksek |
| Client quick actions (düzenle, sil, analiz gönder) | Clients listesinde row actions | Mobilde sadece navigate | 2 | Orta |
| Raporu Gör (SessionPreview) | Dashboard'da link | Dashboard'da eksik | 1 | Orta |
| Table view toggle (clients) | Grid/Row toggle | Sadece liste | 2 | Düşük |
| Notification full experience | Desktop dropdown | Mobilde aynı dropdown (taşma riski) | 0 | Yüksek |
| Settings sticky save | Form altında buton | Scroll gerekli | 8 | Orta |
| Analysis resend/preview | Tests listesinde butonlar | Mobilde eksik | 5 | Yüksek |

---

## Test Checklist (Her INDEX Tamamlandıktan Sonra)

Her INDEX tamamlandığında şu testler yapılmalıdır:

### Cihaz Boyutları
- [ ] iPhone SE (375×667) — en dar modern telefon
- [ ] iPhone 14/15 (390×844) — standart
- [ ] iPhone 14/15 Pro Max (430×932) — büyük telefon
- [ ] iPad Mini (768×1024) — tablet bandı alt sınırı
- [ ] iPad Pro 11" (834×1194) — tablet bandı
- [ ] Laptop (1280×800) — sidebar geçiş sınırı
- [ ] Desktop (1440×900) — standart

### Functional Tests
- [ ] Tüm butonlar/linkler tıklanabilir (özellikle 375px genişlikte)
- [ ] Modal'lar düzgün açılıp kapanıyor
- [ ] Formlar keyboard ile kullanılabilir
- [ ] Scroll sorunsuz çalışıyor (stuck yok)
- [ ] BottomNav hiçbir içerikle çakışmıyor
- [ ] FAB (varsa) BottomNav'ın üstünde
- [ ] Back navigation çalışıyor
- [ ] Loading state'ler görünüyor
- [ ] Empty state'ler görünüyor
- [ ] Error state'ler görünüyor

### Visual Tests
- [ ] Text hiçbir yerde kırpılmıyor (truncate kasıtlı yerler hariç)
- [ ] Kartlar viewport'tan taşmıyor
- [ ] Horizontal scroll (kasıtlı olmayan) yok
- [ ] Badge'ler okunabilir
- [ ] Contrast ratio WCAG AA (4.5:1 text, 3:1 large text)

---

## Öncelik Sıralaması

İyileştirmelerin önerilen uygulama sırası:

1. **INDEX 0** — Global Layout (tüm sayfaları etkiler)
2. **INDEX 1** — Dashboard (ilk açılan sayfa, en çok kullanılan)
3. **INDEX 3** — Randevular (günlük en çok kullanılan özellik)
4. **INDEX 2** — Danışanlar (ikinci en çok kullanılan)
5. **INDEX 5** — Analizler (core feature)
6. **INDEX 4** — Seans Paketleri (tek layout sorunları)
7. **INDEX 8** — Ayarlar (form UX)
8. **INDEX 6** — Danışan Detay
9. **INDEX 7** — Analiz Detay/Rapor
10. **INDEX 9** — Abonelik
11. **INDEX 10** — Motors
12. **INDEX 11** — Onboarding
13. **INDEX 12** — Auth

---

*Bu döküman codebase analizi sonucunda oluşturulmuştur. Her INDEX bağımsız olarak ele alınabilir. Kabul kriterleri checkbox formatındadır; tamamlanan item'lar işaretlenmelidir.*
