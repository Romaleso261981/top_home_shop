"use client";

import { useState } from "react";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    size: "155*210",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const sizes = [
    { value: "155*210", label: "Полуторний 155*210", price: "1050 грн" },
    { value: "175*210", label: "Двоспальний 175*210", price: "1100 грн" },
    { value: "200*220", label: "Євро 200*220", price: "1150 грн" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setSubmitStatus({
            type: "success",
            message: "Дякуємо за замовлення! Наш менеджер зв'яжеться з вами найближчим часом.",
          });
          // Очищаємо форму після успішної відправки
          setFormData({
            name: "",
            phone: "",
            email: "",
            size: "155*210",
          });
        } else if (data.instruction) {
          // Якщо є інструкція (Chat ID не налаштовано)
          setSubmitStatus({
            type: "error",
            message: data.error || "Chat ID не налаштовано. " + (data.instruction || ""),
          });
        } else {
          setSubmitStatus({
            type: "error",
            message: data.error || "Помилка відправки замовлення. Спробуйте ще раз.",
          });
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Помилка відправки замовлення. Спробуйте ще раз.",
        });
      }
    } catch (error) {
      console.error("Помилка відправки форми:", error);
      setSubmitStatus({
        type: "error",
        message: "Помилка з'єднання. Перевірте інтернет-з'єднання та спробуйте ще раз.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSize = sizes.find((s) => s.value === formData.size);

  return (
    <section id="order" className="py-12 md:py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 md:p-8 text-center">
              <div className="inline-block mb-3 px-4 py-2 bg-white/20 rounded-full text-sm md:text-base font-semibold">
                Мега розпродаж -50%
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                КОВДРА СТЬОБАНА НА ОВЧИНІ
              </h2>
              <p className="text-sm md:text-base opacity-90">(360 задоволених покупців)</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="text-gray-300 line-through text-lg md:text-xl">2100 грн</span>
                <span className="text-3xl md:text-4xl font-bold">
                  {selectedSize?.price.split(" ")[0]} грн
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                Заповніть форму для оформлення замовлення
              </h3>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-3 text-base md:text-lg">
                  Оберіть розмір ковдри *
                </label>
                <div className="space-y-3">
                  {sizes.map((size) => (
                    <label
                      key={size.value}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.size === size.value
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        value={size.value}
                        checked={formData.size === size.value}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-5 h-5 text-orange-600 mr-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{size.label}</div>
                        <div className="text-orange-600 font-bold">{size.price}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="mb-4 md:mb-6">
                <label className="block text-gray-900 font-semibold mb-2">
                  Ім&apos;я та прізвище *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="Введіть ваше ім&apos;я"
                />
              </div>

              {/* Phone */}
              <div className="mb-4 md:mb-6">
                <label className="block text-gray-900 font-semibold mb-2">
                  Номер телефону *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="+380 XX XXX XX XX"
                />
              </div>

              {/* Email */}
              <div className="mb-6 md:mb-8">
                <label className="block text-gray-900 font-semibold mb-2">
                  Електронна пошта
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Status Message */}
              {submitStatus.type && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <p className="font-semibold text-center">{submitStatus.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-full transition-colors font-bold text-lg md:text-xl shadow-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                } text-white`}
              >
                {isSubmitting ? "Відправка..." : "Замовити"}
              </button>

              <p className="text-center text-gray-600 text-sm mt-4">
                * Обов&apos;язкові поля
              </p>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <p className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Мега розпродаж <span className="text-orange-600">-50%</span>
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                з сьогодні до кінця тижня
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

