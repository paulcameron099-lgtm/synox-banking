import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import AdminExternalTransfersList from "@/components/admin/AdminExternalTransfersList";

export default async function AdminExternalTransfersPage() {
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

  const { data: transfers, error } = await supabase
    .from("external_transfer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  const userIds = Array.from(new Set((transfers || []).map((t) => t.user_id)));

  const { data: users } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds)
      : { data: [] };

  const transfersWithUsers = (transfers || []).map((transfer) => {
    const transferUser = users?.find((item) => item.id === transfer.user_id);

    return {
      ...transfer,
      user_name: transferUser?.full_name || "Unknown User",
      user_email: transferUser?.email || "No email",
    };
  });

  return <AdminExternalTransfersList transfers={transfersWithUsers} />;
}