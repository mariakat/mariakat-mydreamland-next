import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { InstagramIcon } from "./icons";

const heading =
  "font-sans text-sm font-bold tracking-[0.08em] text-sage";
const link =
  "font-sans text-base text-ink no-underline hover:text-burgundy hover:underline";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-sage-soft">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-4 pb-8 pt-10 sm:px-10 lg:px-20 lg:pt-14">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col gap-3">
            <div className="font-serif text-2xl font-bold text-burgundy lg:text-[28px]">
              My Dreamland Blog <span className="text-rose-star">✦</span>
            </div>
            <p className="m-0 text-lg italic leading-normal">
              ό,τι ονειρευόμαστε, είμαστε
            </p>
          </div>
          <nav aria-label="Κατηγορίες" className="flex flex-col gap-2.5">
            <div className={heading}>ΚΑΤΗΓΟΡΙΕΣ</div>
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/kategoria/${category.slug}`} className={link}>
                {category.name}
              </Link>
            ))}
          </nav>
          <nav aria-label="Το blog" className="flex flex-col gap-2.5">
            <div className={heading}>ΤΟ BLOG</div>
            <Link href="/sxetika" className={link}>
              Σχετικά με μένα
            </Link>
            <Link href="/sxetika#epikoinonia" className={link}>
              Επικοινωνία
            </Link>
            <a
              href="https://instagram.com/mydreamlandbl"
              className={`${link} inline-flex items-center gap-2`}
            >
              <InstagramIcon size={18} className="text-burgundy" /> @mydreamlandbl
            </a>
          </nav>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-sage-line pt-5 font-sans text-sm tracking-[0.02em] text-ink sm:flex-row">
          <span>© {new Date().getFullYear()} My Dreamland Blog</span>
          <span>Φτιαγμένο με ✦ και πολύ καφέ</span>
        </div>
      </div>
    </footer>
  );
}
