"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "White Coat Club gave me an opportunity to meet people outside my regular professional circle and have conversations that were genuinely useful.",
    author: "Dr. Alok M."
  },
  {
    quote: "It was refreshing to attend an event that wasn't about medicine or sales, but simply about meeting people, learning something new and having meaningful conversations.",
    author: "Dr. Sneha R."
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-accent/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">From the White Coat Club Community</h2>
          <h3 className="text-4xl font-serif text-primary">It's about the people.</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 relative"
            >
              <div className="text-accent text-6xl font-serif absolute top-6 left-6 opacity-20">"</div>
              <p className="text-lg text-primary/80 italic mb-8 relative z-10">"{test.quote}"</p>
              <p className="font-bold text-primary">— {test.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
