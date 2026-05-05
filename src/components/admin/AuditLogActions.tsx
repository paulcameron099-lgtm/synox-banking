"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuditLogActions({
  logId,
  currentRole,
}: {
  logId?: string;
  currentRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (currentRole !== "super_admin") return null;

  const deleteLog = async () => {
    const confirmed = window.confirm(
      logId
        ? "Delete this audit log? This action cannot be undone."
        : "Clear all audit logs? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);

    const res = await fetch("/api/admin/audit-logs/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        logId
          ? { logId }
          : { clearAll: true }
      ),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      alert(data?.error || "Failed to delete audit log.");
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={deleteLog}
      disabled={loading}
      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
    >
      {loading ? "Deleting..." : logId ? "Delete" : "Clear All Logs"}
    </button>
  );
}