"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Heroicons
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const links = [
  { href: "/", label: "Početna", icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
  { href: "/users", label: "Članovi", icon: UsersIcon },
  { href: "/club", label: "Klub", icon: BuildingOfficeIcon },
  { href: "/settings", label: "Postavke", icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <h1 className="text-2xl font-bold mb-8">ABASA Sport</h1>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md transition
                ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
