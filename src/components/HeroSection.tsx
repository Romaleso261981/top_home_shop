export function HeroSection() {
  return (
    <section className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-12 shadow-sm sm:px-10 lg:mb-16 lg:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_#e5e7eb,_transparent_55%),radial-gradient(circle_at_bottom_right,_#d1d5db,_transparent_55%)]" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Послуги • Промислові підлоги
        </p>
        <h1 className="mt-4 text-center text-2xl font-bold leading-snug text-slate-900 sm:text-3xl lg:text-4xl">
          Влаштування Бетонних Шліфованих Підлог,<br className="hidden sm:block" />
          Стяжок
        </h1>

        <p className="mt-3 text-center text-xs text-slate-500 sm:text-sm">
          <span className="text-sky-600">Головна</span> &raquo;{" "}
          <span className="text-sky-600">Послуги</span> &raquo; Влаштування бетонних
          шліфованих підлог, стяжок
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="tel:+380965984470"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Зателефонувати менеджеру
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/60 px-8 py-3 text-sm font-semibold text-slate-800 backdrop-blur-sm transition hover:border-slate-400 hover:bg-white"
          >
            Отримати комерційну пропозицію
          </a>
        </div>
      </div>
    </section>
  );
}

