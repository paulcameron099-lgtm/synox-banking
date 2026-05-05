"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CardApplication = {
  id: string;
  card_type: string;
  card_name: string;
  status: string;
  rejection_reason: string | null;
  requested_at: string;
  reviewed_at: string | null;
};

function getStatusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";
    case "pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export default function CardsPage() {
  const [applications, setApplications] = useState<CardApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchApplications = async () => {
    setPageLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPageLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("card_applications")
      .select(
        "id, card_type, card_name, status, rejection_reason, requested_at, reviewed_at"
      )
      .eq("user_id", user.id)
      .order("requested_at", { ascending: false });

    if (!error && data) {
      setApplications(data);
    }

    setPageLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApply = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await fetch("/api/cards/apply", {
      method: "POST",
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Card application failed.");
      return;
    }

    setSuccessMsg(
      data?.emailWarning ||
        "Your Synox Debit Card application has been submitted successfully."
    );

    await fetchApplications();
  };

  const latestApplication = applications[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cards
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Apply for and manage your Synox Debit Card.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="rounded-2xl bg-linear-to-br from-gray-950 to-gray-800 p-6 text-white shadow-sm">
            <p className="text-sm text-gray-300">Synox</p>
            <h2 className="mt-8 text-xl font-semibold">Debit Card</h2>
            <p className="mt-6 tracking-[0.35em] text-gray-200">
              **** **** **** 4829
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-gray-300">
              <span>USD Account</span>
              <span>VIRTUAL / PHYSICAL</span>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
            Synox Debit Card
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Apply for a debit card linked to your Synox account. Your account
            must be verified before applying.
          </p>

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
              {successMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleApply}
            disabled={
              loading ||
              latestApplication?.status === "pending" ||
              latestApplication?.status === "approved"
            }
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Submitting..."
              : latestApplication?.status === "pending"
              ? "Application Pending"
              : latestApplication?.status === "approved"
              ? "Card Approved"
              : "Apply for Debit Card"}
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Card Application History
          </h2>

          <div className="mt-5">
            {pageLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading applications...
              </p>
            ) : applications.length > 0 ? (
              <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                {applications.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.card_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Requested:{" "}
                          {new Date(item.requested_at).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.rejection_reason && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                        Reason: {item.rejection_reason}
                      </p>
                    )}

                    {item.status === "approved" && (
                      <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                        Your card is being prepared for delivery.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No card applications yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}