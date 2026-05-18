"use client";

import { useState } from "react";

type Account = {
  id: string;
  account_name: string;
  account_type: string;
  account_number: string;
  balance: number;
  status: string;
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white";

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

export default function ExternalTransferForm({
  accounts,
}: {
  accounts: Account[];
}) {
  const [form, setForm] = useState({
    fromAccountId: accounts[0]?.id || "",
    recipientBankName: "",
    recipientAccountName: "",
    recipientAccountNumber: "",
    routingNumber: "",
    swiftCode: "",
    recipientCountry: "United States",
    amount: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessRef("");
    setLoading(true);

    const res = await fetch("/api/transfers/external/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "External transfer request failed.");
      return;
    }

    setSuccessRef(data.reference || "Submitted");

    setForm({
      fromAccountId: accounts[0]?.id || "",
      recipientBankName: "",
      recipientAccountName: "",
      recipientAccountNumber: "",
      routingNumber: "",
      swiftCode: "",
      recipientCountry: "United States",
      amount: "",
      note: "",
    });
  };

  const selectedAccount = accounts.find((a) => a.id === form.fromAccountId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          External Transfer
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Send funds from your Synox account to an external bank account.
        </p>
      </div>

      {successRef && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
          <p className="font-semibold">Transfer request submitted.</p>
          <p className="mt-1">
            Reference: <span className="font-bold">{successRef}</span>
          </p>
          <p className="mt-1">
            Please check your email for confirmation instructions.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Source Account
          </h2>

          {accounts.length > 0 ? (
            <div className="mt-5 space-y-4">
              <select
                value={form.fromAccountId}
                onChange={(e) => updateField("fromAccountId", e.target.value)}
                className={inputClass}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name} - {account.account_number}
                  </option>
                ))}
              </select>

              {selectedAccount && (
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Available Balance
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatUSD(selectedAccount.balance || 0)}
                  </p>
                  <p className="mt-2 text-xs capitalize text-gray-500 dark:text-gray-400">
                    {selectedAccount.account_type} account
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No active account found.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Recipient Details
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bank Name
                </label>
                <input
                  required
                  value={form.recipientBankName}
                  onChange={(e) =>
                    updateField("recipientBankName", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Example: Chase Bank"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Name
                </label>
                <input
                  required
                  value={form.recipientAccountName}
                  onChange={(e) =>
                    updateField("recipientAccountName", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Recipient full name"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Number
                </label>
                <input
                  required
                  value={form.recipientAccountNumber}
                  onChange={(e) =>
                    updateField(
                      "recipientAccountNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 20)
                    )
                  }
                  className={inputClass}
                  placeholder="Account number"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Routing Number
                </label>
                <input
                  value={form.routingNumber}
                  onChange={(e) =>
                    updateField(
                      "routingNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 12)
                    )
                  }
                  className={inputClass}
                  placeholder="For US banks"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SWIFT Code
                </label>
                <input
                  value={form.swiftCode}
                  onChange={(e) =>
                    updateField("swiftCode", e.target.value.toUpperCase())
                  }
                  className={inputClass}
                  placeholder="For international banks"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recipient Country
                </label>
                <input
                  required
                  value={form.recipientCountry}
                  onChange={(e) =>
                    updateField("recipientCountry", e.target.value)
                  }
                  className={inputClass}
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount USD
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Note
                </label>
                <input
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || accounts.length === 0}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit External Transfer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}