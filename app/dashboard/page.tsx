// (GITHUB-PUTANJA-FILE: /abasa-sport/app/dashboard/page.tsx)

"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile(profileData);
    }

    loadProfile();
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-semibold mb-6">
          Dashboard
        </h1>

        {profile ? (
          <div className="card">
            <h2 className="text-xl font-medium mb-2">
              Welcome, {profile.name}
            </h2>

            <p className="opacity-70">
              Role: {profile.role}
            </p>

            <p className="opacity-70">
              Club ID: {profile.club_id}
            </p>
          </div>
        ) : (
          <p className="opacity-60">Loading...</p>
        )}

      </div>
    </div>
  );
}
