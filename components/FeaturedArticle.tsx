import Link from "next/link";
import { categoryHref } from "@/lib/categories";
import {
  articleExcerpt,
  articleReadingTime,
  formatDate,
  type Article,
} from "@/lib/strapi";
import { articleHref } from "./ArticleCard";
import { CoverImage } from "./CoverImage";
import { Pill } from "./Pill";

// The large two-column card under the hero.
export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <article className="group relative grid overflow-hidden rounded-[18px] bg-white shadow-card md:grid-cols-2">
      <div className="h-60 md:h-auto md:min-h-[440px]">
        <CoverImage media={article.coverImage} alt="" />
      </div>
      <div className="flex flex-col justify-center gap-[18px] p-6 sm:p-10 lg:p-12">
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Pill tone="burgundy">✦ Featured</Pill>
          <Pill href={categoryHref(article.category)}>{article.category}</Pill>
        </div>
        <h2 className="m-0 font-serif text-3xl font-bold leading-[1.15] text-burgundy lg:text-[44px]">
          <Link
            href={articleHref(article)}
            className="text-burgundy no-underline after:absolute after:inset-0 group-hover:underline group-hover:decoration-rose group-hover:decoration-[3px] group-hover:underline-offset-8"
          >
            {article.title}
          </Link>
        </h2>
        <p className="m-0 text-lg leading-[1.55] lg:text-xl">
          {article.subtitle || articleExcerpt(article, 220)}
        </p>
        <span className="font-sans text-sm tracking-[0.02em] text-muted">
          {formatDate(article.publishedAt)} · {articleReadingTime(article)}′
          ανάγνωση
        </span>
      </div>
    </article>
  );
}
