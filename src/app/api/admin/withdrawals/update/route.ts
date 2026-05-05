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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { withdrawalId, status, reason } = await req.json();

    if (!withdrawalId || !status) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data: withdrawal } = await supabaseAdmin
      .from("withdrawals")
      .select("*")
      .eq("id", withdrawalId)
      .single();

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("withdrawals")
      .update({
        status,
        rejection_reason: status === "rejected" ? reason || null : null,
        processed_at:
          status === "completed" || status === "rejected"
            ? new Date().toISOString()
            : null,
      })
      .eq("id", withdrawalId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Get user email
    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email")
      .eq("id", withdrawal.user_id)
      .single();

    // Email
    try {
      if (targetProfile?.email) {
        if (status === "completed") {
          await sendMail({
            to: targetProfile.email,
            subject: "Withdrawal Completed",
            html: `
              <h2>Withdrawal Successful</h2>
              <p>Hello ${targetProfile.full_name || "Customer"},</p>
              <p>Your withdrawal request has been successfully processed.</p>
              <p>Amount: $${(withdrawal.amount / 100).toFixed(2)}</p>
              <p>The funds will reflect in your bank shortly.</p>
              <br/>
              <p>— Synox Team</p>
            `,
          });
        }

        if (status === "rejected") {
          await sendMail({
            to: targetProfile.email,
            subject: "Withdrawal Rejected",
            html: `
              <h2>Withdrawal Update</h2>
              <p>Hello ${targetProfile.full_name || "Customer"},</p>
              <p>Your withdrawal request was not approved.</p>
              <p>Reason: ${reason || "Not specified"}</p>
              <br/>
              <p>Please contact support if needed.</p>
              <p>— Synox Team</p>
            `,
          });
        }
      }
    } catch (e) {
      console.error("Withdrawal email failed");
    }

    // Audit log
    await createAdminAuditLog({
      adminId: user.id,
      action: "update_withdrawal_status",
      targetUserId: withdrawal.user_id,
      metadata: {
        withdrawal_id: withdrawalId,
        status,
        amount: withdrawal.amount,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}