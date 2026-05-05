"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestFundButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fundWallet = async () => {
    setLoading(true);

    const res = await fetch("/api/dev/fund-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        amount: 1000000, // $500.00
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data?.error || "Funding failed");
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={fundWallet}
      disabled={loading}
      className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {loading ? "Funding..." : "Add Test $10,000"}
    </button>
  );
}