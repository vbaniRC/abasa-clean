"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const WEEKDAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export default function AddSchedulePage() {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    group_id: "",
    coach_id: "",
    location_id: "",
    weekday: 1,
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: groupsData } = await supabase
      .from("groups")
      .select("id, name");

    const { data: coachesData } = await supabase
      .from("coaches")
      .select("id, first_name, last_name");

    const { data: locationsData } = await supabase
      .from("locations")
      .select("id, name");

    setGroups(groupsData || []);
    setCoaches(coachesData || []);
    setLocations(locationsData || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "weekday" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) insert into schedule
    const { data, error } = await supabase
      .from("schedule")
      .insert([
        {
          group_id: form.group_id,
          coach_id: form.coach_id,
          location_id: form.location_id,
          weekday: form.weekday,
          start_time: form.start_time,
          end_time: form.end_time,
        },
      ])
      .select()
      .single();

    if (error || !data) return;

    // 2) auto create schedule_acceptance (pending)
    await supabase.from("schedule_acceptance").insert([
      {
        schedule_id: data.id,
        coach_id: form.coach_id,
        status: "pending",
      },
    ]);

    router.push("/schedule");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Add Schedule</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Location</label>
          <select
            name="location_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.location_id}
            onChange={handleChange}
            required
          >
            <option value="">Select location...</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Coach</label>
          <select
            name="coach_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.coach_id}
            onChange={handleChange}
            required
          >
            <option value="">Select coach...</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Group</label>
          <select
            name="group_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.group_id}
            onChange={handleChange}
            required
          >
            <option value="">Select group...</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Day</label>
          <select
            name="weekday"
            className="w-full px-4 py-2 border rounded-md"
            value={form.weekday}
            onChange={handleChange}
            required
          >
            {WEEKDAYS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Start Time</label>
            <input
              type="time"
              name="start_time"
              className="w-full px-4 py-2 border rounded-md"
              value={form.start_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1">End Time</label>
            <input
              type="time"
              name="end_time"
              className="w-full px-4 py-2 border rounded-md"
              value={form.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Schedule
        </button>
      </form>
    </div>
  );
}
