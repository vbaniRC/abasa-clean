"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CoachSchedulePage({ params }) {
  const { id: coachId } = params;

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: schedule } = await supabase
      .from("schedule")
      .select("*")
      .eq("coach_id", coachId)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true });

    const { data: groups } = await supabase
      .from("groups")
      .select("id, name");

    const { data: locations } = await supabase
      .from("locations")
      .select("id, name");

    const { data: acceptance } = await supabase
      .from("schedule_acceptance")
      .select("*")
      .eq("coach_id", coachId);

    const items = (schedule || []).map((s) => {
      const group = groups?.find((g) => g.id === s.group_id);
      const location = locations?.find((l) => l.id === s.location_id);
      const acc = acceptance?.find((a) => a.schedule_id === s.id);

      return {
        ...s,
        groupName: group?.name || "—",
        locationName: location?.name || "—",
        status: acc?.status || "pending",
        acceptanceId: acc?.id,
      };
    });

    setItems(items);
  };

  const updateStatus = async (scheduleId: string, status: "accepted" | "rejected") => {
    const { data: existing } = await supabase
      .from("schedule_acceptance")
      .select("*")
      .eq("schedule_id", scheduleId)
      .eq("coach_id", coachId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("schedule_acceptance")
        .update({
          status,
          responded_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("schedule_acceptance").insert([
        {
          schedule_id: scheduleId,
          coach_id: coachId,
          status,
          responded_at: new Date().toISOString(),
        },
      ]);
    }

    loadData();
  };

  const statusClass = (status: string) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Schedule</h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Location</th>
              <th className="p-3">Group</th>
              <th className="p-3">Day</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.locationName}</td>
                <td className="p-3">{s.groupName}</td>
                <td className="p-3">{WEEKDAYS[s.weekday - 1] || s.weekday}</td>
                <td className="p-3">
                  {s.start_time} – {s.end_time}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${statusClass(s.status)}`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => updateStatus(s.id, "accepted")}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(s.id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  No schedule entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
