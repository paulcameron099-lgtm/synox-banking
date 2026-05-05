import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  const { data: admins } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, admin_status, created_at")
    .in("role", ["admin", "super_admin"])
    .order("created_at", { ascending: false });

  return (
    <AdminSettingsClient
      currentRole={profile?.role || "admin"}
      admins={admins || []}
    />
  );
}