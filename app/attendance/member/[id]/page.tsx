"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemberAttendanceHistory({ params }) {
  const { id: memberId } = params;

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("*, schedule(*, groups(name))")
      .eq("member_id", memberId)
      .order("date", { ascending: false });

    setRecords(data || []);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Attendance History</h1>

      {records.map((r) => (
        <div key={r.id} className="border rounded-lg p-4">
          <p className="font-semibold">{r.schedule.groups.name}</p>
          <p>{r.date}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}

      {records.length === 0 && (
        <p className="text-gray-500">No attendance records.</p>
      )}
    </div>
  );
}
