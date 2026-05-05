import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAdminProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export function isAdminRole(role?: string | null) {
  return role === "admin" || role === "super_admin";
}

export function isSuperAdminRole(role?: string | null) {
  return role === "super_admin";
}