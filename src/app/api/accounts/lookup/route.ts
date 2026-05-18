import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const accountNumber = searchParams.get("accountNumber");

  if (!accountNumber) {
    return NextResponse.json({ found: false });
  }

  const { data: account } = await supabaseAdmin
    .from("accounts")
    .select("account_number, account_name, account_type, user_id")
    .eq("account_number", accountNumber)
    .maybeSingle();

  if (!account) {
    return NextResponse.json({ found: false });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", account.user_id)
    .maybeSingle();

  return NextResponse.json({
    found: true,
    accountName: profile?.full_name || account.account_name,
    accountNumber: account.account_number,
    accountType: account.account_type,
  });
}