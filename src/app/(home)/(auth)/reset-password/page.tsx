"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-200";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
  const prepareRecoverySession = async () => {
    setErrorMsg("");

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      setErrorMsg(
        "Your reset link has expired or is invalid. Please request a new password reset link."
      );
      return;
    }

    setSessionReady(true);
  };

  prepareRecoverySession();
}, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Your password has been updated successfully.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <h2 className="mb-2 text-2xl font-bold text-[#374151]">
              Reset your password
            </h2>

            <p className="mb-6 text-sm leading-6 text-gray-500">
              Enter a new password for your Synox account.
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
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`${inputClass} pr-12`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPwd((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                    aria-label="Toggle password"
                  >
                    {showPwd ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#374151]">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Confirm new password"
                    className={`${inputClass} pr-12`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirmPwd ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !sessionReady}
                className="w-full rounded-xl bg-zinc-950 py-3 font-medium text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating password..."
                  : !sessionReady
                  ? "Preparing reset session..."
                  : "Update Password"}
              </button>

              {successMsg && (
                <p className="text-sm text-[#374151]">
                  Password updated?{" "}
                  <Link href="/login" className="font-medium text-[#1e1e1e]">
                    Sign in
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="relative hidden bg-zinc-900 lg:block">
          <div className="absolute inset-0 bg-linear-to-br from-zinc-900/75 via-zinc-900/45 to-zinc-900/70" />

          <img
            src="/images/auth/banking-login.jpg"
            alt="Secure password reset"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <div className="max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <h3 className="text-2xl font-bold">Protect your Synox account</h3>
              <p className="mt-3 text-sm leading-6 text-gray-100">
                Choose a strong password to keep your banking dashboard secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}