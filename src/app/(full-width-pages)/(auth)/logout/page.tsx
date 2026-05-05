"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error.message);
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