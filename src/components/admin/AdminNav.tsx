"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Mail, 
  Users, 
  UserCheck, 
  Calendar, 
  Megaphone, 
  LayoutList,
  LogOut 
} from "lucide-react";

interface AdminNavProps {
  userEmail?: string | null;
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Contact Enquiries", icon: Mail },
  { href: "/admin/doctors", label: "Doctors", icon: Users },
  { href: "/admin/requests", label: "Join Requests", icon: UserCheck },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/features", label: "Features", icon: LayoutList },
  { href: "/admin/marketing-team", label: "Marketing Team", icon: Megaphone },
];

export function AdminNav({ userEmail, children }: AdminNavProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open & listen for Escape key
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileOpen]);

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname?.startsWith(item.href + "/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* =========================================
          1. DESKTOP SIDEBAR (md:flex)
         ========================================= */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-30 shadow-md">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-serif text-xl font-bold tracking-tight block">
            WHITE COAT<span className="text-accent">.</span> Admin
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-accent font-semibold shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-accent" : "text-white/60"}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-4 px-3 text-xs text-white/50 break-all">
            Signed in as <br />
            <strong className="text-white text-sm font-medium">{userEmail || "Admin"}</strong>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* =========================================
          2. MOBILE BACKDROP & SLIDE-OVER DRAWER
         ========================================= */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-primary text-white z-50 md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={() => setIsMobileOpen(false)}
            className="font-serif text-lg font-bold tracking-tight"
          >
            WHITE COAT<span className="text-accent">.</span> Admin
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-accent font-semibold shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-accent" : "text-white/60"}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-primary/95">
          <div className="mb-3 px-2 text-xs text-white/50 break-all">
            Signed in as <br />
            <strong className="text-white text-sm font-medium">{userEmail || "Admin"}</strong>
          </div>
          <Link
            href="/api/auth/signout"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* =========================================
          3. MAIN CONTENT CONTAINER
         ========================================= */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Mobile Header with Menu Toggle */}
        <header className="md:hidden bg-primary text-white px-4 py-3 border-b border-white/10 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-1.5 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
              aria-label="Open side menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/admin" className="font-serif font-bold text-base sm:text-lg tracking-tight">
              WHITE COAT<span className="text-accent">.</span> Admin
            </Link>
          </div>

          <Link
            href="/api/auth/signout"
            className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
