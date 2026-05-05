"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  onUploaded,
}: {
  userId: string;
  currentAvatarUrl?: string | null;
  onUploaded?: (url: string) => void;
}) {
  const [preview, setPreview] = useState(currentAvatarUrl || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setLoading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      setLoading(false);
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    setLoading(false);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    setPreview(publicUrl);
    onUploaded?.(publicUrl);

    window.dispatchEvent(new Event("profile-updated"));

    window.dispatchEvent(
      new CustomEvent("admin-user-avatar-updated", {
        detail: { userId, avatarUrl: publicUrl },
      })
    );
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
        {preview ? (
          <img
            src={preview}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No image
          </div>
        )}
      </div>

      <label className="inline-flex cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        {loading ? "Uploading..." : "Upload Avatar"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
        />
      </label>
    </div>
  );
}