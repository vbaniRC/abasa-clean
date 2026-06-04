"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../providers/AuthProvider";

export default function Header() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-2xl font-bold">ABASA Sport</h1>
        <p className="text-gray-500 text-sm">
          Club management dashboard
        </p>
      </div>

      <div className="flex items-center gap-4">
        {!loading && user && (
          <div className="text-right">
            <p className="text-sm font-medium">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        )}

        {!loading && user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Log out
          </button>
        )}

        {!loading && !user && (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
