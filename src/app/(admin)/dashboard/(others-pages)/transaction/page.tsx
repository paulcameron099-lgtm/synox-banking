import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import TransactionsFilterList from "@/components/transactions/TransactionsFilterList";

export default async function TransactionsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  const transactionQuery = supabase
    .from("ledger_entries")
    .select(
      "id, user_id, type, amount, reference, description, status, created_at, metadata"
    )
    .order("created_at", { ascending: false });

  const { data: transactions, error } = isAdmin
    ? await transactionQuery
    : await transactionQuery.eq("user_id", user.id);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  const userIds = Array.from(
    new Set((transactions || []).map((tx) => tx.user_id))
  );

  const { data: profiles } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds)
      : { data: [] };

  const transactionsWithUsers = (transactions || []).map((tx) => {
    const txUser = profiles?.find((profile) => profile.id === tx.user_id);

    return {
      ...tx,
      user_full_name: txUser?.full_name || "Unknown User",
      user_email: txUser?.email || "No email",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isAdmin
            ? "View and monitor all Synox platform transactions."
            : "View your Synox account transaction history."}
        </p>
      </div>

      <TransactionsFilterList
        transactions={transactionsWithUsers}
        isAdmin={isAdmin}
      />
    </div>
  );
}