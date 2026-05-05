"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Withdrawal = {
  id: string;
  amount: number;
  currency: string;
  destination_bank_name: string;
  destination_account_number: string;
  destination_account_name: string;
  status: string;
  reference: string;
  requested_at: string;
};

export default function WithdrawalsPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [destinationBankName, setDestinationBankName] = useState("");
  const [destinationAccountNumber, setDestinationAccountNumber] = useState("");
  const [destinationAccountName, setDestinationAccountName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
    case "processing":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    case "failed":
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

    const fetchWithdrawals = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
        .from("withdrawals")
        .select(
        "id, amount, currency, destination_bank_name, destination_account_number, destination_account_name, status, reference, requested_at"
        )
        .eq("user_id", user.id)
        .order("requested_at", { ascending: false });

    if (!error && data) {
        setWithdrawals(data);
    }
    };

    useEffect(() => {
    fetchWithdrawals();
    }, []);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await fetch("/api/withdrawals/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        destinationBankName,
        destinationAccountNumber,
        destinationAccountName,
        routingNumber,
        swiftCode,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Withdrawal request failed.");
      return;
    }

    setSuccessMsg(
      `Withdrawal request submitted successfully. Reference: ${data.reference}`
    );

    setAmount("");
    setDestinationBankName("");
    setDestinationAccountNumber("");
    setDestinationAccountName("");
    setRoutingNumber("");
    setSwiftCode("");
    await fetchWithdrawals();

    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Withdraw Funds
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Request a withdrawal to an external bank account. Your account must be
          KYC verified before you can withdraw.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleWithdrawal} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount USD
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Name
              </label>
              <input
                type="text"
                value={destinationBankName}
                onChange={(e) => setDestinationBankName(e.target.value)}
                placeholder="Bank of America"
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Number
              </label>
              <input
                type="text"
                value={destinationAccountNumber}
                onChange={(e) => setDestinationAccountNumber(e.target.value)}
                placeholder="Enter account number"
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Name
            </label>
            <input
              type="text"
              value={destinationAccountName}
              onChange={(e) => setDestinationAccountName(e.target.value)}
              placeholder="Recipient account name"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Routing Number
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="Optional"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                SWIFT Code
              </label>
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="Optional"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting Withdrawal..." : "Request Withdrawal"}
          </button>
        </form>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
  <div className="mb-5">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      Withdrawal History
    </h2>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Track your withdrawal requests and statuses.
    </p>
  </div>

        {withdrawals.length > 0 ? (
            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {withdrawals.map((item) => (
                <div
                key={item.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                    {item.destination_bank_name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.destination_account_name} •{" "}
                    {item.destination_account_number}
                    </p>

                    <p className="mt-1 break-all text-xs text-gray-400 dark:text-gray-500">
                    Ref: {item.reference} •{" "}
                    {new Date(item.requested_at).toLocaleString()}
                    </p>
                </div>

                <div className="sm:text-right">
                    <p className="font-bold text-red-600 dark:text-red-400">
                    -{formatUSD(item.amount)}
                    </p>

                    <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                        item.status
                    )}`}
                    >
                    {item.status}
                    </span>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No withdrawal requests yet.
            </div>
        )}
        </div>
    </div>
  );
}