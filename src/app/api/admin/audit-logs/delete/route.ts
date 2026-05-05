import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { getAdminProfile, isSuperAdminRole } from "@/lib/adminAuth";

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

    const { logId, clearAll } = await req.json();

    if (clearAll) {
      const { error } = await supabaseAdmin
        .from("admin_audit_logs")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (!logId) {
      return NextResponse.json(
        { error: "Log ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("admin_audit_logs")
      .delete()
      .eq("id", logId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}