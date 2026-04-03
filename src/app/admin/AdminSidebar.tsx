"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  FileText,
  Plane,
  Megaphone,
  Mail,
  GraduationCap,
} from "lucide-react";
import type { Role } from "@prisma/client";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, roles: ["ADMIN"] },
  { href: "/admin/finance", label: "Finance", icon: DollarSign, roles: ["ADMIN"] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/applications", label: "Applications", icon: FileText, roles: ["ADMIN"] },
  { href: "/admin/visa", label: "Visa Requests", icon: Plane, roles: ["ADMIN"] },
  { href: "/admin/messages", label: "Broadcast", icon: Mail, roles: ["ADMIN"] },
  { href: "/admin/media", label: "Media & Partners", icon: Megaphone, roles: ["ADMIN", "MEDIA_DIRECTOR"] },
];

export default function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  const links = adminLinks.filter((l) => l.roles.includes(role));

  return (
    <aside className="w-56 bg-brand-dark flex-shrink-0 flex flex-col py-6">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-syne font-extrabold text-sm text-white">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-dm transition-colors",
              pathname === link.href
                ? "bg-brand text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 pt-4 border-t border-white/10">
        <p className="text-xs font-dm text-white/30">Role: {role}</p>
      </div>
    </aside>
  );
}
