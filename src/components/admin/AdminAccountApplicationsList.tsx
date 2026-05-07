"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Application = {
  id: string;
  account_type: "checking" | "savings";
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  opening_deposit: number;
  ssn_last4: string;
  drivers_license_number: string | null;
  state_id_number: string | null;
  state: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
};

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

function getStatusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export default function AdminAccountApplicationsList({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const [reason, setReason] = useState("");

  const updateApplication = async (
    applicationId: string,
    status: "approved" | "rejected"
  ) => {
    setLoadingId(applicationId);

    const res = await fetch("/api/admin/account-applications/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId, status, reason }),
    });

    const data = await res.json().catch(() => ({}));
    setLoadingId("");

    if (!res.ok) {
      alert(data?.error || "Failed to update application.");
      return;
    }

    setReason("");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Account Applications
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review checking and savings account applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No account applications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {app.first_name} {app.last_name}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>

                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                      {app.account_type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {app.email} {app.phone ? `• ${app.phone}` : ""}
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Submitted: {new Date(app.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-sm lg:text-right">
                  <p className="text-gray-500 dark:text-gray-400">
                    Opening Deposit
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatUSD(app.opening_deposit)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SSN Last 4
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ***-**-{app.ssn_last4}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Driver License
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {app.drivers_license_number || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    State ID
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {app.state_id_number || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    State
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {app.state || "Not provided"}
                  </p>
                </div>
              </div>

              {app.rejection_reason && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
                  Reason: {app.rejection_reason}
                </div>
              )}

              {app.status === "pending" && (
                <div className="mt-5 space-y-3">
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Rejection reason, optional"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={loadingId === app.id}
                      onClick={() => updateApplication(app.id, "approved")}
                      className="rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {loadingId === app.id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === app.id}
                      onClick={() => updateApplication(app.id, "rejected")}
                      className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}