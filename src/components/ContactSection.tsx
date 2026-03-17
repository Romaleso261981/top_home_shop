import { ctaButtonClass } from "@/components/buttonStyles";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mb-10 rounded-2xl bg-emerald-600 px-6 py-9 text-white shadow-sm sm:px-10"
    >
      <h2 className="text-2xl font-bold">Потрібна консультація по промисловій підлозі?</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
        Розкажіть коротко про об’єкт: площу, призначення приміщення, тип навантажень
        (стелажі, навантажувачі, температура). Ми підготуємо для вас технічне рішення та
        орієнтовний кошторис.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href="tel:+380674428346"
          className={`${ctaButtonClass} min-w-[220px] text-sm`}
        >
          +38 (067) 442 83 46
        </a>
        <a
          href="mailto:monolitrvua@gmail.com"
          className={`${ctaButtonClass} min-w-[220px] text-sm`}
        >
          Написати на email
        </a>
      </div>
    </section>
  );
}

