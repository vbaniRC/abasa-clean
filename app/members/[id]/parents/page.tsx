"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function MemberParentsPage({ params }) {
  const router = useRouter();
  const { id: memberId } = params;

  const [member, setMember] = useState(null);
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadMember();
    loadParents();
  }, []);

  const loadMember = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("id", memberId)
      .single();

    setMember(data);
  };

  const loadParents = async () => {
    const { data } = await supabase
      .from("members_parents")
      .select("parent_id, relation, parents(*)")
      .eq("member_id", memberId);

    setParents(data || []);
  };

  const handleSearch = async () => {
    if (search.trim().length < 2) return;

    const { data } = await supabase
      .from("parents")
      .select("*")
      .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);

    setSearchResults(data || []);
  };

  const linkParent = async (parentId) => {
    await supabase.from("members_parents").insert([
      {
        member_id: memberId,
        parent_id: parentId,
        relation: "parent",
      },
    ]);

    loadParents();
    setSearchResults([]);
    setSearch("");
  };

  const unlinkParent = async (parentId) => {
    await supabase
      .from("members_parents")
      .delete()
      .eq("member_id", memberId)
      .eq("parent_id", parentId);

    loadParents();
  };

  const createAndLinkParent = async () => {
    const [first, last] = search.split(" ");

    const { data: parent } = await supabase
      .from("parents")
      .insert([
        {
          first_name: first || "",
          last_name: last || "",
          email: "",
          phone: "",
        },
      ])
      .select()
      .single();

    await linkParent(parent.id);
  };

  if (!member) return <p>Loading...</p>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">
        Parents of {member.first_name} {member.last_name}
      </h1>

      {/* CURRENT PARENTS */}
      <div className="bg-white border rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Linked Parents</h2>

        {parents.length === 0 && (
          <p className="text-gray-500">No parents linked.</p>
        )}

        {parents.map((p) => (
          <div
            key={p.parent_id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">
                {p.parents.first_name} {p.parents.last_name}
              </p>
              <p className="text-sm text-gray-600">{p.parents.email}</p>
              <p className="text-sm text-gray-600">{p.parents.phone}</p>
            </div>

            <button
              onClick={() => unlinkParent(p.parent_id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* SEARCH + ADD */}
      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-semibold">Add Parent</h2>

        <input
          type="text"
          placeholder="Search by name, email or phone..."
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
            {searchResults.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium">
                    {p.first_name} {p.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{p.email}</p>
                  <p className="text-sm text-gray-600">{p.phone}</p>
                </div>

                <button
                  onClick={() => linkParent(p.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Link
                </button>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && search.length >= 2 && (
          <button
            onClick={createAndLinkParent}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Create New Parent & Link
          </button>
        )}
      </div>
    </div>
  );
}
