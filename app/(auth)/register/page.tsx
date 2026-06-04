"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email inbox to confirm your account.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">

        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {errorMsg && <p className="mb-4 text-red-600 text-center">{errorMsg}</p>}
        {message && <p className="mb-4 text-green-600 text-center">{message}</p>}

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>

      </div>
    </div>
  );
}
