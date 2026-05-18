import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount || 0));
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function statusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    case "processing":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    default:
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
  }
}

export default async function ExternalTransferDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

  const { data: transfer, error } = await supabase
    .from("external_transfer_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !transfer) {
    notFound();
  }

  const { data: owner } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", transfer.user_id)
    .single();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/external-transfers"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            ← Back to External Transfers
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            External Transfer Details
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Reference: {transfer.reference}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
            transfer.status
          )}`}
        >
          {formatStatus(transfer.status)}
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 xl:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Transfer Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Amount
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {formatUSD(transfer.amount)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {new Date(transfer.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recipient Name
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transfer.recipient_account_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recipient Account Number
              </p>
              <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">
                {transfer.recipient_account_number}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Bank Name
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transfer.recipient_bank_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recipient Country
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transfer.recipient_country || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Routing Number
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transfer.routing_number || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SWIFT Code
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transfer.swift_code || "Not provided"}
              </p>
            </div>
          </div>

          {transfer.note && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
              <p className="text-xs text-gray-500 dark:text-gray-400">Note</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {transfer.note}
              </p>
            </div>
          )}

          {transfer.admin_note && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Note
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {transfer.admin_note}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              User Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {owner?.full_name || "Unknown User"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white">
                  {owner?.email || "No email"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {owner?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirmation Fee
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fee Amount
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {formatUSD(Number(transfer.fee_amount || 0))}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Crypto Amount
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {transfer.fee_crypto_amount || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Wallet Address
                </p>
                <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">
                  {transfer.fee_crypto_wallet || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fee Payment Confirmed
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {transfer.fee_payment_confirmed ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/external-transfer"
        className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Manage External Transfers
      </Link>
    </div>
  );
}