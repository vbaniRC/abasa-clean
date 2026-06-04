// (GITHUB-PUTANJA-FILE: /abasa-sport/components/Sidebar.tsx)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users", href: "/users" },
    { name: "Club Settings", href: "/club" },
    { name: "Logout", href: "/logout" },
  ];

  return (
    <aside
      className="w-64 h-screen border-r bg-white flex flex-col p-4"
      style={{ borderColor: "var(--sidebar-border)" }}
    >
      <div className="text-xl font-semibold mb-8">
        ABASA
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`p-3 rounded-md transition ${
                active
                  ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-xs opacity-60 text-center pt-4">
        ABASA — Powered by Copilot
      </div>
    </aside>
  );
}
