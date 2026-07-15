import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import TransactionGenerator from "@/components/admin/TransactionGenerator";

export default async function TransactionGeneratorPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, admin_status")
    .eq("id", user.id)
    .single();

  const isAdmin =
    adminProfile?.role === "admin" ||
    adminProfile?.role === "super_admin";

  if (!isAdmin || adminProfile?.admin_status === "deactivated") {
    redirect("/dashboard");
  }

  const { data: customers, error: customerError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("role", "user")
    .order("full_name", { ascending: true });

  if (customerError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        Unable to load customers: {customerError.message}
      </div>
    );
  }

  const customerIds = (customers || []).map((customer) => customer.id);

  const { data: accounts, error: accountError } =
    customerIds.length > 0
      ? await supabase
          .from("accounts")
          .select(
            "id, user_id, account_name, account_type, account_number, balance, status, created_at"
          )
          .in("user_id", customerIds)
          .in("account_type", ["checking", "savings"])
          .order("created_at", { ascending: true })
      : { data: [], error: null };

  if (accountError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        Unable to load accounts: {accountError.message}
      </div>
    );
  }

  return (
    <TransactionGenerator
      customers={customers || []}
      accounts={accounts || []}
    />
  );
}