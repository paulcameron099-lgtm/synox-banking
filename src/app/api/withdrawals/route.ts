import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to request a withdrawal." },
        { status: 401 }
      );
    }

    const { data: userProfile } = await supabaseAdmin
    .from("profiles")
    .select("account_status")
    .eq("id", user.id)
    .single();

    if (userProfile?.account_status === "restricted") {
      return NextResponse.json(
        {
          error:
            "Your account is currently restricted. You cannot withdraw funds at this time. Please contact Synox support.",
        },
        { status: 403 }
      );
    }

    const { data: kyc } = await supabaseAdmin
      .from("kyc_verifications")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!kyc || kyc.status !== "approved") {
      return NextResponse.json(
        {
          error:
            "Your account must be verified before you can withdraw. Please complete KYC verification first.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const amount = Number(body.amount);
    const destinationBankName = String(body.destinationBankName || "").trim();
    const destinationAccountNumber = String(
      body.destinationAccountNumber || ""
    ).trim();
    const destinationAccountName = String(
      body.destinationAccountName || ""
    ).trim();
    const routingNumber = String(body.routingNumber || "").trim();
    const swiftCode = String(body.swiftCode || "").trim();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid withdrawal amount." },
        { status: 400 }
      );
    }

    if (
      !destinationBankName ||
      !destinationAccountNumber ||
      !destinationAccountName
    ) {
      return NextResponse.json(
        { error: "Bank name, account number, and account name are required." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);

    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .select("id, balance, currency")
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: accountError?.message || "Account not found." },
        { status: 404 }
      );
    }

    if (Number(account.balance) < amountInCents) {
      return NextResponse.json(
        { error: "Insufficient balance for this withdrawal." },
        { status: 400 }
      );
    }

    const reference = `WDR_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}`;

    const newBalance = Number(account.balance) - amountInCents;

    const { error: withdrawalError } = await supabaseAdmin
      .from("withdrawals")
      .insert({
        user_id: user.id,
        account_id: account.id,
        amount: amountInCents,
        currency: account.currency || "USD",
        destination_bank_name: destinationBankName,
        destination_account_number: destinationAccountNumber,
        destination_account_name: destinationAccountName,
        routing_number: routingNumber || null,
        swift_code: swiftCode || null,
        status: "pending",
        reference,
      });

    if (withdrawalError) {
      return NextResponse.json(
        { error: withdrawalError.message },
        { status: 500 }
      );
    }

    const { error: ledgerError } = await supabaseAdmin
      .from("ledger_entries")
      .insert({
        account_id: account.id,
        user_id: user.id,
        type: "debit",
        amount: amountInCents,
        reference: `${reference}_DEBIT`,
        description: `Withdrawal request to ${destinationBankName}`,
        status: "pending",
        metadata: {
          withdrawal_reference: reference,
          destination_bank_name: destinationBankName,
          destination_account_number: destinationAccountNumber,
          destination_account_name: destinationAccountName,
          routing_number: routingNumber || null,
          swift_code: swiftCode || null,
        },
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
      reference,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}