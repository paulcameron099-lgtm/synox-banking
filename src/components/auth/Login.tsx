"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
  if (searchParams.get("confirmed") === "true") {
    setInfoMsg("Email confirmed successfully. You can now sign in.");
  }
}, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  setErrorMsg("");
  setInfoMsg("");
  setShowResend(false);
  setLoading(true);

  const usedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usedEmail,
    password,
  });

  if (error) {
    setLoading(false);

    const msg = error.message || "Unable to sign in.";
    setErrorMsg(msg);

    if (msg.toLowerCase().includes("email not confirmed")) {
      setShowResend(true);
    }

    return;
  }

  if (!data.session || !data.user) {
    setLoading(false);
    setErrorMsg("Login succeeded, but no session was created.");
    return;
  }

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role, admin_status")
  .eq("id", data.user.id)
  .single();

  if (profileError) {
    setLoading(false);
    setErrorMsg("Unable to verify user role.");
    return;
  }

  setInfoMsg("Signed in successfully. Redirecting...");
  setEmail("");
  setPassword("");
  setLoading(false);

  router.refresh();

const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

if (isAdmin && profile?.admin_status === "deactivated") {
  await supabase.auth.signOut();
  setLoading(false);
  setErrorMsg(
    "Your admin access has been deactivated. Please contact the super admin."
  );
  return;
}

if (isAdmin) {
  router.push("/dashboard");
} else {
  router.push("/dashboard");
}
};

  const resendConfirmationEmail = async () => {
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setInfoMsg("Confirmation email resent. Please check your inbox.");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 lg:px-8 mt-28">
  <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
    {/* LEFT: FORM */}
    <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#374151] mb-2">
          Sign in to your Synox account
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          Securely access your banking dashboard.
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            {infoMsg}
          </div>
        )}

         <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#374151]">
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

          <div>
            <label className="block text-sm font-medium mb-1 text-[#374151]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                className={`${inputClass} pr-12`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password"
                disabled={loading}
              >
                {showPwd ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-950 text-white py-3 font-medium hover:bg-zinc-950 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {showResend && (
            <div className="text-left">
              <button
                type="button"
                onClick={resendConfirmationEmail}
                disabled={loading || !email}
                className="text-sm text-[#1e1e1e] underline font-medium disabled:opacity-60"
              >
                Resend confirmation email
              </button>
            </div>
          )}

          <div className="text-sm text-left space-y-2">
            <p className="text-[#374151]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#1e1e1e] font-medium">
                Sign up
              </Link>
            </p>

            <Link
              href="/forgot-password"
              className="text-[#1e1e1e] font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>

    {/* RIGHT: IMAGE - hidden on mobile */}
    <div className="relative hidden bg-zinc-900 lg:block">
      <div className="absolute inset-0 bg-linear-to-br from-zinc-900/75 via-zinc-900/45 to-zinc-900/70" />

      <img
        src="/images/login-image.webp"
        alt="Secure online banking"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 p-10 text-white">
        <div className="max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-md">
          <h3 className="text-2xl font-bold">Bank smarter with Synox</h3>
          <p className="mt-3 text-sm leading-6 text-gray-100">
            Manage your balance, transfers, cards, verification, and secure
            banking activity from one trusted dashboard.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}