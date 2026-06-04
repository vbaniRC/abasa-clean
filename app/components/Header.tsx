"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Pretvaramo rutu u naslov
  const title = pathname === "/"
    ? "Početna"
    : pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2);

  return (
    <header className="w-full flex items-center justify-between mb-10">
      <h2 className="text-3xl font-semibold">{title}</h2>

      <div className="flex items-center gap-4">
        {/* Placeholder avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300" />

        {/* Logout (placeholder) */}
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
          Logout
        </button>
      </div>
    </header>
  );
}
