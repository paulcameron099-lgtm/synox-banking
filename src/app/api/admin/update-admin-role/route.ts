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

    const { targetUserId, role } = await req.json();

    if (!targetUserId || !["user", "admin", "super_admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid user or role." },
        { status: 400 }
      );
    }

    if (targetUserId === user.id && role !== "super_admin") {
      return NextResponse.json(
        { error: "You cannot remove your own super admin access." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role })
      .eq("id", targetUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await createAdminAuditLog({
      adminId: user.id,
      action: "update_admin_role",
      targetUserId,
      metadata: {
        new_role: role,
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