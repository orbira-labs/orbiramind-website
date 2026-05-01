import { NextResponse } from "next/server";
import { authorizeEngineRequest } from "@/lib/engine-auth";

export const runtime = "nodejs";

const ENGINE_API_URL = process.env.ENGINE_API_URL;
const ENGINE_API_KEY = process.env.ENGINE_API_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  const auth = await authorizeEngineRequest(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    if (!ENGINE_API_URL || !ENGINE_API_KEY) {
      console.error("Missing ENGINE_API_URL or ENGINE_API_KEY");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { session_id, profile, core_answers } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    // QUESTION_SET_OUTDATED tespiti için client'ın elindeki versiyon header'ı
    // backend'e iletilir (Faz 4.3).
    const fwdHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "x-api-key": ENGINE_API_KEY,
    };
    const clientQuestionSetVersion = request.headers.get("if-question-set-version");
    if (clientQuestionSetVersion) {
      fwdHeaders["if-question-set-version"] = clientQuestionSetVersion;
    }

    const response = await fetch(`${ENGINE_API_URL}/v1/sessions/${session_id}/answers`, {
      method: "POST",
      headers: fwdHeaders,
      body: JSON.stringify({ profile, core_answers }),
    });

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      console.error("Engine answers: yanıt JSON parse edilemedi, status:", response.status);
      return NextResponse.json(
        { error: "Engine servisinden geçersiz yanıt alındı" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Engine answers API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
