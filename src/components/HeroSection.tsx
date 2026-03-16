export function HeroSection() {
  return (
    <section className="mb-12 rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10 lg:mb-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
        Бетонні промислові підлоги
      </p>
      <h1 className="mt-4 text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-5xl">
        Будівництво довговічних промислових бетонних підлог&nbsp;«під ключ»
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
        Проєктуємо та влаштовуємо бетонні промислові підлоги для складів, виробництв,
        торгових центрів та логістичних комплексів. Працюємо за технологією, яка
        забезпечує міцність, зносостійкість і безпечну експлуатацію під навантаженнями.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href="tel:+380965984470"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Зателефонувати менеджеру
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-100"
        >
          Отримати комерційну пропозицію
        </a>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Працюємо по всій Україні. Допоможемо підібрати оптимальне рішення під ваші
        навантаження та умови експлуатації.
      </p>
    </section>
  );
}

