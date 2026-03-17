import Image from "next/image";

type IndustrialFloorsIntroSectionProps = {
  /**
   * CSS object-position (приклади: "center", "top", "left", "50% 30%")
   * Працює разом з object-none (картинка не масштабується).
   */
  imagePosition?: string;

  /**
   * Де показувати картинку на десктопі.
   */
  imageSide?: "left" | "right";

  /**
   * Текст секції (кожен елемент масиву — окремий абзац).
   */
  paragraphs: string[];
};

export function IndustrialFloorsIntroSection({
  imagePosition = "center",
  imageSide = "left",
  paragraphs,
}: IndustrialFloorsIntroSectionProps) {
  return (
    <section className="mb-12 bg-white shadow-sm sm:rounded-2xl sm:px-10 sm:py-8">
      <div
        className={[
          "grid gap-8 sm:gap-10 lg:items-start",
          imageSide === "right" ? "lg:grid-cols-[1fr_520px]" : "lg:grid-cols-[520px_1fr]",
        ].join(" ")}
      >
        {/* Image: fixed size, no responsive scaling */}
        <div className={["overflow-x-auto", imageSide === "right" ? "lg:order-2" : ""].join(" ")}>
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

        <div
          className={[
            "px-4 pb-6 sm:px-0 sm:pb-0",
            imageSide === "right" ? "lg:order-1" : "",
          ].join(" ")}
        >
          <div className="space-y-6">
            {paragraphs.map((text, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed text-zinc-700 sm:text-base"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

