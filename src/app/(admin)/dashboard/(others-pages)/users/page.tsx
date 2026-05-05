import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/server";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    adminProfile?.role !== "admin" &&
    adminProfile?.role !== "super_admin"
  ) {
    redirect("/dashboard");
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, role, profession, country, city_state, avatar_url, created_at"
    )
    .eq("role", "user")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View all registered Synox user accounts.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Registered Users
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total users: {users?.length || 0}
            </p>
          </div>
        </div>

        {users && users.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="hidden bg-gray-50 px-4 py-3 text-xs font-medium uppercase text-gray-500 dark:bg-gray-950 dark:text-gray-400 lg:grid lg:grid-cols-5">
              <span>User</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Location</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 px-4 py-4 lg:grid-cols-5 lg:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {item.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.avatar_url}
                          alt={item.full_name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (item.full_name || "U")
                          .split(" ")
                          .map((name: string) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.full_name || "Unnamed User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.profession || "No profession"}
                      </p>
                    </div>
                  </div>

                  <p className="wrap-break-word text-sm text-gray-600 dark:text-gray-300">
                    {item.email || "No email"}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.phone || "No phone"}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {[item.city_state, item.country].filter(Boolean).join(", ") ||
                      "No location"}
                  </p>

                  <div className="lg:text-right">
                    <Link
                      href={`/dashboard/users/${item.id}`}
                      className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No users registered yet.
          </div>
        )}
      </div>
    </div>
  );
}