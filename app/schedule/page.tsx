"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: schedule } = await supabase
      .from("schedule")
      .select("*")
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true });

    const { data: groups } = await supabase
      .from("groups")
      .select("id, name");

    const { data: coaches } = await supabase
      .from("coaches")
      .select("id, first_name, last_name");

    const { data: locations } = await supabase
      .from("locations")
      .select("id, name");

    const { data: acceptance } = await supabase
      .from("schedule_acceptance")
      .select("schedule_id, status");

    const items = (schedule || []).map((s) => {
      const group = groups?.find((g) => g.id === s.group_id);
      const coach = coaches?.find((c) => c.id === s.coach_id);
      const location = locations?.find((l) => l.id === s.location_id);
      const acc = acceptance?.find((a) => a.schedule_id === s.id);

      return {
        ...s,
        groupName: group?.name || "—",
        coachName: coach ? `${coach.first_name} ${coach.last_name}` : "—",
        locationName: location?.name || "—",
        status: acc?.status || "pending",
      };
    });

    setItems(items);
  };

  const statusClass = (status: string) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schedule</h1>

        <Link
          href="/schedule/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Schedule
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Location</th>
              <th className="p-3">Coach</th>
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
                <td className="p-3">{s.coachName}</td>
                <td className="p-3">{s.groupName}</td>
                <td className="p-3">
                  {WEEKDAYS[s.weekday - 1] || s.weekday}
                </td>
                <td className="p-3">
                  {s.start_time} – {s.end_time}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${statusClass(s.status)}`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/schedule/${s.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={7}>
                  No schedule entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
