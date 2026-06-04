"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddCoachPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    oib: "",
    iban: "",
    cijena_po_satu: "",
    active: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      cijena_po_satu: form.cijena_po_satu
        ? Number(form.cijena_po_satu)
        : null,
    };

    const { error } = await supabase.from("coaches").insert([payload]);

    if (!error) router.push("/coaches");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Add Coach</h1>

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
          <label className="block mb-1">OIB</label>
          <input
            name="oib"
            className="w-full px-4 py-2 border rounded-md"
            value={form.oib}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">IBAN</label>
          <input
            name="iban"
            className="w-full px-4 py-2 border rounded-md"
            value={form.iban}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Hourly Rate</label>
          <input
            name="cijena_po_satu"
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border rounded-md"
            value={form.cijena_po_satu}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Coach
        </button>
      </form>
    </div>
  );
}
