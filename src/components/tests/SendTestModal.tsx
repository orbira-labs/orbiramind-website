"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { addDays } from "date-fns";
import { useProContext } from "@/lib/context";
import { useClients } from "@/lib/hooks/useClients";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Send,
  Search,
  MessageCircle,
  Mail,
  UserPlus,
  Users,
  Check,
} from "lucide-react";
import { createClient as createSupabase } from "@/lib/supabase/client";
import { generateWhatsAppLink, buildTestMessage } from "@/lib/utils";
import { PRO_CONFIG } from "@/lib/constants";
import { clsx } from "clsx";

type SendStep = "client" | "method" | "link_ready";
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
  const [sendVia, setSendVia] = useState<"email" | "whatsapp">("email");
  const [clientSearch, setClientSearch] = useState("");
  const [sending, setSending] = useState(false);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const [generatedTestLink, setGeneratedTestLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

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

  const effectiveClientEmail =
    clientMode === "existing" && selectedClient
      ? selectedClient.email
      : newEmail.trim() || null;

  function handleClose() {
    setStep("client");
    setClientMode("existing");
    setSelectedClientId("");
    setSendVia("email");
    setClientSearch("");
    setNewFirstName("");
    setNewLastName("");
    setNewEmail("");
    setNewClientId(null);
    setGeneratedTestLink(null);
    setLinkCopied(false);
    onClose();
  }

  async function copyTestLink() {
    if (!generatedTestLink) return;
    await navigator.clipboard.writeText(generatedTestLink);
    setLinkCopied(true);
    toast.success("Link kopyalandı!");
    setTimeout(() => setLinkCopied(false), 2000);
  }

  async function handleSend() {
    if (!professional) return;

    const hasClient =
      clientMode === "existing"
        ? !!selectedClient
        : newFirstName.trim() && newLastName.trim();
    if (!hasClient) return;

    if (creditBalance <= 0) {
      toast.error("Yeterli test krediniz yok");
      router.push("/billing");
      return;
    }

    setSending(true);
    try {
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

        if (clientError || !newClient) {
          toast.error("Danışan oluşturulamadı");
          setSending(false);
          return;
        }

        clientId = newClient.id;
        firstName = newClient.first_name;
        lastName = newClient.last_name;
        setNewClientId(newClient.id);
      }

      const token = nanoid(12);
      const testLink = `${window.location.origin}/t/${token}`;
      const message = buildTestMessage(
        firstName,
        `${professional.first_name} ${professional.last_name}`,
        testLink
      );

      const { error } = await supabase.from("test_invitations").insert({
        professional_id: user!.id,
        client_id: clientId,
        token,
        sent_via: sendVia,
        message_text: message,
        expires_at: addDays(new Date(), PRO_CONFIG.testExpiryDays).toISOString(),
      });

      if (error) {
        toast.error("Test gönderilemedi");
        return;
      }

      await supabase.from("credit_transactions").insert({
        professional_id: user!.id,
        invitation_id: null,
        amount: -1,
        balance_after: creditBalance - 1,
        type: "usage",
        description: `Test: ${firstName} ${lastName}`,
      });

      setGeneratedTestLink(testLink);
      setStep("link_ready");

      if (sendVia === "whatsapp") {
        window.open(generateWhatsAppLink("", message), "_blank");
      }

      if (clientMode === "new") {
        refreshClients();
      }

      refreshCredits();
      onSent?.();
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Test Gönder" size="md">
      {step === "client" && (
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-pro-surface-alt rounded-lg">
            <button
              onClick={() => setClientMode("existing")}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                clientMode === "existing"
                  ? "bg-pro-surface text-pro-text shadow-sm"
                  : "text-pro-text-secondary hover:text-pro-text"
              )}
            >
              <Users className="h-4 w-4" />
              Mevcut Danışan
            </button>
            <button
              onClick={() => setClientMode("new")}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                clientMode === "new"
                  ? "bg-pro-surface text-pro-text shadow-sm"
                  : "text-pro-text-secondary hover:text-pro-text"
              )}
            >
              <UserPlus className="h-4 w-4" />
              Yeni İsim
            </button>
          </div>

          {clientMode === "existing" ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pro-text-tertiary" />
                <input
                  type="text"
                  placeholder="Danışan ara..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredClients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedClientId(c.id);
                      setStep("method");
                    }}
                    className={clsx(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      selectedClientId === c.id
                        ? "bg-pro-primary-light"
                        : "hover:bg-pro-surface-alt"
                    )}
                  >
                    <Avatar firstName={c.first_name} lastName={c.last_name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-pro-text">
                        {c.first_name} {c.last_name}
                      </p>
                      <p className="text-xs text-pro-text-tertiary">
                        {c.email || c.phone || ""}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredClients.length === 0 && (
                  <p className="text-sm text-pro-text-tertiary text-center py-8">
                    Danışan bulunamadı
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-pro-text mb-1.5">Ad</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="Danışan adı"
                    className="w-full px-4 py-2.5 rounded-lg border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pro-text mb-1.5">Soyad</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="Danışan soyadı"
                    className="w-full px-4 py-2.5 rounded-lg border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pro-text mb-1.5">
                  E-posta{" "}
                  <span className="text-pro-text-tertiary font-normal">
                    (email ile göndermek için)
                  </span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="danisan@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-pro-border bg-pro-surface text-sm text-pro-text placeholder:text-pro-text-tertiary focus:outline-none focus:ring-2 focus:ring-pro-primary/30 focus:border-pro-primary"
                />
              </div>
              <Button
                className="w-full mt-2"
                onClick={() => setStep("method")}
                disabled={!newFirstName.trim() || !newLastName.trim()}
              >
                Devam Et
              </Button>
            </div>
          )}
        </div>
      )}

      {step === "method" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-pro-surface-alt rounded-lg">
            <Avatar
              firstName={effectiveClientName.first}
              lastName={effectiveClientName.last}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-pro-text">
                {effectiveClientName.first} {effectiveClientName.last}
              </p>
              {clientMode === "new" && (
                <p className="text-xs text-pro-text-tertiary">
                  Yeni danışan olarak eklenecek
                </p>
              )}
            </div>
            <button
              onClick={() => setStep("client")}
              className="ml-auto text-xs text-pro-primary hover:underline"
            >
              Değiştir
            </button>
          </div>

          <p className="text-sm font-medium text-pro-text">Gönderim Yöntemi</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSendVia("email")}
              className={clsx(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors",
                sendVia === "email"
                  ? "border-pro-primary bg-pro-primary-light"
                  : "border-pro-border hover:border-pro-border-strong"
              )}
            >
              <Mail
                className={clsx(
                  "h-6 w-6",
                  sendVia === "email" ? "text-pro-primary" : "text-pro-text-tertiary"
                )}
              />
              <span className="text-sm font-medium text-pro-text">Email</span>
            </button>
            <button
              onClick={() => setSendVia("whatsapp")}
              className={clsx(
                "flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors",
                sendVia === "whatsapp"
                  ? "border-pro-primary bg-pro-primary-light"
                  : "border-pro-border hover:border-pro-border-strong"
              )}
            >
              <MessageCircle
                className={clsx(
                  "h-6 w-6",
                  sendVia === "whatsapp" ? "text-pro-primary" : "text-pro-text-tertiary"
                )}
              />
              <span className="text-sm font-medium text-pro-text">WhatsApp</span>
            </button>
          </div>

          {sendVia === "email" && !effectiveClientEmail && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">Email adresi yok</p>
              <p className="text-xs text-amber-700/80 mt-1">
                Test linki clipboard&apos;a kopyalanacak. Manuel olarak göndermeniz gerekecek.
              </p>
            </div>
          )}

          {creditBalance <= 0 && (
            <div className="p-3 bg-pro-danger-light rounded-lg">
              <p className="text-sm text-pro-danger font-medium">Yeterli test krediniz yok</p>
              <p className="text-xs text-pro-danger/70 mt-1">
                Bakiye sayfasından paket satın alabilirsiniz
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
              <Send className="h-4 w-4" /> Gönder
            </Button>
          </div>
        </div>
      )}

      {step === "link_ready" && generatedTestLink && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-pro-text">Test Hazır!</h3>
            <p className="text-sm text-pro-text-secondary mt-1">
              {effectiveClientName.first} {effectiveClientName.last} için test linki
              oluşturuldu.
            </p>
          </div>

          <div className="p-4 bg-pro-surface-alt rounded-xl space-y-3">
            <p className="text-xs text-pro-text-tertiary font-medium uppercase tracking-wide">
              Test Linki
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={generatedTestLink}
                readOnly
                className="flex-1 px-3 py-2.5 rounded-lg border border-pro-border bg-white text-sm text-pro-text font-mono select-all"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant={linkCopied ? "accent" : "secondary"}
                size="sm"
                onClick={copyTestLink}
                className="shrink-0"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Kopyala
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-pro-text-tertiary">
              Bu linki danışanınıza WhatsApp, SMS veya başka bir yolla gönderebilirsiniz.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                if (!generatedTestLink) return;
                const msg = buildTestMessage(
                  effectiveClientName.first,
                  `${professional?.first_name} ${professional?.last_name}`,
                  generatedTestLink
                );
                window.open(generateWhatsAppLink("", msg), "_blank");
              }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp ile Gönder
            </Button>
          </div>

          {clientMode === "new" && newClientId && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>
                  {effectiveClientName.first} {effectiveClientName.last}
                </strong>{" "}
                danışan listenize eklendi.
              </p>
              <button
                onClick={() => {
                  handleClose();
                  router.push(`/clients/${newClientId}`);
                }}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Detayları düzenle →
              </button>
            </div>
          )}

          <Button className="w-full" onClick={handleClose}>
            Tamam
          </Button>
        </div>
      )}
    </Modal>
  );
}
