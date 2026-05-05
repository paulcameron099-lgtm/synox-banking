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

    const { data: application, error: updateError } = await supabaseAdmin
      .from("card_applications")
      .update(updatePayload)
      .eq("id", applicationId)
      .select("id, user_id, card_name, status")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", application.user_id)
      .single();

    let emailWarning = "";

    try {
      if (targetProfile?.email && status === "approved") {
        await sendMail({
          to: targetProfile.email,
          subject: "Your Synox Debit Card Application Has Been Approved",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #16a34a;">Card Application Approved</h2>

              <p>Hello ${targetProfile.full_name || "Customer"},</p>

              <p>
                Good news — your Synox Debit Card application has been approved.
              </p>

              <p>
                Your card is now being prepared and will be delivered to your
                registered address within <strong>7 to 14 business days</strong>.
              </p>

              <p>
                Once your card arrives, you will be able to activate and manage it
                from your Synox dashboard.
              </p>

              <br />

              <p>Thank you for banking with Synox.</p>
              <p style="font-weight: bold;">— Synox Team</p>
            </div>
          `,
        });
      }

      if (targetProfile?.email && status === "rejected") {
        await sendMail({
          to: targetProfile.email,
          subject: "Synox Debit Card Application Update",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #dc2626;">Card Application Update</h2>

              <p>Hello ${targetProfile.full_name || "Customer"},</p>

              <p>
                We reviewed your Synox Debit Card application, but we are unable
                to approve it at this time.
              </p>

              <p><strong>Reason:</strong> ${reason || "Not specified"}</p>

              <p>
                You may contact Synox support for more information or apply again
                when the issue has been resolved.
              </p>

              <br />

              <p>Thank you for choosing Synox.</p>
              <p style="font-weight: bold;">— Synox Team</p>
            </div>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("Card status email failed:", emailError?.message);
      emailWarning =
        "Card application updated, but email notification failed.";
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