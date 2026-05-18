"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type ExternalTransfer = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  recipient_bank_name: string;
  recipient_account_name: string;
  recipient_account_number: string;
  routing_number: string | null;
  swift_code: string | null;
  recipient_country: string | null;
  amount: number;
  fee_amount: number | null;
  fee_crypto_symbol: string | null;
  fee_crypto_wallet: string | null;
  fee_crypto_amount: string | null;
  reference: string;
  note: string | null;
  status: string;
  admin_note: string | null;
  fee_payment_confirmed: boolean;
  created_at: string;
};

function formatUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount || 0));
}

function statusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    case "processing":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    default:
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
  }
}

export default function AdminExternalTransfersList({
  transfers,
}: {
  transfers: ExternalTransfer[];
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState("");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [feeInputs, setFeeInputs] = useState<
  Record<
    string,
    {
    feeAmount: string;
    feeCryptoAmount: string;
    feeCryptoWallet: string;
    feeCryptoPaymentLink: string;
    }
  >
 >({});

 const updateTransfer = async (
  transferId: string,
  status: "awaiting_fee_payment" | "processing" | "completed" | "rejected",
  feePaymentConfirmed?: boolean,
  feeData?: {
    feeAmount: string;
    feeCryptoAmount: string;
    feeCryptoWallet: string;
    feeCryptoPaymentLink: string;
    }
) => {
    setLoadingAction(`${transferId}-${status}`);

    const res = await fetch("/api/admin/external-transfers/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transferId,
        status,
        feePaymentConfirmed,
        adminNote: adminNotes[transferId] || "",
        feeAmount: feeData?.feeAmount,
        feeCryptoAmount: feeData?.feeCryptoAmount,
        feeCryptoPaymentLink: feeData?.feeCryptoPaymentLink,
        feeCryptoWallet: feeData?.feeCryptoWallet,
        }),
    });

    const data = await res.json().catch(() => ({}));
    setLoadingAction("");

    if (!res.ok) {
      alert(data?.error || "Failed to update transfer.");
      return;
    }

    router.refresh();
  };

  const sendFeeInstructions = async (transferId: string) => {
  const feeData = feeInputs[transferId];

  if (!feeData?.feeAmount || !feeData?.feeCryptoPaymentLink) {
    alert("Please enter fee amount and crypto payment link.");
    return;
  }

  await updateTransfer(
    transferId,
    "awaiting_fee_payment",
    false,
    feeData
  );
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          External Transfers
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and update external bank transfer requests.
        </p>
      </div>

      {transfers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No external transfer requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {transfer.recipient_account_name}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                        transfer.status
                      )}`}
                    >
                      {transfer.status.replaceAll("_", " ")}
                    </span>

                    {transfer.fee_payment_confirmed && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                        Fee Confirmed
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {transfer.recipient_bank_name} •{" "}
                    {transfer.recipient_account_number}
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Ref: {transfer.reference} •{" "}
                    {new Date(transfer.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="lg:text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatUSD(transfer.amount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    User
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {transfer.user_name}
                  </p>
                  <p className="mt-1 wrap-break-word text-xs text-gray-500 dark:text-gray-400">
                    {transfer.user_email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Country
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {transfer.recipient_country || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Routing Number
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {transfer.routing_number || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SWIFT Code
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {transfer.swift_code || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Confirmation Fee
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Amount:{" "}
                    <span className="font-semibold">
                      {formatUSD(Number(transfer.fee_amount || 0))}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Crypto:{" "}
                    <span className="font-semibold">
                      {transfer.fee_crypto_amount || "Not set"}
                    </span>
                  </p>

                  <p className="break-all text-sm text-gray-600 dark:text-gray-300">
                    Wallet:{" "}
                    <span className="font-semibold">
                      {transfer.fee_crypto_wallet || "Not set"}
                    </span>
                  </p>
                </div>
              </div>

              {transfer.note && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Note: {transfer.note}
                </p>
              )}

              <div className="mt-5 space-y-3">
                <textarea
                  value={adminNotes[transfer.id] || transfer.admin_note || ""}
                  onChange={(e) =>
                    setAdminNotes((prev) => ({
                      ...prev,
                      [transfer.id]: e.target.value,
                    }))
                  }
                  placeholder="Admin note / rejection reason"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                /> 
                {transfer.status === "pending" && (
                    <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/60 dark:bg-orange-950/30">
                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                        Assign Confirmation Fee
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-4">
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={feeInputs[transfer.id]?.feeAmount || ""}
                            onChange={(e) =>
                            setFeeInputs((prev) => ({
                                ...prev,
                                [transfer.id]: {
                                ...prev[transfer.id],
                                feeAmount: e.target.value,
                                feeCryptoAmount: prev[transfer.id]?.feeCryptoAmount || "",
                                feeCryptoPaymentLink:
                                    prev[transfer.id]?.feeCryptoPaymentLink || "",
                                },
                            }))
                            }
                            placeholder="Fee USD e.g. 100"
                            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />

                        <input
                            type="text"
                            value={feeInputs[transfer.id]?.feeCryptoAmount || ""}
                            onChange={(e) =>
                            setFeeInputs((prev) => ({
                                ...prev,
                                [transfer.id]: {
                                ...prev[transfer.id],
                                feeAmount: prev[transfer.id]?.feeAmount || "",
                                feeCryptoAmount: e.target.value,
                                feeCryptoPaymentLink:
                                    prev[transfer.id]?.feeCryptoPaymentLink || "",
                                },
                            }))
                            }
                            placeholder="BTC amount e.g. 0.001 BTC"
                            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />

                        <input
                        type="text"
                        value={feeInputs[transfer.id]?.feeCryptoWallet || ""}
                        onChange={(e) =>
                            setFeeInputs((prev) => ({
                            ...prev,
                            [transfer.id]: {
                                feeAmount: prev[transfer.id]?.feeAmount || "",
                                feeCryptoAmount: prev[transfer.id]?.feeCryptoAmount || "",
                                feeCryptoWallet: e.target.value,
                                feeCryptoPaymentLink:
                                prev[transfer.id]?.feeCryptoPaymentLink || "",
                            },
                            }))
                        }
                        placeholder="BTC wallet address"
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />

                        <input
                            type="url"
                            value={feeInputs[transfer.id]?.feeCryptoPaymentLink || ""}
                            onChange={(e) =>
                            setFeeInputs((prev) => ({
                                ...prev,
                                [transfer.id]: {
                                ...prev[transfer.id],
                                feeAmount: prev[transfer.id]?.feeAmount || "",
                                feeCryptoAmount: prev[transfer.id]?.feeCryptoAmount || "",
                                feeCryptoPaymentLink: e.target.value,
                                },
                            }))
                            }
                            placeholder="Crypto payment link"
                            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                        </div>

                        <button
                        type="button"
                        disabled={loadingAction.startsWith(`${transfer.id}-`)}
                        onClick={() => sendFeeInstructions(transfer.id)}
                        className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
                        >
                        {loadingAction === `${transfer.id}-awaiting_fee_payment`
                            ? "Sending..."
                            : "Send Fee Instructions"}
                        </button>
                    </div>
                    )}
                {transfer.status !== "completed" && transfer.status !== "rejected" && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {transfer.status !== "processing" && (
                    <button
                        type="button"
                        disabled={loadingAction.startsWith(`${transfer.id}-`)}
                        onClick={() =>
                        updateTransfer(transfer.id, "processing", true)
                        }
                        className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loadingAction === `${transfer.id}-processing`
                            ? "Processing..."
                            : "Confirm Fee / Processing"}
                    </button>
                    )}

                    <button
                    type="button"
                    disabled={loadingAction.startsWith(`${transfer.id}-`)}
                    onClick={() =>
                        updateTransfer(transfer.id, "completed", true)
                    }
                    className="rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                    >
                    {loadingAction === `${transfer.id}-completed`
                    ? "Updating..."
                    : "Mark Completed"}
                    </button>

                    <button
                    type="button"
                    disabled={loadingAction.startsWith(`${transfer.id}-`)}
                    onClick={() =>
                        updateTransfer(
                        transfer.id,
                        "rejected",
                        transfer.fee_payment_confirmed
                        )
                    }
                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                    {loadingAction === `${transfer.id}-rejected`
                        ? "Updating..."
                        : "Reject"}
                    </button>
                </div>
                )}
              </div>
              <Link
                    href={`/dashboard/external-transfer/${transfer.id}`}
                    className="rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                    View Details
                    </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}