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

    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user is required." },
        { status: 400 }
      );
    }

    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own super admin account." },
        { status: 400 }
      );
    }

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", targetUserId)
      .single();

    if (!targetProfile) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    if (
      targetProfile.role === "admin" ||
      targetProfile.role === "super_admin"
    ) {
      return NextResponse.json(
        { error: "Use deactivate admin instead of deleting admin accounts." },
        { status: 400 }
      );
    }

    await createAdminAuditLog({
      adminId: user.id,
      action: "delete_user",
      targetUserId,
      metadata: {
        deleted_user_email: targetProfile.email,
        deleted_user_name: targetProfile.full_name,
      },
    });

    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}