"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ParentChildrenPage({ params }) {
  const { id: parentId } = params;

  const [parent, setParent] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    loadParent();
    loadChildren();
  }, []);

  const loadParent = async () => {
    const { data } = await supabase
      .from("parents")
      .select("*")
      .eq("id", parentId)
      .single();
    setParent(data);
  };

  const loadChildren = async () => {
    const { data } = await supabase
      .from("members_parents")
      .select("member_id, members(*)")
      .eq("parent_id", parentId);
    setChildren(data || []);
  };

  const handleSearch = async () => {
    if (search.trim().length < 2) return;
    const { data } = await supabase
      .from("members")
      .select("*")
      .or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    setSearchResults(data || []);
  };

  const linkChild = async (memberId: string) => {
    await supabase.from("members_parents").insert([
      {
        member_id: memberId,
        parent_id: parentId,
        relation: "parent",
      },
    ]);
    loadChildren();
    setSearchResults([]);
    setSearch("");
  };

  const unlinkChild = async (memberId: string) => {
    await supabase
      .from("members_parents")
      .delete()
      .eq("member_id", memberId)
      .eq("parent_id", parentId);
    loadChildren();
  };

  if (!parent) return <p>Loading...</p>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">
        Children of {parent.first_name} {parent.last_name}
      </h1>

      <div className="bg-white border rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Linked Children</h2>
        {children.length === 0 && (
          <p className="text-gray-500">No children linked.</p>
        )}
        {children.map((c) => (
          <div
            key={c.member_id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">
                {c.members.first_name} {c.members.last_name}
              </p>
              <p className="text-sm text-gray-600">{c.members.email}</p>
            </div>
            <button
              onClick={() => unlinkChild(c.member_id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-semibold">Add Child</h2>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full px-4 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>

        {searchResults.length > 0 && (
          <div className="border rounded-md p-3 space-y-2">
            {searchResults.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium">
                    {m.first_name} {m.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{m.email}</p>
                </div>
                <button
                  onClick={() => linkChild(m.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
