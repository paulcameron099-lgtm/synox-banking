import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import AdminFundUserCard from "@/components/admin/AdminFundUserCard";
// import TestFundButton from "@/components/dashboard/TestFundButton";

export const metadata: Metadata = {
  title: "Synox",
  description: "Online Banking System",
};

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
  .from("profiles")
  .select("full_name, email, role, account_status")
  .eq("id", user.id)
  .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  const { data: users } = isAdmin
  ? await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "user")
      .order("created_at", { ascending: false })
  : { data: [] };

  const { data: account } = await supabase
    .from("accounts")
    .select("account_name, account_number, currency, balance")
    .eq("user_id", user.id)
    .single();

    const { data: transactions } = await supabase
      .from("ledger_entries")
      .select("id, type, amount, reference, description, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

      if (isAdmin) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Welcome back, {profile?.full_name || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          Manage Synox users, fund accounts, and review platform activity.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Registered Users
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            {users?.length || 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Funding Access
          </p>
          <h2 className="mt-3 text-xl font-bold text-green-600 dark:text-green-400">
            Active
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Admin Role
          </p>
          <h2 className="mt-3 text-xl font-bold capitalize text-gray-900 dark:text-white">
            {profile?.role}
          </h2>
        </div>
      </div>

      <AdminFundUserCard users={users || []} />
    </div>
  );
}

  return (
     <div className="space-y-6 sm:space-y-8">
      
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        Welcome back, {profile?.full_name || "User"}
      </h1>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
        Here is your Synox account overview.
      </p>
    </div>

    {/* <div className="w-full sm:w-auto">
      <TestFundButton userId={user.id} />
    </div> */}
  </div>
  
  {profile?.account_status === "restricted" && (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
          Account Restricted
        </h2>

        <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">
          Your Synox account is currently restricted. You can still view your
          balance and transaction history, but transfers and withdrawals are
          temporarily disabled. Please contact Synox support for assistance.
        </p>
      </div>

      <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase text-red-700 dark:bg-red-900/50 dark:text-red-300">
        Restricted
      </span>
    </div>
  </div>
)}

  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Available Balance
      </p>

      <h2 className="mt-3 wrap-break-word text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        {formatUSD(account?.balance || 0)}
      </h2>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Account Number
      </p>

      <h2 className="mt-3 wrap-break-word text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        {account?.account_number || "Not available"}
      </h2>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 md:col-span-2 xl:col-span-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Account Type
      </p>

      <h2 className="mt-3 wrap-break-word text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        {account?.account_name || "Synox Bank"}
      </h2>
    </div>
  </div>

  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
    <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
      Recent Transactions
    </h2>

    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        {transactions && transactions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tx.description || "Transaction"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(tx.created_at).toLocaleString()} • {tx.reference}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p
                    className={`font-bold ${
                      tx.type === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {formatUSD(tx.amount)}
                  </p>

                  <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 sm:p-8 sm:text-base">
            No transactions yet.
          </div>
        )}
    </div>
      </div>
</div>
  );
}