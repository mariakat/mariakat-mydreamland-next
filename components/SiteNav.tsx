"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import {
  ChevronDownIcon,
  CloseIcon,
  InstagramIcon,
  MenuIcon,
} from "./icons";

const INSTAGRAM = "https://instagram.com/mydreamlandbl";

const linkBase =
  "font-sans text-[17px] no-underline border-b-[3px] pb-1 transition-colors";

function navLinkClass(active: boolean) {
  return `${linkBase} ${
    active
      ? "border-rose text-burgundy"
      : "border-transparent text-ink hover:text-burgundy hover:border-blush"
  }`;
}

const roundButton =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-blush text-burgundy transition-colors hover:bg-rose";

export function SiteNav() {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus after navigating to another page.
  useEffect(() => {
    setCategoriesOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape and on clicks outside the categories dropdown.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCategoriesOpen(false);
        setMobileOpen(false);
      }
    }
    function onClick(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const inCategory = pathname.startsWith("/kategoria");

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Κύριο μενού" className="hidden items-center gap-7 lg:flex">
        <Link href="/" className={navLinkClass(pathname === "/")}>
          Αρχική
        </Link>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            aria-expanded={categoriesOpen}
            aria-controls="categories-menu"
            onClick={() => setCategoriesOpen((open) => !open)}
            className={`${navLinkClass(inCategory)} inline-flex cursor-pointer items-center gap-1 bg-transparent px-0`}
          >
            Κατηγορίες
            <ChevronDownIcon
              size={16}
              className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {categoriesOpen && (
            <ul
              id="categories-menu"
              className="absolute left-1/2 top-full z-30 m-0 mt-3 w-60 -translate-x-1/2 list-none rounded-[18px] bg-white p-2 shadow-[0_18px_44px_-20px_rgba(110,48,52,0.32)]"
            >
              {CATEGORIES.map((category) => {
                const href = `/kategoria/${category.slug}`;
                return (
                  <li key={category.slug}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-[14px] px-4 font-sans text-base no-underline transition-colors hover:bg-cream hover:text-burgundy ${
                        pathname === href ? "bg-cream font-bold text-burgundy" : "text-ink"
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <Link href="/sxetika" className={navLinkClass(pathname === "/sxetika")}>
          Σχετικά
        </Link>
      </nav>

      <div className="flex items-center gap-1.5">
        <a href={INSTAGRAM} aria-label="Instagram @mydreamlandbl" className={roundButton}>
          <InstagramIcon />
        </a>
        <button
          type="button"
          aria-label={mobileOpen ? "Κλείσιμο μενού" : "Μενού"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
          className={`${roundButton} lg:hidden`}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Κύριο μενού"
          className="absolute inset-x-0 top-full z-30 border-b border-blush bg-cream px-4 pb-6 pt-2 shadow-card lg:hidden"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            <li>
              <Link href="/" className="flex min-h-12 items-center border-b border-blush font-serif text-xl font-bold text-burgundy no-underline">
                Αρχική
              </Link>
            </li>
            <li className="pt-4 font-sans text-sm font-bold tracking-[0.08em] text-sage">
              ΚΑΤΗΓΟΡΙΕΣ
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/kategoria/${category.slug}`}
                  className="flex min-h-11 items-center border-b border-blush font-sans text-[17px] text-ink no-underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sxetika" className="flex min-h-12 items-center font-serif text-xl font-bold text-burgundy no-underline">
                Σχετικά
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
