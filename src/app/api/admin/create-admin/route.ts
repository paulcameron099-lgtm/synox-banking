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

  const { fullName, email, password, role } = await req.json();

  if (!fullName || !email || !password || !["admin", "super_admin"].includes(role)) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const { data: createdUser, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    });

  if (createError || !createdUser.user) {
    return NextResponse.json(
      { error: createError?.message || "Failed to create admin." },
      { status: 500 }
    );
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: createdUser.user.id,
    full_name: fullName,
    email,
    role,
    agreed_to_terms: true,
    agreed_at: new Date().toISOString(),
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

    await createAdminAuditLog({
    adminId: user.id,
    action: "create_admin",
    targetUserId: createdUser.user.id,
    metadata: {
      created_role: role,
      created_email: email,
    },
  });

  return NextResponse.json({ success: true });
}