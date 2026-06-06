"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemberGroupsPage({ params }) {
  const { id: memberId } = params;

  const [member, setMember] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [linkedGroups, setLinkedGroups] = useState<any[]>([]);

  useEffect(() => {
    loadMember();
    loadGroups();
    loadLinkedGroups();
  }, []);

  const loadMember = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("id", memberId)
      .single();
    setMember(data);
  };

  const loadGroups = async () => {
    const { data } = await supabase.from("groups").select("id, name");
    setGroups(data || []);
  };

  const loadLinkedGroups = async () => {
    const { data } = await supabase
      .from("members_groups")
      .select("group_id, groups(name)")
      .eq("member_id", memberId);
    setLinkedGroups(data || []);
  };

  const linkGroup = async (groupId: string) => {
    await supabase.from("members_groups").insert([
      {
        member_id: memberId,
        group_id: groupId,
      },
    ]);
    loadLinkedGroups();
  };

  const unlinkGroup = async (groupId: string) => {
    await supabase
      .from("members_groups")
      .delete()
      .eq("member_id", memberId)
      .eq("group_id", groupId);
    loadLinkedGroups();
  };

  if (!member) return <p>Loading...</p>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">
        Groups of {member.first_name} {member.last_name}
      </h1>

      <div className="bg-white border rounded-xl shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-4">Linked Groups</h2>
        {linkedGroups.length === 0 && (
          <p className="text-gray-500">No groups linked.</p>
        )}
        {linkedGroups.map((g) => (
          <div
            key={g.group_id}
            className="flex items-center justify-between border-b py-2"
          >
            <span>{g.groups.name}</span>
            <button
              onClick={() => unlinkGroup(g.group_id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-xl font-semibold">Add to Group</h2>
        <select
          className="w-full px-4 py-2 border rounded-md"
          onChange={(e) => e.target.value && linkGroup(e.target.value)}
          defaultValue=""
        >
          <option value="">Select group...</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
