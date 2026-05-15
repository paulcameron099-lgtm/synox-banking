import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, fullName, email, phone, profession, country, cityState, postalCode } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Create profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        full_name: fullName,
        email,
        phone,
        profession,
        country,
        city_state: cityState,
        postal_code: postalCode,
        role: "user",
        agreed_to_terms: true,
        agreed_at: new Date().toISOString(),
      });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    const { applicationId } = body;

if (applicationId) {
  const { data: application } = await supabaseAdmin
    .from("account_applications")
    .select("id, account_type, opening_deposit, status")
    .eq("id", applicationId)
    .eq("status", "approved")
    .single();

  if (application) {
    await supabaseAdmin
      .from("account_applications")
      .update({ user_id: userId })
      .eq("id", applicationId);

    const { data: existingAccount } = await supabaseAdmin
      .from("accounts")
      .select("id")
      .eq("user_id", userId)
      .eq("account_type", application.account_type)
      .maybeSingle();

    if (!existingAccount) {
      const accountNumber =
        "40" + Math.floor(1000000000 + Math.random() * 9000000000);

      await supabaseAdmin.from("accounts").insert({
        user_id: userId,
        account_name:
          application.account_type === "checking"
            ? "Synox Checking Account"
            : "Synox Savings Account",
        account_type: application.account_type,
        account_number: accountNumber,
        currency: "USD",
        balance: application.opening_deposit || 0,
        status: "active",
      });
    }
  }
}


    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}