import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { IndustrialFloorsIntroSection } from "@/components/IndustrialFloorsIntroSection";
import { TypesSection } from "@/components/TypesSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { StepsSection } from "@/components/StepsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="bg-zinc-50">
      <HeroSection />
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        <IndustrialFloorsIntroSection imagePosition="70% 50%" />
        <AboutSection />
        <TypesSection />
        <BenefitsSection />
        <StepsSection />
        <ContactSection />
      </main>
    </div>
  );
}
