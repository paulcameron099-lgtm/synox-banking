"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminKycActions({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus?: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleUpdate = async (status: "approved" | "rejected") => {
    setLoading(true);

    const res = await fetch("/api/admin/kyc/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        status,
        reason,
      }),
    });

    setLoading(false);

    if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data?.error || "Failed to update KYC.");
    return;
  }

    router.refresh();
  };

  return (
    <div className="mt-5 space-y-3">
      {currentStatus === "processing" && (
        <>
          <button
            onClick={() => handleUpdate("approved")}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Approve KYC"}
          </button>

          <div className="space-y-2">
            <input
              placeholder="Rejection reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />

            <button
              onClick={() => handleUpdate("rejected")}
              disabled={loading}
              className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              Reject KYC
            </button>
          </div>
        </>
      )}

      {currentStatus === "approved" && (
        <p className="text-sm text-green-600 dark:text-green-400">
          KYC already approved
        </p>
      )}

      {currentStatus === "rejected" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          KYC rejected
        </p>
      )}
    </div>
  );
}