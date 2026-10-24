"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

// ─── Fallback data (used until DB loads) ─────────────────────────────────────
const FALLBACK_FEATURES = [
  {
    _id: "f1",
    title: "Financial Conversations",
    description:
      "Understand important financial concepts, ask questions and gain perspectives from professionals who work in the financial ecosystem.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/d61c3869-e468-4ed7-b63a-1fd72e365275.JPG",
  },
  {
    _id: "f2",
    title: "Doctor-to-Doctor Networking",
    description:
      "Meet fellow doctors, exchange experiences and build relationships with people who understand your professional journey.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6895dd15b40670e608f0/photos/6f788fe0-9b3e-4083-b75a-03c96b7ce8fa.JPG",
  },
  {
    _id: "f3",
    title: "Knowledge Sessions",
    description:
      "Hear from experienced professionals and experts on subjects relevant to life beyond medicine.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68eadd15b40670e6090f/photos/15104109-6cba-47a2-a1d9-8916d22b577a.JPG",
  },
  {
    _id: "f4",
    title: "Meaningful Conversations",
    description:
      "No rigid agenda. No unnecessary formality. Just relevant conversations, useful insights and an opportunity to learn something new.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba68cddd15b40670e60906/photos/e6da52a0-ade6-4b0c-94f6-de471d9e5305.JPG",
  },
  {
    _id: "f5",
    title: "Community Experiences",
    description:
      "Every edition is an opportunity to meet new people, reconnect with peers and become part of something bigger.",
    imageUrl:
      "https://f2fintech-hrms.s3.eu-north-1.amazonaws.com/event-pics/6aba52be784100b388f2e1d1/media/6aba52be784100b388f2e1d2/6aba6893dd15b40670e608d4/photos/e176366b-38bf-499f-98ee-e478e63d6497.JPG",
  },
];

