"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Stethoscope, HeartPulse, Activity, Cross } from "lucide-react";

const HERO_IMAGES = [
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6922dd15b40670e60925/photos/d4aeeae2-9df7-4f63-8069-9109f34d66ed.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ODU4552724GKCIJ%2F20261008%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20261008T045920Z&X-Amz-Expires=3600&X-Amz-Signature=d28ba969891a22819bd4d70f99a58386ff68a7f0979f296bf0947d9653151e98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/d61c3869-e468-4ed7-b63a-1fd72e365275.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ODU4552724GKCIJ%2F20261008%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20261008T050205Z&X-Amz-Expires=3600&X-Amz-Signature=3ab8be0e1807f4cb03e88d28044d332bd24fb8821a96344c46a210778d0b2a6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6922dd15b40670e60925/photos/3782b3a8-6664-4918-9f71-e838f7bd2e87.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ODU4552724GKCIJ%2F20261008%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20261008T050151Z&X-Amz-Expires=3600&X-Amz-Signature=15e857da45c634912fef0de91eb165aff856ff921e2868731485a3c37094f4bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6895dd15b40670e608f0/photos/96832dac-16cb-4aee-8c8a-2c7ad11e3fb5.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ODU4552724GKCIJ%2F20261008%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20261008T050226Z&X-Amz-Expires=3600&X-Amz-Signature=02d90211e68748eb0c97279340155660b7bf000237eefea1db10a37ec658329c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6568dd15b40670e60866/photos/23d15a53-e1d9-42a4-9489-c126046462cc.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ODU4552724GKCIJ%2F20261008%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20261008T050654Z&X-Amz-Expires=3600&X-Amz-Signature=5e69987e80be76525e2252781c62477dc8655d005aa09d57fbc90973bc36112f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6922dd15b40670e60925/photos/fc4221f7-2dad-4c89-8f05-4090b86d3b5c.JPG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA6ODU4552724GKCIJ%2F20261008%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20261008T052508Z&X-Amz-Expires=3600&X-Amz-Signature=b18bdd2b22c6cc76ccc59a2e56058bcc60bd609ba68247eb1c5a9b46224dc64d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500); // 4.5 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 pb-12">
      {/* Background Parallax - Static to prevent scroll lag from heavy blur */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60" />
      </motion.div>

      {/* Floating Medical Icons - Scroll Parallax */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] text-accent/20 hidden lg:block pointer-events-none"
      >
        <Stethoscope size={90} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[40%] text-primary/10 hidden lg:block pointer-events-none z-0"
      >
        <HeartPulse size={140} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[15%] text-accent/15 hidden xl:block pointer-events-none"
      >
        <Activity size={70} />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
              <Cross size={14} className="text-accent" />
              <span>For Medical Professionals</span>
            </div> */}

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary mb-4 leading-tight">
              WHITE COAT <span className="text-accent">CLUB</span>
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-wide text-primary/60 mb-6 uppercase">
              Connect. Learn. Grow.
            </p>
            <h2 className="text-xl md:text-2xl text-primary/90 font-serif mb-8 border-l-4 border-accent pl-4">
              A community created for doctors, beyond the clinic.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-base text-primary/70 space-y-4 mb-10"
          >
            <p>
              Doctors spend their lives taking care of others. Years of learning. Years of practice. Years of making a difference.
            </p>
            <p>
              But life as a doctor extends far beyond medicine. There are conversations about financial decisions, aspirations, and the future — conversations that deserve just as much attention.
            </p>
            <p className="font-semibold text-primary">
              Because growth doesn't only happen inside the clinic.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button asChild size="lg" variant="default" className="shadow-lg shadow-primary/20">
              <Link href="/join">JOIN THE CLUB</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Link href="/#events">EXPLORE EVENTS</Link>
            </Button>
          </motion.div>
        </div>

        {/* Right Image Composition */}
        <motion.div
          className="relative mt-12 lg:mt-0 lg:ml-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 overflow-hidden shadow-2xl border-4 lg:border-8 border-white w-full max-w-[640px] mx-auto transition-transform duration-700 hover:scale-105 aspect-[4/3] rounded-3xl lg:aspect-[1.1/1] lg:[border-radius:40%_60%_70%_30%/40%_50%_60%_50%]"
          >
            {/* Carousel Images */}
            <AnimatePresence>
              {HERO_IMAGES.map((src, index) => (
                index === currentImageIndex && (
                  <motion.img
                    key={src}
                    src={src}
                    alt={`White Coat Club Event ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                )
              ))}
            </AnimatePresence>

            {/* Subtle gradient just for the dots visibility */}
            <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 bg-gradient-to-t from-black/40 to-transparent z-[5] pointer-events-none" />

            {/* Carousel Dots inside the shape */}
            <div className="absolute bottom-6 lg:bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${i === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/60 w-2 hover:bg-white"
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Decorative image accent - Hidden on mobile, shifted left on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 20 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute hidden lg:block -bottom-16 -left-48 w-64 h-64 overflow-hidden shadow-xl border-4 border-white z-20 [border-radius:60%_40%_30%_70%/60%_30%_70%_40%]"
          >
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=400"
              alt="Medical stethoscope"
              className="w-full h-full object-cover scale-110"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

