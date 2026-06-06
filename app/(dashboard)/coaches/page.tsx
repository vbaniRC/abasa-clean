"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    const { data, error } = await supabase
      .from("coaches")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCoaches(data);
  };

  const filtered = coaches.filter((c) => {
    const full = `${c.first_name} ${c.last_name}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coaches</h1>

        <Link
          href="/coaches/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Coach
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search coaches..."
        className="w-full px-4 py-2 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Hourly Rate</th>
              <th className="p-3">Active</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {c.first_name} {c.last_name}
                </td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.cijena_po_satu || "—"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      c.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/coaches/${c.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  No coaches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
