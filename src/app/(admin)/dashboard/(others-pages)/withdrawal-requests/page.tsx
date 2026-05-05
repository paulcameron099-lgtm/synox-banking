import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import AdminWithdrawalList from "@/components/admin/AdminWithdrawalList";

export default async function AdminWithdrawalPage() {
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

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*")
    .order("created_at", { ascending: false });

  const userIds = withdrawals?.map((w) => w.user_id) || [];

  const { data: users } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds)
      : { data: [] };

  const data = withdrawals?.map((w) => {
    const u = users?.find((x) => x.id === w.user_id);
    return {
      ...w,
      user_name: u?.full_name,
      user_email: u?.email,
    };
  });

  return <AdminWithdrawalList withdrawals={data || []} />;
}