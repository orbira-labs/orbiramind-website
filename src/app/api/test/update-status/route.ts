import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, status, session_id, results_snapshot } = body;

    if (!token || !status) {
      return NextResponse.json(
        { error: "Token and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["started", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const updateData: Record<string, unknown> = {
      status,
    };

    if (status === "started") {
      updateData.started_at = new Date().toISOString();
      if (session_id) {
        updateData.session_id = session_id;
      }
    }

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      if (results_snapshot) {
        updateData.results_snapshot = results_snapshot;
      }
    }

    const { error } = await supabase
      .from("test_invitations")
      .update(updateData)
      .eq("token", token.toUpperCase());

    if (error) {
      console.error("Test status update failed:", error);
      return NextResponse.json(
        { error: "Failed to update test status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
