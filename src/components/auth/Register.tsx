"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";


const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600";

function normalizeEmail(raw: string) {
  return raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [country, setCountry] = useState("");
  const [cityState, setCityState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [agreed, setAgreed] = useState(false); // NEW

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPostSignupActions, setShowPostSignupActions] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");

  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  useEffect(() => {
  const fetchApplication = async () => {
    if (!applicationId) {
      setErrorMsg("Missing approved application ID.");
      return;
    }

    const res = await fetch(
      `/api/account-applications/get-approved?applicationId=${applicationId}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data?.error || "Unable to load approved application.");
      return;
    }

    setFullName(`${data.application.first_name} ${data.application.last_name}`);
    setEmail(data.application.email);
    setPhone(data.application.phone || "");
  };

  fetchApplication();
}, [applicationId]);

  const phoneError = useMemo(() => {
    if (!phone) return "";
    if (!/^\d+$/.test(phone)) return "Phone number must contain digits only.";
    if (phone.length !== 11) return "Phone number must be 11 digits.";
    return "";
  }, [phone]);

  const clearInputs = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setProfession("");
    setCountry("");
    setCityState("");
    setPostalCode("");
    setPassword("");
    setConfirmPassword("");
    setShowPwd(false);
    setShowConfirmPwd(false);
    setAgreed(false); // NEW
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setShowPostSignupActions(false);

    // Guard (also keep on server-side logic, even though button is disabled)
    if (!agreed) {
      return setErrorMsg(
        "You must agree to Synox Privacy Policy and Terms & Conditions.",
      );
    }

    if (phoneError) return setErrorMsg(phoneError);
    if (password !== confirmPassword)
      return setErrorMsg("Passwords do not match.");

    const usedEmail = normalizeEmail(email);
    if (!usedEmail || !isValidEmail(usedEmail)) {
      return setErrorMsg("Unable to validate email.");
    }

    setSignupEmail(usedEmail);
    setLoading(true);

    // 1) CHECK EMAIL EXISTS FIRST
    try {
      const res = await fetch(
        `/api/auth/email-exists?email=${encodeURIComponent(usedEmail)}`,
        { cache: "no-store" },
      );

      const text = await res.text();
      let json: any = null;

      try {
        json = JSON.parse(text);
      } catch {
        setLoading(false);
        return setErrorMsg(
          `Email check failed (non-JSON): ${text.slice(0, 120)}`,
        );
      }

      if (!res.ok) {
        setLoading(false);
        return setErrorMsg(json?.error || `Email check failed (${res.status})`);
      }

      if (json?.exists) {
        setLoading(false);
        setShowPostSignupActions(true);
        return setErrorMsg("Email already exist, kindly sign-in.");
      }
    } catch (e: any) {
      setLoading(false);
      return setErrorMsg(
        `Email check failed: ${e?.message || "Network error"}`,
      );
    }

    // 2) NOW create account
    const { data, error } = await supabase.auth.signUp({
      email: usedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
          phone,
          profession: profession.trim(),
          country: country.trim(),
          city_state: cityState.trim(),
          postal_code: postalCode.trim(),
          role: "user",
          agreed_to_terms: true,
          agreed_at: new Date().toISOString(),
        },
      },
    });

    setLoading(false);

    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (
        msg.includes("already") ||
        msg.includes("exists") ||
        msg.includes("registered")
      ) {
        setShowPostSignupActions(true);
        return setErrorMsg("Email already exist, kindly sign-in.");
      }
      if (msg.includes("validate email")) {
        return setErrorMsg("Unable to validate email.");
      }
      return setErrorMsg(error.message);
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      return setErrorMsg("Account created, but user data was not returned.");
    }

    const profileRes = await fetch("/api/auth/create-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     body: JSON.stringify({
      userId: user.id,
      fullName: fullName.trim(),
      email: usedEmail,
      phone,
      profession: profession.trim(),
      country: country.trim(),
      cityState: cityState.trim(),
      postalCode: postalCode.trim(),
    }),
    });

    const profileJson = await profileRes.json();

    if (!profileRes.ok) {
      setLoading(false);
      return setErrorMsg(
        profileJson?.error || "Failed to create profile/account.",
      );
    }

    clearInputs();
    setSuccessMsg("Sign-Up Successfull, Confirmation email sent!");
    setShowPostSignupActions(true);
  };

  const resendConfirmationEmail = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setResendLoading(true);

    const targetEmail = normalizeEmail(signupEmail);
    if (!targetEmail || !isValidEmail(targetEmail)) {
      setResendLoading(false);
      return setErrorMsg("Unable to validate email.");
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: targetEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setResendLoading(false);

    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("validate email"))
        return setErrorMsg("Unable to validate email.");
      return setErrorMsg(error.message);
    }

    setSuccessMsg("Confirmation email resent. Please check your inbox.");
    setShowPostSignupActions(true);
  };

  // Disable submit until checkbox is checked (and also block while loading)
  const submitDisabled = loading || resendLoading || !agreed;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-10 lg:px-8 mt-20">
  <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
    {/* LEFT: FORM */}
    <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold text-[#374151] mb-4">
          Create your Synox account
        </h2>

        <p className="text-[#374151] font-medium mb-4">
          Start banking smarter and securely.
        </p>

         {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-[#1e1e1e]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Approved Application</p>
          <p className="mt-1">{fullName || "Loading applicant..."}</p>
          <p className="mt-1">{email || "Loading email..."}</p>
          {phone && <p className="mt-1">{phone}</p>}
        </div>

          <div>
              <label className="block text-sm font-medium mb-1 text-[#374151]">
                Profession
              </label>
              <input
                type="text"
                placeholder="Enter your profession"
                className={inputClass}
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                required
                disabled={loading || resendLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#374151]">
                Country
              </label>
              <input
                type="text"
                placeholder="Enter your country"
                className={inputClass}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                disabled={loading || resendLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#374151]">
                City/State
              </label>
              <input
                type="text"
                placeholder="Enter your city or state"
                className={inputClass}
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                required
                disabled={loading || resendLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#374151]">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="Enter your postal code"
                className={inputClass}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                disabled={loading || resendLoading}
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
                disabled={loading || resendLoading}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading || resendLoading}
                aria-label="Toggle password"
              >
                {showPwd ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#374151]">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPwd ? "text" : "password"}
                placeholder="Confirm password"
                className={`${inputClass} pr-12`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || resendLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading || resendLoading}
                aria-label="Toggle confirm password"
              >
                {showConfirmPwd ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms & Privacy (must agree) */}
          <div className="flex items-start gap-2 text-sm text-[#374151]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1e1e1e] focus:ring-zinc-950"
              disabled={loading || resendLoading}
            />
            <p>
              I have read and agreed to Synox{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-[#1e1e1e] font-medium underline hover:text-[#1e1e1e]"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-and-conditions"
                target="_blank"
                className="text-[#1e1e1e] font-medium underline hover:text-[#1e1e1e]"
              >
                Terms & Conditions
              </Link>
            </p>
          </div>

          {/* Submit disabled until agreed */}
          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full rounded-xl bg-zinc-950 text-white py-3 font-medium hover:bg-zinc-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
            title={
              !agreed ? "Please agree to Privacy Policy and Terms first" : ""
            }
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {showPostSignupActions ? (
            <div className="space-y-2 text-sm text-left">
              <button
                type="button"
                onClick={resendConfirmationEmail}
                disabled={resendLoading || !signupEmail}
                className="text-[#1e1e1e] underline font-medium disabled:opacity-60"
              >
                {resendLoading ? "Resending..." : "Resend confirmation email"}
              </button>

              <p className="text-[#374151]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#1e1e1e] font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <div className="text-sm text-left">
              <p className="text-[#374151]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#1e1e1e] font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>

    {/* RIGHT: IMAGE - hidden on mobile */}
    <div className="relative hidden bg-zinc-900 lg:block">
      <div className="absolute inset-0 bg-linear-to-br from-zinc-900/75 via-zinc-900/40 to-zinc-900/70" />

      <img
        src="/images/reg-image.avif"
        alt="Digital banking registration"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 p-10 text-white">
        <div className="max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-md">
          <h3 className="text-2xl font-bold">Open your Synox account</h3>
          <p className="mt-3 text-sm leading-6 text-gray-100">
            Create a secure wallet, verify your identity, apply for a card, and
            manage your money confidently.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
