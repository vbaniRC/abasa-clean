"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AttendancePage({ params }) {
  const { schedule_id } = params;

  const [members, setMembers] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const coachId = "COACH_ID_FROM_AUTH"; // zamijeni kad dodaš auth

  useEffect(() => {
    loadSchedule();
  }, []);

  useEffect(() => {
    if (schedule) loadMembers();
  }, [schedule]);

  const loadSchedule = async () => {
    const { data } = await supabase
      .from("schedule")
      .select("*")
      .eq("id", schedule_id)
      .single();
    setSchedule(data);
  };

  const loadMembers = async () => {
    const { data: mg } = await supabase
      .from("members_groups")
      .select("member_id, members(*)")
      .eq("group_id", schedule.group_id);

    const today = new Date().toISOString().slice(0, 10);

    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("schedule_id", schedule_id)
      .eq("date", today);

    const list = (mg || []).map((m) => {
      const att = attendance?.find((a) => a.member_id === m.member_id);
      return {
        ...m.members,
        status: att?.status || "none",
      };
    });

    setMembers(list);
  };

  const setStatus = async (memberId, status) => {
    const date = new Date().toISOString().slice(0, 10);

    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("schedule_id", schedule_id)
      .eq("member_id", memberId)
      .eq("date", date)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("attendance")
        .update({ status })
        .eq("id", existing.id);
    } else {
      await supabase.from("attendance").insert([
        {
          schedule_id,
          member_id: memberId,
          coach_id: coachId,
          date,
          status,
        },
      ]);
    }

    loadMembers();
  };

  if (!schedule) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Attendance</h1>

      {members.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between border-b py-3"
        >
          <div>
            <p className="font-medium">{m.first_name} {m.last_name}</p>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => setStatus(m.id, "present")}
              className={`px-3 py-1 rounded ${
                m.status === "present" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Present
            </button>

            <button
              onClick={() => setStatus(m.id, "absent")}
              className={`px-3 py-1 rounded ${
                m.status === "absent" ? "bg-red-600 text-white" : "bg-gray-200"
              }`}
            >
              Absent
            </button>

            <button
              onClick={() => setStatus(m.id, "justified")}
              className={`px-3 py-1 rounded ${
                m.status === "justified" ? "bg-yellow-600 text-white" : "bg-gray-200"
              }`}
            >
              Justified
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
