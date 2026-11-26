import type { PageBlock } from "@/lib/strapi";
import { ButtonLink } from "./ButtonLink";

type Cta = Extract<PageBlock, { __component: "sections.cta" }>;

// Centered closing section: title, a line of text and up to two buttons.
export function PageCta({ block }: { block: Cta }) {
  const hasButtons =
    (block.primaryLabel && block.primaryUrl) ||
    (block.secondaryLabel && block.secondaryUrl);
  if (!block.title && !block.text && !hasButtons) return null;

  return (
    <section className="mx-auto flex max-w-[760px] flex-col items-center gap-5 px-4 py-16 text-center sm:px-0 lg:py-24">
      <span aria-hidden="true" className="text-3xl text-rose-star">✦</span>
      {block.title && (
        <h2 className="m-0 font-serif text-4xl font-bold leading-[1.12] text-burgundy sm:text-[42px]">
          {block.title}
        </h2>
      )}
      {block.text && (
        <p className="m-0 whitespace-pre-line text-xl leading-normal sm:text-[22px]">
          {block.text}
        </p>
      )}
      {hasButtons && (
        <div className="flex flex-wrap justify-center gap-3.5 pt-2">
          <ButtonLink href={block.primaryUrl} label={block.primaryLabel} />
          <ButtonLink
            href={block.secondaryUrl}
            label={block.secondaryLabel}
            variant="secondary"
          />
        </div>
      )}
    </section>
  );
}
