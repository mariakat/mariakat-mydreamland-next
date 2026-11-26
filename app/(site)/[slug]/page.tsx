import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBlocks } from "@/components/sections/PageBlocks";
import { getPageBySlug } from "@/lib/strapi";

// Rendered on every request, like the articles: a page edited in the CMS
// shows up straight away.
export const dynamic = "force-dynamic";

function siteUrl() {
  return (process.env.SITE_URL || "https://mydreamland.gr").replace(/\/$/, "");
}

// Fixed pages live at the top level: /sxetika, /epikoinonia … Routes that
// exist in the code (/arthra, /kategoria, /api, /coming-soon) always win over
// this one, so a page with one of those slugs in the CMS is never shown.
export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(decodeURIComponent(slug));
  if (!page) return {};
  return {
    title: `${page.title} — My Dreamland Blog`,
    ...(page.seoDescription ? { description: page.seoDescription } : {}),
    openGraph: {
      title: page.title,
      ...(page.seoDescription ? { description: page.seoDescription } : {}),
      type: "website",
      url: `${siteUrl()}/${page.slug}`,
    },
  };
}

export default async function CmsPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getPageBySlug(decodeURIComponent(slug));
  if (!page) notFound();

  const blocks = page.blocks ?? [];
  // A "reading" page, or a page without sections, starts with its own title
  // (unless a hero section already opens the page with one).
  const showTitle =
    blocks.length === 0 ||
    (page.layout === "reading" && blocks[0].__component !== "sections.hero");

  return (
    <article>
      {showTitle && (
        <header className="mx-auto max-w-[760px] px-4 pb-6 pt-8 sm:px-0 sm:pt-14">
          <h1 className="m-0 font-serif text-4xl font-bold leading-[1.12] text-burgundy sm:text-5xl lg:text-[60px] lg:leading-[1.1]">
            {page.title}
          </h1>
        </header>
      )}
      <PageBlocks blocks={blocks} />
      <div className="pb-8" />
    </article>
  );
}
