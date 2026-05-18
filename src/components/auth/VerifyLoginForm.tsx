"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    const res = await fetch("/api/auth/verify-login-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Verification failed.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold">
          Verify Login
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Enter the 6-digit code sent to your email.
        </p>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter verification code"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl tracking-[10px] outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 text-white font-medium"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}