"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminWithdrawalList({ withdrawals }: any) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);

    await fetch("/api/admin/withdrawals/update", {
      method: "POST",
      body: JSON.stringify({ withdrawalId: id, status }),
    });

    setLoadingId("");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Withdrawal Requests</h1>

      {withdrawals.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No withdrawal requests yet.
        </div>
        )}

      {withdrawals.map((w: any) => (
        <div key={w.id} className="border p-4 rounded-xl space-y-2">
          <p>
            <b>{w.user_name}</b> ({w.user_email})
          </p>
          <p>Amount: ${(w.amount / 100).toFixed(2)}</p>
          <p>Status: {w.status}</p>

          {w.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(w.id, "processing")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Processing
              </button>

              <button
                onClick={() => updateStatus(w.id, "completed")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Complete
              </button>

              <button
                onClick={() => updateStatus(w.id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}