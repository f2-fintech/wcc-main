import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { MarketingTeamSection } from "@/components/sections/MarketingTeamSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <EventsSection />
      <TestimonialsSection />
      <PartnersSection />
      <MarketingTeamSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
