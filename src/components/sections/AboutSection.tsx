"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Users, BookOpen, TrendingUp, ShieldPlus, Syringe, Dna, Stethoscope, HeartPulse, Pill } from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Stronger Parallax scroll effects using pixel values instead of percentages
  const yFloating1 = useTransform(scrollYProgress, [0, 1], [-150, 300]);
  const yFloating2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const xFloating1 = useTransform(scrollYProgress, [0, 1], [-100, 200]);
  const xFloating2 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  const xTitle = useTransform(scrollYProgress, [0, 1], [-150, 50]);
  const xSubtitle = useTransform(scrollYProgress, [0, 1], [100, -50]);

  return (
    <section id="about" ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      
      {/* Rich Dotted Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#0b192c 2px, transparent 2px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      {/* Dynamic Floating Medical Elements */}
      <motion.div style={{ y: yFloating1, x: xFloating1 }} className="absolute top-[10%] left-[-2%] text-primary/10 pointer-events-none rotate-12">
        <ShieldPlus size={280} strokeWidth={0.5} />
      </motion.div>
      <motion.div style={{ y: yFloating2, x: xFloating2 }} className="absolute bottom-[5%] right-[-2%] text-accent/10 pointer-events-none -rotate-12">
        <Dna size={350} strokeWidth={0.5} />
      </motion.div>
      <motion.div style={{ y: yFloating1, x: xFloating2 }} className="absolute top-[40%] left-[85%] text-primary/10 pointer-events-none">
        <Syringe size={120} strokeWidth={0.5} className="-rotate-45" />
      </motion.div>
      <motion.div style={{ y: yFloating2, x: xFloating1 }} className="absolute top-[60%] left-[5%] text-accent/15 pointer-events-none hidden md:block">
        <Stethoscope size={90} strokeWidth={1} className="rotate-45" />
      </motion.div>
      <motion.div style={{ y: yFloating1 }} className="absolute bottom-[20%] left-[40%] text-primary/5 pointer-events-none hidden lg:block">
        <HeartPulse size={160} strokeWidth={0.5} />
      </motion.div>
      <motion.div style={{ y: yFloating2 }} className="absolute top-[20%] right-[30%] text-accent/10 pointer-events-none hidden md:block">
        <Pill size={80} strokeWidth={1} className="rotate-12" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Top Centered Content */}
        <div className="max-w-4xl mx-auto text-center mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 shadow-sm">
              <h2 className="text-sm font-bold tracking-widest text-accent uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                A Space Created For Doctors
              </h2>
            </div>
            
            <motion.h3 
              style={{ x: xTitle }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-2 leading-tight"
            >
              Beyond Medicine.
            </motion.h3>
            <motion.div style={{ x: xSubtitle }} className="mb-10">
              <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary/60 italic leading-tight">
                Beyond the Clinic.
              </span>
            </motion.div>
            
            <div className="text-lg md:text-xl text-primary/70 space-y-6 text-left md:text-center max-w-3xl mx-auto leading-relaxed bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-primary/5 shadow-xl">
              <p>Medicine teaches doctors how to care for others.</p>
              <p>White Coat Club creates a space for doctors to take care of another important part of their lives — their own growth.</p>
              <p>Through meaningful conversations, peer networking and knowledge-sharing sessions, the Club brings doctors and professionals together in an environment that is informative, comfortable and genuinely community-driven.</p>
              <p>Whether it is a conversation with another doctor, a new professional connection, an expert insight or simply an evening spent with people who understand the journey —</p>
              <p className="font-semibold text-primary text-2xl mt-8 pb-4 border-b-2 border-accent/30 inline-block">
                White Coat Club is about creating meaningful moments beyond the clinic.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Two Column Section */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="relative"
          >
            {/* Decorative background shape */}
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10" />
            
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Why White Coat Club?</h2>
            <h3 className="text-4xl lg:text-5xl font-serif text-primary mb-8 leading-tight">
              Because doctors deserve a space of their own.
            </h3>
            
            <div className="text-lg text-primary/70 space-y-5 relative pl-6 border-l-2 border-primary/10">
              <p>
                Doctors spend years mastering medicine. But there are many areas outside medicine where access to the right knowledge, guidance and conversations can make a difference.
              </p>
              <p>
                One such area is <strong className="text-primary font-medium">financial knowledge.</strong>
              </p>
              <p>
                Through our work with doctors, we recognised the need for a platform where financial topics could be discussed openly and simply — without making the conversation feel complicated or commercial.
              </p>
              <p className="font-serif text-2xl text-primary italic pt-4">
                That thought became White Coat Club.
              </p>
            </div>
          </motion.div>

          {/* Right Column Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.2 }}
            className="grid gap-6 relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl -z-10 rounded-full" />
            
            <h4 className="font-serif text-3xl text-primary mb-2">A community where doctors can:</h4>
            
            <div className="group bg-white/80 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <Users className="text-accent" size={28} />
                </div>
                <div>
                  <strong className="block text-primary text-xl mb-2 font-serif">CONNECT</strong>
                  <span className="text-primary/70">Meet fellow doctors, professionals and people from different walks of life.</span>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="text-accent" size={28} />
                </div>
                <div>
                  <strong className="block text-primary text-xl mb-2 font-serif">LEARN</strong>
                  <span className="text-primary/70">Explore financial, professional and life-related topics through meaningful conversations.</span>
                </div>
              </div>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-primary/10 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="text-accent" size={28} />
                </div>
                <div>
                  <strong className="block text-primary text-xl mb-2 font-serif">GROW</strong>
                  <span className="text-primary/70">Discover new perspectives, build relationships and make more informed decisions.</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
