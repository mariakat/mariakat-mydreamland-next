import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-blush">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-10 lg:h-24 lg:px-20">
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-[23px] font-bold text-burgundy no-underline sm:text-[28px] lg:text-[32px]"
        >
          My Dreamland Blog <span className="text-rose-star">✦</span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
