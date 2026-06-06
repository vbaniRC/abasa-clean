"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditGroupPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    loadPrograms();
    loadGroup();
  }, []);

  const loadPrograms = async () => {
    const { data } = await supabase.from("programs").select("id, name");
    setPrograms(data || []);
  };

  const loadGroup = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();

    setForm(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      min_age: form.min_age ? Number(form.min_age) : null,
      max_age: form.max_age ? Number(form.max_age) : null,
    };

    await supabase.from("groups").update(payload).eq("id", id);

    router.push("/groups");
  };

  const handleDelete = async () => {
    await supabase.from("groups").delete().eq("id", id);
    router.push("/groups");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Edit Group</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block mb-1">Program</label>
          <select
            name="program_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.program_id}
            onChange={handleChange}
            required
          >
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
          Save Changes
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Delete Group
      </button>
    </div>
  );
}
