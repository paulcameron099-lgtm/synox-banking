"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string | null;
  profession: string | null;
  country: string | null;
  city_state: string | null;
  avatar_url: string | null;
};

export default function UserMetaCard() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
  const getProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name, profession, country, city_state, avatar_url")
      .eq("id", user.id)
      .single();

    setProfile(data);
  };

  getProfile();

  window.addEventListener("profile-updated", getProfile);

  return () => {
    window.removeEventListener("profile-updated", getProfile);
  };
}, []);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SU";

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          {/* Avatar */}
          <div className="flex items-center justify-center w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
            {profile?.avatar_url ? (
              <Image
                width={80}
                height={80}
                src={profile.avatar_url}
                alt="user"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Info */}
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {profile?.full_name || "Synox User"}
            </h4>

            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.profession || "No profession"}
              </p>

              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.city_state && profile?.country
                  ? `${profile.city_state}, ${profile.country}`
                  : "No location"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}