"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AvatarUpload from "@/components/admin/AvatarUpload";

type Props = {
  userId: string;
  fullName: string | null;
  currentAvatarUrl?: string | null;
  accountStatus?: string | null;
  currentAdminRole?: string | null;
};

export default function AdminUserActions({
  userId,
  fullName,
  currentAvatarUrl,
  accountStatus,
  currentAdminRole,
}: Props) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [fundingBankName, setFundingBankName] = useState("");
  const [fundingAccountName, setFundingAccountName] = useState("");
  const [fundingAccountNumber, setFundingAccountNumber] = useState("");
  const [note, setNote] = useState("");
  const [loadingFund, setLoadingFund] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [message, setMessage] = useState("");

  const isRestricted = accountStatus === "restricted";

  const handleFundUser = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoadingFund(true);

    const res = await fetch("/api/admin/fund-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
      targetUserId: userId,
      amount: Number(amount),

      fundingBankName,
      fundingAccountName,
      fundingAccountNumber,

      note,
    }),
    });

    const data = await res.json();
    setLoadingFund(false);

    if (!res.ok) {
      setMessage(data?.error || "Funding failed.");
      return;
    }

    setAmount("");

    setFundingBankName("");
    setFundingAccountName("");
    setFundingAccountNumber("");

    setNote("");
    setMessage(data?.emailWarning || "User account funded successfully.");
    router.refresh();
  };

  const handleAccountStatus = async () => {
    setMessage("");
    setLoadingStatus(true);

    const nextStatus = isRestricted ? "active" : "restricted";

    const res = await fetch("/api/admin/users/restrict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        status: nextStatus,
      }),
    });

    const data = await res.json();
    setLoadingStatus(false);

    if (!res.ok) {
      setMessage(data?.error || "Status update failed.");
      return;
    }

    setMessage(
      nextStatus === "restricted"
        ? "User account restricted successfully."
        : "User account unrestricted successfully."
    );

    router.refresh();
  };

  const handleDeleteUser = async () => {
  const confirmed = window.confirm(
    `Are you sure you want to permanently delete ${
      fullName || "this user"
    }? This action cannot be undone.`
  );

  if (!confirmed) return;

  setMessage("");
  setLoadingStatus(true);

  const res = await fetch("/api/admin/delete-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUserId: userId,
    }),
  });

  const data = await res.json().catch(() => ({}));
  setLoadingStatus(false);

  if (!res.ok) {
    setMessage(data?.error || "Failed to delete user.");
    return;
  }

  setMessage("User deleted successfully.");
  router.replace("/dashboard/users");
  router.refresh();
};

  return (
    <div className="space-y-6">
      {message && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Fund User Account
        </h2>

        <form onSubmit={handleFundUser} className="mt-5 space-y-4">
         <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sender Bank Name
        </label>

        <input
          value={fundingBankName}
          onChange={(e) => setFundingBankName(e.target.value)}
          required
          disabled={loadingFund}
          placeholder="Example: Chase Bank"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sender Account Name
        </label>

        <input
          value={fundingAccountName}
          onChange={(e) => setFundingAccountName(e.target.value)}
          required
          disabled={loadingFund}
          placeholder="Example: Errandly247 Ltd"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sender Account Number
        </label>

        <input
          value={fundingAccountNumber}
          onChange={(e) => setFundingAccountNumber(e.target.value)}
          required
          disabled={loadingFund}
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
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <button
            disabled={loadingFund}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loadingFund ? "Funding..." : "Fund User"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Profile Picture
        </h2>
        <p className="mb-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload or update {fullName || "this user"}&apos;s profile picture.
        </p>

        <AvatarUpload userId={userId} currentAvatarUrl={currentAvatarUrl} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Account Restriction
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Current status:{" "}
          <span className="font-semibold capitalize">
            {accountStatus || "active"}
          </span>
        </p>

        <button
          onClick={handleAccountStatus}
          disabled={loadingStatus}
          className={`mt-5 w-full rounded-xl px-5 py-3 font-medium text-white disabled:opacity-60 ${
            isRestricted
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loadingStatus
            ? "Updating..."
            : isRestricted
            ? "Unrestrict User"
            : "Restrict User"}
        </button>
      </div>
      {currentAdminRole === "super_admin" && (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 sm:p-6">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
          Danger Zone
        </h2>

        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          Permanently delete this user account and all linked records. This action
          cannot be undone.
        </p>

        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={loadingStatus}
          className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loadingStatus ? "Deleting..." : "Delete User"}
        </button>
      </div>
    )}
    </div>
  );
}