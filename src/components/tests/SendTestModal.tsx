"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addDays } from "date-fns";
import { useProContext } from "@/lib/context";
import { useClients } from "@/lib/hooks/useClients";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { sendTestNewClientSchema } from "@/lib/validations";
import { Send, Search, UserPlus, Users, Check, ChevronRight } from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { PRO_CONFIG } from "@/lib/constants";
import { clsx } from "clsx";
import { TestCreatingOverlay } from "@/components/tests/TestCreatingOverlay";

// 0/O ve 1/I gibi karıştırılan karakterler çıkarıldı → 32 karakter havuzu
// 8 hane = 32^8 ≈ 1 trilyon ihtimal
const TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateToken(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => TOKEN_CHARS[b % TOKEN_CHARS.length]).join("");
}

type SendStep = "client" | "confirm" | "creating" | "link_ready";
type ClientMode = "existing" | "new";

interface SendTestModalProps {
  open: boolean;
  onClose: () => void;
  onSent?: () => void;
}

export function SendTestModal({ open, onClose, onSent }: SendTestModalProps) {
  const router = useRouter();
  const { professional, creditBalance, refreshCredits } = useProContext();
  const { clients, refresh: refreshClients } = useClients();

  const [step, setStep] = useState<SendStep>("client");
  const [clientMode, setClientMode] = useState<ClientMode>("existing");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [sending, setSending] = useState(false);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const [generatedTestLink, setGeneratedTestLink] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const [newClientErrors, setNewClientErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
  }>({});

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = useMemo(
    () =>
      clients.filter((c) =>
        `${c.first_name} ${c.last_name}`
          .toLowerCase()
          .includes(clientSearch.toLowerCase())
      ),
    [clients, clientSearch]
  );

  const effectiveClientName =
    clientMode === "existing" && selectedClient
      ? { first: selectedClient.first_name, last: selectedClient.last_name }
      : { first: newFirstName, last: newLastName };

  function handleClose() {
    setStep("client");
    setClientMode("existing");
    setSelectedClientId("");
    setClientSearch("");
    setNewFirstName("");
    setNewLastName("");
    setNewEmail("");
    setNewClientId(null);
    setGeneratedTestLink(null);
    setGeneratedToken(null);
    setLinkCopied(false);
    setIdCopied(false);
    setNewClientErrors({});
    onClose();
  }

  async function copyLink() {
    if (!generatedTestLink) return;
    try {
      await navigator.clipboard.writeText(generatedTestLink);
      setLinkCopied(true);
      toast.success("Link kopyalandı!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Link kopyalanamadı");
    }
  }

  async function copyId() {
    if (!generatedToken) return;
    try {
      await navigator.clipboard.writeText(generatedToken);
      setIdCopied(true);
      toast.success("Test ID kopyalandı!");
      setTimeout(() => setIdCopied(false), 2000);
    } catch {
      toast.error("Test ID kopyalanamadı");
    }
  }

  async function handleSend() {
    if (!professional) return;

    const hasClient =
      clientMode === "existing"
        ? !!selectedClient
        : newFirstName.trim() && newLastName.trim();
    if (!hasClient) {
      toast.error("Lütfen bir danışan seçin veya yeni danışan bilgilerini doldurun");
      return;
    }

    if (clientMode === "new") {
      const parsed = sendTestNewClientSchema.safeParse({
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
      });

      if (!parsed.success) {
        const nextErrors: typeof newClientErrors = {};
        for (const issue of parsed.error.issues) {
          const path = issue.path[0];
          if (path === "first_name" || path === "last_name" || path === "email") {
            nextErrors[path] = issue.message;
          }
        }
        setNewClientErrors(nextErrors);
        toast.error("Lütfen danışan bilgilerini kontrol edin");
        return;
      }

      setNewClientErrors({});
    }

    if (creditBalance <= 0) {
      toast.error("Yeterli test krediniz yok");
      router.push("/billing");
      return;
    }

    // Animasyon ekranını hemen göster
    setStep("creating");
    setSending(true);

    const MIN_ANIMATION_MS = 5000;

    async function runApiCall() {
      const supabase = createSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let clientId: string;
      let firstName: string;
      let lastName: string;

      if (clientMode === "existing" && selectedClient) {
        clientId = selectedClient.id;
        firstName = selectedClient.first_name;
        lastName = selectedClient.last_name;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({
            professional_id: user!.id,
            first_name: newFirstName.trim(),
            last_name: newLastName.trim(),
            email: newEmail.trim() || null,
            status: "active",
          })
          .select()
          .single();

        if (clientError || !newClient) throw new Error("Danışan oluşturulamadı");

        clientId = newClient.id;
        firstName = newClient.first_name;
        lastName = newClient.last_name;
        setNewClientId(newClient.id);
      }

      const token = generateToken();
      const testLink = `${window.location.origin}/t/${token}`;

      const { error } = await supabase.from("test_invitations").insert({
        professional_id: user!.id,
        client_id: clientId,
        token,
        expires_at: addDays(new Date(), PRO_CONFIG.testExpiryDays).toISOString(),
      });

      if (error) throw new Error("Test oluşturulamadı");

      await supabase.from("credit_transactions").insert({
        professional_id: user!.id,
        invitation_id: null,
        amount: -1,
        balance_after: creditBalance - 1,
        type: "usage",
        description: `Test: ${firstName} ${lastName}`,
      });

      if (clientMode === "new") refreshClients();
      refreshCredits();
      onSent?.();

      return { token, testLink };
    }

    try {
      const [result] = await Promise.all([
        runApiCall(),
        new Promise<void>((resolve) => setTimeout(resolve, MIN_ANIMATION_MS)),
      ]);

      setGeneratedTestLink(result.testLink);
      setGeneratedToken(result.token);
      setStep("link_ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      setStep("confirm");
    } finally {
      setSending(false);
    }
  }

  const renderClientStep = () => (
    <div className="space-y-5">
      {/* Segment Control */}
      <div className="flex gap-1.5 p-1.5 bg-pro-surface-alt rounded-xl border border-pro-border/50">
        <button
          onClick={() => {
            setClientMode("existing");
            setSelectedClientId("");
            setNewClientErrors({});
          }}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            clientMode === "existing"
              ? "bg-pro-surface text-pro-text shadow-sm ring-1 ring-pro-border/60"
              : "text-pro-text-tertiary hover:text-pro-text-secondary"
          )}
        >
          <Users className="h-4 w-4" />
          Mevcut Danışan
        </button>
        <button
          onClick={() => setClientMode("new")}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            clientMode === "new"
              ? "bg-pro-surface text-pro-text shadow-sm ring-1 ring-pro-border/60"
              : "text-pro-text-tertiary hover:text-pro-text-secondary"
          )}
        >
          <UserPlus className="h-4 w-4" />
          Yeni Danışan
        </button>
      </div>

      {clientMode === "existing" ? (
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
            <input
              type="text"
              placeholder="Ad veya soyad ile arayın..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/20 focus:border-pro-primary transition-shadow"
            />
          </div>

          {/* Client List */}
          <div className="max-h-[280px] overflow-y-auto -mx-1 px-1 space-y-1">
            {filteredClients.map((c) => {
              const isSelected = selectedClientId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(isSelected ? "" : c.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-150 group",
                    isSelected
                      ? "bg-pro-primary/[0.07] ring-1 ring-pro-primary/20"
                      : "hover:bg-pro-surface-alt active:bg-pro-surface-alt"
                  )}
                >
                  <Avatar firstName={c.first_name} lastName={c.last_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pro-text truncate">
                      {c.first_name} {c.last_name}
                    </p>
                    {(c.email || c.phone) && (
                      <p className="text-xs text-pro-text-tertiary truncate">
                        {c.email || c.phone}
                      </p>
                    )}
                  </div>
                  {isSelected ? (
                    <div className="shrink-0 w-5 h-5 rounded-full bg-pro-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <ChevronRight className="shrink-0 w-4 h-4 text-pro-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}

            {/* Empty states */}
            {filteredClients.length === 0 && clientSearch.trim() && (
              <div className="text-center py-10 space-y-2">
                <Search className="w-8 h-8 text-pro-text-tertiary/40 mx-auto" />
                <p className="text-sm text-pro-text-tertiary">
                  &ldquo;{clientSearch}&rdquo; ile eşleşen danışan bulunamadı
                </p>
                <button
                  onClick={() => {
                    setClientMode("new");
                    setNewFirstName(clientSearch.split(" ")[0] || "");
                    setNewLastName(clientSearch.split(" ").slice(1).join(" ") || "");
                  }}
                  className="text-sm text-pro-primary font-medium hover:underline"
                >
                  Yeni danışan olarak ekle
                </button>
              </div>
            )}
            {filteredClients.length === 0 && !clientSearch.trim() && clients.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <Users className="w-8 h-8 text-pro-text-tertiary/40 mx-auto" />
                <p className="text-sm text-pro-text-tertiary">
                  Henüz danışan eklenmemiş
                </p>
                <button
                  onClick={() => setClientMode("new")}
                  className="text-sm text-pro-primary font-medium hover:underline"
                >
                  Yeni danışan ekle
                </button>
              </div>
            )}
          </div>

          {/* Sticky CTA for existing client selection */}
          {selectedClientId && (
            <div className="pt-2 border-t border-pro-border/50">
              <Button
                className="w-full"
                onClick={() => setStep("confirm")}
              >
                <span className="truncate">
                  {selectedClient?.first_name} {selectedClient?.last_name} ile devam et
                </span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-pro-text mb-1.5">Ad</label>
              <input
                type="text"
                value={newFirstName}
                maxLength={50}
                onChange={(e) => {
                  setNewFirstName(e.target.value);
                  setNewClientErrors((current) => ({ ...current, first_name: undefined }));
                }}
                placeholder="Danışan adı"
                className={clsx(
                  "w-full px-4 py-3 rounded-xl border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/20 focus:border-pro-primary transition-shadow",
                  newClientErrors.first_name ? "border-pro-danger" : "border-pro-border"
                )}
              />
              {newClientErrors.first_name && (
                <p className="mt-1 text-xs text-pro-danger">{newClientErrors.first_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-pro-text mb-1.5">Soyad</label>
              <input
                type="text"
                value={newLastName}
                maxLength={50}
                onChange={(e) => {
                  setNewLastName(e.target.value);
                  setNewClientErrors((current) => ({ ...current, last_name: undefined }));
                }}
                placeholder="Danışan soyadı"
                className={clsx(
                  "w-full px-4 py-3 rounded-xl border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/20 focus:border-pro-primary transition-shadow",
                  newClientErrors.last_name ? "border-pro-danger" : "border-pro-border"
                )}
              />
              {newClientErrors.last_name && (
                <p className="mt-1 text-xs text-pro-danger">{newClientErrors.last_name}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-pro-text mb-1.5">
              E-posta{" "}
              <span className="text-pro-text-tertiary font-normal">(isteğe bağlı)</span>
            </label>
            <input
              type="email"
              value={newEmail}
              maxLength={254}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setNewClientErrors((current) => ({ ...current, email: undefined }));
              }}
              placeholder="danisan@email.com"
              className={clsx(
                "w-full px-4 py-3 rounded-xl border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/20 focus:border-pro-primary transition-shadow",
                newClientErrors.email ? "border-pro-danger" : "border-pro-border"
              )}
            />
            {newClientErrors.email && (
              <p className="mt-1 text-xs text-pro-danger">{newClientErrors.email}</p>
            )}
          </div>
          <div className="pt-1">
            <Button
              className="w-full"
              onClick={() => setStep("confirm")}
              disabled={!newFirstName.trim() || !newLastName.trim()}
            >
              Devam Et
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-5">
      {/* Selected client card */}
      <div className="flex items-center gap-3.5 p-4 bg-pro-surface-alt rounded-xl border border-pro-border/40">
        <Avatar
          firstName={effectiveClientName.first}
          lastName={effectiveClientName.last}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-pro-text">
            {effectiveClientName.first} {effectiveClientName.last}
          </p>
          {clientMode === "new" ? (
            <p className="text-xs text-pro-primary/80 mt-0.5">
              Yeni danışan olarak eklenecek
            </p>
          ) : selectedClient?.email ? (
            <p className="text-xs text-pro-text-tertiary mt-0.5 truncate">
              {selectedClient.email}
            </p>
          ) : null}
        </div>
        <button
          onClick={() => setStep("client")}
          className="shrink-0 text-xs font-medium text-pro-primary hover:text-pro-primary-hover transition-colors px-3 py-1.5 rounded-lg hover:bg-pro-primary/[0.06]"
        >
          Değiştir
        </button>
      </div>

      {/* Info text */}
      <div className="flex items-start gap-3 px-1">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-pro-primary/[0.08] flex items-center justify-center mt-0.5">
          <Send className="w-4 h-4 text-pro-primary" />
        </div>
        <p className="text-sm text-pro-text-secondary leading-relaxed">
          Bu danışan için benzersiz bir test ID ve link oluşturulacak. 
          Linki istediğiniz yöntemle paylaşabilirsiniz.
        </p>
      </div>

      {/* Credit warning */}
      {creditBalance <= 0 && (
        <div className="flex items-start gap-3 p-4 bg-pro-danger/[0.06] rounded-xl border border-pro-danger/15">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-pro-danger/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-pro-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-pro-danger font-medium">Yeterli test krediniz yok</p>
            <p className="text-xs text-pro-danger/70 mt-0.5">
              Bakiye sayfasından paket satın alabilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* Credit badge */}
      {creditBalance > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-pro-surface-alt/60 rounded-xl">
          <span className="text-xs text-pro-text-tertiary">Kalan krediniz</span>
          <span className="text-sm font-semibold text-pro-text">{creditBalance} test</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button variant="secondary" className="flex-1" onClick={() => setStep("client")}>
          Geri
        </Button>
        <Button
          variant="blue"
          className="flex-1"
          onClick={handleSend}
          loading={sending}
          disabled={creditBalance <= 0}
        >
          <Send className="h-4 w-4" /> Test Oluştur
        </Button>
      </div>
    </div>
  );

  const renderLinkReadyStep = () => (
    <div className="space-y-5">
      {/* Success header */}
      <div className="text-center pt-2">
        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-4 ring-green-100/50">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-pro-text">Test Hazır!</h3>
        <p className="text-sm text-pro-text-secondary mt-1">
          <span className="font-medium text-pro-text">{effectiveClientName.first} {effectiveClientName.last}</span> için test oluşturuldu.
        </p>
      </div>

      {/* Credentials */}
      <div className="p-4 bg-pro-surface-alt/70 rounded-xl border border-pro-border/30 space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-pro-text-tertiary font-medium uppercase tracking-wider">
            Test ID
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedToken || ""}
              readOnly
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-pro-border bg-white text-sm text-pro-text font-mono tracking-wide select-all focus:outline-none focus:ring-2 focus:ring-pro-primary/20"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              variant={idCopied ? "accent" : "secondary"}
              size="sm"
              onClick={copyId}
              className="shrink-0"
            >
              {idCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Kopyala
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="border-t border-pro-border/30" />

        <div className="space-y-2">
          <p className="text-xs text-pro-text-tertiary font-medium uppercase tracking-wider">
            Test Linki
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedTestLink || ""}
              readOnly
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-pro-border bg-white text-sm text-pro-text font-mono select-all focus:outline-none focus:ring-2 focus:ring-pro-primary/20"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              variant={linkCopied ? "accent" : "secondary"}
              size="sm"
              onClick={copyLink}
              className="shrink-0"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Kopyala
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* New client notice */}
      {clientMode === "new" && newClientId && (
        <div className="flex items-start gap-3 p-4 bg-blue-50/80 border border-blue-200/50 rounded-xl">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-800">
              <strong>{effectiveClientName.first} {effectiveClientName.last}</strong> danışan listenize eklendi.
            </p>
            <button
              onClick={() => {
                handleClose();
                router.push(`/clients/${newClientId}`);
              }}
              className="text-sm text-blue-600 font-medium hover:underline mt-1 inline-flex items-center gap-1"
            >
              Detayları düzenle
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <Button className="w-full" onClick={handleClose}>
        Tamam
      </Button>
    </div>
  );

  if (!open) return null;

  return (
    <>
      <TestCreatingOverlay visible={step === "creating"} />
      
      {/* ============================================================
          DESKTOP VIEW - Centered Modal
          ============================================================ */}
      <div className="desktop-only">
        <Modal
          open={open}
          onClose={handleClose}
          title="Danışana Test Gönder"
          subtitle={
            step === "client"
              ? "Mevcut danışanlarınızdan seçin veya yeni danışan ekleyin."
              : step === "confirm"
                ? "Göndermeden önce bilgileri kontrol edin."
                : undefined
          }
          size="md"
        >
          {step === "client" && renderClientStep()}
          {step === "confirm" && renderConfirmStep()}
          {step === "link_ready" && generatedTestLink && generatedToken && renderLinkReadyStep()}
        </Modal>
      </div>

      {/* ============================================================
          MOBILE VIEW - Full Screen Modal
          ============================================================ */}
      <div className="mobile-only">
        <div className="mobile-modal pt-safe">
          {/* Mobile Header */}
          <div className="mobile-modal-header">
            <button
              onClick={handleClose}
              className="p-2 -ml-2 rounded-lg text-pro-text-tertiary active:bg-pro-surface-alt"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-pro-text">Danışana Test Gönder</h2>
              {step === "client" && (
                <p className="text-xs text-pro-text-tertiary mt-0.5">Danışan seçin veya yeni ekleyin</p>
              )}
            </div>
            <div className="w-10" />
          </div>

          {/* Mobile Content */}
          <div className="p-4 pb-safe">
            {step === "client" && renderClientStep()}
            {step === "confirm" && renderConfirmStep()}
            {step === "link_ready" && generatedTestLink && generatedToken && renderLinkReadyStep()}
          </div>
        </div>
      </div>
    </>
  );
}
