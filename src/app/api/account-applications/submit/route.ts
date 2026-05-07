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
    } = await supabase.auth.getUser();

    const body = await req.json();

    const accountType = String(body.accountType || "").trim();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const openingDeposit = Number(body.openingDeposit || 0);
    const ssnLast4 = String(body.ssnLast4 || "").trim();
    const driversLicenseNumber = String(
      body.driversLicenseNumber || ""
    ).trim();
    const stateIdNumber = String(body.stateIdNumber || "").trim();
    const state = String(body.state || "").trim();

    if (!["checking", "savings"].includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type." },
        { status: 400 }
      );
    }

    if (!firstName || !lastName || !email || !ssnLast4 || !state) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(ssnLast4)) {
      return NextResponse.json(
        { error: "SSN must be the last 4 digits only." },
        { status: 400 }
      );
    }

    if (openingDeposit < 0 || openingDeposit > 50000) {
      return NextResponse.json(
        { error: "Opening deposit must be between $0 and $50,000." },
        { status: 400 }
      );
    }

    const openingDepositInCents = Math.round(openingDeposit * 100);

    const { error: insertError } = await supabaseAdmin
      .from("account_applications")
      .insert({
        user_id: user?.id || null,
        account_type: accountType,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        opening_deposit: openingDepositInCents,
        ssn_last4: ssnLast4,
        drivers_license_number: driversLicenseNumber || null,
        state_id_number: stateIdNumber || null,
        state,
        status: "pending",
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    let emailWarning = "";

    try {
      await sendMail({
        to: email,
        subject: `Your Synox ${accountType} Account Application Has Been Received`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Application Received</h2>

            <p>Hello ${firstName},</p>

            <p>
              Your Synox ${
                accountType === "checking" ? "Checking" : "Savings"
              } Account application has been received successfully.
            </p>

            <p>
              Our account review team will review your submitted information and
              contact you within <strong>24 to 48 hours</strong>.
            </p>

            <br />

            <p>Thank you for choosing Synox.</p>
            <p style="font-weight: bold;">— Synox Team</p>
          </div>
        `,
      });
    } catch (emailError: any) {
      console.error("Account application email failed:", emailError?.message);
      emailWarning = "Application submitted, but email notification failed.";
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