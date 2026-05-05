"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-200";

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const usedEmail = normalizeEmail(email);

    const { error } = await supabase.auth.resetPasswordForEmail(usedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg(
      "Password reset link sent. Please check your email inbox."
    );
    setEmail("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 lg:px-8 mt-28">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <h2 className="mb-2 text-2xl font-bold text-[#374151]">
              Forgot your password?
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-500">
              Enter your Synox account email and we’ll send you a secure link to
              reset your password.
            </p>

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#374151]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-zinc-950 py-3 font-medium text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending reset link..." : "Send Reset Link"}
              </button>

              <p className="text-sm text-[#374151]">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-[#1e1e1e]">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="relative hidden bg-zinc-900 lg:block">
          <div className="absolute inset-0 bg-linear-to-br from-zinc-900/75 via-zinc-900/45 to-zinc-900/70" />

          <img
            src="/images/auth/banking-login.jpg"
            alt="Secure password recovery"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <div className="max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <h3 className="text-2xl font-bold">Secure account recovery</h3>
              <p className="mt-3 text-sm leading-6 text-gray-100">
                Reset your password safely and regain access to your Synox
                banking dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}