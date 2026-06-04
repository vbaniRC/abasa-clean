"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddGroupPage() {
  const router = useRouter();

  const [programs, setPrograms] = useState([]);

  const [form, setForm] = useState({
    program_id: "",
    name: "",
    level: "",
    age_group: "",
    description: "",
    min_age: "",
    max_age: "",
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    const { data } = await supabase.from("programs").select("id, name");
    setPrograms(data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      min_age: form.min_age ? Number(form.min_age) : null,
      max_age: form.max_age ? Number(form.max_age) : null,
    };

    const { error } = await supabase.from("groups").insert([payload]);

    if (!error) router.push("/groups");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Add Group</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Program</label>
          <select
            name="program_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.program_id}
            onChange={handleChange}
            required
          >
            <option value="">Select program...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Group Name</label>
          <input
            name="name"
            className="w-full px-4 py-2 border rounded-md"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Level</label>
          <input
            name="level"
            className="w-full px-4 py-2 border rounded-md"
            value={form.level}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Age Group</label>
          <input
            name="age_group"
            className="w-full px-4 py-2 border rounded-md"
            value={form.age_group}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            className="w-full px-4 py-2 border rounded-md"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Min Age</label>
            <input
              name="min_age"
              type="number"
              className="w-full px-4 py-2 border rounded-md"
              value={form.min_age}
              onChange={handleChange}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1">Max Age</label>
            <input
              name="max_age"
              type="number"
              className="w-full px-4 py-2 border rounded-md"
              value={form.max_age}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Group
        </button>
      </form>
    </div>
  );
}
