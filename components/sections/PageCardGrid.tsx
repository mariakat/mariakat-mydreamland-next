import Link from "next/link";
import type { PageBlock, PageCard } from "@/lib/strapi";
import { CardIconGlyph } from "./section-icons";

type CardGrid = Extract<PageBlock, { __component: "sections.card-grid" }>;

const container = "mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-20";

// Full class names (not built from the count) so Tailwind can see them.
const columns: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

function CardBody({ card, index }: { card: PageCard; index: number }) {
  return (
    <>
      <span
        className={`flex h-[52px] w-[52px] items-center justify-center rounded-full text-burgundy ${
          index % 2 === 0 ? "bg-blush" : "bg-sage-soft"
        }`}
      >
        <CardIconGlyph name={card.icon} />
      </span>
      <h3 className="m-0 font-serif text-2xl font-bold leading-tight text-burgundy">
        {card.title}
      </h3>
      {card.text && (
        <p className="m-0 whitespace-pre-line text-lg leading-normal">{card.text}</p>
      )}
    </>
  );
}

function Card({ card, index }: { card: PageCard; index: number }) {
  const className =
    "flex h-full flex-col gap-3.5 rounded-[18px] bg-white p-7 text-left no-underline shadow-card";
  const href = card.url;
  if (!href) {
    return (
      <div className={className}>
        <CardBody card={card} index={index} />
      </div>
    );
  }
  const linked = `${className} transition-transform duration-200 hover:-translate-y-0.5`;
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={linked}>
        <CardBody card={card} index={index} />
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={linked}
      {...(/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <CardBody card={card} index={index} />
    </a>
  );
}

// A band with a heading and a grid of cards (e.g. "what you'll find here").
export function PageCardGrid({ block }: { block: CardGrid }) {
  const cards = block.cards ?? [];
  if (cards.length === 0) return null;

  return (
    <section className="bg-band py-14 lg:py-20">
      <div className={`${container} flex flex-col gap-10`}>
        {(block.kicker || block.title) && (
          <div className="flex flex-col items-center gap-3 text-center">
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
          </div>
        )}
        <ul
          className={`m-0 grid list-none gap-6 p-0 sm:grid-cols-2 ${
            columns[cards.length] ?? "lg:grid-cols-4"
          }`}
        >
          {cards.map((card, index) => (
            <li key={card.id}>
              <Card card={card} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
