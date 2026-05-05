import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";

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
        { error: "You must be logged in to transfer money." },
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
            "Your account is currently restricted. You cannot make transfers at this time. Please contact Synox support.",
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
            "Your account must be verified before you can make transfers. Please complete KYC verification first.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const recipientAccountNumber = String(
      body.recipientAccountNumber || ""
    ).trim();

    const amount = Number(body.amount);
    const note = String(body.note || "").trim();
    const saveBeneficiary = Boolean(body.saveBeneficiary);

    if (!recipientAccountNumber) {
      return NextResponse.json(
        { error: "Recipient account number is required." },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid transfer amount." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);

    const { data: senderProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    const { data: senderAccount } = await supabaseAdmin
      .from("accounts")
      .select("account_number")
      .eq("user_id", user.id)
      .single();

    const { data: recipientAccount } = await supabaseAdmin
      .from("accounts")
      .select("id, user_id, account_number")
      .eq("account_number", recipientAccountNumber)
      .single();

    if (!recipientAccount) {
      return NextResponse.json(
        { error: "Recipient account not found." },
        { status: 404 }
      );
    }

    const { data: receiverProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", recipientAccount.user_id)
      .single();

    const { data, error } = await supabase.rpc("internal_transfer", {
      recipient_account_number: recipientAccountNumber,
      transfer_amount: amountInCents,
      transfer_note: note || "Synox internal transfer",
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Transfer failed." },
        { status: 400 }
      );
    }

    let emailWarning = "";

    try {
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amountInCents / 100);

      await Promise.all([
        sendMail({
          to: senderProfile?.email || "",
          subject: "Debit Alert - Synox",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Debit Alert</h2>
              <p>Hello ${senderProfile?.full_name || "Customer"},</p>
              <p>Your Synox account has been debited.</p>
              <p><strong>Amount:</strong> ${formattedAmount}</p>
              <p><strong>Recipient Account:</strong> ${recipientAccountNumber}</p>
              <p><strong>Description:</strong> ${
                note || "Synox internal transfer"
              }</p>
              <p><strong>Status:</strong> Successful</p>
              <br />
              <p>Thank you for using Synox.</p>
            </div>
          `,
        }),

        sendMail({
          to: receiverProfile?.email || "",
          subject: "Credit Alert - Synox",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Credit Alert</h2>
              <p>Hello ${receiverProfile?.full_name || "Customer"},</p>
              <p>Your Synox account has been credited.</p>
              <p><strong>Amount:</strong> ${formattedAmount}</p>
              <p><strong>Sender Account:</strong> ${
                senderAccount?.account_number || "Synox User"
              }</p>
              <p><strong>Description:</strong> ${
                note || "Synox internal transfer"
              }</p>
              <p><strong>Status:</strong> Successful</p>
              <br />
              <p>Thank you for using Synox.</p>
            </div>
          `,
        }),
      ]);
    } catch (emailError: any) {
      console.error("Transfer email alert failed:", emailError?.message);
      emailWarning = "Transfer successful, but email alert failed.";
    }

    let beneficiaryWarning = "";

    if (saveBeneficiary) {
      const { error: beneficiaryError } = await supabaseAdmin
        .from("beneficiaries")
        .upsert(
          {
            user_id: user.id,
            beneficiary_account_id: recipientAccount.id,
            beneficiary_name: receiverProfile?.full_name || "Synox User",
            beneficiary_account_number: recipientAccountNumber,
            beneficiary_bank_name: "Synox Bank",
            beneficiary_type: "internal",
          },
          {
            onConflict: "user_id,beneficiary_account_number",
          }
        );

      if (beneficiaryError) {
        console.error("Save beneficiary failed:", beneficiaryError.message);
        beneficiaryWarning = "Transfer successful, but beneficiary was not saved.";
      }
    }

    return NextResponse.json({
      success: true,
      data,
      emailWarning,
      beneficiaryWarning,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}