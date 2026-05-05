"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const fileInputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white";

type FileKey =
  | "passportPhoto"
  | "driversLicenseFront"
  | "driversLicenseBack"
  | "ssnFront"
  | "ssnBack";

export default function KYCPage() {
  const [files, setFiles] = useState<Record<FileKey, File | null>>({
    passportPhoto: null,
    driversLicenseFront: null,
    driversLicenseBack: null,
    ssnFront: null,
    ssnBack: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (key: FileKey, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const uploadFile = async (userId: string, key: FileKey, file: File) => {
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${key}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("kyc-documents")
      .upload(filePath, file, {
        upsert: false,
        cacheControl: "3600",
      });

    if (error) throw new Error(error.message);

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    for (const [key, file] of Object.entries(files)) {
      if (!file) {
        setErrorMsg(`Please upload ${key}.`);
        return;
      }
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in.");

      const passportPhotoPath = await uploadFile(
        user.id,
        "passportPhoto",
        files.passportPhoto!
      );

      const driversLicenseFrontPath = await uploadFile(
        user.id,
        "driversLicenseFront",
        files.driversLicenseFront!
      );

      const driversLicenseBackPath = await uploadFile(
        user.id,
        "driversLicenseBack",
        files.driversLicenseBack!
      );

      const ssnFrontPath = await uploadFile(user.id, "ssnFront", files.ssnFront!);

      const ssnBackPath = await uploadFile(user.id, "ssnBack", files.ssnBack!);

      const res = await fetch("/api/kyc/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passportPhotoPath,
          driversLicenseFrontPath,
          driversLicenseBackPath,
          ssnFrontPath,
          ssnBackPath,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "KYC submission failed.");
      }

      setSuccessMsg(
        "Your verification has been submitted successfully and is now processing."
      );

      setFiles({
        passportPhoto: null,
        driversLicenseFront: null,
        driversLicenseBack: null,
        ssnFront: null,
        ssnBack: null,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          KYC Verification
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload your verification documents. Review usually takes less than 24
          hours.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-400">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Passport Photo
            </label>
            <input
              type="file"
              accept="image/*"
              className={fileInputClass}
              onChange={(e) =>
                handleFileChange("passportPhoto", e.target.files?.[0] || null)
              }
              disabled={loading}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Driver&apos;s License Front
              </label>
              <input
                type="file"
                accept="image/*"
                className={fileInputClass}
                onChange={(e) =>
                  handleFileChange(
                    "driversLicenseFront",
                    e.target.files?.[0] || null
                  )
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Driver&apos;s License Back
              </label>
              <input
                type="file"
                accept="image/*"
                className={fileInputClass}
                onChange={(e) =>
                  handleFileChange(
                    "driversLicenseBack",
                    e.target.files?.[0] || null
                  )
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                SSN Front
              </label>
              <input
                type="file"
                accept="image/*"
                className={fileInputClass}
                onChange={(e) =>
                  handleFileChange("ssnFront", e.target.files?.[0] || null)
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                SSN Back
              </label>
              <input
                type="file"
                accept="image/*"
                className={fileInputClass}
                onChange={(e) =>
                  handleFileChange("ssnBack", e.target.files?.[0] || null)
                }
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
}