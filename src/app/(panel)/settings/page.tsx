"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useProContext } from "@/lib/context";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { SPECIALIZATIONS } from "@/lib/constants";
import { staggerContainer, cardReveal } from "@/lib/animations";
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export default function SettingsPage() {
  const { professional, loading, refreshProfile } = useProContext();

  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [specs, setSpecs] = useState<string[]>([]);

  useEffect(() => {
    if (professional) {
      setFirstName(professional.first_name || "");
      setLastName(professional.last_name || "");
      setPhone(professional.phone || "");
      setCity(professional.city || "");
      setDistrict(professional.district || "");
      setSpecs(professional.specializations || []);
    }
  }, [professional]);

  async function handleSave() {
    if (!professional) return;
    setSaving(true);
    try {
      const supabase = createSupabase();
      const { error } = await supabase
        .from("professionals")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          city,
          district,
          specializations: specs,
        })
        .eq("id", professional.id);

      if (error) {
        toast.error("Profil güncellenemedi");
        return;
      }

      toast.success("Profil güncellendi");
      refreshProfile();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    toast.info("Hesap silme işlemi için destek ile iletişime geçin: info@orbiralabs.com");
  }

  return (
    <>
      <TopBar title="Ayarlar" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {loading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-40 w-full" />
            </>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Profil Bilgileri */}
              <motion.div variants={cardReveal}>
                <Card padding="lg" variant="elevated">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-9 w-9 rounded-lg bg-pro-primary-light flex items-center justify-center">
                      <User className="h-4 w-4 text-pro-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-pro-text">
                        Profil Bilgileri
                      </h2>
                      <p className="text-xs text-pro-text-tertiary">Kişisel ve profesyonel bilgileriniz</p>
                    </div>
                  </div>

                  {/* Avatar section */}
                  <div className="flex items-center gap-4 p-4 bg-pro-surface-alt rounded-xl mb-6">
                    <Avatar
                      firstName={firstName}
                      lastName={lastName}
                      size="lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-pro-text">{firstName} {lastName}</p>
                      <p className="text-xs text-pro-text-tertiary">{professional?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Ad"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <Input
                        label="Soyad"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <Input
                      label="Telefon"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      hint="WhatsApp üzerinden analiz göndermek için"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="İl"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <Input
                        label="İlçe"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-pro-text">
                        Uzmanlık Alanları
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SPECIALIZATIONS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSpecs((prev) =>
                                prev.includes(s.id)
                                  ? prev.filter((x) => x !== s.id)
                                  : [...prev, s.id]
                              );
                            }}
                            className={clsx(
                              "rounded-full px-4 py-2 text-sm transition-all duration-200",
                              specs.includes(s.id)
                                ? "bg-pro-primary text-white shadow-sm"
                                : "bg-pro-surface-alt text-pro-text-secondary hover:bg-pro-border"
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSave} loading={saving} className="mt-2">
                      Değişiklikleri Kaydet
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Plan & Krediler */}
              <motion.div variants={cardReveal}>
                <Card padding="lg" variant="elevated">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-pro-accent-light flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-pro-accent" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-semibold text-pro-text">Plan & Krediler</h2>
                      <p className="text-xs text-pro-text-tertiary">Analiz kredilerinizi yönetin</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-pro-surface-alt rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-pro-text-secondary">Mevcut Bakiye</p>
                        <p className="text-2xl font-bold text-pro-text">
                          {/* Bu değer context'ten alınacak */}
                          — <span className="text-sm font-normal text-pro-text-tertiary">analiz kredisi</span>
                        </p>
                      </div>
                      <Link href="/billing">
                        <Button variant="accent" size="sm">
                          Kredi Al
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Gizlilik & Güvenlik */}
              <motion.div variants={cardReveal}>
                <Card padding="lg" variant="elevated">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-pro-success-light flex items-center justify-center">
                      <Shield className="h-4 w-4 text-pro-success" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-pro-text">Gizlilik & Güvenlik</h2>
                      <p className="text-xs text-pro-text-tertiary">Veri güvenliği ve yasal bilgiler</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link 
                      href="/privacy" 
                      target="_blank"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-pro-surface-alt transition-colors group"
                    >
                      <span className="text-sm text-pro-text-secondary group-hover:text-pro-text">Gizlilik Politikası</span>
                      <ExternalLink className="h-4 w-4 text-pro-text-tertiary" />
                    </Link>
                    <Link 
                      href="/terms" 
                      target="_blank"
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-pro-surface-alt transition-colors group"
                    >
                      <span className="text-sm text-pro-text-secondary group-hover:text-pro-text">Kullanım Koşulları</span>
                      <ExternalLink className="h-4 w-4 text-pro-text-tertiary" />
                    </Link>
                    <div className="p-3 rounded-xl bg-pro-info-light/50 border border-pro-info/10">
                      <p className="text-xs text-pro-info">
                        Verileriniz KVKK uyumlu şekilde şifrelenerek Türkiye'de saklanır.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Hesap */}
              <motion.div variants={cardReveal}>
                <Card padding="lg">
                  <h2 className="text-base font-semibold text-pro-text mb-2">
                    Hesap
                  </h2>
                  <p className="text-sm text-pro-text-secondary mb-4">
                    {professional?.email}
                  </p>
                  <div className="pt-4 border-t border-pro-border">
                    <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                      Hesabı Sil
                    </Button>
                    <p className="text-xs text-pro-text-tertiary mt-2">
                      KVKK kapsamında hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
