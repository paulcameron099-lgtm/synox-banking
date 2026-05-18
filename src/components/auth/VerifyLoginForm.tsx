"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VerifyLoginForm() {
  const searchParams = useSearchParams();
  const [resending, setResending] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
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

    const handleResendCode = async () => {
    setErrorMsg("");
    setInfoMsg("");
    setResending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setResending(false);
      setErrorMsg("Session expired. Please sign in again.");
      router.push("/login");
      return;
    }

    const res = await fetch("/api/auth/send-login-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        email,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setResending(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Unable to resend verification code.");
      return;
    }

    setInfoMsg("A new verification code has been sent to your email.");
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

        {infoMsg && (
          <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {infoMsg}
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
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resending || loading}
            className="w-full rounded-xl border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {resending ? "Sending new code..." : "Resend Code"}
          </button>
        </form>
      </div>
    </div>
  );
}