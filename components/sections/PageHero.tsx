import { Pill } from "@/components/Pill";
import { mediaUrl, type PageBlock } from "@/lib/strapi";
import { ButtonLink } from "./ButtonLink";

type Hero = Extract<PageBlock, { __component: "sections.hero" }>;

const container = "mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-20";

// The page's opening: title, subtitle, tagline, up to two buttons, and the
// illustration in the blush arch. Without an uploaded image it shows the
// same mascot as the home page.
export function PageHero({ block }: { block: Hero }) {
  const uploaded = mediaUrl(block.image);
  const src = uploaded ?? "/images/mascot.png";
  const alt = uploaded
    ? block.image?.alternativeText || ""
    : "Εικονογράφηση: κορίτσι με γυαλιά, laptop, σημειωματάριο και παγωμένο καφέ";

  return (
    <section
      className={`${container} flex flex-col-reverse items-center gap-12 pb-10 pt-8 lg:flex-row lg:justify-between lg:gap-16 lg:pt-16`}
    >
      <div className="flex w-full max-w-[640px] flex-col gap-[22px]">
        {block.kicker && (
          <div>
            <Pill>✦ {block.kicker}</Pill>
          </div>
        )}
        <h1 className="m-0 font-serif text-[44px] font-bold leading-[1.08] text-burgundy sm:text-6xl lg:text-[68px]">
          {block.title}
        </h1>
        {block.subtitle && (
          <p className="m-0 whitespace-pre-line text-xl leading-normal sm:text-2xl">
            {block.subtitle}
          </p>
        )}
        {block.tagline && (
          <p className="m-0 text-xl italic leading-normal sm:text-2xl">
            <span className="border-b-[5px] border-rose">{block.tagline}</span>
          </p>
        )}
        {((block.primaryLabel && block.primaryUrl) ||
          (block.secondaryLabel && block.secondaryUrl)) && (
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href={block.primaryUrl} label={block.primaryLabel} />
            <ButtonLink
              href={block.secondaryUrl}
              label={block.secondaryLabel}
              variant="secondary"
            />
          </div>
        )}
      </div>

      <div className="relative w-full max-w-[420px] shrink-0">
        <div className="flex aspect-[420/460] w-full items-end justify-center overflow-hidden rounded-b-[28px] rounded-t-[210px] bg-blush">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={uploaded ? "h-full w-full object-cover" : "h-auto w-[92%]"}
          />
        </div>
        <span aria-hidden="true" className="absolute -left-4 top-14 text-3xl text-burgundy">✦</span>
        <span aria-hidden="true" className="absolute -right-2 top-6 text-xl text-rose-star">✦</span>
        <span aria-hidden="true" className="absolute bottom-16 right-4 text-base text-sage-line">✦</span>
      </div>
    </section>
  );
}
