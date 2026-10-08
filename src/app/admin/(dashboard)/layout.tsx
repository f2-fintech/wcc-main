import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Users, Calendar, Megaphone } from "lucide-react";

export const instant = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-serif text-xl font-bold tracking-tight">
            WHITE COAT<span className="text-accent">.</span> Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-accent" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/doctors" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Users className="w-5 h-5 text-accent" />
            <span>Doctors</span>
          </Link>
          <Link href="/admin/requests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Users className="w-5 h-5 text-accent" />
            <span>Join Requests</span>
          </Link>
          <Link href="/admin/events" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Calendar className="w-5 h-5 text-accent" />
            <span>Events</span>
          </Link>
          <Link href="/admin/marketing-team" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Megaphone className="w-5 h-5 text-accent" />
            <span>Marketing Team</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="mb-4 px-4 text-sm text-white/50 break-all">
            Signed in as <br/> <strong className="text-white">{session.user?.email}</strong>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <span className="font-serif font-bold text-primary">WCC Admin</span>
          <Link href="/api/auth/signout" className="text-red-500"><LogOut className="w-5 h-5"/></Link>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
