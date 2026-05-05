import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createAdminAuditLog } from "@/lib/adminAuditLog";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (
      adminProfile?.role !== "admin" &&
      adminProfile?.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const targetUserId = String(body.targetUserId || "").trim();
    const amount = Number(body.amount);
    const fundingSource = String(body.fundingSource || "").trim();
    const note = String(body.note || "").trim();

    if (!targetUserId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "User and valid amount are required." },
        { status: 400 }
      );
    }

    if (!fundingSource) {
      return NextResponse.json(
        { error: "Funding source is required." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", targetUserId)
      .single();

    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .select("id, balance, account_number")
      .eq("user_id", targetUserId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: accountError?.message || "User account not found." },
        { status: 404 }
      );
    }

    const newBalance = Number(account.balance) + amountInCents;

    const reference = `CREDIT_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}`;

    const description = note || `Credit from ${fundingSource}`;

    const { error: ledgerError } = await supabaseAdmin
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
        source: fundingSource,
        sender_name: fundingSource,
        sender_account: fundingSource,
        receiver_name: targetProfile?.full_name || "Synox User",
        receiver_account: account.account_number,
        note: note || null,
        funded_by_admin_id: user.id,
        funded_by_admin_name: adminProfile?.full_name || "Synox Admin",
        },
      });

    if (ledgerError) {
      return NextResponse.json({ error: ledgerError.message }, { status: 500 });
    }

    const { error: balanceError } = await supabaseAdmin
      .from("accounts")
      .update({ balance: newBalance })
      .eq("id", account.id);

    if (balanceError) {
      return NextResponse.json({ error: balanceError.message }, { status: 500 });
    }

    await createAdminAuditLog({
      adminId: user.id,
      action: "fund_user_account",
      targetUserId,
      metadata: {
        amount: amountInCents,
        funding_source: fundingSource,
        description,
        reference,
      },
    });

    let emailWarning = "";

    try {
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amountInCents / 100);

      if (targetProfile?.email) {
        await sendMail({
          to: targetProfile.email,
          subject: "Credit Alert - Synox",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Credit Alert</h2>

              <p>Hello ${targetProfile?.full_name || "Customer"},</p>

              <p>Your Synox account has been credited successfully.</p>

              <p><strong>Amount:</strong> ${formattedAmount}</p>
              <p><strong>From:</strong> ${fundingSource}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Status:</strong> Successful</p>

              <br />

              <p>This credit is now available in your Synox account.</p>
              <p>Thank you for using Synox.</p>
            </div>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("Admin funding email alert failed:", emailError?.message);
      emailWarning = "Funding successful, but email alert failed.";
    }

    return NextResponse.json({
      success: true,
      emailWarning,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}