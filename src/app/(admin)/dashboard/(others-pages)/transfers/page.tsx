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
  const [transferType, setTransferType] = useState<"internal" | "external" | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [recipientName, setRecipientName] = useState("");

  const [recipientBankName, setRecipientBankName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("United States");
  const [fromAccountId, setFromAccountId] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);

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

      const { data: userAccounts } = await supabase
      .from("accounts")
      .select("id, account_name, account_number, balance, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (userAccounts && userAccounts.length > 0) {
      setAccounts(userAccounts);
      setFromAccountId(userAccounts[0].id);
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

  const lookupAccount = async (accountNumber: string) => {
  if (accountNumber.length < 6) {
    setTransferType(null);
    setRecipientName("");
    return;
  }

  setLookupLoading(true);

  const res = await fetch(`/api/accounts/lookup?accountNumber=${accountNumber}`);
  const data = await res.json();

  setLookupLoading(false);

  if (data?.found) {
    setTransferType("internal");
    setRecipientName(data.accountName || "");
    setRecipientBankName("");
    setRoutingNumber("");
    setSwiftCode("");
  } else {
    setTransferType("external");
    setRecipientName("");
  }
};

const handleTransfer = async (e: React.FormEvent) => {
  e.preventDefault();

  setErrorMsg("");
  setSuccessMsg("");
  setLoading(true);

  const endpoint =
    transferType === "external"
      ? "/api/transfers/external/request"
      : "/api/transfers";

  const payload =
    transferType === "external"
      ? {
          fromAccountId,
          recipientBankName,
          recipientAccountName: recipientName,
          recipientAccountNumber: recipientAccount,
          routingNumber,
          swiftCode,
          recipientCountry,
          amount: Number(amount),
          note,
        }
      : {
          recipientAccountNumber: recipientAccount,
          amount: Number(amount),
          note,
          saveBeneficiary,
        };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  setLoading(false);

  if (!res.ok) {
    setErrorMsg(data?.error || "Transfer failed.");
    return;
  }

  setSuccessMsg(
    transferType === "external"
      ? `External transfer request submitted. Reference: ${data?.reference || "Pending"}. Please check your email for confirmation instructions.`
      : ["Transfer successful.", data?.emailWarning, data?.beneficiaryWarning]
          .filter(Boolean)
          .join(" ")
  );

  setRecipientAccount("");
  setRecipientName("");
  setRecipientBankName("");
  setRoutingNumber("");
  setSwiftCode("");
  setRecipientCountry("United States");
  setAmount("");
  setNote("");
  setSaveBeneficiary(false);
  setSelectedBeneficiaryId("");
  setTransferType(null);

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
             onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setRecipientAccount(value);
                lookupAccount(value);
              }}
              placeholder="Enter recipient account number"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          {lookupLoading && (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Checking account...
      </p>
    )}

    {transferType === "internal" && recipientName && (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
        <p className="font-semibold">Synox account found</p>
        <p className="mt-1">Account Name: {recipientName}</p>
      </div>
    )}

    {transferType === "external" && (
      <div className="space-y-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/60 dark:bg-yellow-950/30">
        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
          External bank account detected. Please complete recipient bank details.
        </p>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Source Synox Account
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name} - {account.account_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recipient Account Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient account name"
              required={transferType === "external"}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Name
              </label>
              <input
                type="text"
                value={recipientBankName}
                onChange={(e) => setRecipientBankName(e.target.value)}
                placeholder="Example: Chase Bank"
                required={transferType === "external"}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  placeholder="For US banks"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
                  placeholder="For international banks"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Recipient Country
              </label>
              <input
                type="text"
                value={recipientCountry}
                onChange={(e) => setRecipientCountry(e.target.value)}
                required={transferType === "external"}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>
          </div>
        )}

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