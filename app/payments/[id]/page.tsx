"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditPaymentPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [payment, setPayment] = useState(null);

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();

    setPayment(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    await supabase
      .from("payments")
      .update(payment)
      .eq("id", id);

    router.push("/payments");
  };

  const handleDelete = async () => {
    await supabase.from("payments").delete().eq("id", id);
    router.push("/payments");
  };

  if (!payment) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Edit Payment</h1>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            className="w-full px-4 py-2 border rounded-md"
            value={payment.amount}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            className="w-full px-4 py-2 border rounded-md"
            value={payment.status}
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
            value={payment.note || ""}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save Changes
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md"
      >
        Delete Payment
      </button>
    </div>
  );
}
