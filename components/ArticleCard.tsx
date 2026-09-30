import Link from "next/link";
import { categoryHref } from "@/lib/categories";
import {
  articleExcerpt,
  articleReadingTime,
  formatDate,
  type Article,
} from "@/lib/strapi";
import { CoverImage } from "./CoverImage";
import { Pill } from "./Pill";

export function articleHref(article: Article) {
  return `/arthra/${article.slug}`;
}

// Card from the "Πρόσφατα" grid: image on top, category, date, title, excerpt.
export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[18px] bg-white shadow-card transition-shadow hover:shadow-[0_18px_44px_-20px_rgba(110,48,52,0.32)]">
      <div className="h-52 sm:h-60">
        <CoverImage media={article.coverImage} alt="" />
      </div>
      <div className="flex flex-col gap-2.5 px-6 pb-[26px] pt-[22px]">
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Pill href={categoryHref(article.category)}>{article.category}</Pill>
          <span className="font-sans text-sm tracking-[0.02em] text-muted">
            {formatDate(article.publishedAt)} · {articleReadingTime(article)}′
          </span>
        </div>
        <h3 className="m-0 font-serif text-[23px] font-bold leading-tight text-burgundy sm:text-[26px]">
          {/* The whole card is clickable through this link's overlay. */}
          <Link
            href={articleHref(article)}
            className="text-burgundy no-underline after:absolute after:inset-0 group-hover:underline group-hover:decoration-rose group-hover:decoration-2 group-hover:underline-offset-4"
          >
            {article.title}
          </Link>
        </h3>
        <p className="m-0 text-lg leading-normal">{articleExcerpt(article)}</p>
      </div>
    </article>
  );
}
