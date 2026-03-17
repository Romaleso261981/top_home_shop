type MaterialSelectionSectionProps = {
  title: string;
  paragraphs: string[];
  items: string[];
};

export function MaterialSelectionSection({
  title,
  paragraphs,
  items,
}: MaterialSelectionSectionProps) {
  return (
    <section className="mb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">{title}</h2>

        <div className="mt-5 space-y-5">
          {paragraphs.map((text, idx) => (
            <p key={idx} className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              {text}
            </p>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
            Види промислових підлог
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
            Існує декілька типів промислових підлог, кожен з яких має свої характеристики і
            властивості, що роблять їх придатними для різних промислових умов. Ось деякі з
            найпоширеніших видів промислових підлог:
          </p>

          <ol className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
            {items.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold text-zinc-900">{idx + 1}. </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

