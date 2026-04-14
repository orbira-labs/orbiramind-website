import { after, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ENGINE_API_URL = process.env.ENGINE_API_URL;
const ENGINE_API_KEY = process.env.ENGINE_API_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type InvitationStatus =
  | "processing"
  | "completed"
  | "error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function updateInvitationStatus(
  supabase: SupabaseClient,
  {
    token,
    status,
    sessionId,
    resultsSnapshot,
  }: {
    token: string;
    status: InvitationStatus;
    sessionId?: string;
    resultsSnapshot?: Record<string, unknown>;
  }
) {
  const updateData: Record<string, unknown> = { status };

  if (status === "processing" && sessionId) {
    updateData.session_id = sessionId;
  }

  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
    if (resultsSnapshot) {
      updateData.results_snapshot = resultsSnapshot;
    }
  }

  if (status === "error") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("test_invitations")
    .update(updateData)
    .eq("token", token);

  if (error) {
    throw new Error(`Invitation update failed: ${error.message}`);
  }
}

async function runBackgroundCompletion({
  token,
  sessionId,
  deepDiveAnswers,
}: {
  token: string;
  sessionId: string;
  deepDiveAnswers: Record<string, number>;
}) {
  const supabase = await createClient();

  try {
    if (!ENGINE_API_URL || !ENGINE_API_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Missing engine configuration");
    }

    const response = await fetch(`${ENGINE_API_URL}/v1/sessions/${sessionId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "x-api-key": ENGINE_API_KEY,
      },
      body: JSON.stringify({ deep_dive_answers: deepDiveAnswers }),
    });

    let rawData: unknown;
    try {
      rawData = await response.json();
    } catch {
      throw new Error(`Engine returned invalid JSON (status: ${response.status})`);
    }

    if (!response.ok) {
      const message =
        isRecord(rawData) && "error" in rawData
          ? JSON.stringify(rawData.error)
          : "Engine completion failed";
      throw new Error(message);
    }

    const payload =
      isRecord(rawData) && isRecord(rawData.data)
        ? rawData.data
        : rawData;

    const resultsSnapshot =
      isRecord(payload) && isRecord(payload.results)
        ? payload.results
        : undefined;

    await updateInvitationStatus(supabase, {
      token,
      status: "completed",
      resultsSnapshot,
    });
  } catch (error) {
    console.error("Background test completion failed:", error);

    try {
      await updateInvitationStatus(supabase, {
        token,
        status: "error",
      });
    } catch (statusError) {
      console.error("Failed to mark invitation as error:", statusError);
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, session_id, deep_dive_answers } = body ?? {};

    if (!token || !session_id) {
      return NextResponse.json(
        { error: "token and session_id are required" },
        { status: 400 }
      );
    }

    if (!isRecord(deep_dive_answers)) {
      return NextResponse.json(
        { error: "deep_dive_answers must be an object" },
        { status: 400 }
      );
    }

    const normalizedToken = String(token).toUpperCase();
    const sessionId = String(session_id);
    const deepDiveAnswersEntries = Object.entries(deep_dive_answers).map(
      ([key, value]) => [key, Number(value)] as const
    );

    if (deepDiveAnswersEntries.some(([, value]) => !Number.isFinite(value))) {
      return NextResponse.json(
        { error: "deep_dive_answers contains invalid values" },
        { status: 400 }
      );
    }

    const deepDiveAnswers = Object.fromEntries(deepDiveAnswersEntries);

    const supabase = await createClient();
    const { data: invitation, error } = await supabase
      .from("test_invitations")
      .select("status, expires_at")
      .eq("token", normalizedToken)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Test invitation fetch failed:", error);
      return NextResponse.json(
        { error: "Test invitation could not be verified" },
        { status: 500 }
      );
    }

    if (!invitation) {
      return NextResponse.json(
        { error: "Test invitation not found" },
        { status: 404 }
      );
    }

    if (invitation.status === "completed" || invitation.status === "reviewed") {
      return NextResponse.json({ success: true, status: "completed" });
    }

    if (invitation.status === "processing") {
      return NextResponse.json({ success: true, status: "processing" });
    }

    if (
      invitation.status === "expired" ||
      new Date(invitation.expires_at) <= new Date()
    ) {
      return NextResponse.json(
        { error: "Test invitation has expired" },
        { status: 410 }
      );
    }

    await updateInvitationStatus(supabase, {
      token: normalizedToken,
      status: "processing",
      sessionId,
    });

    after(async () => {
      await runBackgroundCompletion({
        token: normalizedToken,
        sessionId,
        deepDiveAnswers,
      });
    });

    return NextResponse.json({ success: true, status: "processing" });
  } catch (error) {
    console.error("Test completion queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
