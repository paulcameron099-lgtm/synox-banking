import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";
import AuditLogActions from "@/components/admin/AuditLogActions";

function formatAction(action: string) {
  return action.replaceAll("_", " ");
}

export default async function AdminAuditLogsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  const { data: logs, error } = await supabase
    .from("admin_audit_logs")
    .select(
      "id, admin_email, admin_name, action, target_email, target_name, metadata, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audit Logs
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track admin actions across Synox.
        </p>
      </div>

      <AuditLogActions currentRole={profile?.role || ""} />
    </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {logs && logs.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid gap-4 p-4 lg:grid-cols-4 lg:items-start"
              >
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Action
                  </p>
                  <p className="mt-1 text-sm font-semibold capitalize text-gray-900 dark:text-white">
                    {formatAction(log.action)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Admin
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {log.admin_name || "Unknown Admin"}
                  </p>
                  <p className="mt-1 wrap-break-word text-xs text-gray-500 dark:text-gray-400">
                    {log.admin_email || "No email"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Target
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {log.target_name || "No target"}
                  </p>
                  <p className="mt-1 wrap-break-word text-xs text-gray-500 dark:text-gray-400">
                    {log.target_email || "No email"}
                  </p>
                </div>

                <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Metadata
                  </p>

                  <AuditLogActions
                    logId={log.id}
                    currentRole={profile?.role || ""}
                  />
                </div>

                <pre className="mt-1 max-h-32 overflow-auto rounded-xl bg-gray-50 p-3 text-xs text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                  {JSON.stringify(log.metadata || {}, null, 2)}
                </pre>
              </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No audit logs yet.
          </div>
        )}
      </div>
    </div>
  );
}