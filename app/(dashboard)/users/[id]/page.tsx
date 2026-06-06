"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditMemberPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState(null);

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    const { data } = await supabase
      .from("members")
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

    await supabase.from("members").update(form).eq("id", id);

    router.push("/users");
  };

  const handleDelete = async () => {
    await supabase.from("members").delete().eq("id", id);
    router.push("/users");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Edit Member</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            name="first_name"
            className="w-full px-4 py-2 border rounded-md"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Last Name</label>
          <input
            name="last_name"
            className="w-full px-4 py-2 border rounded-md"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            className="w-full px-4 py-2 border rounded-md"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            className="w-full px-4 py-2 border rounded-md"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Date of Birth</label>
          <input
            name="date_of_birth"
            type="date"
            className="w-full px-4 py-2 border rounded-md"
            value={form.date_of_birth}
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
        Delete Member
      </button>
    </div>
  );
}
