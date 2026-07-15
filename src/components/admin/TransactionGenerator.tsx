"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
};

type Account = {
  id: string;
  user_id: string;
  account_name: string | null;
  account_type: "checking" | "savings";
  account_number: string;
  balance: number;
  status: string;
  created_at: string;
};

type GenerationMode = "continue" | "new" | "replace";

type TransactionDirection = "credit" | "debit";

type TransactionCategory =
  | "payroll"
  | "direct_deposit"
  | "card_purchase"
  | "atm_withdrawal"
  | "internal_transfer"
  | "external_transfer"
  | "utility_bill"
  | "rent_mortgage"
  | "interest"
  | "fee"
  | "refund"
  | "deposit";

type TransactionConfig = {
  category: TransactionCategory;
  direction: TransactionDirection;
  amount: string;
  transactionCount: string;
  description: string;

  fromBank: string;
  fromAccountName: string;
  fromAccountNumber: string;

  toBank: string;
  toAccountName: string;
  toAccountNumber: string;
};

type PreviewTransaction = {
  id: string;
  type: TransactionDirection;
  category: TransactionCategory;
  amount: number;
  description: string;
  effective_at: string;
  balance_after: number;

  from_bank: string;
  from_account_name: string;
  from_account_number: string;

  to_bank: string;
  to_account_name: string;
  to_account_number: string;
};

type CategoryDefinition = {
  key: TransactionCategory;
  label: string;
  defaultDirection: TransactionDirection;
  defaultDescription: string;
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-indigo-950";

const categories: CategoryDefinition[] = [
  {
    key: "payroll",
    label: "Payroll",
    defaultDirection: "credit",
    defaultDescription: "Payroll direct deposit",
  },
  {
    key: "direct_deposit",
    label: "Direct deposit",
    defaultDirection: "credit",
    defaultDescription: "Incoming direct deposit",
  },
  {
    key: "card_purchase",
    label: "Card purchase",
    defaultDirection: "debit",
    defaultDescription: "Card purchase",
  },
  {
    key: "atm_withdrawal",
    label: "ATM withdrawal",
    defaultDirection: "debit",
    defaultDescription: "ATM cash withdrawal",
  },
  {
    key: "internal_transfer",
    label: "Internal transfer",
    defaultDirection: "debit",
    defaultDescription: "Internal account transfer",
  },
  {
    key: "external_transfer",
    label: "External transfer",
    defaultDirection: "debit",
    defaultDescription: "External bank transfer",
  },
  {
    key: "utility_bill",
    label: "Utility bill",
    defaultDirection: "debit",
    defaultDescription: "Utility bill payment",
  },
  {
    key: "rent_mortgage",
    label: "Rent or mortgage",
    defaultDirection: "debit",
    defaultDescription: "Rent or mortgage payment",
  },
  {
    key: "interest",
    label: "Interest",
    defaultDirection: "credit",
    defaultDescription: "Account interest credit",
  },
  {
    key: "fee",
    label: "Fee",
    defaultDirection: "debit",
    defaultDescription: "Account service fee",
  },
  {
    key: "refund",
    label: "Refund",
    defaultDirection: "credit",
    defaultDescription: "Merchant refund",
  },
  {
    key: "deposit",
    label: "Deposit",
    defaultDirection: "credit",
    defaultDescription: "Account deposit",
  },
];

function formatUSD(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amountInCents || 0) / 100);
}

function getCategoryDefinition(category: TransactionCategory) {
  return categories.find((item) => item.key === category);
}

function getSynoxAccountName(
  customer: Customer | null,
  account: Account | null,
) {
  return (
    customer?.full_name ||
    account?.account_name ||
    "Synox account holder"
  );
}

