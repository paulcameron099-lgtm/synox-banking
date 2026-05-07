import Link from "next/link";

export default function AccountApplicationSubmittedPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-16 mt-28">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">
          ✓
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Application Under Review
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your Synox account application has been received successfully. Our
          account review team will review your information and contact you
          within 24 to 48 hours.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-900"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}