"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  admin_status?: string | null;
  created_at: string;
};

export default function AdminSettingsClient({
  currentRole,
  admins,
}: {
  currentRole: string;
  admins: AdminUser[];
}) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const canCreateAdmin = currentRole === "super_admin";

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await fetch("/api/admin/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email: email.trim().toLowerCase(),
        password,
        role,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(data?.error || "Failed to create admin.");
      return;
    }

    setSuccessMsg("Admin created successfully.");
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("admin");

    router.refresh();
  };

  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
  const confirmed = window.confirm(`Change this admin role to ${newRole}?`);
  if (!confirmed) return;

  const res = await fetch("/api/admin/update-admin-role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUserId,
      role: newRole,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    alert(data?.error || "Failed to update admin role.");
    return;
  }

  router.refresh();
};

const handleAdminStatus = async (
  targetUserId: string,
  status: "active" | "deactivated"
) => {
  const confirmed = window.confirm(
    status === "deactivated"
      ? "Deactivate this admin account?"
      : "Reactivate this admin account?"
  );

  if (!confirmed) return;

  const res = await fetch("/api/admin/deactivate-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetUserId,
      status,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    alert(data?.error || "Failed to update admin status.");
    return;
  }

  router.refresh();
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage Synox administrators and admin access.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Create Admin
          </h2>

          {!canCreateAdmin && (
            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-950/40 dark:text-yellow-400">
              Only a super admin can create another admin.
            </div>
          )}

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

          <form onSubmit={handleCreateAdmin} className="mt-5 space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              required
              disabled={!canCreateAdmin || loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={!canCreateAdmin || loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Temporary password"
              required
              disabled={!canCreateAdmin || loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!canCreateAdmin || loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <button
              type="submit"
              disabled={!canCreateAdmin || loading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Existing Admins
          </h2>

          <div className="mt-5 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {admins.map((admin) => (
              <div key={admin.id} className="space-y-4 p-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {admin.full_name || "Unnamed Admin"}
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {admin.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {admin.role.replace("_", " ")}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      admin.admin_status === "deactivated"
                        ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    }`}
                  >
                    {admin.admin_status || "active"}
                  </span>
                </div>
              </div>

              {canCreateAdmin && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    defaultValue={admin.role}
                    onChange={(e) => handleUpdateRole(admin.id, e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="user">Remove Admin Role</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      handleAdminStatus(
                        admin.id,
                        admin.admin_status === "deactivated" ? "active" : "deactivated"
                      )
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-medium text-white ${
                      admin.admin_status === "deactivated"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {admin.admin_status === "deactivated"
                      ? "Reactivate Admin"
                      : "Deactivate Admin"}
                  </button>
                </div>
              )}
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}