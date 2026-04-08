# OrbiraMind - Google & Instagram Reklam Hazırlık Checklist

**Site:** https://orbiramind.com  
**Tarih:** 8 Nisan 2026

---

## BÖLÜM 1: GOOGLE SEARCH CONSOLE KURULUMU

### Adım 1.1: DNS Doğrulama
- [ ] https://search.google.com/search-console adresine git
- [ ] "Özellik Ekle" → "Domain" → `orbiramind.com` yaz
- [ ] Google'ın verdiği TXT kaydını kopyala
- [ ] GoDaddy DNS ayarlarına TXT kaydı ekle (OrbiWeb'deki gibi)
- [ ] "Doğrulamayı Başlat" tıkla

### Adım 1.2: Sitemap Gönderme
- [ ] Search Console açıldıktan sonra "Site Haritaları" tıkla
- [ ] `sitemap.xml` ekle ve gönder
- [ ] Durum: "Başarılı" olmasını bekle

---

## BÖLÜM 2: SITE TEKNİK KONTROL

### Adım 2.1: Deploy Et
```bash
cd /Users/dilaraaycinakyel/dev/orbiramind-website
git add .
git commit -m "SEO: Landing page, sitemap, robots eklendi"
git push
```

### Adım 2.2: Canlı Site Kontrolü (Deploy sonrası)
- [ ] https://orbiramind.com açılıyor mu? (landing page)
- [ ] https://orbiramind.com/sitemap.xml erişilebilir mi?
- [ ] https://orbiramind.com/robots.txt erişilebilir mi?

### Adım 2.3: Yasal Sayfalar Kontrolü
- [ ] https://orbiramind.com/privacy erişilebilir ✅
- [ ] https://orbiramind.com/terms erişilebilir ✅

---

## BÖLÜM 3: META (INSTAGRAM/FACEBOOK) REKLAM HAZIRLIĞI

### Adım 3.1: Meta Business Hesabı
- [ ] OrbiWeb için kullandığın hesabı kullanabilirsin
- [ ] Veya ayrı bir "OrbiraMind" sayfası oluştur

### Adım 3.2: Instagram Hesabı
- [ ] @orbiramind Instagram hesabı var mı?
- [ ] Yoksa oluştur ve Meta Business'a bağla

---

## BÖLÜM 4: REKLAM İÇERİK KURALLARI (META 2026 POLİTİKALARI)

### Adım 4.1: Yasak İfadeler - KULLANMA

| ❌ YASAK | Neden |
|----------|-------|
| "Psikolojik sorunlarınız mı var?" | Sağlık durumu ima ediyor |
| "Depresyonda mısınız?" | Kişisel sağlık sorusu |
| "Danışanlarınız sizi terk mi ediyor?" | Olumsuz durum ima ediyor |
| "Rakiplerinizden geri mi kalıyorsunuz?" | Korku pazarlaması |

### Adım 4.2: Onaylanan İfadeler - KULLANABİLİRSİN

| ✅ ONAYLANIR | Açıklama |
|--------------|----------|
| "Psikologlar için danışan yönetim platformu" | Genel fayda |
| "Kişilik analizi araçları" | Özellik odaklı |
| "Danışan takibini kolaylaştırın" | Fayda odaklı |
| "Bilimsel temelli analiz motorları" | Özellik odaklı |
| "KVKK uyumlu, güvenli platform" | Güvenlik vurgusu |
| "Ücretsiz deneyin" | Eylem çağrısı |

### Adım 4.3: Önemli Notlar (Sağlık/Psikoloji Reklamları)
- Tıbbi tanı iddiası yapma
- "Tedavi" kelimesini kullanma
- Belirli hastalıklardan bahsetme
- "Sonuç garantisi" verme

---

## BÖLÜM 5: REKLAM OLUŞTURMA

### Adım 5.1: Hedef Kitle Önerileri
- **Meslek:** Psikolog, Yaşam Koçu, Terapist, Danışman
- **İlgi Alanları:** Psikoloji, Terapi, Koçluk, Kişisel Gelişim
- **Yaş:** 28-55
- **Konum:** Türkiye (büyük şehirler)

### Adım 5.2: Reklam Metni Örnekleri

**Örnek 1:**
> Psikologlar için tasarlandı. Danışan yönetimi, kişilik analizi ve randevu takibi tek platformda. Ücretsiz deneyin.

**Örnek 2:**
> Danışanlarınızı daha iyi anlayın. OrbiraMind ile bilimsel kişilik analizi ve profesyonel danışan yönetimi.

**Örnek 3:**
> KVKK uyumlu, güvenli danışan yönetim platformu. Psikologlar ve koçlar için özel tasarlandı.

### Adım 5.3: Landing Page
- [ ] URL: https://orbiramind.com (yeni landing page)
- [ ] Veya: https://orbiramind.com/auth/register (direkt kayıt)

---

## BÖLÜM 6: REKLAM SONRASI TAKİP

### Günlük Kontrol
- [ ] Reklam onaylandı mı?
- [ ] Gösterim alıyor mu?
- [ ] Kayıt (conversion) geliyor mu?

### Haftalık Kontrol
- [ ] Kayıt maliyeti (CPA) makul mü?
- [ ] Hangi reklam metni daha iyi performans gösteriyor?
- [ ] Google Search Console'da indexleme durumu

---

## HIZLI REFERANS

### Site Linkleri
| Sayfa | URL |
|-------|-----|
| Ana Sayfa (Landing) | https://orbiramind.com |
| Giriş | https://orbiramind.com/auth/login |
| Kayıt | https://orbiramind.com/auth/register |
| Gizlilik | https://orbiramind.com/privacy |
| Kullanım Koşulları | https://orbiramind.com/terms |
| Sitemap | https://orbiramind.com/sitemap.xml |
| Robots | https://orbiramind.com/robots.txt |

### İletişim
- Email: info@orbiralabs.com

---

## YAPILAN DEĞİŞİKLİKLER (8 Nisan 2026)

1. ✅ Landing page eklendi (ana sayfa artık tanıtım sayfası)
2. ✅ SEO metadata güçlendirildi (title, description, keywords)
3. ✅ robots.ts oluşturuldu (panel sayfaları engellendi)
4. ✅ sitemap.ts oluşturuldu (public sayfalar eklendi)
5. ✅ Google indexleme açıldı (robots: index true)

---

**Son Güncelleme:** 8 Nisan 2026
