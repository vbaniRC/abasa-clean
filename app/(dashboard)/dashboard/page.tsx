"use client";

import { useEffect, useState } from "react";

type DashboardUser = {
  created_at: string;
  role?: string;
};

export default function DashboardPage() {
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/users/list");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="p-6">Učitavanje...</p>;
  }

  const last30 = new Date();
  last30.setDate(last30.getDate() - 30);

  const newUsers =
    users?.users?.filter((u: DashboardUser) => {
      if (!u?.created_at) return false;
      return new Date(u.created_at) >= last30;
    }).length || 0;

  const totalUsers = users?.users?.length || 0;

  const coaches =
    users?.users?.filter((u: any) => u.role === "coach").length || 0;

  const members =
    users?.users?.filter((u: any) => u.role === "member").length || 0;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold">Ukupno korisnika</h3>
          <p className="text-2xl font-bold mt-2">{totalUsers}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold">Novi u zadnjih 30 dana</h3>
          <p className="text-2xl font-bold mt-2">{newUsers}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold">Treneri</h3>
          <p className="text-2xl font-bold mt-2">{coaches}</p>
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold">Članovi</h3>
          <p className="text-2xl font-bold mt-2">{members}</p>
        </div>
      </div>
    </div>
  );
}
