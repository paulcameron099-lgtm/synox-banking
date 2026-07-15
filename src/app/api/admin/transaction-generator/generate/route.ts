import { NextResponse } from "next/server";
import {
  createClient as createSupabaseAdminClient,
} from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  amount: number;
  transactionCount: number;
  description: string;

  fromBank: string;
  fromAccountName: string;
  fromAccountNumber: string;

  toBank: string;
  toAccountName: string;
  toAccountNumber: string;
};

type GeneratedTransaction = {
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

type GenerateRequest = {
  userId: string;
  accountId: string;
  mode: GenerationMode;
  startDate: string;
  endDate: string;
  transactionConfigs: TransactionConfig[];
  transactions: GeneratedTransaction[];
};

const VALID_MODES: GenerationMode[] = [
  "continue",
  "new",
  "replace",
];

const VALID_CATEGORIES: TransactionCategory[] = [
  "payroll",
  "direct_deposit",
  "card_purchase",
  "atm_withdrawal",
  "internal_transfer",
  "external_transfer",
  "utility_bill",
  "rent_mortgage",
  "interest",
  "fee",
  "refund",
  "deposit",
];

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase service-role environment variables are missing.",
    );
  }

  return createSupabaseAdminClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isValidDate(value: unknown) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  return !Number.isNaN(
    new Date(
      `${value}T00:00:00.000Z`,
    ).getTime(),
  );
}

function validateTransaction(
  transaction: unknown,
  startDate: Date,
  endDate: Date,
): transaction is GeneratedTransaction {
  if (!isPlainObject(transaction)) {
    return false;
  }

  if (
    typeof transaction.id !== "string" ||
    !transaction.id
  ) {
    return false;
  }

  if (
    transaction.type !== "credit" &&
    transaction.type !== "debit"
  ) {
    return false;
  }

  if (
    typeof transaction.category !== "string" ||
    !VALID_CATEGORIES.includes(
      transaction.category as TransactionCategory,
    )
  ) {
    return false;
  }

  if (
    !isFiniteNumber(transaction.amount) ||
    !Number.isSafeInteger(
      transaction.amount,
    ) ||
    transaction.amount <= 0
  ) {
    return false;
  }

  if (
    typeof transaction.description !==
      "string" ||
    !transaction.description.trim()
  ) {
    return false;
  }

  if (
    typeof transaction.effective_at !==
    "string"
  ) {
    return false;
  }

  const effectiveDate = new Date(
    transaction.effective_at,
  );

  if (
    Number.isNaN(effectiveDate.getTime()) ||
    effectiveDate.getTime() <
      startDate.getTime() ||
    effectiveDate.getTime() >
      endDate.getTime()
  ) {
    return false;
  }

  if (
    !isFiniteNumber(
      transaction.balance_after,
    ) ||
    !Number.isSafeInteger(
      transaction.balance_after,
    )
  ) {
    return false;
  }

  const requiredStrings = [
    transaction.from_bank,
    transaction.from_account_name,
    transaction.from_account_number,
    transaction.to_bank,
    transaction.to_account_name,
    transaction.to_account_number,
  ];

  return requiredStrings.every(
    (field) =>
      typeof field === "string" &&
      field.trim().length > 0,
  );
}

function validateRequest(
  body: unknown,
): string | null {
  if (!isPlainObject(body)) {
    return "Invalid request body.";
  }

  const data =
    body as Partial<GenerateRequest>;

  if (
    typeof data.userId !== "string" ||
    !data.userId
  ) {
    return "A customer is required.";
  }

  if (
    typeof data.accountId !== "string" ||
    !data.accountId
  ) {
    return "An account is required.";
  }

  if (
    typeof data.mode !== "string" ||
    !VALID_MODES.includes(
      data.mode as GenerationMode,
    )
  ) {
    return "Invalid generation mode.";
  }

  if (
    !isValidDate(data.startDate) ||
    !isValidDate(data.endDate)
  ) {
    return "A valid transaction period is required.";
  }

  const startDate = new Date(
    `${data.startDate}T00:00:00.000Z`,
  );

  const endDate = new Date(
    `${data.endDate}T23:59:59.999Z`,
  );

  if (
    endDate.getTime() < startDate.getTime()
  ) {
    return "End date cannot be before start date.";
  }

  if (
    !Array.isArray(data.transactions) ||
    data.transactions.length === 0 ||
    data.transactions.length > 1000
  ) {
    return "The generated transaction list must contain between 1 and 1,000 transactions.";
  }

  if (
    data.transactions.some(
      (transaction) =>
        !validateTransaction(
          transaction,
          startDate,
          endDate,
        ),
    )
  ) {
    return "One or more preview transactions are invalid.";
  }

  return null;
}

