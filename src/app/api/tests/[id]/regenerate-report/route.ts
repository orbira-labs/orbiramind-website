import { after, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Regenerate AI report for a completed test invitation.
 *
 * Why this exists: production'da bir donemde orbiramind website yanlis API
 * key (Moodumuz consumer preset) ile calisiyordu → backend AI rapor
 * uretmiyordu (`generate_ai_report=false`). Bu pencerede tamamlanan testlerin
 * `results_snapshot.report` alanı yok. Terapist panel "Rapor verileri eksik"
 * gosteriyor.
 *
 * Bu endpoint backend'in `/v1/sessions/:id/regenerate-report` endpoint'ine
 * dispatch yapip arka planda raporu poll eder, gelince test_invitations
 * tablosunu gunceller. Frontend "Uretiliyor..." gosterir; refresh ile sonuc
 * gorulur.
 */

export const runtime = "nodejs";
export const maxDuration = 300;

const ENGINE_API_URL = process.env.ENGINE_API_URL;
const ENGINE_API_KEY = process.env.ENGINE_API_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidReport(report: unknown): boolean {
  if (!isRecord(report)) return false;
  if ("error" in report) return false;
  const hasActionPlan =
    Array.isArray(report.therapeutic_tasks) || isRecord(report.coaching_roadmap);
  return (
    typeof report.character_analysis === "string" &&
    isRecord(report.top5_and_weak5) &&
    hasActionPlan
  );
}

function getReportStatus(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  if (typeof payload.report_status === "string") return payload.report_status;
  const results = payload.results;
  if (isRecord(results) && isRecord(results.metadata)) {
    return typeof results.metadata.report_status === "string"
      ? (results.metadata.report_status as string)
      : undefined;
  }
  return undefined;
}

const REPORT_POLL_INTERVAL_MS = 4_000;
const REPORT_POLL_MAX_ATTEMPTS = 45; // ~3 min

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
      console.warn(`[regenerate-poll] GET session ${sessionId} returned ${res.status}, attempt ${attempt + 1}`);
      continue;
    }

    const body: unknown = await res.json().catch(() => null);
    const data = isRecord(body) && isRecord((body as Record<string, unknown>).data)
      ? ((body as Record<string, unknown>).data as Record<string, unknown>)
      : body;

    const status = getReportStatus(data);
    if (status === "ready") {
      const results = isRecord(data) && isRecord(data.results)
        ? (data.results as Record<string, unknown>)
        : undefined;
      console.log(`[regenerate-poll] Report ready for session ${sessionId} after ${attempt + 1} polls`);
      return results;
    }
    if (status === "failed") {
      console.error(`[regenerate-poll] Report failed for session ${sessionId} after ${attempt + 1} polls`);
      return undefined;
    }
  }

  console.error(`[regenerate-poll] Timed out waiting for report on session ${sessionId}`);
  return undefined;
}

async function backgroundRegenerate({
  invitationId,
  sessionId,
  force,
}: {
  invitationId: string;
  sessionId: string;
  force: boolean;
}): Promise<void> {
  const supabase = await createClient();

  try {
    if (!ENGINE_API_URL || !ENGINE_API_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Missing engine configuration");
    }

    // Step 1: backend'e regenerate dispatch
    const dispatchRes = await fetch(
      `${ENGINE_API_URL}/v1/sessions/${sessionId}/regenerate-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "x-api-key": ENGINE_API_KEY,
        },
        body: JSON.stringify({ force }),
      },
    );

    if (!dispatchRes.ok) {
      const errBody = await dispatchRes.text().catch(() => "");
      throw new Error(`Regenerate dispatch failed: ${dispatchRes.status} ${errBody.slice(0, 200)}`);
    }

    // Step 2: poll for report ready
    const polledResults = await pollForReport(sessionId);

    if (!polledResults) {
      console.error(`[regenerate] Polling failed/timeout for session ${sessionId}`);
      return;
    }

    const report = isRecord(polledResults) ? polledResults.report : undefined;
    if (!isValidReport(report)) {
      console.error(`[regenerate] Report invalid after poll for session ${sessionId}`);
      return;
    }

    // Step 3: update test_invitations.results_snapshot
    const { error: updateError } = await supabase
      .from("test_invitations")
      .update({
        results_snapshot: polledResults,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", invitationId);

    if (updateError) {
      console.error(`[regenerate] DB update failed for invitation ${invitationId}:`, updateError);
      return;
    }

    console.log(`[regenerate] Successfully regenerated report for invitation ${invitationId}`);
  } catch (err) {
    console.error("[regenerate] Background regenerate failed:", err);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const force: boolean = body?.force === true;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: invitation, error } = await supabase
      .from("test_invitations")
      .select("id, session_id, status, results_snapshot")
      .eq("id", id)
      .single();

    if (error || !invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (!invitation.session_id) {
      return NextResponse.json(
        { error: "Invitation has no session_id; cannot regenerate." },
        { status: 422 },
      );
    }

    if (invitation.status !== "completed" && invitation.status !== "reviewed") {
      return NextResponse.json(
        {
          error: `Cannot regenerate report: invitation is in '${invitation.status}' state. Must be completed.`,
        },
        { status: 409 },
      );
    }

    // Idempotency: rapor zaten varsa ve force değilse skip
    const existingReport = isRecord(invitation.results_snapshot)
      ? invitation.results_snapshot.report
      : undefined;
    if (isValidReport(existingReport) && !force) {
      return NextResponse.json({
        success: true,
        status: "already_exists",
        message: "Report already valid. Pass {force:true} to regenerate.",
      });
    }

    after(async () => {
      await backgroundRegenerate({
        invitationId: invitation.id,
        sessionId: invitation.session_id as string,
        force,
      });
    });

    return NextResponse.json({
      success: true,
      status: "processing",
      message: "Report regeneration started. Refresh in 30-60 seconds.",
    });
  } catch (err) {
    console.error("[regenerate API] Unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
