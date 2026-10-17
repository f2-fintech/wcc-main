"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Stethoscope,
  GraduationCap,
  Clock,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  QrCode,
  RotateCcw,
  Building2,
  HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SmartDoctorImage } from "@/components/ui/SmartDoctorImage";

interface DoctorData {
  _id: string;
  name: string;
  slug: string;
  photoUrl?: string;
  specialization?: string;
  qualifications?: string;
  hospital?: string;
  city?: string;
  state?: string;
  experienceYears?: number;
  bio?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
  };
  focalPoint?: {
    x: number;
    y: number;
  };
  createdAt?: string;
}

// Official WhatsApp brand icon SVG
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.84C8.94 6.84 8.78 6.85 8.63 6.94C8.42 7.04 8.16 7.29 8.16 7.78C8.16 8.27 8.52 9.27 9.01 9.94C9.5 10.61 10.57 12.28 12.24 13C13.62 13.6 14.37 13.63 15.05 13.48C15.69 13.34 16.71 12.75 16.92 12.16C17.13 11.58 17.13 11.08 17.07 10.98C17 10.87 16.85 10.81 16.58 10.68C16.31 10.54 15 9.9 14.76 9.81C14.52 9.73 14.34 9.68 14.17 9.94C14 10.2 13.5 10.81 13.35 10.98C13.2 11.15 13.05 11.17 12.78 11.03C12.51 10.9 11.64 10.61 10.61 9.69C9.8 8.97 9.26 8.08 9.12 7.84C8.98 7.6 9.11 7.47 9.24 7.34C9.36 7.22 9.5 7.03 9.64 6.89C9.77 6.74 9.82 6.64 9.91 6.45C10 6.26 9.95 6.1 9.88 5.97C9.82 5.83 9.29 4.54 9.11 4.1C8.93 3.67 8.74 3.73 8.6 3.72L8.14 3.72C7.96 3.72 7.69 3.79 7.46 4.04C7.23 4.29 6.58 4.9 6.58 6.13C6.58 7.36 7.48 8.54 7.61 8.71C7.74 8.88 9.38 11.4 11.88 12.48C14.38 13.56 14.38 13.2 14.82 13.16C15.26 13.12 16.24 12.58 16.44 12.01C16.64 11.44 16.64 10.95 16.58 10.85C16.52 10.75 16.37 10.69 16.1 10.56L9.11 6.84Z" />
    </svg>
  );
}

