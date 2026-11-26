import { Block } from "@/components/blocks/ArticleContent";
import type { PageBlock } from "@/lib/strapi";
import { PageCardGrid } from "./PageCardGrid";
import { PageCta } from "./PageCta";
import { PageHero } from "./PageHero";
import { PageStory } from "./PageStory";

// The sections of a page, top to bottom. "sections.*" blocks are full-width
// designs of their own; the article blocks (text, image, quote…) sit in the
// same narrow reading column as an article.
export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const key = `${block.__component}-${block.id}`;
        switch (block.__component) {
          case "sections.hero":
            return <PageHero key={key} block={block} />;
          case "sections.story":
            return <PageStory key={key} block={block} />;
          case "sections.card-grid":
            return <PageCardGrid key={key} block={block} />;
          case "sections.cta":
            return <PageCta key={key} block={block} />;
          default:
            return (
              <div
                key={key}
                className="mx-auto w-full max-w-[760px] px-4 py-3.5 sm:px-0"
              >
                <Block block={block} />
              </div>
            );
        }
      })}
    </>
  );
}
