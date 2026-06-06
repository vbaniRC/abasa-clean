"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemberNotificationsPage({ params }) {
  const { id: memberId } = params;

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false });

    setItems(data || []);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Member Notifications</h1>

      {items.map((n) => (
        <div key={n.id} className="border rounded-lg p-4">
          <p className="font-semibold">{n.title}</p>
          <p>{n.message}</p>
          <p className="text-xs text-gray-400">{n.created_at}</p>
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-gray-500">No notifications for this member.</p>
      )}
    </div>
  );
}
