import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTestInvitationPayload {
  invitationId: string;
  clientEmail: string;
  clientName: string;
  professionalName: string;
  testLink: string;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "RESEND_API_KEY tanımlı değil" },
        { status: 500 }
      );
    }

    const body: SendTestInvitationPayload = await request.json();

    if (!body.clientEmail || !body.testLink) {
      return NextResponse.json(
        { error: "Email ve test linki gerekli" },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Karakter Analizi <onboarding@resend.dev>",
      to: body.clientEmail,
      subject: `${body.professionalName} size bir Karakter Analizi gönderdi`,
      text: `
Merhaba ${body.clientName},

${body.professionalName} size bir Karakter Analizi testi gönderdi.

Testi tamamlamak için aşağıdaki linke tıklayın:
${body.testLink}

Bu link 7 gün geçerlidir.

Test yaklaşık 10-15 dakika sürmektedir. Lütfen sessiz bir ortamda, dikkatinizi verebileceğiniz bir zamanda tamamlayın.

İyi analizler!

---
Bu e-posta Orbira Labs Karakter Analizi sistemi tarafından otomatik olarak gönderilmiştir.
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f9f7; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto;">
    
    <div style="background: linear-gradient(135deg, #5B7B6A 0%, #4A6A59 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px; font-weight: 600;">Karakter Analizi</h1>
      <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">Kişisel gelişim yolculuğunuz başlıyor</p>
    </div>

    <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      
      <p style="font-size: 16px; color: #1a1a1a; margin: 0 0 20px;">
        Merhaba <strong>${body.clientName}</strong>,
      </p>
      
      <p style="font-size: 15px; color: #4a4a4a; line-height: 1.6; margin: 0 0 24px;">
        <strong>${body.professionalName}</strong> size bir Karakter Analizi testi gönderdi. Bu test, kişilik özelliklerinizi ve gelişim alanlarınızı keşfetmenize yardımcı olacak.
      </p>

      <div style="background: #f8faf9; border: 1px solid #e0e8e4; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 13px; color: #6b7280;">⏱️ Süre: ~10-15 dakika</span>
        </div>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 13px; color: #6b7280;">📅 Geçerlilik: 7 gün</span>
        </div>
      </div>

      <a href="${body.testLink}" style="display: block; background: linear-gradient(135deg, #5B7B6A 0%, #4A6A59 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 0 24px;">
        Testi Başlat →
      </a>

      <p style="font-size: 13px; color: #9ca3af; line-height: 1.6; margin: 0;">
        Buton çalışmıyorsa bu linki tarayıcınıza kopyalayın:<br>
        <a href="${body.testLink}" style="color: #5B7B6A; word-break: break-all;">${body.testLink}</a>
      </p>
    </div>

    <p style="text-align: center; font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
      Bu e-posta Orbira Labs tarafından otomatik olarak gönderilmiştir.
    </p>
  </div>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Email gönderilemedi: " + (error as Error).message },
        { status: 500 }
      );
    }

    if (body.invitationId) {
      await supabase
        .from("test_invitations")
        .update({ sent_via: "email" })
        .eq("id", body.invitationId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Beklenmeyen hata" },
      { status: 500 }
    );
  }
}
