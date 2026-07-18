"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type UserOption = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export default function AdminFundUserCard({
  users,
}: {
  users: UserOption[];
}) {
  const router = useRouter();

  const [targetUserId, setTargetUserId] = useState("");
  const [amount, setAmount] = useState("");

  const [fundingBankName, setFundingBankName] = useState("");
  const [fundingAccountName, setFundingAccountName] = useState("");
  const [fundingAccountNumber, setFundingAccountNumber] = useState("");

  const [note, setNote] = useState("Admin wallet funding");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFundUser = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/fund-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId,
          amount: Number(amount),

          fundingBankName,
          fundingAccountName,
          fundingAccountNumber,

          note,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data?.error || "Funding failed.");
        return;
      }

      setSuccessMsg(
        data?.emailWarning || "User account funded successfully.",
      );

      setTargetUserId("");
      setAmount("");

      setFundingBankName("");
      setFundingAccountName("");
      setFundingAccountNumber("");

      setNote("Admin wallet funding");

      router.refresh();
    } catch {
      setErrorMsg("Unable to connect to the funding service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
        Fund User Account
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Select a registered Synox user and credit their account.
      </p>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleFundUser} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select User
          </label>

          <select
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          >
            <option value="">Choose user</option>

            {users.map((item) => (
              <option key={item.id} value={item.id}>
                {item.full_name || "Unnamed User"} - {item.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sender Bank Name
          </label>

          <input
            type="text"
            value={fundingBankName}
            onChange={(e) => setFundingBankName(e.target.value)}
            required
            disabled={loading}
            placeholder="Example: Chase Bank"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sender Account Name
          </label>

          <input
            type="text"
            value={fundingAccountName}
            onChange={(e) => setFundingAccountName(e.target.value)}
            required
            disabled={loading}
            placeholder="Example: Errandly247 Ltd"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sender Account Number
          </label>

          <input
            type="text"
            value={fundingAccountNumber}
            onChange={(e) => setFundingAccountNumber(e.target.value)}
            required
            disabled={loading}
            placeholder="Example: 4821937462"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount USD
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={loading}
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
            placeholder="Example: Incoming business payment"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Funding User..." : "Fund User"}
        </button>
      </form>
    </div>
  );
}