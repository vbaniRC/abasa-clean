"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    const { data } = await supabase
      .from("parents")
      .select("*")
      .order("created_at", { ascending: false });

    setParents(data || []);
  };

  const filtered = parents.filter((p) => {
    const full = `${p.first_name} ${p.last_name}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Parents</h1>

        <Link
          href="/parents/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Parent
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search parents..."
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
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {p.first_name} {p.last_name}
                </td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">
                  <Link
                    href={`/parents/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={4}>
                  No parents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
