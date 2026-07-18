import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createAdminAuditLog } from "@/lib/adminAuditLog";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(req: Request) {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const {
      data: adminProfile,
      error: adminProfileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (
      adminProfileError ||
      !adminProfile ||
      (adminProfile.role !== "admin" &&
        adminProfile.role !== "super_admin")
    ) {
      return NextResponse.json(
        {
          error: "Admin access required.",
        },
        { status: 403 },
      );
    }

    const body = await req.json();

    const targetUserId = String(
      body.targetUserId || "",
    ).trim();

    const amount = Number(body.amount);

    const fundingBankName = String(
      body.fundingBankName || "",
    ).trim();

    const fundingAccountName = String(
      body.fundingAccountName || "",
    ).trim();

    const fundingAccountNumber = String(
      body.fundingAccountNumber || "",
    ).trim();

    const note = String(
      body.note || "",
    ).trim();

    if (
      !targetUserId ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "User and valid amount are required.",
        },
        { status: 400 },
      );
    }

    if (
      !fundingBankName ||
      !fundingAccountName ||
      !fundingAccountNumber
    ) {
      return NextResponse.json(
        {
          error:
            "Sender bank name, account name and account number are required.",
        },
        { status: 400 },
      );
    }

    const amountInCents =
      Math.round(amount * 100);

    const {
      data: targetProfile,
      error: targetProfileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", targetUserId)
      .single();

    if (
      targetProfileError ||
      !targetProfile
    ) {
      return NextResponse.json(
        {
          error:
            targetProfileError?.message ||
            "User profile not found.",
        },
        { status: 404 },
      );
    }

    const {
      data: account,
      error: accountError,
    } = await supabaseAdmin
      .from("accounts")
      .select(
        "id, balance, account_number, account_name",
      )
      .eq("user_id", targetUserId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        {
          error:
            accountError?.message ||
            "User account not found.",
        },
        { status: 404 },
      );
    }

    const currentBalance =
      Number(account.balance || 0);

    const newBalance =
      currentBalance + amountInCents;

    const reference = `CREDIT_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}`;

    const description =
      note ||
      `Credit from ${fundingAccountName}`;

    const {
      error: ledgerError,
    } = await supabaseAdmin
      .from("ledger_entries")
      .insert({
        account_id: account.id,
        user_id: targetUserId,
        type: "credit",
        amount: amountInCents,
        reference,
        description,
        status: "completed",

        metadata: {
          source: fundingBankName,

          sender_name:
            fundingAccountName,

          sender_account:
            fundingAccountNumber,

          receiver_name:
            targetProfile.full_name ||
            "Synox User",

          receiver_account:
            account.account_number,

          from_bank:
            fundingBankName,

          to_bank: "Synox Bank",

          from_account_name:
            fundingAccountName,

          from_account_number:
            fundingAccountNumber,

          to_account_name:
            targetProfile.full_name ||
            "Synox User",

          to_account_number:
            account.account_number,

          balance_after: newBalance,

          note: note || null,

          funded_by_admin_id:
            user.id,

          funded_by_admin_name:
            adminProfile.full_name ||
            "Synox Admin",
        },
      });

    if (ledgerError) {
      return NextResponse.json(
        {
          error: ledgerError.message,
        },
        { status: 500 },
      );
    }

    const {
      error: balanceError,
    } = await supabaseAdmin
      .from("accounts")
      .update({
        balance: newBalance,
      })
      .eq("id", account.id);

    if (balanceError) {
      /*
       * This should eventually be moved into a database
       * transaction/RPC so the ledger insert and account
       * balance update are atomic.
       */
      return NextResponse.json(
        {
          error: balanceError.message,
        },
        { status: 500 },
      );
    }

    await createAdminAuditLog({
      adminId: user.id,
      action: "fund_user_account",
      targetUserId,

      metadata: {
        amount: amountInCents,

        funding_bank_name:
          fundingBankName,

        funding_account_name:
          fundingAccountName,

        funding_account_number:
          fundingAccountNumber,

        receiver_account_number:
          account.account_number,

        description,
        reference,
      },
    });

    let emailWarning = "";

    try {
      const formattedAmount =
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amountInCents / 100);

      if (targetProfile.email) {
        await sendMail({
          to: targetProfile.email,
          subject: "Credit Alert - Synox",

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Credit Alert</h2>

              <p>
                Hello ${
                  targetProfile.full_name ||
                  "Customer"
                },
              </p>

              <p>
                Your Synox account has been credited successfully.
              </p>

              <p>
                <strong>Amount:</strong>
                ${formattedAmount}
              </p>

              <p>
                <strong>From Bank:</strong>
                ${fundingBankName}
              </p>

              <p>
                <strong>Sender:</strong>
                ${fundingAccountName}
              </p>

              <p>
                <strong>Sender Account:</strong>
                ${fundingAccountNumber}
              </p>

              <p>
                <strong>Receiving Account:</strong>
                ${account.account_number}
              </p>

              <p>
                <strong>Description:</strong>
                ${description}
              </p>

              <p>
                <strong>Status:</strong>
                Successful
              </p>

              <br />

              <p>
                This credit is now available in your Synox account.
              </p>

              <p>Thank you for using Synox.</p>
            </div>
          `,
        });
      }
    } catch (emailError: unknown) {
      const message =
        emailError instanceof Error
          ? emailError.message
          : "Unknown email error";

      console.error(
        "Admin funding email alert failed:",
        message,
      );

      emailWarning =
        "Funding successful, but email alert failed.";
    }

    return NextResponse.json({
      success: true,
      emailWarning,
      newBalance,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Server error.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}