import AccountApplicationForm from "@/components/account-applications/AccountApplicationForm";

export default function SavingsPage() {
  return (
    <main className="bg-gray-50 px-4 py-16 lg:px-8 mt-28">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-300">
            Synox Savings
          </p>
          <h1 className="mt-4 text-4xl font-bold">
            Save securely for what matters.
          </h1>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            Apply for a Synox Savings Account to separate funds and build
            stronger financial habits.
          </p>
        </div>

        <div className="p-5 sm:p-8 lg:p-12">
          <h1 className="text-2xl font-bold text-gray-900">
            Apply for Savings Account
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Complete the form below. Your application will be reviewed within
            24 to 48 hours.
          </p>

          <div className="mt-8">
            <AccountApplicationForm accountType="savings" />
          </div>
        </div>
      </div>
    </main>
  );
}