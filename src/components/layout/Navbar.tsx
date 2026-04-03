"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";

const navLinks = [
  { href: "/apply", label: "Find Colleges" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/visa", label: "Visa Help" },
  { href: "/flights", label: "Book Flight" },
  { href: "/ai-counseling", label: "AI Counselor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-syne font-800 text-xl text-[#0a0a0a]">Apple 9</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-dm font-medium transition-colors",
                  pathname === link.href
                    ? "text-brand bg-brand-light"
                    : "text-[#0a0a0a] hover:text-brand hover:bg-brand-light"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-light transition-colors text-sm font-dm font-medium text-[#0a0a0a]"
                >
                  <div className="w-7 h-7 bg-brand rounded-full flex items-center justify-center text-white text-xs font-syne font-800">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-muted" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-black/10 shadow-lg overflow-hidden z-50">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-dm text-[#0a0a0a] hover:bg-brand-light"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-dm text-[#0a0a0a] hover:bg-brand-light"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Messages
                    </Link>
                    {(session.user?.role === "ADMIN" || session.user?.role === "MEDIA_DIRECTOR") && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-dm text-[#0a0a0a] hover:bg-brand-light"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="border-black/10" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-dm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm font-dm font-medium",
                pathname === link.href
                  ? "text-brand bg-brand-light"
                  : "text-[#0a0a0a] hover:bg-brand-light"
              )}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-black/10 my-2" />
          {session ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-dm text-[#0a0a0a] hover:bg-brand-light rounded-lg">
                My Profile
              </Link>
              <button
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                className="w-full text-left px-3 py-2 text-sm font-dm text-red-500 hover:bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
