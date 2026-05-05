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

    // 2. Create default wallet account
    const accountNumber = "30" + Math.floor(1000000000 + Math.random() * 9000000000); // simple mock

    const { error: accountError } = await supabaseAdmin
      .from("accounts")
      .insert({
        user_id: userId,
        account_name: "Synox Wallet",
        account_type: "wallet",
        account_number: accountNumber,
        currency: "USD",
        balance: 0,
      });

    if (accountError) {
      return NextResponse.json(
        { error: accountError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}