"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function UsersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMembers(data);
  };

  const filtered = members.filter((m) => {
    const full = `${m.first_name} ${m.last_name}`.toLowerCase();
    return full.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Members</h1>

        <Link
          href="/users/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Member
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search members..."
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
              <th className="p-3">Active</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {m.first_name} {m.last_name}
                </td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.phone}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      m.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {m.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/users/${m.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={5}>
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
