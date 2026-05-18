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
      .select("role")
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

    const {
    transferId,
    status,
    adminNote,
    feePaymentConfirmed,
    feeAmount,
    feeCryptoAmount,
    feeCryptoPaymentLink,
    feeCryptoWallet,
    } = await req.json();

    if (
      !transferId ||
      !["awaiting_fee_payment", "processing", "completed", "rejected"].includes(
        status
      )
    ) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { data: transfer, error: transferError } = await supabaseAdmin
      .from("external_transfer_requests")
      .select("*")
      .eq("id", transferId)
      .single();

    if (transferError || !transfer) {
      return NextResponse.json(
        { error: transferError?.message || "Transfer request not found." },
        { status: 404 }
      );
    }

    if (status === "completed" && transfer.status !== "completed") {
    if (!transfer.from_account_id) {
        return NextResponse.json(
        { error: "Source account is missing for this transfer." },
        { status: 400 }
        );
    }

    const amountInCents = Math.round(Number(transfer.amount) * 100);

    const { data: sourceAccount, error: accountError } = await supabaseAdmin
        .from("accounts")
        .select("id, balance")
        .eq("id", transfer.from_account_id)
        .single();

    if (accountError || !sourceAccount) {
        return NextResponse.json(
        { error: "Source account not found." },
        { status: 404 }
        );
    }

    if (sourceAccount.balance < amountInCents) {
        return NextResponse.json(
        { error: "Insufficient balance to complete this transfer." },
        { status: 400 }
        );
    }

    const { error: debitError } = await supabaseAdmin
        .from("accounts")
        .update({
        balance: sourceAccount.balance - amountInCents,
        })
        .eq("id", transfer.from_account_id);

    if (debitError) {
        return NextResponse.json(
        { error: debitError.message },
        { status: 500 }
        );
    }

    await supabaseAdmin.from("ledger_entries").insert({
        account_id: transfer.from_account_id,
        user_id: transfer.user_id,
        type: "debit",
        amount: amountInCents,
        reference: transfer.reference,
        description: `External transfer to ${transfer.recipient_account_name}`,
        status: "completed",
        metadata: {
        transfer_type: "external",
        recipient_bank_name: transfer.recipient_bank_name,
        recipient_account_name: transfer.recipient_account_name,
        recipient_account_number: transfer.recipient_account_number,
        external_transfer_id: transfer.id,
        },
    });
    }

    const updatePayload: any = {
    status,
    admin_note: adminNote || null,
    fee_payment_confirmed:
        typeof feePaymentConfirmed === "boolean"
        ? feePaymentConfirmed
        : transfer.fee_payment_confirmed,
    updated_at: new Date().toISOString(),
    };

    if (feeAmount !== undefined) {
    updatePayload.fee_amount = Number(feeAmount);
    }

    if (feeCryptoAmount !== undefined) {
    updatePayload.fee_crypto_amount = feeCryptoAmount;
    }

    if (feeCryptoPaymentLink !== undefined) {
    updatePayload.fee_crypto_payment_link = feeCryptoPaymentLink;
    }

    if (feeCryptoWallet !== undefined) {
    updatePayload.fee_crypto_wallet = feeCryptoWallet;
    }

    const { error: updateError } = await supabaseAdmin
      .from("external_transfer_requests")
      .update(updatePayload)
      .eq("id", transferId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", transfer.user_id)
      .single();

      if (profile?.email && status === "awaiting_fee_payment") {
    await sendMail({
        to: profile.email,
        subject: "External Transfer Confirmation Fee Instructions",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
            <h2>Transfer Confirmation Required</h2>

            <p>Hello ${profile.full_name || "Customer"},</p>

            <p>
            Your external transfer request has been reviewed and requires a confirmation
            and settlement processing fee before it can move to final processing.
            </p>

            <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;">
            <p style="margin: 0;"><strong>Reference:</strong> ${transfer.reference}</p>
            <p style="margin: 8px 0 0 0;"><strong>Transfer Amount:</strong> $${Number(
                transfer.amount
            ).toFixed(2)}</p>
            <p style="margin: 8px 0 0 0;"><strong>Recipient:</strong> ${
                transfer.recipient_account_name
            }</p>
            <p style="margin: 8px 0 0 0;"><strong>Bank:</strong> ${
                transfer.recipient_bank_name
            }</p>
            </div>

            <div style="margin: 20px 0; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px;">
            <p style="margin: 0;"><strong>Confirmation Fee:</strong> $${Number(
                feeAmount || transfer.fee_amount || 0
            ).toFixed(2)}</p>
            <p style="margin: 8px 0 0 0;"><strong>Payment Method:</strong> Bitcoin / Crypto Checkout</p>
            <p style="margin: 8px 0 0 0;"><strong>BTC Amount:</strong> ${
                feeCryptoAmount || transfer.fee_crypto_amount || "Shown on checkout page"
            }</p>
            <p style="margin: 8px 0 0 0; word-break: break-all;">
            <strong>BTC Wallet Address:</strong> ${
                feeCryptoWallet || transfer.fee_crypto_wallet || "Shown on checkout page"
            }
            </p>
            </div>

            <p>
            Please use the secure payment link below to complete the confirmation fee:
            </p>

            <p style="margin: 24px 0;">
            <a href="${feeCryptoPaymentLink || transfer.fee_crypto_payment_link}" target="_blank" style="background:#111827;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">
                Pay Confirmation Fee
            </a>
            </p>

            <p>
            After completing the payment, please reply to this email with:
            </p>

            <div style="margin: 18px 0; padding: 14px; background: #f3f4f6; border-radius: 10px;">
            <p style="margin: 0; font-weight: bold;">
                “I have completed the confirmation fee payment for transfer reference ${transfer.reference}.”
            </p>
            </div>

            <p>
            Once your confirmation is received and reviewed, your transfer status will be updated in your Synox dashboard.
            </p>

            <br />

            <p>Thank you for choosing Synox.</p>
            <p style="font-weight: bold;">— Synox Transfers Team</p>
        </div>
        `,
    });
    }

    try {
      if (profile?.email && status === "completed") {
        await sendMail({
          to: profile.email,
          subject: "Your External Transfer Has Been Completed",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
            <h2>Debit Alert - External Transfer Completed</h2>

            <p>Hello ${profile.full_name || "Customer"},</p>

            <p>
            Your Synox account has been debited for a completed external transfer.
            </p>

            <div style="margin: 20px 0; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px;">
            <p style="margin: 0;"><strong>Reference:</strong> ${transfer.reference}</p>
            <p style="margin: 8px 0 0 0;"><strong>Debit Amount:</strong> $${Number(transfer.amount).toFixed(2)}</p>
            <p style="margin: 8px 0 0 0;"><strong>Recipient:</strong> ${transfer.recipient_account_name}</p>
            <p style="margin: 8px 0 0 0;"><strong>Bank:</strong> ${transfer.recipient_bank_name}</p>
            <p style="margin: 8px 0 0 0;"><strong>Recipient Account:</strong> ${transfer.recipient_account_number}</p>
            <p style="margin: 8px 0 0 0;"><strong>Status:</strong> Completed</p>
            </div>

            <p>
            You can sign in to your Synox dashboard to view the updated transfer status and transaction record.
            </p>

            <br />

            <p>Thank you for choosing Synox.</p>
            <p style="font-weight: bold;">— Synox Transfers Team</p>
        </div>
          `,
        });
      }

      if (profile?.email && status === "rejected") {
        await sendMail({
          to: profile.email,
          subject: "External Transfer Request Update",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
              <h2>External Transfer Request Update</h2>

              <p>Hello ${profile.full_name || "Customer"},</p>

              <p>
                We reviewed your external transfer request, but it could not be completed at this time.
              </p>

              <div style="margin: 20px 0; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px;">
                <p style="margin: 0;"><strong>Reference:</strong> ${transfer.reference}</p>
                <p style="margin: 8px 0 0 0;"><strong>Amount:</strong> $${Number(
                  transfer.amount
                ).toFixed(2)}</p>
                <p style="margin: 8px 0 0 0;"><strong>Status:</strong> Rejected</p>
                <p style="margin: 8px 0 0 0;"><strong>Reason:</strong> ${
                  adminNote || "Not specified"
                }</p>
              </div>

              <p>
                Please contact Synox support if you need more information about this transfer request.
              </p>

              <br />

              <p>Thank you for choosing Synox.</p>
              <p style="font-weight: bold;">— Synox Transfers Team</p>
            </div>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("External transfer status email failed:", emailError?.message);
    }

    await createAdminAuditLog({
      adminId: user.id,
      action: "update_external_transfer_status",
      targetUserId: transfer.user_id,
      metadata: {
        transfer_id: transferId,
        reference: transfer.reference,
        status,
        fee_payment_confirmed: updatePayload.fee_payment_confirmed,
        admin_note: adminNote || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}