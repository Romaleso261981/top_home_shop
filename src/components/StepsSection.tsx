export function StepsSection() {
  return (
    <section className="mb-12 rounded-2xl bg-white px-6 py-8 shadow-sm sm:px-10 lg:mb-16">
      <h2 className="text-2xl font-bold text-zinc-900">Етапи влаштування підлоги</h2>
      <ol className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
        <li>
          <span className="font-semibold text-zinc-900">1. Обстеження об’єкта.</span>{" "}
          Аналіз ґрунтів, існуючих конструкцій, навантажень, умов експлуатації.
        </li>
        <li>
          <span className="font-semibold text-zinc-900">
            2. Проєктування конструкції підлоги.
          </span>{" "}
          Підбір товщини плити, армування, типу бетону, швів, фінішного шару.
        </li>
        <li>
          <span className="font-semibold text-zinc-900">
            3. Підготовка основи та влаштування плити.
          </span>{" "}
          Ущільнення основи, гідроізоляція, армування, бетонування з контролем рівня.
        </li>
        <li>
          <span className="font-semibold text-zinc-900">
            4. Фінішна обробка та шви.
          </span>{" "}
          Зміцнення поверхні (топінг/шліфування/полімер), нарізка та герметизація швів.
        </li>
        <li>
          <span className="font-semibold text-zinc-900">
            5. Здача об’єкта та рекомендації з експлуатації.
          </span>{" "}
          Передаємо паспорт підлоги та регламент догляду.
        </li>
      </ol>
    </section>
  );
}

