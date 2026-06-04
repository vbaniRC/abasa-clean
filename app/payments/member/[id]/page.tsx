"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemberPaymentsPage({ params }) {
  const { id: memberId } = params;

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("member_id", memberId)
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    setItems(data || []);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Payment History</h1>

      {items.map((p) => (
        <div key={p.id} className="border rounded-lg p-4">
          <p className="font-semibold">
            {p.month}/{p.year}
          </p>
          <p>Amount: {p.amount} {p.currency}</p>
          <p>Status: {p.status}</p>
          {p.note && <p>Note: {p.note}</p>}
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-gray-500">No payments found.</p>
      )}
    </div>
  );
}
