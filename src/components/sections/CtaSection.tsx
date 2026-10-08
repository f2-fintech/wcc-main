"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-primary text-white">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-l-full blur-3xl transform translate-x-1/4" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-6">BECOME PART OF THE COMMUNITY</h2>
          <div className="text-xl text-white/80 space-y-4 mb-10 text-balance">
            <p>Your white coat represents your profession.</p>
            <p>Your community can represent everything beyond it.</p>
            <p>Join a growing community of doctors who believe that learning, connection and growth don't stop when the clinic closes.</p>
          </div>
          
          <Button asChild size="lg" variant="accent" className="text-lg px-8 h-14">
            <Link href="/join">JOIN WHITE COAT CLUB</Link>
          </Button>
          
          <p className="mt-8 text-white/50 text-sm tracking-wide">
            It's free. It's for doctors. And it's built around you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
