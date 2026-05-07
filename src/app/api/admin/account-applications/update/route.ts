import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";
import { createAdminAuditLog } from "@/lib/adminAuditLog";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateAccountNumber() {
  return "40" + Math.floor(1000000000 + Math.random() * 9000000000);
}

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

    const { applicationId, status, reason } = await req.json();

    if (!applicationId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { data: application, error: appError } = await supabaseAdmin
      .from("account_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: appError?.message || "Application not found." },
        { status: 404 }
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { error: "This application has already been reviewed." },
        { status: 400 }
      );
    }

    const updatePayload: any = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      rejection_reason: status === "rejected" ? reason || "Not specified" : null,
    };

    const { error: updateError } = await supabaseAdmin
      .from("account_applications")
      .update(updatePayload)
      .eq("id", applicationId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    let createdAccountNumber: string | null = null;

    if (status === "approved" && application.user_id) {
      createdAccountNumber = generateAccountNumber();

      const { data: existingAccount } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("user_id", application.user_id)
    .eq("account_type", application.account_type)
      .maybeSingle();

    if (existingAccount) {
      return NextResponse.json(
        {
          error: `User already has a ${application.account_type} account.`,
        },
        { status: 400 }
      );
    }

     const accountType = application.account_type === "savings" ? "savings" : "checking";

      const accountName =
        accountType === "checking"
          ? "Synox Checking Account"
          : "Synox Savings Account";

      const { error: accountError } = await supabaseAdmin
        .from("accounts")
        .insert({
          user_id: application.user_id,
          account_name: accountName,
          account_type: accountType,
          account_number: createdAccountNumber,
          currency: "USD",
          balance: application.opening_deposit || 0,
          status: "active",
        });
      if (accountError) {
        return NextResponse.json(
          { error: accountError.message },
          { status: 500 }
        );
      }

      if (application.opening_deposit > 0) {
        await supabaseAdmin.from("ledger_entries").insert({
          account_id: null,
          user_id: application.user_id,
          type: "credit",
          amount: application.opening_deposit,
          reference: `OPENING_DEP_${Date.now()}`,
          description: `Opening deposit for Synox ${application.account_type} account`,
          status: "completed",
          metadata: {
            source: "Opening Deposit",
            account_type: application.account_type,
            account_number: createdAccountNumber,
          },
        });
      }
    }

    try {
      if (application.email) {
        if (status === "approved") {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const registrationLink = `${siteUrl}/register?applicationId=${application.id}`;
          await sendMail({
            to: application.email,
            subject: `Your Synox ${application.account_type} Account Has Been Approved`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color:#16a34a;">Account Application Approved</h2>
                <p>Hello ${application.first_name},</p>
                <p>
                  Good news — your Synox ${
                    application.account_type === "checking"
                      ? "Checking"
                      : "Savings"
                  } Account application has been approved.
                </p>
                <p>
                  Your new account has been created and is now available in your Synox dashboard.
                </p>
                ${
                  createdAccountNumber
                    ? `<p><strong>Account Number:</strong> ${createdAccountNumber}</p>`
                    : ""
                }
                <p>
                  To complete your Synox online banking profile, please create your login password using the secure link below:
                </p>

                <p style="margin: 24px 0;">
                  <a href="${registrationLink}" style="background:#18181b;color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">
                    Complete Registration
                  </a>
                </p>

                <p>
                  This link is connected to your approved application. Please do not share it with anyone.
                </p>
                <p>You can sign in to view your balance and account details.</p>
                <br />
                <p>Thank you for banking with Synox.</p>
                <p style="font-weight:bold;">— Synox Team</p>
              </div>
            `,
          });
        }

        if (status === "rejected") {
          await sendMail({
            to: application.email,
            subject: `Synox ${application.account_type} Account Application Update`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color:#dc2626;">Application Update</h2>
                <p>Hello ${application.first_name},</p>
                <p>
                  We reviewed your Synox ${
                    application.account_type === "checking"
                      ? "Checking"
                      : "Savings"
                  } Account application, but we are unable to approve it at this time.
                </p>
                <p><strong>Reason:</strong> ${reason || "Not specified"}</p>
                <p>You may contact Synox support for help or submit a new application later.</p>
                <br />
                <p>Thank you for choosing Synox.</p>
                <p style="font-weight:bold;">— Synox Team</p>
              </div>
            `,
          });
        }
      }
    } catch (emailError: any) {
      console.error("Account application email failed:", emailError?.message);
    }

    await createAdminAuditLog({
      adminId: user.id,
      action:
        status === "approved"
          ? "approve_account_application"
          : "reject_account_application",
      targetUserId: application.user_id,
      metadata: {
        application_id: applicationId,
        account_type: application.account_type,
        status,
        reason: reason || null,
        created_account_number: createdAccountNumber,
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