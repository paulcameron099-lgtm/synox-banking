import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import PrintReceiptButton from "@/components/transactions/PrintReceiptButton";

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

function getStatusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    case "failed":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    case "reversed":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

function getTimelineSteps(status: string) {
  const steps = [
    {
      title: "Transfer Initiated",
      description: "Your transaction request was received.",
      active: true,
    },
    {
      title: "Processing",
      description: "Synox is processing your transaction.",
      active: status === "pending" || status === "completed",
    },
    {
      title:
        status === "failed"
          ? "Failed"
          : status === "reversed"
          ? "Reversed"
          : "Completed",
      description:
        status === "failed"
          ? "This transaction could not be completed."
          : status === "reversed"
          ? "This transaction was reversed."
          : "This transaction was completed successfully.",
      active: status === "completed" || status === "failed" || status === "reversed",
    },
  ];

  return steps;
}

    export default async function TransactionDetailsPage({
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

    const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

    const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

    let query = supabase
      .from("ledger_entries")
      .select(
        "id, user_id, type, amount, reference, description, status, created_at, metadata"
      )
      .eq("id", id);

    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data: transaction, error } = await query.single();

  if (error || !transaction) {
    notFound();
  }

  const { data: transactionOwner } = await supabase
  .from("profiles")
  .select("full_name, email")
  .eq("id", transaction.user_id)
  .single();

   const metadata = transaction.metadata as {
    sender_account?: string;
    receiver_account?: string;
    sender_name?: string;
    receiver_name?: string;
    source?: string;
    note?: string | null;
  } | null;

    const fromName = metadata?.source || metadata?.sender_name || "Not available";
    const toName = metadata?.receiver_name || "Your Synox Account";
    const senderAccount = metadata?.source || metadata?.sender_account || "External Funding Source";
    const receiverAccount = metadata?.receiver_account || "Your Synox Account";

    const isCredit = transaction.type === "credit";
    const timelineSteps = getTimelineSteps(transaction.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/transaction"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          ← Back to transactions
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Transaction Receipt
        </h1>

        <div className="mt-4">
        <PrintReceiptButton />
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Details for this Synox transaction.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transaction Timeline
        </h2>

        <div className="mt-6 space-y-6">
            {timelineSteps.map((step, index) => {
            const isLast = index === timelineSteps.length - 1;

            return (
                <div key={step.title} className="relative flex gap-4">
                {!isLast && (
                    <div
                    className={`absolute left-[11px] top-7 h-full w-0.5 ${
                        step.active
                        ? "bg-indigo-600 dark:bg-indigo-400"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    />
                )}

                <div
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    step.active
                        ? "border-indigo-600 bg-indigo-600 dark:border-indigo-400 dark:bg-indigo-400"
                        : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                    }`}
                >
                    {step.active && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                </div>

                <div>
                    <p
                    className={`text-sm font-medium ${
                        step.active
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                    >
                    {step.title}
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {step.description}
                    </p>
                </div>
                </div>
            );
            })}
        </div>
        </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="border-b border-gray-200 pb-5 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              isCredit
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isCredit ? "+" : "-"}
            {formatUSD(transaction.amount)}
          </h2>
        </div>

        {isAdmin && (
          <>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transaction Owner
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {transactionOwner?.full_name || "Unknown User"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Owner Email</p>
              <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white">
                {transactionOwner?.email || "No email"}
              </p>
            </div>
          </>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {fromName}
                </p>
                </div>

                <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {toName}
                </p>
                </div>

                <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sender Account</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {senderAccount}
                </p>
                </div>

                <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receiver Account</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {receiverAccount}
                </p>
                </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
            <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
              {transaction.type}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                transaction.status
                )}`}
            >
                {transaction.status}
            </span>
            </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reference</p>
            <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">
              {transaction.reference}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {new Date(transaction.created_at).toLocaleString()}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Description
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {transaction.description || "No description"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}