// ─── Helper: shortest circular distance ─────────────────────────────────────
function angularDistance(a: number, b: number, total: number): number {
  const diff = Math.abs(a - b);
  return Math.min(diff, total - diff);
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function FeaturesSection() {
  const [features, setFeatures] = useState<any[]>(FALLBACK_FEATURES);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions for cards & orbit ellipse
  const [dimensions, setDimensions] = useState({
    cardW: 380,
    cardH: 250,
    radiusX: 420,
    radiusY: 70,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setDimensions({ cardW: 270, cardH: 180, radiusX: 150, radiusY: 30 });
      } else if (w < 1024) {
        setDimensions({ cardW: 320, cardH: 215, radiusX: 280, radiusY: 50 });
      } else {
        setDimensions({ cardW: 390, cardH: 260, radiusX: 430, radiusY: 70 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Fetch features from DB; fallback on error
  useEffect(() => {
    fetch("/api/public/features")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setFeatures(d.data);
        }
      })
      .catch(() => {});
  }, []);

  // ─── Responsive Scroll Progress ──────────────────────────────────────────
  // Track scroll inside the sectionRef
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const total = features.length;
    if (total === 0) return;

    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Map scroll progress (0..1) directly to indices with smooth distribution
      const rawIdx = Math.floor(v * total);
      const idx = Math.min(total - 1, Math.max(0, rawIdx));
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [scrollYProgress, features.length]);

  const total = features.length;

  /**
   * Fast & responsive scroll distance:
   * Total height is around 200vh-220vh so each card requires just ~20-25vh of scrolling
   * instead of tedious multi-screen scrolling.
   */
  const sectionHeight = `${Math.max(180, total * 42)}vh`;

  return (
    <div
      ref={sectionRef}
      style={{ height: sectionHeight, position: "relative" }}
      className="bg-primary"
    >
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className="bg-primary text-white flex flex-col justify-between"
      >
        {/* ── Section heading (Padded comfortably to sit below the fixed navbar) ── */}
        <div className="text-center pt-24 sm:pt-28 md:pt-32 pb-2 flex-shrink-0 px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase mb-2">
              What Happens At White Coat Club?
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
              Conversations that go beyond the clinic.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-xl mx-auto mt-2 leading-relaxed">
              Every White Coat Club gathering is designed around meaningful interaction rather
              than formal presentations alone.
            </p>
          </motion.div>
        </div>

        {/* ── Orbit stage ─────────────────────────────────────────────── */}
        <div className="flex-1 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
          {/* Warm ambient golden glow behind the active center card */}
          <div
            className="absolute pointer-events-none transition-all duration-700"
            style={{
              left: "50%",
              top: "38%",
              transform: "translate(-50%, -50%)",
              width: dimensions.cardW * 1.5,
              height: dimensions.cardH * 1.5,
              background:
                "radial-gradient(ellipse at center, rgba(197,168,128,0.18) 0%, rgba(197,168,128,0.04) 50%, transparent 75%)",
              borderRadius: "50%",
            }}
          />

          {/* ── Orbiting cards ────────────────────────────────────────── */}
          {features.map((feature, index) => {
            // Anti-clockwise step
            const angleStep = -(2 * Math.PI) / total;
            // Angle formula: active card sits at front center (Math.PI / 2)
            const angle = (index - activeIndex) * angleStep + Math.PI / 2;

            // Coordinates on ellipse
            const x = Math.cos(angle) * dimensions.radiusX;
            // Active card at y = 0; inactive cards recede gently upwards (negative y)
            const y = -(1 - Math.sin(angle)) * dimensions.radiusY;

            const isActive = index === activeIndex;
            const dist = angularDistance(index, activeIndex, total);

            // Larger cards, smooth scaling & opacity
            const scale = isActive ? 1.15 : Math.max(0.62, 0.78 - dist * 0.08);
            const opacity = isActive ? 1 : Math.max(0.2, 0.5 - dist * 0.12);
            const zIndex = isActive ? 30 : Math.max(1, 20 - dist * 4);

            return (
              <motion.div
                key={feature._id ?? index}
                onClick={() => setActiveIndex(index)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "38%",
                  width: dimensions.cardW,
                  height: dimensions.cardH,
                  marginLeft: -(dimensions.cardW / 2),
                  marginTop: -(dimensions.cardH / 2),
                  cursor: isActive ? "default" : "pointer",
                  zIndex,
                  willChange: "transform, opacity",
                }}
                animate={{
                  x,
                  y,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier without sluggish physics lag
                }}
              >
                <div
                  className="w-full h-full rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    border: isActive
                      ? "2px solid rgba(197,168,128,0.85)"
                      : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: isActive
                      ? "0 0 50px 8px rgba(197,168,128,0.28), 0 24px 70px rgba(0,0,0,0.7)"
                      : "0 8px 25px rgba(0,0,0,0.35)",
                  }}
                >
                  {/* Card image container */}
                  <div className="w-full h-full relative overflow-hidden bg-black/40">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                      style={{
                        transform: isActive ? "scale(1.04)" : "scale(1)",
                      }}
                    />

                    {/* Gradient overlay on image */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: isActive
                          ? "linear-gradient(to top, rgba(10,25,47,0.75) 0%, transparent 60%)"
                          : "rgba(10,25,47,0.45)",
                      }}
                    />

                    {/* Title label badge on bottom of active card */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-0 left-0 right-0 px-5 py-3.5"
                      >
                        <p className="text-accent text-sm sm:text-base font-bold leading-tight truncate drop-shadow-md">
                          {feature.title}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* ── Active feature text description block ────────────────────── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-center px-4 z-20"
            style={{ bottom: "1.25rem", width: "min(680px, 92vw)" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h3 className="text-2xl sm:text-3xl font-serif text-accent mb-2">
                  {features[activeIndex]?.title}
                </h3>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  {features[activeIndex]?.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators for quick click / touch navigation */}
            <div className="flex gap-2.5 justify-center mt-4">
              {features.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to feature ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer hover:opacity-100"
                  style={{
                    width: i === activeIndex ? 26 : 8,
                    height: 8,
                    background:
                      i === activeIndex
                        ? "rgba(197,168,128,1)"
                        : "rgba(255,255,255,0.25)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Marquee strip ───────────────────────────────────────────── */}
        <div className="overflow-hidden py-3 border-t border-white/10 flex-shrink-0 relative z-20">
          <div className="flex w-[200%] animate-marquee items-center gap-16">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex gap-16 whitespace-nowrap text-lg sm:text-xl font-serif text-white/35"
              >
                <span>Expert conversations</span>
                <span className="text-accent">•</span>
                <span>Peer networking</span>
                <span className="text-accent">•</span>
                <span>Financial literacy</span>
                <span className="text-accent">•</span>
                <span>Knowledge sharing</span>
                <span className="text-accent">•</span>
                <span>Interactive discussions</span>
                <span className="text-accent">•</span>
                <span>Food &amp; refreshments</span>
                <span className="text-accent">•</span>
                <span>New connections</span>
                <span className="text-accent">•</span>
                <span>Good conversations</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