export function DoctorProfileCard({ doctor }: { doctor: DoctorData }) {
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareText = `Check out Dr. ${doctor.name}${doctor.specialization ? ` (${doctor.specialization})` : ""} on The White Coat Club:\n${currentUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Dr. ${doctor.name} - White Coat Club`,
          text: `Doctor Profile: Dr. ${doctor.name}`,
          url: currentUrl || window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentUrl || "https://whitecoat.in")}`;

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-20 overflow-hidden bg-[#fafafa]">

      {/* =========================================================================
          AUTHENTIC & AESTHETIC MEDICAL BACKGROUND
          ========================================================================= */}

      {/* 1. Subtle, Warm Ambient Lighting (Natural, not neon) */}
      <div className="absolute top-12 left-1/4 w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-slate-200/40 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* 2. Soft Dot Texture */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#0b192c 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 3. Subtle Electrocardiogram (ECG) Heartbeat Pulse Wave */}
      <div className="absolute top-28 left-0 right-0 pointer-events-none -z-10 opacity-15 overflow-hidden">
        <svg className="w-full h-20 text-accent" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path
            d="M0,40 L220,40 L235,40 L245,20 L255,65 L265,10 L275,55 L285,40 L500,40 L515,40 L525,20 L535,65 L545,10 L555,55 L565,40 L880,40 L895,40 L905,20 L915,65 L925,10 L935,55 L945,40 L1200,40 L1215,40 L1225,20 L1235,65 L1245,10 L1255,55 L1265,40 L1440,40"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 4. Artistic Stethoscope Watermark in Background */}
      <div className="absolute top-16 right-6 pointer-events-none -z-10 text-primary/[0.03]">
        <Stethoscope className="w-80 h-80 transform rotate-12" />
      </div>

      {/* =========================================================================
          PAGE CONTENT CONTAINER
          ========================================================================= */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">

        {/* Navigation & Sharing Top Bar (Responsive for Mobile) */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-primary/80 hover:text-primary hover:bg-white/80 shadow-xs border border-gray-200/60 text-xs sm:text-sm rounded-full px-3.5 py-1.5"
          >
            <Link href="/doctors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-primary text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Copy Profile Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span className="hidden sm:inline text-xs">Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =====================================================================
            HUMANIZED DOCTOR PROFILE CARD
            ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-3xl border border-gray-200/80 shadow-lg shadow-slate-900/5 overflow-hidden"
        >
          {/* Natural, Humanized Card Header */}
          <div className="px-5 sm:px-8 py-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                <Stethoscope className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide block">
                  The White Coat Club
                </span>
                <p className="text-[11px] sm:text-xs text-primary/60">
                  Doctor Directory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Verified Doctor
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

              {/* Left Column: 3D Flipping Photo & QR Box */}
              <div className="lg:col-span-5 flex flex-col items-center">

                {/* 3D Flip Card Container */}
                <div
                  className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] mx-auto cursor-pointer select-none group"
                  style={{ perspective: "1000px" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  title="Click or tap to flip card"
                >
                  <div
                    className="w-full h-full relative"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* =========================================================
                        FRONT SIDE: DOCTOR PHOTO
                        ========================================================= */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md group-hover:shadow-lg transition-shadow"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {doctor.photoUrl ? (
                        <SmartDoctorImage
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          focalPoint={doctor.focalPoint}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary/30 p-6 text-center">
                          <Stethoscope className="w-20 h-20 mb-2 text-primary/20" />
                          <span className="text-xs uppercase tracking-wider text-primary/50 font-medium">Doctor Profile</span>
                        </div>
                      )}

                      {/* Interactive Flip Hint Chip (Top Right) */}
                      <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/75 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105">
                        <QrCode className="w-3 h-3 text-amber-300" />
                      </div>

                      {/* Qualification Tag on Front (Bottom) */}
                      {doctor.qualifications && (
                        <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                          <span className="font-semibold truncate mr-2">{doctor.qualifications}</span>
                          <span className="text-white/70 text-[11px] shrink-0">Credentials</span>
                        </div>
                      )}
                    </div>

                    {/* =========================================================
                        BACK SIDE: QR CODE CARD (FLIPPED 180 DEG)
                        ========================================================= */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white border border-amber-300/60 shadow-xl flex flex-col items-center justify-between p-6 text-center"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {/* Interactive Flip Hint Chip (Top Right) */}
                      <div className="absolute top-3 right-3 bg-slate-100 text-primary text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1.5 shadow-xs transition-transform group-hover:scale-105">
                        <RotateCcw className="w-3 h-3 text-accent" />
                        <span>View Photo</span>
                      </div>

                      {/* Top Branding on QR Side */}
                      <div className="mt-2">
                        <span className="text-[11px] font-semibold text-accent uppercase tracking-wider block">
                          The White Coat Club
                        </span>
                        <h4 className="font-serif text-lg font-bold text-primary truncate max-w-[200px]">
                          Dr. {doctor.name}
                        </h4>
                      </div>

                      {/* Crisp QR Code */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs inline-block">
                        <img
                          src={qrApiUrl}
                          alt={`QR Code for Dr. ${doctor.name}`}
                          className="w-36 h-36 sm:w-44 sm:h-44 object-contain"
                        />
                      </div>

                      {/* Bottom Instruction & Flip Back Hint */}
                      <div className="w-full">
                        <p className="text-[11px] text-primary/60 mb-1">
                          Scan to view & share verified profile
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs text-accent font-medium">
                          <RotateCcw className="w-3 h-3" />
                          <span>Tap anywhere to flip back</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop-only Action Buttons Container (Hidden on Mobile) */}
                <div className="hidden lg:block w-full max-w-[280px] sm:max-w-[320px] mt-4 space-y-2.5">
                  {/* WhatsApp Direct Share Button */}
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-semibold shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer text-sm"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>Share on WhatsApp</span>
                  </button>

                  {/* Secondary Buttons Row: Flip Toggle, Copy Link & Native Share */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-medium text-primary shadow-xs transition-colors cursor-pointer"
                      title="Flip Card"
                    >
                      {isFlipped ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">Photo</span>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">Show QR</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-medium text-primary shadow-xs transition-colors cursor-pointer"
                      title="Copy Profile Link"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-emerald-700 font-semibold truncate">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="truncate">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleNativeShare}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-medium text-primary shadow-xs transition-colors cursor-pointer"
                      title="Share via other apps"
                    >
                      <Share2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">Share</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Doctor Details, Practice Info & Bio */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>

                  {/* Specialization Pill */}
                  {doctor.specialization ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent font-semibold text-xs tracking-wide uppercase mb-2">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{doctor.specialization}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary/70 font-semibold text-xs tracking-wide uppercase mb-2">
                      <span>Medical Practitioner</span>
                    </div>
                  )}

                  {/* Doctor Full Name */}
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight mb-1.5 break-words">
                    Dr. {doctor.name}
                  </h1>

                  <p className="text-primary/60 text-xs sm:text-sm mb-6">
                    White Coat Club Community Member {doctor.hospital ? `• ${doctor.hospital}` : ""}
                  </p>

                  {/* Structured Practice Details Grid (Responsive) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

                    {/* Hospital / Clinic */}
                    {doctor.hospital && (
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-gray-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] uppercase tracking-wider text-primary/50 font-medium block">
                            Hospital / Clinic
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-primary block truncate">
                            {doctor.hospital}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Qualifications */}
                    {doctor.qualifications && (
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-gray-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] uppercase tracking-wider text-primary/50 font-medium block">
                            Qualifications
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-primary block truncate">
                            {doctor.qualifications}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {(doctor.city || doctor.state) && (
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-gray-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] uppercase tracking-wider text-primary/50 font-medium block">
                            Location
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-primary block truncate">
                            {[doctor.city, doctor.state].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {Boolean(doctor.experienceYears && doctor.experienceYears > 0) && (
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-gray-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] uppercase tracking-wider text-primary/50 font-medium block">
                            Experience
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-primary block truncate">
                            {doctor.experienceYears} Years of Practice
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* About / Bio Section (Humanized Tone) */}
                  <div className="pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2.5">
                      <HeartPulse className="w-4 h-4 text-accent" />
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-primary">
                        About Dr. {doctor.name}
                      </h3>
                    </div>

                    <div className="text-primary/75 text-xs sm:text-sm leading-relaxed space-y-2.5 bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-gray-100">
                      {doctor.bio ? (
                        doctor.bio.split("\n").filter(Boolean).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))
                      ) : (
                        <p className="text-primary/70">
                          Dr. {doctor.name} is a medical practitioner and member of The White Coat Club. For consultations, clinic appointments, or professional inquiries, connect directly through the options above.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn / Social Link */}
                  {doctor.socialLinks?.linkedin && (
                    <div className="mt-5 flex items-center gap-3">
                      <Button asChild variant="outline" size="sm" className="gap-2 rounded-xl text-xs sm:text-sm">
                        <a href={doctor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5" /> View LinkedIn Profile
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Mobile-only Action Dock at Very Bottom */}
                  <div className="lg:hidden mt-8 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 className="w-4 h-4 text-accent" />
                      <h3 className="font-serif text-base font-bold text-primary">
                        Share Dr. {doctor.name}&apos;s Profile
                      </h3>
                    </div>

                    {/* WhatsApp Primary Share */}
                    <button
                      onClick={handleWhatsAppShare}
                      className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-semibold shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer text-sm"
                    >
                      <WhatsAppIcon className="w-5 h-5 shrink-0" />
                      <span>Share on WhatsApp</span>
                    </button>

                    {/* Secondary Quick Action Row: Show QR, Copy Link, Native Share */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setIsFlipped(!isFlipped);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-medium text-primary shadow-xs transition-colors cursor-pointer"
                        title="Flip to QR Code"
                      >
                        {isFlipped ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="truncate">Photo</span>
                          </>
                        ) : (
                          <>
                            <QrCode className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="truncate">Show QR</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-medium text-primary shadow-xs transition-colors cursor-pointer"
                        title="Copy Profile Link"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700 font-semibold truncate">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                            <span className="truncate">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleNativeShare}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-medium text-primary shadow-xs transition-colors cursor-pointer"
                        title="Share via other apps"
                      >
                        <Share2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">More</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Understated Member Footer Note */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs text-primary/50">
                  <span>The White Coat Club • Professional Network</span>
                  <span>Member Directory</span>
                </div>

              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
