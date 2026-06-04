"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function PaymentsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*, members(first_name, last_name)")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    setItems(data || []);
  };

  const statusClass = (s) => {
    if (s === "paid") return "bg-green-100 text-green-700";
    if (s === "overdue") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Link
          href="/payments/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Payment
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Member</th>
              <th className="p-3">Month</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {p.members.first_name} {p.members.last_name}
                </td>
                <td className="p-3">
                  {p.month}/{p.year}
                </td>
                <td className="p-3">{p.amount} {p.currency}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusClass(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/payments/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={5}>
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
