"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch("/api/auth/clear-login-verification", {
          method: "POST",
        });

        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error("Logout error:", error.message);
        }
      } catch (err) {
        console.error("Logout failed:", err);
      }

      window.location.replace("/login");
    };

    handleLogout();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-500">
      Logging you out...
    </div>
  );
}