import { createClient } from "@/lib/supabase/server";

/**
 * Validates that a request to an engine API route comes from either:
 * 1. An authenticated Supabase user (dashboard flow), OR
 * 2. A valid, non-expired test invitation token (public /t/[token] flow)
 *
 * Returns { authorized: true } or { authorized: false, status: number, message: string }
 */
export async function authorizeEngineRequest(
  request: Request
): Promise<{ authorized: true } | { authorized: false; status: number; message: string }> {
  const supabase = await createClient();

  // Path 1: authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("engine-auth: getUser hatası:", userError.message);
  }

  if (user) {
    return { authorized: true };
  }

  // Path 2: valid test invitation token
  const testToken = request.headers.get("x-test-token");

  if (testToken) {
    const { data: invitation, error: invitationError } = await supabase
      .from("test_invitations")
      .select("id, status, expires_at")
      .eq("token", testToken)
      .single();

    if (invitationError && invitationError.code !== "PGRST116") {
      // PGRST116 = "no rows returned" — beklenen durum, loglama gerekmez
      console.error("engine-auth: davet sorgusu hatası:", invitationError.message);
    }

    if (
      invitation &&
      invitation.status !== "completed" &&
      invitation.status !== "expired" &&
      new Date(invitation.expires_at) > new Date()
    ) {
      return { authorized: true };
    }
  }

  return { authorized: false, status: 401, message: "Unauthorized" };
}
