import { ctaButtonClass } from "@/components/buttonStyles";

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

export function Header() {
  return (
    <header className="bg-slate-800 text-slate-100">
      {/* Top info bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-around sm:gap-4 sm:px-6">
          <div className="flex flex-wrap justify-around items-center gap-x-6 gap-y-2 text-xs text-slate-200/90">
            <div className="flex flex-col justify-around gap-x-2 lg:flex-row">
              <a
                href="tel:+380965984470"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <IconPhone className="h-4 w-4 opacity-90" />
                +38 (067) 442 83 46
              </a>
              <a
                href="tel:+380673823099"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <IconPhone className="h-4 w-4 opacity-90" />
                +38 (067) 442 83 46
              </a>
            </div>
            <span className="hidden items-center gap-2 md:inline-flex">
              <IconPin className="h-4 w-4 opacity-90" />
              Україна
            </span>
            <span className="items-center flex flex-row gap-2 lg:inline-flex">
              <IconPin className="h-4 w-4 opacity-90" />
              33027, м. Ладижин.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
