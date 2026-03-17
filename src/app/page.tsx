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
        <IndustrialFloorsIntroSection
          imagePosition="70% 50%"
          paragraphs={[
            "Термін «підлога» слід розуміти як обробку горизонтальної перегородки конструкції, що надає їй необхідні функціональні властивості. Підлога складається з: гідроізоляційних шарів, пароізоляції, тепло- і звукоізоляції, захисних шарів, несучих шарів (бетонів, стяжок), обраних в залежності від навантаження, типу приміщення і відповідних вимог до використання. З іншого боку, підлога – це верхній шар, який переносить функціональні навантаження на будівельні шари і / або захищає його від пошкоджень, викликаних агресивним середовищем і / або.",
            "Дизайнерські рішення для підлог варіюються в залежності від навантаження і місця установки (умов експлуатації). Тип використовуваних матеріалів залежить, перш за все, від типу приміщення і об’єкта, способу завантаження, наявності та типу агресивних сполук, способу використання приміщення, додаткових санітарних вимог і т. д.",
          ]}
        />
        <AboutSection />
        <TypesSection />
        <BenefitsSection />
        <StepsSection />
        <ContactSection />
      </main>
    </div>
  );
}
