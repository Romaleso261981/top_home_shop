export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-slate-100 py-10 sm:py-14 lg:py-16"
      style={{
        backgroundImage: 'url("/fon-stranic-min.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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

