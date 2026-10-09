import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { ArticleContent } from "@/components/blocks/ArticleContent";
import { Markdown } from "@/components/Markdown";
import { Pill } from "@/components/Pill";
import { ReviewCard } from "@/components/ReviewCard";
import { ShareButtons } from "@/components/ShareButtons";
import { categoryHref } from "@/lib/categories";
import {
  articleExcerpt,
  articleReadingTime,
  formatDate,
  getArticleBySlug,
  getSiteSettings,
  mediaUrl,
} from "@/lib/strapi";

export const dynamic = "force-dynamic";

function siteUrl() {
  return (process.env.SITE_URL || "https://mydreamland.gr").replace(/\/$/, "");
}

export async function generateMetadata({
  params,
}: PageProps<"/arthra/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(decodeURIComponent(slug));
  if (!article) return {};
  const description = article.subtitle || articleExcerpt(article, 160);
  const image = mediaUrl(article.coverImage);
  return {
    title: `${article.title} — My Dreamland Blog`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      url: `${siteUrl()}/arthra/${article.slug}`,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/arthra/[slug]">) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getArticleBySlug(decodeURIComponent(slug)),
    getSiteSettings(),
  ]);
  if (!article) notFound();

  const url = `${siteUrl()}/arthra/${article.slug}`;
  const cover = mediaUrl(article.coverImage);
  const readingTime = articleReadingTime(article);

  return (
    <article>
      <header className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 pb-10 pt-8 sm:gap-7 sm:px-0 sm:pt-14">
        <nav aria-label="Διαδρομή" className="font-sans text-sm text-muted">
          <Link href="/" className="text-muted">
            Αρχική
          </Link>{" "}
          /{" "}
          <Link href={categoryHref(article.category)} className="text-muted">
            {article.category}
          </Link>
        </nav>
        <div>
          <Pill href={categoryHref(article.category)}>{article.category}</Pill>
        </div>
        <h1 className="m-0 font-serif text-4xl font-bold leading-[1.12] text-burgundy sm:text-5xl lg:text-[60px] lg:leading-[1.1]">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="m-0 text-xl italic leading-normal sm:text-[25px]">
            {article.subtitle}
          </p>
        )}
        <div className="flex flex-col gap-4 border-y border-blush py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AuthorAvatar settings={settings} size={44} />
            <div className="flex flex-col">
              <span className="font-sans text-base font-bold text-burgundy">
                {settings.authorName || "My Dreamland Blog"}
              </span>
              <span className="font-sans text-[13px] tracking-[0.02em] text-muted">
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>{" "}
                · {readingTime}′ ανάγνωση
              </span>
            </div>
          </div>
          <ShareButtons url={url} title={article.title} />
        </div>
      </header>

      {cover && (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={article.coverImage?.alternativeText || ""}
            className="block max-h-[560px] w-full rounded-[18px] object-cover"
          />
        </div>
      )}

      <div className="mx-auto flex max-w-[760px] flex-col gap-7 px-4 pb-16 pt-10 sm:px-0 sm:pb-[72px] sm:pt-14">
        {article.content && article.content.length > 0 ? (
          <ArticleContent blocks={article.content} />
        ) : article.body ? (
          <Markdown>{article.body}</Markdown>
        ) : (
          article.excerpt && (
            <p className="m-0 text-[19px] leading-[1.7] sm:text-[21px]">{article.excerpt}</p>
          )
        )}

        {article.reviewCard && <ReviewCard card={article.reviewCard} />}

        {article.tags && article.tags.length > 0 && (
          <ul aria-label="Ετικέτες" className="m-0 flex list-none flex-wrap gap-2.5 p-0 pt-2">
            {article.tags.map((tag) => (
              <li key={tag.documentId}>
                <Pill>#{tag.name}</Pill>
              </li>
            ))}
          </ul>
        )}

        <div className="border-y border-blush py-6">
          <ShareButtons url={url} title={article.title} />
        </div>
      </div>
    </article>
  );
}
