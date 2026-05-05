import React from "react";
import AvatarUpload from "./AvatarUpload";
import { createSupabaseServerClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function UserDetailPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return <div>Unable to load profile</div>;
  }

  return (
    <div>
      <AvatarUpload
        userId={profile.id}
        currentAvatarUrl={profile.avatar_url}
      />
    </div>
  );
}