"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddPaymentPage() {
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    member_id: "",
    amount: "",
    currency: "EUR",
    month: "",
    year: new Date().getFullYear(),
    status: "unpaid",
    note: "",
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("id, first_name, last_name")
      .order("first_name");

    setMembers(data || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("payments").insert([form]);

    router.push("/payments");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Add Payment</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Member</label>
          <select
            name="member_id"
            className="w-full px-4 py-2 border rounded-md"
            value={form.member_id}
            onChange={handleChange}
            required
          >
            <option value="">Select member...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Month</label>
            <input
              type="number"
              name="month"
              min="1"
              max="12"
              className="w-full px-4 py-2 border rounded-md"
              value={form.month}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1">Year</label>
            <input
              type="number"
              name="year"
              className="w-full px-4 py-2 border rounded-md"
              value={form.year}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            className="w-full px-4 py-2 border rounded-md"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            className="w-full px-4 py-2 border rounded-md"
            value={form.status}
            onChange={handleChange}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Note</label>
          <textarea
            name="note"
            className="w-full px-4 py-2 border rounded-md"
            value={form.note}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save Payment
        </button>
      </form>
    </div>
  );
}
