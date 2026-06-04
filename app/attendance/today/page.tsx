"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function AttendanceToday() {
  const [items, setItems] = useState([]);

  const coachId = "COACH_ID_FROM_AUTH"; // zamijeni kad dodaš auth

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const today = new Date();
    const weekday = today.getDay() === 0 ? 7 : today.getDay();

    const { data: schedule } = await supabase
      .from("schedule")
      .select("*")
      .eq("coach_id", coachId)
      .eq("weekday", weekday);

    const { data: groups } = await supabase.from("groups").select("id, name");
    const { data: locations } = await supabase.from("locations").select("id, name");

    const items = (schedule || []).map((s) => ({
      ...s,
      groupName: groups?.find((g) => g.id === s.group_id)?.name || "—",
      locationName: locations?.find((l) => l.id === s.location_id)?.name || "—",
    }));

    setItems(items);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Today's Attendance</h1>

      {items.length === 0 && (
        <p className="text-gray-500">No sessions today.</p>
      )}

      {items.map((s) => (
        <Link
          key={s.id}
          href={`/attendance/${s.id}`}
          className="block border rounded-lg p-4 hover:bg-gray-50"
        >
          <p className="font-semibold">{s.groupName}</p>
          <p>{s.locationName}</p>
          <p>{s.start_time} – {s.end_time}</p>
        </Link>
      ))}
    </div>
  );
}
