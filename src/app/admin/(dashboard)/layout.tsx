import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminNav } from "@/components/admin/AdminNav";

// instant = false → allow blocking prerender (blocking-prerender-dynamic fix)
// connection() → marks route as dynamic before crypto is called (blocking-prerender-random fix)
export const instant = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminNav userEmail={session.user?.email}>
      {children}
    </AdminNav>
  );
}

