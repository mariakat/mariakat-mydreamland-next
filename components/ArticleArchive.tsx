import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, type Category } from "@/lib/categories";
import { getArticles } from "@/lib/strapi";
import { ArticleCard } from "./ArticleCard";
import { ArrowRightIcon } from "./icons";
import { Pill } from "./Pill";

export const PAGE_SIZE = 9;

// "?selida=2" → 2; anything invalid → 1.
export function parsePage(value: string | string[] | undefined): number {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function pageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?selida=${page}`;
}

function Pagination({
  basePath,
  page,
  pageCount,
}: {
  basePath: string;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Σελιδοποίηση" className="flex flex-wrap items-center justify-center gap-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(basePath, p)}
          aria-label={`Σελίδα ${p}`}
          aria-current={p === page ? "page" : undefined}
          className={`flex h-11 w-11 items-center justify-center rounded-full font-sans text-base font-bold no-underline transition-colors ${
            p === page
              ? "bg-burgundy text-white"
              : "bg-blush text-burgundy-deep hover:bg-rose"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < pageCount && (
        <Link
          href={pageHref(basePath, page + 1)}
          className="ml-2 inline-flex min-h-11 items-center gap-1.5 font-sans text-base font-bold text-burgundy no-underline hover:underline"
        >
          Επόμενη <ArrowRightIcon size={18} />
        </Link>
      )}
    </nav>
  );
}

function countLabel(total: number) {
  return total === 1 ? "1 άρθρο" : `${total} άρθρα`;
}

// Shared by /arthra (category undefined) and /kategoria/<slug>.
export async function ArticleArchive({
  category,
  page,
}: {
  category?: Category;
  page: number;
}) {
  const basePath = category ? `/kategoria/${category.slug}` : "/arthra";
  const { data: articles, meta } = await getArticles({
    category: category?.name,
    page,
    pageSize: PAGE_SIZE,
  });
  const { total, pageCount } = meta.pagination;

  // /kategoria/x?selida=99 → 404, but an empty category still shows page 1.
  if (page > 1 && page > pageCount) notFound();

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-20">
      <section className="mt-4 flex flex-col gap-3 rounded-[22px] bg-band px-[22px] py-7 sm:mt-8 sm:gap-4 sm:rounded-[28px] sm:px-16 sm:py-14">
        <nav aria-label="Διαδρομή" className="font-sans text-sm text-muted">
          <Link href="/" className="text-muted">
            Αρχική
          </Link>{" "}
          / {category ? "Κατηγορία" : "Άρθρα"}
        </nav>
        <h1 className="m-0 font-serif text-[38px] font-bold leading-[1.05] text-burgundy sm:text-[56px] lg:text-[64px]">
          <span className="text-rose-star">✦</span>{" "}
          {category ? category.name : "Όλα τα άρθρα"}
        </h1>
        <p className="m-0 max-w-[760px] text-lg italic leading-normal sm:text-[22px]">
          {category
            ? category.description
            : "Ό,τι έχει γραφτεί στη Dreamland, από το πιο καινούριο στο πιο παλιό."}
        </p>
        <span className="font-sans text-[15px] tracking-[0.02em] text-muted">
          {countLabel(total)}
        </span>
      </section>

      <div className="flex flex-wrap gap-2.5 pt-8 sm:pt-10">
        <Pill tone={category ? "sage" : "burgundy"} href="/arthra">
          Όλα
        </Pill>
        {CATEGORIES.map((c) => (
          <Pill
            key={c.slug}
            tone={c.slug === category?.slug ? "burgundy" : "sage"}
            href={`/kategoria/${c.slug}`}
          >
            {c.name}
          </Pill>
        ))}
      </div>

      <section className="flex flex-col gap-12 pb-14 pt-8 sm:pt-9">
        {articles.length === 0 ? (
          <p className="m-0 rounded-[18px] bg-white p-7 text-lg shadow-card">
            {category
              ? "Δεν υπάρχουν ακόμα άρθρα σε αυτή την κατηγορία. Σύντομα ✦"
              : "Τα πρώτα άρθρα ετοιμάζονται ✦"}
          </p>
        ) : (
          <div className="grid gap-[22px] sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.documentId} article={article} />
            ))}
          </div>
        )}
        <Pagination basePath={basePath} page={page} pageCount={pageCount} />
      </section>
    </div>
  );
}
