"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PartnersSection() {
  return (
    <section id="partners" className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-2">Community Partners</h3>
            <h4 className="text-2xl font-serif text-primary mb-4">Building the community together.</h4>
            <p className="text-primary/70 mb-6 flex-grow">
              We work with: Doctors · Hospitals · Medical associations · Healthcare organisations · Financial professionals · Industry experts
            </p>
            <Button asChild variant="outline" className="w-max">
              <Link href="/contact?type=partner">PARTNER WITH US</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col h-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-2">For Speakers & Experts</h3>
            <h4 className="text-2xl font-serif text-primary mb-4">Have knowledge that can help doctors?</h4>
            <p className="text-primary/70 mb-6 flex-grow">
              If you have expertise in finance, wealth, entrepreneurship, professional growth, technology, business or other areas relevant to doctors.
            </p>
            <Button asChild variant="outline" className="w-max">
              <Link href="/contact?type=speaker">BECOME A SPEAKER</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full bg-primary text-white p-8 rounded-3xl shadow-sm"
          >
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-2">For Partners</h3>
            <h4 className="text-2xl font-serif mb-4">Build meaningful connections.</h4>
            <p className="text-white/70 mb-6 flex-grow">
              White Coat Club offers organisations an opportunity to support a meaningful initiative focused on doctors, knowledge and community.
            </p>
            <Button asChild variant="accent" className="w-max">
              <Link href="/contact?type=partner">PARTNER WITH US</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
