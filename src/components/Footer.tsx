import Link from "next/link";
import { Logo } from "@/components/Logo";

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

function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.1 0 2.25.2 2.25.2v2.46h-1.27c-1.25 0-1.64.78-1.64 1.57V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function IconYoutube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.2a3 3 0 0 0-2.12-2.12C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.48.48A3 3 0 0 0 2.4 7.2 31.6 31.6 0 0 0 2 12a31.6 31.6 0 0 0 .4 4.8 3 3 0 0 0 2.12 2.12C6.4 19.4 12 19.4 12 19.4s5.6 0 7.48-.48a3 3 0 0 0 2.12-2.12A31.6 31.6 0 0 0 22 12a31.6 31.6 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1f252f] text-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-sm">
            <h2 className="text-xl font-semibold text-white">
              «Компанія управління будівництвом «Моноліт»
            </h2>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              Компанія, яка виконує комплекс будівельно-монтажних робіт із впровадженням
              сучасних методів і технологій ведення будівництва.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-center">
            <Logo className="shrink-0" />
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Facebook"
              >
                <IconFacebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                aria-label="YouTube"
              >
                <IconYoutube className="h-4 w-4" />
              </a>
            </div>
            <Link href="#sitemap" className="mt-3 text-sm text-zinc-300 transition hover:text-white">
              Мапа сайту
            </Link>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">Контакти</h3>
            <div className="mt-5 space-y-4 text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <IconPhone className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-1">
                  <a href="tel:+380674428346" className="block hover:text-white">
                    +38 (067) 442 83 46
                  </a>
                  <a href="tel:+380674428346" className="block hover:text-white">
                    +38 (067) 442 83 46
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>33027, м. Ладижин.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#1a1f28]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-center text-sm text-zinc-400 sm:px-6 lg:px-8">
          <p>© 2026 «Компанія управління будівництвом «Моноліт»</p>
          <p>Розробка та просування сайту — Агентство «Gigaweb»</p>
        </div>
      </div>
    </footer>
  );
}

