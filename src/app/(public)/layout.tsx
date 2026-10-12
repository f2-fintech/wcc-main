import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Suspense fallback={<div className="h-20" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
