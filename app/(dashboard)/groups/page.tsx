"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: groupsData } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: programsData } = await supabase
      .from("programs")
      .select("id, name");

    setGroups(groupsData || []);
    setPrograms(programsData || []);
  };

  const getProgramName = (id) => {
    const p = programs.find((x) => x.id === id);
    return p ? p.name : "—";
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>

        <Link
          href="/groups/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Group
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search groups..."
        className="w-full px-4 py-2 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Program</th>
              <th className="p-3">Level</th>
              <th className="p-3">Age Group</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{g.name}</td>
                <td className="p-3">{getProgramName(g.program_id)}</td>
                <td className="p-3">{g.level}</td>
                <td className="p-3">{g.age_group}</td>
                <td className="p-3">
                  <Link
                    href={`/groups/${g.id}`}
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
                  No groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
