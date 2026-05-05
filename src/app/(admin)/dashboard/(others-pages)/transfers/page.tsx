"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Beneficiary = {
  id: string;
  beneficiary_name: string;
  beneficiary_account_number: string;
  beneficiary_bank_name: string;
};

export default function TransfersPage() {
  const router = useRouter();

  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("");

    useEffect(() => {
    const fetchBeneficiaries = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("beneficiaries")
        .select(
          "id, beneficiary_name, beneficiary_account_number, beneficiary_bank_name"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBeneficiaries(data);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleSelectBeneficiary = (beneficiaryId: string) => {
    setSelectedBeneficiaryId(beneficiaryId);

    if (!beneficiaryId) {
      setRecipientAccount("");
      return;
    }

    const selected = beneficiaries.find((item) => item.id === beneficiaryId);

    if (selected) {
      setRecipientAccount(selected.beneficiary_account_number);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientAccountNumber: recipientAccount,
        amount: Number(amount),
        note,
        saveBeneficiary,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Transfer failed.");
      return;
    }

    setSuccessMsg(
  [
    "Transfer successful.",
    data?.emailWarning,
    data?.beneficiaryWarning,
  ]
    .filter(Boolean)
    .join(" ")
  );
    setRecipientAccount("");
    setAmount("");
    setNote("");
    setSaveBeneficiary(false);
    setSelectedBeneficiaryId("");

    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transfer Money
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Send money to another Synox account.
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

          {beneficiaries.length > 0 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Saved Beneficiary
            </label>

            <select
              value={selectedBeneficiaryId}
              onChange={(e) => handleSelectBeneficiary(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="">Choose a saved beneficiary</option>

              {beneficiaries.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.beneficiary_name} - {item.beneficiary_account_number}
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 mt-5">
              Recipient Account Number
            </label>
            <input
              type="text"
              value={recipientAccount}
              onChange={(e) =>
                setRecipientAccount(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter recipient account number"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
              placeholder="0.00"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Note / Description
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What is this transfer for?"
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
            <input
              type="checkbox"
              checked={saveBeneficiary}
              onChange={(e) => setSaveBeneficiary(e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span>
              Save this recipient as a beneficiary for future transfers.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing Transfer..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
}