import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { TypesSection } from "@/components/TypesSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { StepsSection } from "@/components/StepsSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="bg-zinc-50">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <HeroSection />
        <AboutSection />
        <TypesSection />
        <BenefitsSection />
        <StepsSection />
        <ContactSection />
      </main>
    </div>
  );
}
