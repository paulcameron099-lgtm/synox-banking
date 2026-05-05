import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { getAdminProfile, isSuperAdminRole } from "@/lib/adminAuth";
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

    const adminProfile = await getAdminProfile(user.id);

    if (!isSuperAdminRole(adminProfile?.role)) {
      return NextResponse.json(
        { error: "Super admin access required." },
        { status: 403 }
      );
    }

    const { targetUserId, status } = await req.json();

    if (!targetUserId || !["active", "deactivated"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid admin or status." },
        { status: 400 }
      );
    }

    if (targetUserId === user.id && status === "deactivated") {
      return NextResponse.json(
        { error: "You cannot deactivate your own super admin account." },
        { status: 400 }
      );
    }

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", targetUserId)
      .single();

    if (
      targetProfile?.role !== "admin" &&
      targetProfile?.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "Target user is not an admin." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ admin_status: status })
      .eq("id", targetUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await createAdminAuditLog({
      adminId: user.id,
      action: status === "deactivated" ? "deactivate_admin" : "reactivate_admin",
      targetUserId,
      metadata: {
        admin_status: status,
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