function createDefaultConfig(
  category: TransactionCategory,
  customer: Customer | null,
  account: Account | null,
): TransactionConfig {
  const definition = getCategoryDefinition(category);

  const direction =
    definition?.defaultDirection || "credit";

  const synoxAccountName = getSynoxAccountName(
    customer,
    account,
  );

  if (direction === "credit") {
    return {
      category,
      direction,
      amount: "",
      transactionCount: "1",
      description:
        definition?.defaultDescription || "Transaction",

      fromBank: "",
      fromAccountName: "",
      fromAccountNumber: "",

      toBank: "Synox Bank",
      toAccountName: synoxAccountName,
      toAccountNumber: account?.account_number || "",
    };
  }

  return {
    category,
    direction,
    amount: "",
    transactionCount: "1",
    description:
      definition?.defaultDescription || "Transaction",

    fromBank: "Synox Bank",
    fromAccountName: synoxAccountName,
    fromAccountNumber: account?.account_number || "",

    toBank: "",
    toAccountName: "",
    toAccountNumber: "",
  };
}

export default function TransactionGenerator({
  customers,
  accounts,
}: {
  customers: Customer[];
  accounts: Account[];
}) {
  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [selectedAccountId, setSelectedAccountId] =
    useState("");

  const [mode, setMode] =
    useState<GenerationMode>("continue");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<TransactionCategory[]>([]);

  const [transactionConfigs, setTransactionConfigs] =
    useState<
      Partial<
        Record<TransactionCategory, TransactionConfig>
      >
    >({});

  const [preview, setPreview] = useState<
    PreviewTransaction[]
  >([]);

  const [previewLoading, setPreviewLoading] =
    useState(false);

  const [generateLoading, setGenerateLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const userAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          account.user_id === selectedUserId &&
          account.status === "active",
      ),
    [accounts, selectedUserId],
  );

  const selectedAccount = useMemo(
    () =>
      accounts.find(
        (account) =>
          account.id === selectedAccountId,
      ) || null,
    [accounts, selectedAccountId],
  );

  const selectedCustomer = useMemo(
    () =>
      customers.find(
        (customer) =>
          customer.id === selectedUserId,
      ) || null,
    [customers, selectedUserId],
  );

  const totalTransactionCount = useMemo(() => {
    return selectedCategories.reduce(
      (total, category) => {
        const config = transactionConfigs[category];

        return (
          total +
          Number(config?.transactionCount || 0)
        );
      },
      0,
    );
  }, [selectedCategories, transactionConfigs]);

  const previewTotalCredits = useMemo(() => {
    return preview.reduce(
      (total, transaction) =>
        transaction.type === "credit"
          ? total + transaction.amount
          : total,
      0,
    );
  }, [preview]);

  const previewTotalDebits = useMemo(() => {
    return preview.reduce(
      (total, transaction) =>
        transaction.type === "debit"
          ? total + transaction.amount
          : total,
      0,
    );
  }, [preview]);

  const calculatedEndingBalance =
    preview.length > 0
      ? preview[preview.length - 1].balance_after
      : selectedAccount?.balance || 0;

  useEffect(() => {
    if (!selectedAccount || !selectedCustomer) {
      return;
    }

    const synoxAccountName = getSynoxAccountName(
      selectedCustomer,
      selectedAccount,
    );

    setTransactionConfigs((current) => {
      const updated = { ...current };

      for (const category of selectedCategories) {
        const config = updated[category];

        if (!config) continue;

        if (config.direction === "credit") {
          updated[category] = {
            ...config,
            toBank: "Synox Bank",
            toAccountName: synoxAccountName,
            toAccountNumber:
              selectedAccount.account_number,
          };
        } else {
          updated[category] = {
            ...config,
            fromBank: "Synox Bank",
            fromAccountName: synoxAccountName,
            fromAccountNumber:
              selectedAccount.account_number,
          };
        }
      }

      return updated;
    });

    setPreview([]);
  }, [
    selectedAccount,
    selectedCustomer,
    selectedCategories,
  ]);

  const handleCustomerChange = (userId: string) => {
    setSelectedUserId(userId);

    const firstAccount = accounts.find(
      (account) =>
        account.user_id === userId &&
        account.status === "active",
    );

    setSelectedAccountId(firstAccount?.id || "");
    setSelectedCategories([]);
    setTransactionConfigs({});
    setPreview([]);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const toggleCategory = (
    category: TransactionCategory,
  ) => {
    const isSelected =
      selectedCategories.includes(category);

    if (isSelected) {
      setSelectedCategories((current) =>
        current.filter(
          (item) => item !== category,
        ),
      );

      setTransactionConfigs((current) => {
        const updated = { ...current };
        delete updated[category];
        return updated;
      });

      setPreview([]);
      return;
    }

    setSelectedCategories((current) => [
      ...current,
      category,
    ]);

    setTransactionConfigs((current) => ({
      ...current,
      [category]: createDefaultConfig(
        category,
        selectedCustomer,
        selectedAccount,
      ),
    }));

    setPreview([]);
  };

  const updateConfig = (
    category: TransactionCategory,
    updates: Partial<TransactionConfig>,
  ) => {
    setTransactionConfigs((current) => {
      const existing = current[category];

      if (!existing) return current;

      return {
        ...current,
        [category]: {
          ...existing,
          ...updates,
        },
      };
    });

    setPreview([]);
  };

  const handleDirectionChange = (
    category: TransactionCategory,
    direction: TransactionDirection,
  ) => {
    const existing = transactionConfigs[category];

    if (!existing) return;

    const synoxAccountName = getSynoxAccountName(
      selectedCustomer,
      selectedAccount,
    );

    if (direction === "credit") {
      updateConfig(category, {
        direction,

        fromBank:
          existing.direction === "credit"
            ? existing.fromBank
            : "",
        fromAccountName:
          existing.direction === "credit"
            ? existing.fromAccountName
            : "",
        fromAccountNumber:
          existing.direction === "credit"
            ? existing.fromAccountNumber
            : "",

        toBank: "Synox Bank",
        toAccountName: synoxAccountName,
        toAccountNumber:
          selectedAccount?.account_number || "",
      });

      return;
    }

    updateConfig(category, {
      direction,

      fromBank: "Synox Bank",
      fromAccountName: synoxAccountName,
      fromAccountNumber:
        selectedAccount?.account_number || "",

      toBank:
        existing.direction === "debit"
          ? existing.toBank
          : "",
      toAccountName:
        existing.direction === "debit"
          ? existing.toAccountName
          : "",
      toAccountNumber:
        existing.direction === "debit"
          ? existing.toAccountNumber
          : "",
    });
  };

  const validateForm = () => {
    if (!selectedUserId || !selectedAccountId) {
      return "Select a customer and account.";
    }

    if (!startDate || !endDate) {
      return "Select the transaction period.";
    }

    if (
      new Date(`${endDate}T23:59:59`) <
      new Date(`${startDate}T00:00:00`)
    ) {
      return "End date cannot be before start date.";
    }

    if (selectedCategories.length === 0) {
      return "Select at least one transaction type.";
    }

    if (
      totalTransactionCount < 1 ||
      totalTransactionCount > 1000
    ) {
      return "The total number of transactions must be between 1 and 1,000.";
    }

    for (const category of selectedCategories) {
      const config = transactionConfigs[category];

      if (!config) {
        return "One or more transaction configurations are missing.";
      }

      if (
        !config.amount ||
        Number(config.amount) <= 0
      ) {
        return `Enter a valid amount for ${
          getCategoryDefinition(category)?.label ||
          category
        }.`;
      }

      if (
        !config.transactionCount ||
        !Number.isInteger(
          Number(config.transactionCount),
        ) ||
        Number(config.transactionCount) < 1 ||
        Number(config.transactionCount) > 1000
      ) {
        return `Enter a valid transaction count for ${
          getCategoryDefinition(category)?.label ||
          category
        }.`;
      }

      if (!config.description.trim()) {
        return `Enter a transaction description for ${
          getCategoryDefinition(category)?.label ||
          category
        }.`;
      }

      if (
        !config.fromBank.trim() ||
        !config.fromAccountName.trim() ||
        !config.fromAccountNumber.trim()
      ) {
        return `Complete the source bank and account details for ${
          getCategoryDefinition(category)?.label ||
          category
        }.`;
      }

      if (
        !config.toBank.trim() ||
        !config.toAccountName.trim() ||
        !config.toAccountNumber.trim()
      ) {
        return `Complete the destination bank and account details for ${
          getCategoryDefinition(category)?.label ||
          category
        }.`;
      }
    }

    return "";
  };

  const getPayload = () => ({
    userId: selectedUserId,
    accountId: selectedAccountId,
    mode,
    startDate,
    endDate,

    transactionConfigs: selectedCategories.map(
      (category) => {
        const config =
          transactionConfigs[category]!;

        return {
          category: config.category,
          direction: config.direction,
          amount: Number(config.amount),
          transactionCount: Number(
            config.transactionCount,
          ),
          description: config.description.trim(),

          fromBank: config.fromBank.trim(),
          fromAccountName:
            config.fromAccountName.trim(),
          fromAccountNumber:
            config.fromAccountNumber.trim(),

          toBank: config.toBank.trim(),
          toAccountName:
            config.toAccountName.trim(),
          toAccountNumber:
            config.toAccountNumber.trim(),
        };
      },
    ),
  });

  const handlePreview = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setPreviewLoading(true);

    try {
      const res = await fetch(
        "/api/admin/transaction-generator/preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getPayload()),
        },
      );

      const data = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(
          data?.error ||
            "Unable to create preview.",
        );
        return;
      }

      setPreview(data.transactions || []);
    } catch {
      setErrorMsg(
        "Unable to connect to the preview service.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    if (preview.length === 0) {
      setErrorMsg(
        "Preview the transaction history before generating it.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Generate this synthetic transaction history and update the selected account balance?",
    );

    if (!confirmed) return;

    setGenerateLoading(true);

    try {
      const res = await fetch(
        "/api/admin/transaction-generator/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...getPayload(),
            transactions: preview,
          }),
        },
      );

      const data = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(
          data?.error ||
            "Unable to generate transaction history.",
        );
        return;
      }

      setSuccessMsg(
        `Generated ${
          data.transactionCount ||
          preview.length
        } synthetic transactions successfully. New account balance: ${formatUSD(
          data.endingBalance || 0,
        )}.`,
      );

      setPreview([]);
    } catch {
      setErrorMsg(
        "Unable to connect to the generation service.",
      );
    } finally {
      setGenerateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Admin tools
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Transaction History Generator
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
          Create backdated synthetic transaction
          history with admin-controlled amounts,
          descriptions, source accounts and destination
          accounts.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
          {successMsg}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Customer and account
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Customer
                </label>

                <select
                  value={selectedUserId}
                  onChange={(event) =>
                    handleCustomerChange(
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.full_name ||
                        "Unnamed customer"}{" "}
                      —{" "}
                      {customer.email || "No email"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account
                </label>

                <select
                  value={selectedAccountId}
                  onChange={(event) => {
                    setSelectedAccountId(
                      event.target.value,
                    );
                    setPreview([]);
                  }}
                  disabled={!selectedUserId}
                  className={inputClass}
                >
                  <option value="">
                    Select account
                  </option>

                  {userAccounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.account_name ||
                        account.account_type}{" "}
                      — {account.account_number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedAccount && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <InfoCard
                  label="Customer"
                  value={
                    selectedCustomer?.full_name ||
                    "Unknown"
                  }
                />

                <InfoCard
                  label="Account type"
                  value={selectedAccount.account_type}
                  capitalize
                />

                <InfoCard
                  label="Current balance"
                  value={formatUSD(
                    selectedAccount.balance,
                  )}
                />
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Generation period
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The selected period may be earlier than
              the account creation date.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mode
                </label>

                <select
                  value={mode}
                  onChange={(event) =>
                    setMode(
                      event.target
                        .value as GenerationMode,
                    )
                  }
                  className={inputClass}
                >
                  <option value="continue">
                    Continue existing synthetic history
                  </option>

                  <option value="new">
                    Start new synthetic history
                  </option>

                  <option value="replace">
                    Replace synthetic history in period
                  </option>
                </select>
              </div>

              <div />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(
                      event.target.value,
                    );
                    setPreview([]);
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setPreview([]);
                  }}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Transaction types
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select one or more transaction types.
              Each selected type will have its own
              amount, count and account details.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {categories.map((category) => {
                const selected =
                  selectedCategories.includes(
                    category.key,
                  );

                return (
                  <label
                    key={category.key}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {category.label}
                    </span>

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleCategory(category.key)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </label>
                );
              })}
            </div>
          </section>

          {selectedCategories.map((category) => {
            const config =
              transactionConfigs[category];

            const definition =
              getCategoryDefinition(category);

            if (!config) return null;

            return (
              <section
                key={category}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
                    Transaction configuration
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {definition?.label ||
                      category}
                  </h2>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction direction
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                        config.direction === "credit"
                          ? "border-green-500 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`direction-${category}`}
                        checked={
                          config.direction ===
                          "credit"
                        }
                        onChange={() =>
                          handleDirectionChange(
                            category,
                            "credit",
                          )
                        }
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Credit
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Add the amount to the account
                          balance.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                        config.direction === "debit"
                          ? "border-red-500 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`direction-${category}`}
                        checked={
                          config.direction ===
                          "debit"
                        }
                        onChange={() =>
                          handleDirectionChange(
                            category,
                            "debit",
                          )
                        }
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Debit
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Subtract the amount from the
                          account balance.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount for each transaction
                    </label>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={config.amount}
                      onChange={(event) =>
                        updateConfig(category, {
                          amount:
                            event.target.value,
                        })
                      }
                      placeholder="Example: 50000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Number of transactions
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="1"
                      value={
                        config.transactionCount
                      }
                      onChange={(event) =>
                        updateConfig(category, {
                          transactionCount:
                            event.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transaction description
                    </label>

                    <input
                      type="text"
                      value={config.description}
                      onChange={(event) =>
                        updateConfig(category, {
                          description:
                            event.target.value,
                        })
                      }
                      placeholder="Example: Incoming direct deposit"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-7 grid gap-6 lg:grid-cols-2">
                  <AccountDetailsSection
                    title="From account"
                    subtitle="The bank account sending the money."
                    bank={config.fromBank}
                    accountName={
                      config.fromAccountName
                    }
                    accountNumber={
                      config.fromAccountNumber
                    }
                    onBankChange={(value) =>
                      updateConfig(category, {
                        fromBank: value,
                      })
                    }
                    onAccountNameChange={(value) =>
                      updateConfig(category, {
                        fromAccountName: value,
                      })
                    }
                    onAccountNumberChange={(
                      value,
                    ) =>
                      updateConfig(category, {
                        fromAccountNumber: value,
                      })
                    }
                  />

                  <AccountDetailsSection
                    title="To account"
                    subtitle="The bank account receiving the money."
                    bank={config.toBank}
                    accountName={
                      config.toAccountName
                    }
                    accountNumber={
                      config.toAccountNumber
                    }
                    onBankChange={(value) =>
                      updateConfig(category, {
                        toBank: value,
                      })
                    }
                    onAccountNameChange={(value) =>
                      updateConfig(category, {
                        toAccountName: value,
                      })
                    }
                    onAccountNumberChange={(
                      value,
                    ) =>
                      updateConfig(category, {
                        toAccountNumber: value,
                      })
                    }
                  />
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Generation summary
            </h2>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Customer"
                value={
                  selectedCustomer?.full_name ||
                  "Not selected"
                }
              />

              <SummaryRow
                label="Account"
                value={
                  selectedAccount?.account_name ||
                  "Not selected"
                }
              />

              <SummaryRow
                label="Starting balance"
                value={
                  selectedAccount
                    ? formatUSD(
                        selectedAccount.balance,
                      )
                    : "$0.00"
                }
              />

              <SummaryRow
                label="Selected types"
                value={String(
                  selectedCategories.length,
                )}
              />

              <SummaryRow
                label="Total transactions"
                value={String(
                  totalTransactionCount,
                )}
              />

              {preview.length > 0 && (
                <>
                  <SummaryRow
                    label="Total credits"
                    value={formatUSD(
                      previewTotalCredits,
                    )}
                  />

                  <SummaryRow
                    label="Total debits"
                    value={formatUSD(
                      previewTotalDebits,
                    )}
                  />

                  <SummaryRow
                    label="Calculated ending balance"
                    value={formatUSD(
                      calculatedEndingBalance,
                    )}
                  />
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handlePreview}
              disabled={
                previewLoading ||
                generateLoading
              }
              className="mt-6 w-full rounded-xl border border-indigo-600 px-5 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
            >
              {previewLoading
                ? "Creating Preview..."
                : "Preview History"}
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                generateLoading ||
                previewLoading ||
                preview.length === 0
              }
              className="mt-3 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generateLoading
                ? "Generating History..."
                : "Generate History"}
            </button>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Preview
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review every generated entry before
                saving.
              </p>
            </div>

            {preview.length > 0 ? (
              <div className="max-h-[700px] divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
                {preview.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {
                            transaction.description
                          }
                        </p>

                        <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
                          {transaction.category.replaceAll(
                            "_",
                            " ",
                          )}{" "}
                          •{" "}
                          {new Date(
                            transaction.effective_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <p
                        className={`text-sm font-bold ${
                          transaction.type ===
                          "credit"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type ===
                        "credit"
                          ? "+"
                          : "-"}
                        {formatUSD(
                          transaction.amount,
                        )}
                      </p>
                    </div>

                    <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-950 dark:text-gray-400">
                      <p>
                        <span className="font-semibold">
                          From:
                        </span>{" "}
                        {transaction.from_bank} —{" "}
                        {
                          transaction.from_account_name
                        }{" "}
                        —{" "}
                        {
                          transaction.from_account_number
                        }
                      </p>

                      <p className="mt-1">
                        <span className="font-semibold">
                          To:
                        </span>{" "}
                        {transaction.to_bank} —{" "}
                        {
                          transaction.to_account_name
                        }{" "}
                        —{" "}
                        {
                          transaction.to_account_number
                        }
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Balance after:{" "}
                      {formatUSD(
                        transaction.balance_after,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No preview generated yet.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function AccountDetailsSection({
  title,
  subtitle,
  bank,
  accountName,
  accountNumber,
  onBankChange,
  onAccountNameChange,
  onAccountNumberChange,
}: {
  title: string;
  subtitle: string;
  bank: string;
  accountName: string;
  accountNumber: string;
  onBankChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bank name
          </label>

          <input
            type="text"
            value={bank}
            onChange={(event) =>
              onBankChange(event.target.value)
            }
            placeholder="Example: Chase Bank"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account name
          </label>

          <input
            type="text"
            value={accountName}
            onChange={(event) =>
              onAccountNameChange(
                event.target.value,
              )
            }
            placeholder="Account holder or company"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account number
          </label>

          <input
            type="text"
            value={accountNumber}
            onChange={(event) =>
              onAccountNumberChange(
                event.target.value,
              )
            }
            placeholder="Account number"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold text-gray-900 dark:text-white ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="text-right text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}