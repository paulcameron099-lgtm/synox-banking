import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
    return NextResponse.json(
      { error: "Application ID is required." },
      { status: 400 }
    );
  }

  const { data: application, error } = await supabaseAdmin
    .from("account_applications")
    .select("id, first_name, last_name, email, phone, account_type, status")
    .eq("id", applicationId)
    .eq("status", "approved")
    .single();

  if (error || !application) {
    return NextResponse.json(
      { error: "Approved application not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ application });
}