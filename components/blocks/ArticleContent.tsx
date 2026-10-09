import Link from "next/link";
import { categoryHref } from "@/lib/categories";
import {
  articleExcerpt,
  cmsUrl,
  mediaUrl,
  type ContentBlock,
} from "@/lib/strapi";
import { articleHref } from "../ArticleCard";
import { CoverImage } from "../CoverImage";
import { Pill } from "../Pill";
import { ReviewCard } from "../ReviewCard";
import { InstagramEmbed } from "./InstagramEmbed";
import { RichText } from "./RichText";

const captionClass = "text-center font-sans text-sm text-muted";

// open.spotify.com/(intl-el/)?<type>/<id> → embed URL and player height.
export function spotifyEmbed(url: string): { src: string; height: number } | null {
  const match = url.match(
    /open\.spotify\.com\/(?:intl-[a-z-]+\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/,
  );
  if (!match) return null;
  const [, type, id] = match;
  return {
    src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`,
    height: type === "track" || type === "episode" ? 152 : 352,
  };
}

// youtu.be/<id>, youtube.com/watch?v=<id>, /shorts/<id>, /embed/<id>
export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function lines(text: string | null | undefined): string[] {
  return (text ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.__component) {
    case "blocks.text":
      return <RichText content={block.content} cmsBase={cmsUrl()} />;

    case "blocks.image": {
      const src = mediaUrl(block.image);
      if (!src) return null;
      return (
        <figure className={`m-0 my-2 flex flex-col gap-2 ${block.wide ? "lg:-mx-40" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={block.image?.alternativeText || block.caption || ""}
            loading="lazy"
            className="block h-auto w-full rounded-[18px]"
          />
          {block.caption && <figcaption className={captionClass}>{block.caption}</figcaption>}
        </figure>
      );
    }

    case "blocks.gallery": {
      const images = (block.images ?? []).filter((img) => mediaUrl(img));
      if (images.length === 0) return null;
      return (
        <figure className="m-0 my-2 flex flex-col gap-2 lg:-mx-20">
          <div className={`grid gap-3 ${images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
            {images.map((img, i) => (
              <a
                key={`${img.url}-${i}`}
                href={mediaUrl(img)!}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-[14px] bg-blush"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(img)!}
                  alt={img.alternativeText || ""}
                  loading="lazy"
                  className="block h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </a>
            ))}
          </div>
          {block.caption && <figcaption className={captionClass}>{block.caption}</figcaption>}
        </figure>
      );
    }

    case "blocks.quote":
      return (
        <figure className="m-0 my-2 rounded-[18px] bg-blush px-6 py-[22px] sm:px-10 sm:py-8">
          <blockquote className="m-0 whitespace-pre-line font-serif text-2xl italic leading-[1.35] text-burgundy sm:text-[30px]">
            «{block.text}»
          </blockquote>
          {block.author && (
            <figcaption className="mt-3 font-sans text-base font-bold text-burgundy-deep">— {block.author}</figcaption>
          )}
        </figure>
      );

    case "blog.review-card":
      return <ReviewCard card={block} />;

    case "blocks.spotify": {
      const embed = spotifyEmbed(block.url);
      if (!embed) return null;
      return (
        <iframe
          src={embed.src}
          title="Spotify"
          width="100%"
          height={embed.height}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block rounded-[14px] border-0"
        />
      );
    }

    case "blocks.youtube": {
      const id = youtubeId(block.url);
      if (!id) return null;
      return (
        <figure className="m-0 my-2 flex flex-col gap-2">
          <div className="aspect-video overflow-hidden rounded-[18px] bg-ink">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={block.caption || "Βίντεο από το YouTube"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="block h-full w-full border-0"
            />
          </div>
          {block.caption && <figcaption className={captionClass}>{block.caption}</figcaption>}
        </figure>
      );
    }

    case "blocks.instagram":
      return <InstagramEmbed url={block.url} />;

    case "blocks.related-article": {
      const related = block.article;
      if (!related) return null;
      return (
        <aside className="group relative my-2 grid overflow-hidden rounded-[18px] bg-white shadow-card sm:grid-cols-[200px_minmax(0,1fr)]">
          <div className="h-40 sm:h-full sm:min-h-[150px]">
            <CoverImage media={related.coverImage} alt="" />
          </div>
          <div className="flex flex-col gap-2 p-5 sm:p-6">
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span className="font-sans text-sm font-bold tracking-[0.08em] text-sage">
                {(block.label || "Διάβασε επίσης").toLocaleUpperCase("el")}
              </span>
              <Pill href={categoryHref(related.category)}>{related.category}</Pill>
            </div>
            <Link
              href={articleHref(related)}
              className="font-serif text-[22px] font-bold leading-tight text-burgundy no-underline after:absolute after:inset-0 group-hover:underline group-hover:decoration-rose group-hover:decoration-2 group-hover:underline-offset-4"
            >
              {related.title}
            </Link>
            <p className="m-0 text-base leading-normal">{articleExcerpt(related, 120)}</p>
          </div>
        </aside>
      );
    }

    case "blocks.divider":
      return (
        <div role="separator" className="flex flex-col items-center gap-1 py-2">
          <span aria-hidden="true" className="text-xl tracking-[1em] text-rose-star">✦✦✦</span>
          {block.label && (
            <span className="font-sans text-sm font-bold tracking-[0.08em] text-sage">
              {block.label.toLocaleUpperCase("el")}
            </span>
          )}
        </div>
      );

    case "blocks.recipe": {
      const facts = [
        ["Μερίδες", block.servings],
        ["Προετοιμασία", block.prepTime],
        ["Μαγείρεμα", block.cookTime],
      ].filter((f): f is [string, string] => Boolean(f[1]));
      return (
        <section className="my-2 flex flex-col gap-6 rounded-[18px] border border-blush bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-bold tracking-[0.08em] text-sage">ΣΥΝΤΑΓΗ</span>
            {block.title && (
              <h3 className="m-0 font-serif text-[26px] font-bold leading-tight text-burgundy sm:text-3xl">
                {block.title}
              </h3>
            )}
            {facts.length > 0 && (
              <dl className="m-0 flex flex-wrap gap-2">
                {facts.map(([label, value]) => (
                  <div key={label} className="rounded-full bg-sage-soft px-3 py-1 font-sans text-sm text-sage">
                    <dt className="inline font-bold">{label}: </dt>
                    <dd className="m-0 inline">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="flex flex-col gap-3">
              <h4 className="m-0 font-serif text-xl font-bold text-burgundy">Υλικά</h4>
              <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-lg leading-normal marker:text-rose-star">
                {lines(block.ingredients).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="m-0 font-serif text-xl font-bold text-burgundy">Εκτέλεση</h4>
              <ol className="m-0 flex list-decimal flex-col gap-2.5 pl-5 text-lg leading-normal marker:font-bold marker:text-burgundy">
                {lines(block.steps).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          {block.notes && (
            <p className="m-0 whitespace-pre-line rounded-[14px] bg-band p-4 text-base italic leading-normal">
              {block.notes}
            </p>
          )}
        </section>
      );
    }

    default:
      // A block type this version of the site doesn't know yet: skip it.
      return null;
  }
}

export function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="flex flex-col gap-7">
      {blocks.map((block) => (
        <Block key={`${block.__component}-${block.id}`} block={block} />
      ))}
    </div>
  );
}
