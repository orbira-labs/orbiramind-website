import { after, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

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

function isValidReport(report: unknown): boolean {
  if (!isRecord(report)) return false;
  if ("error" in report) return false;
  // Accept either the new format (therapeutic_tasks) or the legacy
  // format (coaching_roadmap) as proof that the report finished.
  const hasActionPlan =
    Array.isArray(report.therapeutic_tasks) || isRecord(report.coaching_roadmap);
  return (
    typeof report.character_analysis === "string" &&
    isRecord(report.top5_and_weak5) &&
    hasActionPlan
  );
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
    if (resultsSnapshot) {
      updateData.results_snapshot = resultsSnapshot;
    }
  }

  const { error } = await supabase
    .from("test_invitations")
    .update(updateData)
    .eq("token", token);

  if (error) {
    throw new Error(`Invitation update failed: ${error.message}`);
  }
}

const REPORT_POLL_INTERVAL_MS = 4_000;
const REPORT_POLL_MAX_ATTEMPTS = 45; // ~3 min max wait

function getReportStatus(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  if (typeof payload.report_status === "string") return payload.report_status;
  const results = payload.results;
  if (isRecord(results) && isRecord(results.metadata)) {
    return typeof results.metadata.report_status === "string"
      ? results.metadata.report_status
      : undefined;
  }
  return undefined;
}

async function pollForReport(sessionId: string): Promise<Record<string, unknown> | undefined> {
  for (let attempt = 0; attempt < REPORT_POLL_MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, REPORT_POLL_INTERVAL_MS));

    const res = await fetch(`${ENGINE_API_URL}/v1/sessions/${sessionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "x-api-key": ENGINE_API_KEY!,
      },
    });

    if (!res.ok) {
      console.warn(`[report-poll] GET session ${sessionId} returned ${res.status}, attempt ${attempt + 1}`);
      continue;
    }

    const body: unknown = await res.json().catch(() => null);
    const data = isRecord(body) && isRecord((body as Record<string, unknown>).data)
      ? (body as Record<string, unknown>).data as Record<string, unknown>
      : body;

    const status = getReportStatus(data);

    if (status === "ready") {
      const results = isRecord(data) && isRecord(data.results)
        ? data.results as Record<string, unknown>
        : undefined;
      console.log(`[report-poll] Report ready for session ${sessionId} after ${attempt + 1} polls`);
      return results;
    }

    if (status === "failed") {
      console.error(`[report-poll] Report failed for session ${sessionId} after ${attempt + 1} polls`);
      return undefined;
    }
  }

  console.error(`[report-poll] Timed out waiting for report on session ${sessionId}`);
  return undefined;
}

async function runBackgroundCompletion({
  token,
  sessionId,
  deepDiveAnswers,
}: {
  token: string;
  sessionId: string;
  deepDiveAnswers: Record<string, number | string | string[]>;
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

    let payload =
      isRecord(rawData) && isRecord(rawData.data)
        ? rawData.data
        : rawData;

    let resultsSnapshot =
      isRecord(payload) && isRecord(payload.results)
        ? (payload.results as Record<string, unknown>)
        : undefined;

    const reportStatus = getReportStatus(payload);

    if (reportStatus === "pending") {
      console.log(`[test-complete] Report pending for session ${sessionId}, starting poll...`);
      const polledResults = await pollForReport(sessionId);
      if (polledResults) {
        resultsSnapshot = polledResults;
      }
    }

    // Engine artık AI raporu kapalıyken "disabled" ya da HAE çalışmadığında
    // "skipped" döndürüyor. Bu durumlarda temel analiz (AQE skorları, HAE
    // trait'leri) yine tamamlanmış sayılır — completed işaretlenmeli.
    const analysisOnly = reportStatus === "disabled" || reportStatus === "skipped";

    const report = isRecord(resultsSnapshot) ? resultsSnapshot.report : undefined;
    const reportIsValid = isValidReport(report);

    if (!resultsSnapshot) {
      console.error(`[test-complete] Empty results snapshot for session ${sessionId}`);
      await updateInvitationStatus(supabase, {
        token,
        status: "error",
      });
      return;
    }

    if (!analysisOnly && !reportIsValid) {
      const reportError =
        isRecord(report) && typeof report.error === "string"
          ? report.error
          : "Report generation returned incomplete data";
      console.error(
        `[test-complete] Invalid report for session ${sessionId} (report_status=${reportStatus ?? "unknown"}):`,
        reportError
      );

      await updateInvitationStatus(supabase, {
        token,
        status: "error",
        resultsSnapshot,
      });
      return;
    }

    if (analysisOnly) {
      console.log(
        `[test-complete] Session ${sessionId} completed without AI report (report_status=${reportStatus}). Marking as completed.`
      );
    }

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
    
    // Validate deep_dive_answers - accept number, string, or string[] values
    const deepDiveAnswers: Record<string, number | string | string[]> = {};
    for (const [key, value] of Object.entries(deep_dive_answers)) {
      if (typeof value === "number") {
        if (!Number.isFinite(value)) {
          return NextResponse.json(
            { error: `deep_dive_answers["${key}"] contains invalid number` },
            { status: 400 }
          );
        }
        deepDiveAnswers[key] = value;
      } else if (typeof value === "string") {
        deepDiveAnswers[key] = value;
      } else if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
        deepDiveAnswers[key] = value as string[];
      } else {
        return NextResponse.json(
          { error: `deep_dive_answers["${key}"] has invalid type` },
          { status: 400 }
        );
      }
    }

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
