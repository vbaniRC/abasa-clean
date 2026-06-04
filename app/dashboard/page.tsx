"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    coaches: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      // Fetch all users
      const { data: users } = await supabase.auth.admin.listUsers();

      const totalUsers = users?.users?.length || 0;

      // New users in last 30 days
      const last30 = new Date();
      last30.setDate(last30.getDate() - 30);

      const newUsers =
        users?.users?.filter((u) => new Date(u.created_at) >= last30).length ||
        0;

      // Active users (placeholder: all users are active)
      const activeUsers = totalUsers;

      // Coaches (placeholder until we add coaches table)
      const coaches = 6;

      setStats({
        totalUsers,
        newUsers,
        activeUsers,
        coaches,
      });

      setLoading(false);
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* HERO */}
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your club's key metrics.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? "..." : stats.totalUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">All registered users</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">New Users (30 days)</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? "..." : stats.newUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">Recently joined</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold">Coaches</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? "..." : stats.coaches}
          </p>
          <p className="text-sm text-gray-500 mt-1">Licensed coaches</p>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/users"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            Manage Users →
          </a>

          <a
            href="/club"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            Club Information →
          </a>

          <a
            href="/settings"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            System Settings →
          </a>
        </div>
      </div>
    </div>
  );
}
