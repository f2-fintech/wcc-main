"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Stethoscope, HeartPulse, Activity, Cross } from "lucide-react";

const HERO_IMAGES = [
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6922dd15b40670e60925/photos/d4aeeae2-9df7-4f63-8069-9109f34d66ed.JPG",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/d61c3869-e468-4ed7-b63a-1fd72e365275.JPG",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6922dd15b40670e60925/photos/3782b3a8-6664-4918-9f71-e838f7bd2e87.JPG",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6895dd15b40670e608f0/photos/96832dac-16cb-4aee-8c8a-2c7ad11e3fb5.JPG",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6568dd15b40670e60866/photos/23d15a53-e1d9-42a4-9489-c126046462cc.JPG",
  "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6922dd15b40670e60925/photos/fc4221f7-2dad-4c89-8f05-4090b86d3b5c.JPG"
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

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content (Order 2 on mobile, Order 1 on desktop) */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
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

        {/* Image Composition (Order 1 on mobile, Order 2 on desktop) */}
        <div className="relative order-1 lg:order-2 w-full lg:mt-0 lg:ml-8">

          {/* ===================================================================
              MOBILE-ONLY STACKED PHOTO DECK (Realistic Physical Photo Stack)
              =================================================================== */}
          <div className="block lg:hidden w-full max-w-[420px] sm:max-w-[480px] mx-auto mb-10 select-none px-2 sm:px-0">
            {/* Aspect container with padding so rotated cards are never clipped */}
            <div
              className="relative w-full aspect-[4/3] cursor-pointer"
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)}
              title="Tap to see next photo"
            >
              {/* Card 3: Deep Background Layer (Tilted slight left) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-md bg-slate-200 transition-transform duration-500 pointer-events-none"
                style={{
                  transform: "rotate(-1.5deg) translateY(8px) scale(0.92)",
                  zIndex: 1,
                }}
              >
                <img
                  src={HERO_IMAGES[(currentImageIndex + 2) % HERO_IMAGES.length]}
                  alt="Event preview"
                  className="w-full h-full object-cover brightness-[0.88]"
                />
              </div>

              {/* Card 2: Middle Layer (Tilted OPPOSITE RIGHT, clearly peeking out) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 transition-transform duration-500 pointer-events-none"
                style={{
                  transform: "rotate(4.5deg) translateY(4px) translateX(6px) scale(0.96)",
                  zIndex: 2,
                }}
              >
                <img
                  src={HERO_IMAGES[(currentImageIndex + 1) % HERO_IMAGES.length]}
                  alt="Next event"
                  className="w-full h-full object-cover brightness-[0.94]"
                />
              </div>

              {/* Card 1: Top Active Layer (Tilted LEFT, Lifts up & Swipes away on change) */}
              <div className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0.9, scale: 0.96, rotate: 4.5, y: 4, x: 6 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3, y: 0, x: 0 }}
                    exit={{
                      x: -340,
                      y: -35,
                      rotate: -18,
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
                    }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900 relative"
                  >
                    <img
                      src={HERO_IMAGES[currentImageIndex]}
                      alt={`White Coat Club Event ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay for indicator visibility */}
                    <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

                    {/* Subtle "Tap to swipe" hint */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
                      <span>Tap to swipe</span>
                    </div>

                    {/* Carousel Dots inside top card */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
                      {HERO_IMAGES.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === currentImageIndex ? "bg-white w-5" : "bg-white/50 w-1.5"
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ===================================================================
              DESKTOP-ONLY IMAGE COMPOSITION (Original Organic Morphing Blob)
              =================================================================== */}
          <div className="hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 overflow-hidden shadow-2xl border-8 border-white w-full max-w-[640px] mx-auto transition-transform duration-700 hover:scale-105 aspect-[1.1/1] [border-radius:40%_60%_70%_30%/40%_50%_60%_50%]"
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
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent z-[5] pointer-events-none" />

              {/* Carousel Dots inside the shape */}
              <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                      i === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/60 w-2 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Decorative image accent - shifted left on desktop */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 20 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-16 -left-48 w-64 h-64 overflow-hidden shadow-xl border-4 border-white z-20 [border-radius:60%_40%_30%_70%/60%_30%_70%_40%]"
            >
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=400"
                alt="Medical stethoscope"
                className="w-full h-full object-cover scale-110"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

