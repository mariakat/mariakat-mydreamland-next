import { RichText } from "@/components/blocks/RichText";
import { cmsUrl, type PageBlock } from "@/lib/strapi";

type Story = Extract<PageBlock, { __component: "sections.story" }>;

const container = "mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-20";

// A text section: kicker, title and rich text in the reading column, with an
// optional quote in the blush box beside it (above it on a phone).
export function PageStory({ block }: { block: Story }) {
  const hasQuote = Boolean(block.quote);
  const hasText = Boolean(block.kicker || block.title || block.body?.length);
  if (!hasQuote && !hasText) return null;

  return (
    <section
      className={`${container} grid items-start gap-10 py-12 lg:gap-16 lg:py-16 ${
        hasQuote && hasText ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : ""
      }`}
    >
      {hasQuote && (
        <figure
          className={`m-0 flex flex-col gap-5 rounded-[18px] bg-blush px-7 py-9 sm:px-10 sm:py-12 ${
            hasText ? "" : "mx-auto max-w-[760px]"
          }`}
        >
          <span aria-hidden="true" className="text-2xl text-burgundy">✦</span>
          <blockquote className="m-0 whitespace-pre-line font-serif text-3xl italic leading-[1.3] text-burgundy sm:text-4xl">
            {block.quote}
          </blockquote>
          {block.quoteLabel && (
            <figcaption className="font-sans text-sm font-bold tracking-[0.08em] text-burgundy-deep">
              {block.quoteLabel.toLocaleUpperCase("el")}
            </figcaption>
          )}
        </figure>
      )}

      {hasText && (
        <div className="flex max-w-[680px] flex-col gap-5">
          {block.kicker && (
            <span className="font-sans text-sm font-bold tracking-[0.08em] text-sage">
              {block.kicker.toLocaleUpperCase("el")}
            </span>
          )}
          {block.title && (
            <h2 className="m-0 font-serif text-4xl font-bold leading-[1.12] text-burgundy sm:text-[42px]">
              {block.title}
            </h2>
          )}
          {block.body && block.body.length > 0 && (
            <RichText content={block.body} cmsBase={cmsUrl()} />
          )}
        </div>
      )}
    </section>
  );
}
