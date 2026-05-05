import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AuditLogInput = {
  adminId: string;
  action: string;
  targetUserId?: string | null;
  metadata?: Record<string, any>;
};

export async function createAdminAuditLog({
  adminId,
  action,
  targetUserId = null,
  metadata = {},
}: AuditLogInput) {
  const { data: adminProfile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email")
    .eq("id", adminId)
    .single();

  const { data: targetProfile } = targetUserId
    ? await supabaseAdmin
        .from("profiles")
        .select("full_name, email")
        .eq("id", targetUserId)
        .single()
    : { data: null };

  const { error } = await supabaseAdmin.from("admin_audit_logs").insert({
    admin_id: adminId,
    admin_email: adminProfile?.email || null,
    admin_name: adminProfile?.full_name || null,
    action,
    target_user_id: targetUserId,
    target_email: targetProfile?.email || null,
    target_name: targetProfile?.full_name || null,
    metadata,
  });

  if (error) {
    console.error("Admin audit log failed:", error.message);
  }
}