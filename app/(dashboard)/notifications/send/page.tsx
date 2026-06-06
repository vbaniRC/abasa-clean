"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SendNotificationPage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [coaches, setCoaches] = useState([]);

  // TODO: zamijeni s auth vrijednostima
  const senderId = "CURRENT_USER_ID";
  const senderRole = "admin"; // ili "coach"

  const [form, setForm] = useState({
    group_id: "",
    member_id: "",
    coach_id: "",
    send_to_admin: "",
    send_to_all_coaches: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    loadGroups();
    loadMembers();
    loadCoaches();
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

  const loadCoaches = async () => {
    const { data } = await supabase
      .from("coaches")
      .select("id, first_name, last_name");
    setCoaches(data || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Ako trener šalje adminu
    if (form.send_to_admin === "yes") {
      await supabase.from("notifications").insert([
        {
          sender_id: senderId,
          coach_id: null,
          group_id: null,
          member_id: null,
          title: form.title,
          message: form.message,
        },
      ]);

      return router.push("/notifications");
    }

    // 2) Ako admin ili trener šalje svim trenerima
    if (form.send_to_all_coaches === "yes") {
      const { data: allCoaches } = await supabase
        .from("coaches")
        .select("id");

      for (const c of allCoaches) {
        await supabase.from("notifications").insert([
          {
            sender_id: senderId,
            coach_id: c.id,
            group_id: null,
            member_id: null,
            title: form.title,
            message: form.message,
          },
        ]);
      }

      return router.push("/notifications");
    }

    // 3) Ako admin šalje grupi → automatski pronađi trenera te grupe
    let coachId = form.coach_id || null;

    if (form.group_id && !coachId) {
      const { data: schedule } = await supabase
        .from("schedule")
        .select("coach_id")
        .eq("group_id", form.group_id)
        .limit(1)
        .maybeSingle();

      if (schedule?.coach_id) {
        coachId = schedule.coach_id;
      }
    }

    // 4) Standardni insert
    await supabase.from("notifications").insert([
      {
        sender_id: senderId,
        group_id: form.group_id || null,
        member_id: form.member_id || null,
        coach_id: coachId,
        title: form.title,
        message: form.message,
      },
    ]);

    router.push("/notifications");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Send Notification</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* SEND TO GROUP */}
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

        {/* SEND TO MEMBER */}
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

        {/* SEND TO COACH */}
        <div>
          <label className="block mb-1">Send to Coach</label>
          <select
            name="coach_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.coach_id}
            onChange={handleChange}
          >
            <option value="">— None —</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* SEND TO ADMIN */}
        <div>
          <label className="block mb-1">Send to Admin?</label>
          <select
            name="send_to_admin"
            className="w-full px-4 py-2 border rounded-md"
            value={form.send_to_admin}
            onChange={handleChange}
          >
            <option value="">— No —</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* SEND TO ALL COACHES */}
        <div>
          <label className="block mb-1">Send to All Coaches?</label>
          <select
            name="send_to_all_coaches"
            className="w-full px-4 py-2 border rounded-md"
            value={form.send_to_all_coaches}
            onChange={handleChange}
          >
            <option value="">— No —</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* TITLE */}
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

        {/* MESSAGE */}
        <div>
          <label className="block mb-1">Message</label>
          <textarea
            name="message"
            className="w-full px-4 py-2 border rounded-md"
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
