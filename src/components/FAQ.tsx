"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Замовлення та доставка",
      answer: "Для оформлення замовлення скористайтеся формою нижче та введіть свої дані. Наш менеджер зв'яжеться з вами найближчим часом для уточнення деталей замовлення. Доставляємо замовлення протягом 1-3 днів Новою Поштою або Укрпоштою.",
    },
    {
      question: "Оплата",
      answer: "Жодних передплат. Ви сплачуєте товар лише за фактом отримання на руки. Усі товари проходять перевірку перед відправкою клієнту.",
    },
    {
      question: "Додаткові характеристика ковдри:",
      answer: (
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>Антибактеріальна (не створює середовище для паразитів і пилових кліщів)</li>
          <li>Терморегулювальна (зберігає тепло, але не парить)</li>
          <li>Дозволене машинне прання (рекомендуємо пральні машини від 7 кг)</li>
          <li>Не створює статистичну електрику</li>
        </ul>
      ),
    },
  ];

  return (
    <section id="faq" className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6">
          FAQ
        </h2>
        <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm md:text-base">
          Важлива інформація та відповіді на питання
        </p>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 md:px-8 py-4 md:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-base md:text-lg pr-4">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-600 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 md:px-8 pb-4 md:pb-5 text-gray-700 text-sm md:text-base leading-relaxed">
                  {typeof faq.answer === "string" ? <p>{faq.answer}</p> : faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

