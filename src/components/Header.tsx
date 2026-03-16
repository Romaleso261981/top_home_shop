import Link from "next/link";

const navItems = [
  { label: "Головна", href: "/" },
  { label: "Послуги", href: "#services" },
  { label: "Портфоліо", href: "#portfolio" },
  { label: "Новини", href: "#news" },
  { label: "Про компанію", href: "#about" },
  { label: "Контакти", href: "#contact" },
];

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function IconPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="bg-slate-800 text-slate-100">
      {/* Top info bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-200/90">
            <div className="flex flex-col gap-1">
              <a
                href="tel:+380965984470"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <IconPhone className="h-4 w-4 opacity-90" />
                +38 (096) 598 44 70
              </a>
              <a
                href="tel:+380673823099"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <IconPhone className="h-4 w-4 opacity-90" />
                +38 (067) 382 30 99
              </a>
            </div>
            <a
              href="mailto:monolitrvua@gmail.com"
              className="inline-flex items-center gap-2 hover:text-white"
            >
              <IconMail className="h-4 w-4 opacity-90" />
              monolitrvua@gmail.com
            </a>
            <span className="hidden items-center gap-2 md:inline-flex">
              <IconPin className="h-4 w-4 opacity-90" />
              Україна
            </span>
            <span className="hidden items-center gap-2 lg:inline-flex">
              <IconPin className="h-4 w-4 opacity-90" />
              33027, м. Рівне, вул. Данила Галицького, 25а/1
            </span>
          </div>

          <a
            href="#contact"
            className="inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-sky-600 sm:w-auto"
          >
            Замовити дзвінок
          </a>
        </div>
      </div>

      {/* Main nav bar */}
      <div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded bg-slate-700 text-slate-100">
              <span className="text-sm font-bold">M</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Моноліт</div>
              <div className="text-[11px] text-slate-300">Промислові підлоги</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Пошук"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <IconSearch className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
              aria-label="Мова"
            >
              Укр.
              <IconChevronDown className="h-4 w-4 opacity-90" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="border-t border-white/10 md:hidden">
          <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-2 text-sm text-slate-200 sm:px-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

