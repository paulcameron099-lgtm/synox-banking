import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Verification code must be 6 digits." },
        { status: 400 }
      );
    }

    const { data: verification, error } = await supabaseAdmin
      .from("login_verifications")
      .select("id, user_id, email, code, expires_at, verified")
      .eq("email", email)
      .eq("code", code)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !verification) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    const isExpired = new Date(verification.expires_at).getTime() < Date.now();

    if (isExpired) {
      return NextResponse.json(
        { error: "Verification code has expired. Please sign in again." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("login_verifications")
      .update({ verified: true })
      .eq("id", verification.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: verification.user_id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}