"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddMemberPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    active: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("members").insert([form]);

    if (!error) router.push("/users");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Add Member</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            name="first_name"
            className="w-full px-4 py-2 border rounded-md"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Last Name</label>
          <input
            name="last_name"
            className="w-full px-4 py-2 border rounded-md"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            type="email"
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
          Save Member
        </button>
      </form>
    </div>
  );
}
