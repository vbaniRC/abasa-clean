// (GITHUB-PUTANJA-FILE: /abasa-sport/app/logout/page.tsx)

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.push("/login");
    }

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="opacity-70">Logging out...</div>
    </div>
  );
}