function verifyRunningBalances(
  transactions: GeneratedTransaction[],
  startingBalance: number,
): string | null {
  const sortedTransactions = [
    ...transactions,
  ].sort(
    (first, second) =>
      new Date(first.effective_at).getTime() -
      new Date(second.effective_at).getTime(),
  );

  let runningBalance = startingBalance;

  for (const transaction of sortedTransactions) {
    runningBalance =
      transaction.type === "credit"
        ? runningBalance +
          transaction.amount
        : runningBalance -
          transaction.amount;

    if (
      runningBalance !==
      transaction.balance_after
    ) {
      return `The running balance is invalid for transaction "${transaction.description}". Create a new preview before generating.`;
    }
  }

  return null;
}

function createReference(
  batchId: string,
  index: number,
) {
  const batchPart = batchId
    .replaceAll("-", "")
    .slice(0, 10)
    .toUpperCase();

  return `SYN-${batchPart}-${String(
    index + 1,
  ).padStart(4, "0")}`;
}

export async function POST(request: Request) {
  let insertedEntryIds: string[] = [];
  let deletedEntriesBackup: Record<
    string,
    unknown
  >[] = [];

  let previousBalance: number | null =
    null;

  let accountIdForRollback = "";

  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user: authenticatedUser },
      error: authenticationError,
    } = await supabase.auth.getUser();

    if (
      authenticationError ||
      !authenticatedUser
    ) {
      return NextResponse.json(
        {
          error: "You must be signed in.",
        },
        { status: 401 },
      );
    }

    const {
      data: adminProfile,
      error: adminProfileError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("id", authenticatedUser.id)
      .single();

    if (
      adminProfileError ||
      !adminProfile
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to verify your administrator account.",
        },
        { status: 403 },
      );
    }

    const adminRole = String(
      adminProfile.role || "",
    ).toLowerCase();

    if (
      ![
        "admin",
        "super_admin",
        "super-admin",
      ].includes(adminRole)
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to generate transaction history.",
        },
        { status: 403 },
      );
    }

    const body: unknown = await request
      .json()
      .catch(() => null);

    const validationError =
      validateRequest(body);

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        { status: 400 },
      );
    }

    const payload = body as GenerateRequest;
    const adminSupabase = getAdminClient();

    const {
      data: customer,
      error: customerError,
    } = await adminSupabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", payload.userId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        {
          error:
            "The selected customer could not be found.",
        },
        { status: 404 },
      );
    }

    const {
      data: account,
      error: accountError,
    } = await adminSupabase
      .from("accounts")
      .select(
        "id, user_id, account_name, account_type, account_number, balance, status",
      )
      .eq("id", payload.accountId)
      .eq("user_id", payload.userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        {
          error:
            "The selected account does not belong to this customer.",
        },
        { status: 404 },
      );
    }

    if (account.status !== "active") {
      return NextResponse.json(
        {
          error:
            "The selected account is not active.",
        },
        { status: 400 },
      );
    }

    previousBalance = Number(
      account.balance || 0,
    );

    accountIdForRollback = account.id;

    if (
      !Number.isSafeInteger(previousBalance)
    ) {
      return NextResponse.json(
        {
          error:
            "The selected account has an invalid balance.",
        },
        { status: 400 },
      );
    }

    const runningBalanceError =
      verifyRunningBalances(
        payload.transactions,
        previousBalance,
      );

    if (runningBalanceError) {
      return NextResponse.json(
        {
          error: runningBalanceError,
        },
        { status: 400 },
      );
    }

    const batchId = crypto.randomUUID();

    if (payload.mode === "new") {
      const {
        data: entriesToDelete,
        error: inspectError,
      } = await adminSupabase
        .from("ledger_entries")
        .select("*")
        .eq("account_id", account.id)
        .eq("is_synthetic", true);

      if (inspectError) {
        throw new Error(
          `Unable to inspect existing synthetic history: ${inspectError.message}`,
        );
      }

      deletedEntriesBackup =
        (entriesToDelete as Record<
          string,
          unknown
        >[]) || [];

      if (
        deletedEntriesBackup.length > 0
      ) {
        const ids =
          deletedEntriesBackup.map(
            (entry) => String(entry.id),
          );

        const { error: deleteError } =
          await adminSupabase
            .from("ledger_entries")
            .delete()
            .in("id", ids);

        if (deleteError) {
          throw new Error(
            `Unable to remove existing synthetic history: ${deleteError.message}`,
          );
        }
      }
    }

    if (payload.mode === "replace") {
      const periodStart = `${payload.startDate}T00:00:00.000Z`;
      const periodEnd = `${payload.endDate}T23:59:59.999Z`;

      const {
        data: entriesToDelete,
        error: inspectError,
      } = await adminSupabase
        .from("ledger_entries")
        .select("*")
        .eq("account_id", account.id)
        .eq("is_synthetic", true)
        .gte("created_at", periodStart)
        .lte("created_at", periodEnd);

      if (inspectError) {
        throw new Error(
          `Unable to inspect the selected history period: ${inspectError.message}`,
        );
      }

      deletedEntriesBackup =
        (entriesToDelete as Record<
          string,
          unknown
        >[]) || [];

      if (
        deletedEntriesBackup.length > 0
      ) {
        const ids =
          deletedEntriesBackup.map(
            (entry) => String(entry.id),
          );

        const { error: deleteError } =
          await adminSupabase
            .from("ledger_entries")
            .delete()
            .in("id", ids);

        if (deleteError) {
          throw new Error(
            `Unable to replace the selected history period: ${deleteError.message}`,
          );
        }
      }
    }

    const sortedTransactions = [
      ...payload.transactions,
    ].sort(
      (first, second) =>
        new Date(
          first.effective_at,
        ).getTime() -
        new Date(
          second.effective_at,
        ).getTime(),
    );

    const generatedAt =
      new Date().toISOString();

    const ledgerRows =
      sortedTransactions.map(
        (transaction, index) => ({
          account_id: account.id,
          user_id: payload.userId,
          type: transaction.type,
          amount: transaction.amount,
          reference: createReference(
            batchId,
            index,
          ),
          status: "completed",
          description:
            transaction.description,

          is_synthetic: true,
          generator_batch_id: batchId,
          generated_by:
            authenticatedUser.id,
          synthetic_created_at:
            generatedAt,

          created_at:
            transaction.effective_at,

          metadata: {
            category:
              transaction.category,
            synthetic: true,
            generator_mode: payload.mode,
            generator_batch_id: batchId,
            generated_by:
              authenticatedUser.id,
            balance_after:
              transaction.balance_after,

            from_bank:
              transaction.from_bank,
            from_account_name:
              transaction.from_account_name,
            from_account_number:
              transaction.from_account_number,

            to_bank:
              transaction.to_bank,
            to_account_name:
              transaction.to_account_name,
            to_account_number:
              transaction.to_account_number,

            preview_transaction_id:
              transaction.id,
          },
        }),
      );

    const {
      data: insertedEntries,
      error: insertError,
    } = await adminSupabase
      .from("ledger_entries")
      .insert(ledgerRows)
      .select("id");

    if (insertError) {
      throw new Error(
        `Unable to insert generated transactions: ${insertError.message}`,
      );
    }

    insertedEntryIds =
      insertedEntries?.map(
        (entry) => entry.id,
      ) || [];

    const endingBalance =
      sortedTransactions[
        sortedTransactions.length - 1
      ]?.balance_after ?? previousBalance;

    const { error: balanceError } =
      await adminSupabase
        .from("accounts")
        .update({
          balance: endingBalance,
        })
        .eq("id", account.id)
        .eq("user_id", payload.userId);

    if (balanceError) {
      throw new Error(
        `Unable to update the account balance: ${balanceError.message}`,
      );
    }

    const totalCredits =
      sortedTransactions.reduce(
        (total, transaction) =>
          transaction.type === "credit"
            ? total + transaction.amount
            : total,
        0,
      );

    const totalDebits =
      sortedTransactions.reduce(
        (total, transaction) =>
          transaction.type === "debit"
            ? total + transaction.amount
            : total,
        0,
      );

    const { error: auditError } =
      await adminSupabase
        .from("admin_activity_logs")
        .insert({
          admin_id:
            authenticatedUser.id,

          action:
            "generate_synthetic_transaction_history",

          target_user_id:
            payload.userId,

          account_id: account.id,

          generator_batch_id:
            batchId,

          description: `${
            adminProfile.full_name ||
            "Administrator"
          } generated ${
            sortedTransactions.length
          } synthetic transactions for ${
            customer.full_name ||
            customer.email ||
            "customer"
          }.`,

          metadata: {
            mode: payload.mode,
            transaction_count:
              sortedTransactions.length,
            period_start:
              payload.startDate,
            period_end: payload.endDate,
            previous_balance:
              previousBalance,
            ending_balance:
              endingBalance,
            total_credits:
              totalCredits,
            total_debits: totalDebits,
            deleted_synthetic_entries:
              deletedEntriesBackup.length,
            account_number:
              account.account_number,
            account_type:
              account.account_type,
            customer_email:
              customer.email,
          },
        });

    if (auditError) {
      throw new Error(
        `Transactions were created, but the audit log failed: ${auditError.message}`,
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Synthetic transaction history generated successfully.",
      batchId,
      transactionCount:
        sortedTransactions.length,
      deletedTransactionCount:
        deletedEntriesBackup.length,
      previousBalance,
      endingBalance,
      totalCredits,
      totalDebits,
    });
  } catch (error) {
    console.error(
      "Transaction generation error:",
      error,
    );

    try {
      const adminSupabase =
        getAdminClient();

      if (insertedEntryIds.length > 0) {
        await adminSupabase
          .from("ledger_entries")
          .delete()
          .in("id", insertedEntryIds);
      }

      if (
        deletedEntriesBackup.length > 0
      ) {
        await adminSupabase
          .from("ledger_entries")
          .insert(deletedEntriesBackup);
      }

      if (
        accountIdForRollback &&
        previousBalance !== null
      ) {
        await adminSupabase
          .from("accounts")
          .update({
            balance: previousBalance,
          })
          .eq("id", accountIdForRollback);
      }
    } catch (rollbackError) {
      console.error(
        "Transaction generator rollback failed:",
        rollbackError,
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate transaction history.",
      },
      { status: 500 },
    );
  }
}