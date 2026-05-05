import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import AdminUserActions from "@/components/admin/AdminUserActions";
import AdminKycActions from "@/components/admin/AdminKycActions";
import AdminCardApplicationActions from "@/components/admin/AdminCardApplicationActions";

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    adminProfile?.role !== "admin" &&
    adminProfile?.role !== "super_admin"
  ) {
    redirect("/dashboard");
  }

  const { data: targetUser, error: userError } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, role, profession, country, city_state, postal_code, avatar_url, account_status, created_at"
    )
    .eq("id", id)
    .single();

  if (userError || !targetUser) {
    notFound();
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("account_name, account_number, currency, balance, status")
    .eq("user_id", id)
    .single();

  const { data: kyc } = await supabase
    .from("kyc_verifications")
    .select("status, submitted_at, reviewed_at, rejection_reason")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: cardApplication } = await supabase
  .from("card_applications")
  .select(
    "id, card_name, card_type, status, rejection_reason, requested_at, reviewed_at"
  )
  .eq("user_id", id)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

  const { data: transactions } = await supabase
    .from("ledger_entries")
    .select("id, type, amount, reference, description, status, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const initials = (targetUser.full_name || "User")
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/users"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          ← Back to users
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Manage User
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View user profile, account balance, KYC status, and recent activity.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xl font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {targetUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={targetUser.avatar_url}
                  alt={targetUser.full_name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {targetUser.full_name || "Unnamed User"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {targetUser.email}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {targetUser.role}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {targetUser.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Profession
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {targetUser.profession || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Country</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {targetUser.country || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                City/State
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {targetUser.city_state || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Postal Code
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {targetUser.postal_code || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Registered
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {new Date(targetUser.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Available Balance
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {formatUSD(account?.balance || 0)}
            </h2>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Account: {account?.account_number || "Not available"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            KYC Status
          </p>

          <h2 className="mt-3 text-xl font-bold capitalize text-gray-900 dark:text-white">
            {kyc?.status || "Not submitted"}
          </h2>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Submitted:{" "}
            {kyc?.submitted_at
              ? new Date(kyc.submitted_at).toLocaleString()
              : "Not available"}
          </p>

          {kyc?.rejection_reason && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              Reason: {kyc.rejection_reason}
            </p>
          )}

          <AdminKycActions
            userId={id}
            currentStatus={kyc?.status}
          />
        </div>
          <AdminUserActions
            userId={targetUser.id}
            fullName={targetUser.full_name}
            currentAvatarUrl={targetUser.avatar_url}
            accountStatus={targetUser.account_status}
            currentAdminRole={adminProfile?.role}
          />
        </div>
        <AdminCardApplicationActions application={cardApplication} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
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
                    <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.created_at).toLocaleString()} •{" "}
                      {tx.reference}
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
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent transactions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}