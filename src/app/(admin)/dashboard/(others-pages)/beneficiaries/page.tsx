import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";

export default async function BeneficiariesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: beneficiaries, error } = await supabase
    .from("beneficiaries")
    .select(
      "id, beneficiary_name, beneficiary_account_number, beneficiary_bank_name, beneficiary_type, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Beneficiaries
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your saved Synox transfer recipients.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {beneficiaries && beneficiaries.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {beneficiaries.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.beneficiary_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.beneficiary_account_number} •{" "}
                    {item.beneficiary_bank_name}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  {item.beneficiary_type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No beneficiaries saved yet.
          </div>
        )}
      </div>
    </div>
  );
}