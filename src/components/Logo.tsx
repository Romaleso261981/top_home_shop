import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={className} aria-label="Моноліт — на головну">
      <Image
        src="/logo-monolit.png"
        alt="Моноліт"
        width={160}
        height={40}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
}

