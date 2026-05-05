"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CardApplication = {
  id: string;
  card_name: string;
  card_type: string;
  status: string;
  rejection_reason: string | null;
  requested_at: string;
  reviewed_at: string | null;
};

function getStatusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export default function AdminCardApplicationActions({
  application,
}: {
  application: CardApplication | null;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (status: "approved" | "rejected") => {
    if (!application?.id) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/cards/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId: application.id,
        status,
        reason,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMessage(data?.error || "Failed to update card application.");
      return;
    }

    setMessage(
      data?.emailWarning ||
        `Card application ${status === "approved" ? "approved" : "rejected"} successfully.`
    );

    router.refresh();
  };

  if (!application) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Card Application
        </h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          This user has not applied for a Synox Debit Card yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Card Application
      </h2>

      {message && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
          {message}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Card</p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {application.card_name}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
          <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
            {application.card_type}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
          <span
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
              application.status
            )}`}
          >
            {application.status}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Requested</p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {new Date(application.requested_at).toLocaleString()}
          </p>
        </div>

        {application.reviewed_at && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reviewed</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {new Date(application.reviewed_at).toLocaleString()}
            </p>
          </div>
        )}

        {application.rejection_reason && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Rejection Reason
            </p>
            <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
              {application.rejection_reason}
            </p>
          </div>
        )}
      </div>

      {application.status === "pending" && (
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleUpdate("approved")}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Approve Card Application"}
          </button>

          <input
            placeholder="Rejection reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />

          <button
            onClick={() => handleUpdate("rejected")}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            Reject Card Application
          </button>
        </div>
      )}
    </div>
  );
}