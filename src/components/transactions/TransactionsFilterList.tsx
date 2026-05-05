"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Transaction = {
  id: string;
  user_id?: string;
  user_full_name?: string;
  user_email?: string;
  type: "credit" | "debit";
  amount: number;
  reference: string;
  description: string | null;
  status: string;
  created_at: string;
  metadata?: {
    source?: string;
    [key: string]: any;
  } | null;
};

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

function getStatusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    case "failed":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    case "reversed":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export default function TransactionsFilterList({
  transactions,
  isAdmin = false,
}: {
  transactions: Transaction[];
  isAdmin?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        tx.reference.toLowerCase().includes(searchValue) ||
        (tx.description || "").toLowerCase().includes(searchValue) ||
        (tx.metadata?.source || "").toLowerCase().includes(searchValue) ||
        (tx.user_full_name || "").toLowerCase().includes(searchValue) ||
        (tx.user_email || "").toLowerCase().includes(searchValue) ||
        tx.status.toLowerCase().includes(searchValue);

      const matchesType = type === "all" || tx.type === type;

      const txDate = new Date(tx.created_at);

      const matchesDateFrom = dateFrom
        ? txDate >= new Date(dateFrom)
        : true;

      const matchesDateTo = dateTo
        ? txDate <= new Date(`${dateTo}T23:59:59`)
        : true;

      const txAmountDollars = tx.amount / 100;

      const matchesMinAmount = minAmount
        ? txAmountDollars >= Number(minAmount)
        : true;

      const matchesMaxAmount = maxAmount
        ? txAmountDollars <= Number(maxAmount)
        : true;

      return (
        matchesSearch &&
        matchesType &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesMinAmount &&
        matchesMaxAmount
      );
    });
  }, [transactions, search, type, dateFrom, dateTo, minAmount, maxAmount]);

  const clearFilters = () => {
    setSearch("");
    setType("all");
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, status, description"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="all">All</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Min Amount $
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Amount $
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="500.00"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredTransactions.map((tx) => (
              <Link
                key={tx.id}
                href={`/dashboard/transaction/${tx.id}`}
                className="flex flex-col gap-3 p-4 transition hover:bg-gray-50 dark:hover:bg-white/3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tx.metadata?.source
                      ? `Credit from ${tx.metadata.source}`
                      : tx.description || "Transaction"}
                  </p>

                  {isAdmin && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {tx.user_full_name} • {tx.user_email}
                    </p>
                  )}

                  <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">
                    {new Date(tx.created_at).toLocaleString()} • {tx.reference}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p
                    className={`font-bold ${
                      tx.type === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {formatUSD(tx.amount)}
                  </p>

                 <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                        tx.status
                    )}`}
                    >
                    {tx.status}
                 </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No transactions match your filters.
          </div>
        )}
      </div>
    </div>
  );
}