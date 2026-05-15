"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200";

export default function AccountApplicationForm({
  accountType,
}: {
  accountType: "checking" | "savings";
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    openingDeposit: "",
    ssnLast4: "",
    driversLicenseNumber: "",
    stateIdNumber: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const deposit = Number(form.openingDeposit || 0);

    if (deposit < 0 || deposit > 50000) {
      setErrorMsg("Opening deposit must be between $0 and $50,000.");
      return;
    }

    if (form.ssnLast4.length !== 4) {
      setErrorMsg("SSN must be the last 4 digits only.");
      return;
    }

    if (form.phone && form.phone.length < 10) {
      setErrorMsg("Phone number must be at least 10 digits.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/account-applications/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountType,
        ...form,
        openingDeposit: deposit,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Application submission failed.");
      return;
    }

    router.push("/account-application/submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            required
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className={inputClass}
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            required
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className={inputClass}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
                updateField(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 15)
                )
              }
            className={inputClass}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Opening Deposit USD
        </label>
        <input
          required
          type="number"
          min="0"
          max="50000"
          step="0.01"
          value={form.openingDeposit}
          onChange={(e) => updateField("openingDeposit", e.target.value)}
          className={inputClass}
          placeholder="Minimum $0 - Maximum $50,000"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            SSN Last 4 Digits
          </label>
          <input
            required
            maxLength={4}
            inputMode="numeric"
            value={form.ssnLast4}
            onChange={(e) =>
              updateField("ssnLast4", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            className={inputClass}
            placeholder="1234"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            required
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            className={inputClass}
            placeholder="Example: Texas"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Driver&apos;s License Number
          </label>
          <input
            value={form.driversLicenseNumber}
            onChange={(e) =>
              updateField("driversLicenseNumber", e.target.value)
            }
            className={inputClass}
            placeholder="Enter license number"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State ID Number
          </label>
          <input
            value={form.stateIdNumber}
            onChange={(e) => updateField("stateIdNumber", e.target.value)}
            className={inputClass}
            placeholder="Enter state ID number"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-medium text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting Application..." : `Apply for ${accountType} account`}
      </button>
    </form>
  );
}