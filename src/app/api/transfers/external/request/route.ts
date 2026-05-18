import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeReference() {
  return `EXT_TRF_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to request an external transfer." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      fromAccountId,
      recipientBankName,
      recipientAccountName,
      recipientAccountNumber,
      routingNumber,
      swiftCode,
      recipientCountry,
      amount,
      note,
    } = body;

    const transferAmount = Number(amount);

    if (
      !fromAccountId ||
      !recipientBankName ||
      !recipientAccountName ||
      !recipientAccountNumber ||
      !recipientCountry ||
      !transferAmount ||
      transferAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Please complete all required transfer fields." },
        { status: 400 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, account_status")
      .eq("id", user.id)
      .single();

    if (profile?.account_status === "restricted") {
      return NextResponse.json(
        {
          error:
            "Your account is currently restricted. You cannot request external transfers.",
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
            "Your account must be verified before you can request an external transfer.",
        },
        { status: 403 }
      );
    }

    const { data: fromAccount } = await supabaseAdmin
      .from("accounts")
      .select("id, balance, account_number, account_name, account_type")
      .eq("id", fromAccountId)
      .eq("user_id", user.id)
      .single();

    if (!fromAccount) {
      return NextResponse.json(
        { error: "Source account not found." },
        { status: 404 }
      );
    }

    const amountInCents = Math.round(transferAmount * 100);

    if (fromAccount.balance < amountInCents) {
      return NextResponse.json(
        { error: "Insufficient available balance." },
        { status: 400 }
      );
    }

    const feeAmount = null;
    const btcWallet = null;
    const btcAmount = null;
    const cryptoPaymentLink = null;

    const reference = makeReference();

    const { error: insertError } = await supabaseAdmin
      .from("external_transfer_requests")
      .insert({
        user_id: user.id,
        from_account_id: fromAccountId,
        recipient_bank_name: recipientBankName,
        recipient_account_name: recipientAccountName,
        recipient_account_number: recipientAccountNumber,
        routing_number: routingNumber || null,
        swift_code: swiftCode || null,
        recipient_country: recipientCountry,
        amount: transferAmount,
        fee_amount: feeAmount,
        fee_crypto_symbol: "BTC",
        fee_crypto_wallet: btcWallet,
        fee_crypto_amount: btcAmount,
        fee_crypto_payment_link: cryptoPaymentLink,
        reference,
        note: note || null,
        status: "pending",
        fee_payment_confirmed: false,
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    let emailWarning = "";

    try {
      if (profile?.email) {
        await sendMail({
          to: profile.email,
          subject: "External Transfer Request Received - Pending Review",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
              <h2 style="margin-bottom: 16px;">External Transfer Request Received</h2>

              <p>Hello ${profile.full_name || "Customer"},</p>

              <p>
                Your external transfer request has been received and is currently pending confirmation.
              </p>

              <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;">
                <p style="margin: 0;"><strong>Reference:</strong> ${reference}</p>
                <p style="margin: 8px 0 0 0;"><strong>Amount:</strong> $${transferAmount.toFixed(
                  2
                )}</p>
                <p style="margin: 8px 0 0 0;"><strong>Recipient:</strong> ${recipientAccountName}</p>
                <p style="margin: 8px 0 0 0;"><strong>Bank:</strong> ${recipientBankName}</p>
                <p style="margin: 8px 0 0 0;"><strong>Account Number:</strong> ${recipientAccountNumber}</p>
              </div>

                <p>
                Your transfer is now pending review by our transfers team.
                </p>

              <p>
                Once your confirmation is received and reviewed, your transfer status will be updated in your Synox dashboard.
              </p>

              <p>
                If you did not initiate this transfer request, please contact Synox support immediately.
              </p>

              <br />

              <p>Thank you for choosing Synox.</p>
              <p style="font-weight: bold;">— Synox Transfers Team</p>
            </div>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("External transfer email failed:", emailError?.message);
      emailWarning =
        "Transfer request submitted, but email notification failed.";
    }

    return NextResponse.json({
      success: true,
      reference,
      emailWarning,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}