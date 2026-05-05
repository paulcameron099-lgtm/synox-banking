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

    const { userId, status, reason } = await req.json();

    if (!userId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const updatePayload: any = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    };

    if (status === "rejected") {
      updatePayload.rejection_reason = reason || "Not specified";
    }

    if (status === "approved") {
      updatePayload.rejection_reason = null;
    }

    const { error: updateError } = await supabaseAdmin
      .from("kyc_verifications")
      .update(updatePayload)
      .eq("user_id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    await createAdminAuditLog({
    adminId: user.id,
    action: status === "approved" ? "approve_kyc" : "reject_kyc",
    targetUserId: userId,
    metadata: {
      status,
      reason: reason || null,
    },
  });

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    let emailWarning = "";

    try {
      if (targetProfile?.email && status === "approved") {
        await sendMail({
          to: targetProfile.email,
          subject: "Your Synox Account Has Been Verified",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #16a34a;">Verification Successful</h2>

              <p>Hello ${targetProfile?.full_name || "Customer"},</p>

              <p>
                We’re pleased to inform you that your identity verification has been
                successfully completed.
              </p>

              <p>
                Your Synox account is now fully verified and you can access all features,
                including transfers and withdrawals.
              </p>

              <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
                <p style="margin: 0;"><strong>Status:</strong> Verified</p>
                <p style="margin: 0;"><strong>Verification Time:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <p>
                If you did not initiate this verification or have any concerns, please
                contact our support team immediately.
              </p>

              <br />

              <p>Thank you for choosing Synox.</p>

              <p style="font-weight: bold;">— Synox Team</p>
            </div>
          `,
        });
      }

      if (targetProfile?.email && status === "rejected") {
        await sendMail({
          to: targetProfile.email,
          subject: "Action Required: Synox Verification Update",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #dc2626;">Verification Update</h2>

              <p>Hello ${targetProfile?.full_name || "Customer"},</p>

              <p>
                We reviewed your submitted documents, but we were unable to complete
                your verification at this time.
              </p>

              <p><strong>Reason:</strong> ${reason || "Not specified"}</p>

              <p>
                Please log in to your account and resubmit valid documents to continue.
              </p>

              <br />

              <p>We’re here to help if you need assistance.</p>

              <p style="font-weight: bold;">— Synox Team</p>
            </div>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("KYC status email failed:", emailError?.message);
      emailWarning =
        "KYC status updated successfully, but email notification failed.";
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