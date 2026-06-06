"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditProgramPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState(null);

  useEffect(() => {
    loadProgram();
  }, []);

  const loadProgram = async () => {
    const { data } = await supabase
      .from("programs")
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

    await supabase.from("programs").update(form).eq("id", id);

    router.push("/programs");
  };

  const handleDelete = async () => {
    await supabase.from("programs").delete().eq("id", id);
    router.push("/programs");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Edit Program</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block mb-1">Program Name</label>
          <input
            name="name"
            className="w-full px-4 py-2 border rounded-md"
            value={form.name}
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
        Delete Program
      </button>
    </div>
  );
}
