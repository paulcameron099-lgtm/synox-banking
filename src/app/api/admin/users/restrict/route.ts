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
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { userId, status } = await req.json();

  if (!userId || !["active", "restricted"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { data: targetProfile } = await supabaseAdmin
  .from("profiles")
  .select("full_name, email")
  .eq("id", userId)
  .single();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ account_status: status })
    .eq("id", userId)
    .eq("role", "user");

  if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}

await createAdminAuditLog({
  adminId: user.id,
  action: status === "restricted" ? "restrict_user" : "unrestrict_user",
  targetUserId: userId,
  metadata: {
    new_status: status,
  },
});

let emailWarning = "";

try {
  if (targetProfile?.email) {
    if (status === "restricted") {
      await sendMail({
        to: targetProfile.email,
        subject: "Important Notice: Your Synox Account Has Been Restricted",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #dc2626;">Account Restricted</h2>

            <p>Hello ${targetProfile.full_name || "Customer"},</p>

            <p>
              We’re writing to let you know that your Synox account has been temporarily restricted.
            </p>

            <p>
              During this restriction, you can still sign in and view your account information,
              but transfers, withdrawals, and other money movement features may be unavailable.
            </p>

            <p>
              This action may have been taken for account safety, verification review, or compliance reasons.
              Please contact Synox support if you believe this was done in error or if you need help resolving it.
            </p>

            <br />

            <p>Thank you for your understanding.</p>
            <p style="font-weight: bold;">— Synox Team</p>
          </div>
        `,
      });
    }

    if (status === "active") {
      await sendMail({
        to: targetProfile.email,
        subject: "Your Synox Account Restriction Has Been Lifted",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #16a34a;">Account Restored</h2>

            <p>Hello ${targetProfile.full_name || "Customer"},</p>

            <p>
              Your Synox account restriction has been lifted successfully.
            </p>

            <p>
              You can now access your account features again, including transfers and withdrawals,
              provided your account verification is complete.
            </p>

            <br />

            <p>Thank you for banking with Synox.</p>
            <p style="font-weight: bold;">— Synox Team</p>
          </div>
        `,
      });
    }
  }
} catch (emailError: any) {
  console.error("Restriction email failed:", emailError?.message);
  emailWarning =
    "Account status updated successfully, but email notification failed.";
}

return NextResponse.json({ success: true, emailWarning });
}