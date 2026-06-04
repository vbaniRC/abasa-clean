"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SendNotificationPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    group_id: "",
    member_id: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    loadGroups();
    loadMembers();
  }, []);

  const loadGroups = async () => {
    const { data } = await supabase.from("groups").select("id, name");
    setGroups(data || []);
  };

  const loadMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("id, first_name, last_name");
    setMembers(data || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("notifications").insert([
      {
        group_id: form.group_id || null,
        member_id: form.member_id || null,
        title: form.title,
        message: form.message,
      },
    ]);

    router.push("/notifications");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Send Notification</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Send to Group</label>
          <select
            name="group_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.group_id}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Send to Member</label>
          <select
            name="member_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.member_id}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            className="w-full px-4 py-2 border rounded-md"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Message</label>
          <textarea
            name="message"
            className="w-full px-4 py-2 border rounded-md"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
