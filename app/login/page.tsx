// (GITHUB-PUTANJA-FILE: /abasa-sport/app/login/page.tsx)

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(true);
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function loginWithApple() {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Welcome back
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stayConnected}
              onChange={() => setStayConnected(!stayConnected)}
            />
            Stay connected
          </label>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button type="submit" className="w-full">
            Sign In
          </button>
        </form>

        <div className="text-center my-4 opacity-60">or continue with</div>

        <div className="flex gap-3">
          <button
            onClick={loginWithGoogle}
            className="flex-1 bg-white border text-black"
          >
            Google
          </button>

          <button
            onClick={loginWithApple}
            className="flex-1 bg-black text-white"
          >
            Apple
          </button>
        </div>

        <div className="footer mt-6">
          ABASA — Powered by Copilot
        </div>
      </div>
    </div>
  );
}
