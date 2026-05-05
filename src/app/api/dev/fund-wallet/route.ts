import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid user or amount" },
        { status: 400 }
      );
    }

    // amount is in cents
    // 50000 = $500.00

    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .select("id, balance")
      .eq("user_id", userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: accountError?.message || "Account not found" },
        { status: 404 }
      );
    }

    const newBalance = Number(account.balance) + Number(amount);

    const reference = `TEST_DEP_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}`;

    const { error: ledgerError } = await supabaseAdmin
      .from("ledger_entries")
      .insert({
        account_id: account.id,
        user_id: userId,
        type: "credit",
        amount,
        reference,
        description: "Test wallet funding",
        status: "posted",
      });

    if (ledgerError) {
      return NextResponse.json(
        { error: ledgerError.message },
        { status: 500 }
      );
    }

    const { error: balanceError } = await supabaseAdmin
      .from("accounts")
      .update({ balance: newBalance })
      .eq("id", account.id);

    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      balance: newBalance,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}