// (GITHUB-PUTANJA-FILE: /abasa-sport/app/club/page.tsx)

"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function ClubSettingsPage() {
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [currency, setCurrency] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadClub() {
      const { data: session } = await supabase.auth.getUser();
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("club_id")
        .eq("id", session.user.id)
        .single();

      if (!profile?.club_id) return;

      const res = await fetch(`/api/club/info?club_id=${profile.club_id}`);
      const json = await res.json();

      if (json.success) {
        setClub(json.data);
        setName(json.data.name);
        setSport(json.data.sport);
        setCurrency(json.data.currency);
        setLogoPreview(json.data.logo_url);
      }

      setLoading(false);
    }

    loadClub();
  }, []);

  async function saveChanges() {
    const res = await fetch("/api/club/update", {
      method: "POST",
      body: JSON.stringify({
        club_id: club.id,
        name,
        sport,
        currency,
      }),
    });

    const json = await res.json();
    if (json.success) {
      alert("Club updated successfully");
    } else {
      alert(json.error);
    }
  }

  async function uploadLogo() {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append("file", logoFile);
    formData.append("club_id", club.id);

    const res = await fetch("/api/club/logo-upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (json.success) {
      setLogoPreview(json.url);
      alert("Logo uploaded");
    } else {
      alert(json.error);
    }
  }

  async function deleteLogo() {
    const res = await fetch("/api/club/logo-delete", {
      method: "POST",
      body: JSON.stringify({ club_id: club.id }),
    });

    const json = await res.json();
    if (json.success) {
      setLogoPreview(null);
      alert("Logo deleted");
    } else {
      alert(json.error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-semibold mb-6">Club Settings</h1>

        {/* LOGO */}
        <div className="card mb-6">
          <h2 className="text-xl font-medium mb-4">Club Logo</h2>

          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Club Logo"
              className="w-32 h-32 object-cover rounded-md mb-4"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              No logo
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setLogoFile(file);
              if (file) setLogoPreview(URL.createObjectURL(file));
            }}
          />

          <div className="flex gap-3 mt-4">
            <button onClick={uploadLogo}>Upload Logo</button>
            <button
              onClick={deleteLogo}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Logo
            </button>
          </div>
        </div>

        {/* CLUB INFO */}
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Club Information</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Club Name"
              className="w-full p-3 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Sport"
              className="w-full p-3 border rounded-md"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            />

            <input
              type="text"
              placeholder="Currency (e.g. EUR)"
              className="w-full p-3 border rounded-md"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />

            <button onClick={saveChanges} className="w-full">
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
