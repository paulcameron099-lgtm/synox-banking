import { NextResponse } from "next/server";
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

type PreviewRequest = {
  userId: string;
  accountId: string;
  mode: GenerationMode;
  startDate: string;
  endDate: string;
  transactionConfigs: TransactionConfig[];
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

const DAY_IN_MS = 24 * 60 * 60 * 1000;

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

function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function toCents(amountInDollars: number) {
  return Math.round(amountInDollars * 100);
}

function validateConfig(
  value: unknown,
): value is TransactionConfig {
  if (!isPlainObject(value)) {
    return false;
  }

  if (
    typeof value.category !== "string" ||
    !VALID_CATEGORIES.includes(
      value.category as TransactionCategory,
    )
  ) {
    return false;
  }

  if (
    value.direction !== "credit" &&
    value.direction !== "debit"
  ) {
    return false;
  }

  if (
    !isFiniteNumber(value.amount) ||
    value.amount <= 0
  ) {
    return false;
  }

  if (
    !isFiniteNumber(value.transactionCount) ||
    !Number.isInteger(value.transactionCount) ||
    value.transactionCount < 1 ||
    value.transactionCount > 1000
  ) {
    return false;
  }

  const requiredStrings = [
    value.description,
    value.fromBank,
    value.fromAccountName,
    value.fromAccountNumber,
    value.toBank,
    value.toAccountName,
    value.toAccountNumber,
  ];

  return requiredStrings.every(
    (field) =>
      typeof field === "string" &&
      field.trim().length > 0,
  );
}

function validatePayload(
  body: unknown,
): string | null {
  if (!isPlainObject(body)) {
    return "Invalid request body.";
  }

  const data =
    body as Partial<PreviewRequest>;

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
    typeof data.startDate !== "string" ||
    typeof data.endDate !== "string"
  ) {
    return "A valid transaction period is required.";
  }

  const startDate = parseDateOnly(
    data.startDate,
  );

  const endDate = parseDateOnly(data.endDate);

  if (!startDate || !endDate) {
    return "Invalid start or end date.";
  }

  if (
    endDate.getTime() < startDate.getTime()
  ) {
    return "End date cannot be before start date.";
  }

  if (
    !Array.isArray(data.transactionConfigs) ||
    data.transactionConfigs.length === 0
  ) {
    return "Select and configure at least one transaction type.";
  }

  if (
    data.transactionConfigs.some(
      (config) => !validateConfig(config),
    )
  ) {
    return "One or more transaction configurations are invalid.";
  }

  const totalCount =
    data.transactionConfigs.reduce(
      (total, config) =>
        total + config.transactionCount,
      0,
    );

  if (totalCount < 1 || totalCount > 1000) {
    return "The total transaction count must be between 1 and 1,000.";
  }

  return null;
}

function createDistributedDates(
  startDate: Date,
  endDate: Date,
  count: number,
) {
  const dates: Date[] = [];

  const startTime = startDate.getTime();
  const endTime =
    endDate.getTime() +
    DAY_IN_MS -
    1;

  if (count === 1) {
    const middle =
      startTime +
      Math.floor((endTime - startTime) / 2);

    dates.push(new Date(middle));
    return dates;
  }

  const interval =
    (endTime - startTime) / (count - 1);

  for (let index = 0; index < count; index += 1) {
    const date = new Date(
      startTime +
        Math.round(interval * index),
    );

    date.setUTCHours(
      8 + (index % 10),
      (index * 17) % 60,
      (index * 11) % 60,
      0,
    );

    dates.push(date);
  }

  return dates;
}

function buildTransactions(
  payload: PreviewRequest,
  startingBalance: number,
): PreviewTransaction[] {
  const startDate = parseDateOnly(
    payload.startDate,
  )!;

  const endDate = parseDateOnly(
    payload.endDate,
  )!;

  const transactionsWithoutBalance =
    payload.transactionConfigs.flatMap(
      (config) => {
        const dates = createDistributedDates(
          startDate,
          endDate,
          config.transactionCount,
        );

        return dates.map((date) => ({
          id: crypto.randomUUID(),
          type: config.direction,
          category: config.category,
          amount: toCents(config.amount),
          description: config.description,
          effective_at: date.toISOString(),

          from_bank: config.fromBank,
          from_account_name:
            config.fromAccountName,
          from_account_number:
            config.fromAccountNumber,

          to_bank: config.toBank,
          to_account_name:
            config.toAccountName,
          to_account_number:
            config.toAccountNumber,
        }));
      },
    );

  transactionsWithoutBalance.sort(
    (first, second) =>
      new Date(first.effective_at).getTime() -
      new Date(second.effective_at).getTime(),
  );

  let runningBalance = startingBalance;

  return transactionsWithoutBalance.map(
    (transaction) => {
      runningBalance =
        transaction.type === "credit"
          ? runningBalance +
            transaction.amount
          : runningBalance -
            transaction.amount;

      return {
        ...transaction,
        balance_after: runningBalance,
      };
    },
  );
}

export async function POST(request: Request) {
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
      error: adminError,
    } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", authenticatedUser.id)
      .single();

    if (adminError || !adminProfile) {
      return NextResponse.json(
        {
          error:
            "Unable to verify your administrator account.",
        },
        { status: 403 },
      );
    }

    const role = String(
      adminProfile.role || "",
    ).toLowerCase();

    if (
      ![
        "admin",
        "super_admin",
        "super-admin",
      ].includes(role)
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
      validatePayload(body);

    if (validationError) {
      return NextResponse.json(
        {
          error: validationError,
        },
        { status: 400 },
      );
    }

    const payload = body as PreviewRequest;

    const { data: account, error: accountError } =
      await supabase
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

    if (
      account.account_type !== "checking" &&
      account.account_type !== "savings"
    ) {
      return NextResponse.json(
        {
          error:
            "History can only be generated for checking or savings accounts.",
        },
        { status: 400 },
      );
    }

    const startingBalance = Number(
      account.balance || 0,
    );

    if (
      !Number.isSafeInteger(startingBalance)
    ) {
      return NextResponse.json(
        {
          error:
            "The account has an invalid current balance.",
        },
        { status: 400 },
      );
    }

    const transactions = buildTransactions(
      payload,
      startingBalance,
    );

    const totalCredits =
      transactions.reduce(
        (total, transaction) =>
          transaction.type === "credit"
            ? total + transaction.amount
            : total,
        0,
      );

    const totalDebits =
      transactions.reduce(
        (total, transaction) =>
          transaction.type === "debit"
            ? total + transaction.amount
            : total,
        0,
      );

    const endingBalance =
      transactions[
        transactions.length - 1
      ]?.balance_after ?? startingBalance;

    return NextResponse.json({
      transactions,
      summary: {
        mode: payload.mode,
        transactionCount:
          transactions.length,
        startingBalance,
        endingBalance,
        totalCredits,
        totalDebits,
      },
    });
  } catch (error) {
    console.error(
      "Transaction preview error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create transaction preview.",
      },
      { status: 500 },
    );
  }
}