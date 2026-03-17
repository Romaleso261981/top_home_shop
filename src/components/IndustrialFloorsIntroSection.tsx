import Image from "next/image";

type IndustrialFloorsIntroSectionProps = {
  /**
   * CSS object-position (приклади: "center", "top", "left", "50% 30%")
   * Працює разом з object-none (картинка не масштабується).
   */
  imagePosition?: string;
};

export function IndustrialFloorsIntroSection({
  imagePosition = "center",
}: IndustrialFloorsIntroSectionProps) {
  return (
    <section className="mb-12 bg-white shadow-sm sm:rounded-2xl sm:px-10 sm:py-8">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-[520px_1fr] lg:items-start">
        {/* Image: fixed size, no responsive scaling */}
        <div className="overflow-x-auto">
          <div className="w-[520px]">
            <Image
              src="/promyshlennye-poly.jpg"
              alt="Промислові бетонні підлоги"
              width={520}
              height={340}
              className="block h-[340px] w-[520px] border border-zinc-200 object-none"
              style={{ objectPosition: imagePosition }}
              unoptimized
            />
          </div>
        </div>

        <div className="px-4 pb-6 sm:px-0 sm:pb-0">
          <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
            Термін «підлога» слід розуміти як обробку горизонтальної перегородки
            конструкції, що надає їй необхідні функціональні властивості. Підлога
            складається з: гідроізоляційних шарів, пароізоляції, тепло- і звукоізоляції,
            захисних шарів, несучих шарів (бетонів, стяжок), обраних в залежності від
            навантаження, типу приміщення і відповідних вимог до використання. З іншого
            боку, підлога – це верхній шар, який переносить функціональні навантаження на
            будівельні шари і / або захищає його від пошкоджень, викликаних агресивним
            середовищем і / або.
          </p>

          <p className="mt-6 text-sm leading-relaxed text-zinc-700 sm:text-base">
            Дизайнерські рішення для підлог варіюються в залежності від навантаження і
            місця установки (умов експлуатації). Тип використовуваних матеріалів залежить,
            перш за все, від типу приміщення і об’єкта, способу завантаження, наявності та
            типу агресивних сполук, способу використання приміщення, додаткових санітарних
            вимог і т. д.
          </p>
        </div>
      </div>
    </section>
  );
}

