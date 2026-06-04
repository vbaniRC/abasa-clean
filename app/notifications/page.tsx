"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*, groups(name), members(first_name, last_name)")
      .order("created_at", { ascending: false });

    setItems(data || []);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Link
          href="/notifications/send"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Send Notification
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((n) => (
          <div key={n.id} className="border rounded-lg p-4">
            <p className="font-semibold">{n.title}</p>
            <p className="text-gray-700">{n.message}</p>

            <p className="text-sm text-gray-500 mt-2">
              {n.group_id && <>Group: {n.groups?.name}</>}
              {n.member_id && (
                <>
                  Member: {n.members?.first_name} {n.members?.last_name}
                </>
              )}
              {!n.group_id && !n.member_id && <>All members</>}
            </p>

            <p className="text-xs text-gray-400">{n.created_at}</p>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-gray-500">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
