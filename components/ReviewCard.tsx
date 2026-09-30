import { mediaUrl, type ReviewCard as ReviewCardData } from "@/lib/strapi";
import { Pill } from "./Pill";

const LABELS: Record<
  ReviewCardData["kind"],
  { card: string; creator: string; whereToFind: string; poster: string }
> = {
  Ταινία: { card: "Κάρτα ταινίας", creator: "Σκηνοθεσία", whereToFind: "Πού θα τη δεις", poster: "Αφίσα" },
  Σειρά: { card: "Κάρτα σειράς", creator: "Δημιουργία", whereToFind: "Πού θα τη δεις", poster: "Αφίσα" },
  Βιβλίο: { card: "Κάρτα βιβλίου", creator: "Συγγραφέας", whereToFind: "Εκδόσεις", poster: "Εξώφυλλο" },
};

export function RatingStars({ rating }: { rating: number }) {
  const value = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <span
      role="img"
      aria-label={`${value} στα 5`}
      className="text-[22px] tracking-[4px]"
    >
      <span className="text-burgundy">{"✦".repeat(value)}</span>
      <span className="text-rose">{"✦".repeat(5 - value)}</span>
    </span>
  );
}

export function ReviewCard({ card }: { card: ReviewCardData }) {
  const labels = LABELS[card.kind] ?? LABELS["Ταινία"];
  const poster = mediaUrl(card.poster);
  const facts = [
    [labels.creator, card.creator],
    ["Έτος", card.year?.toString()],
    ["Είδος", card.genre],
    [labels.whereToFind, card.whereToFind],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return (
    <aside
      aria-label={labels.card}
      className="flex flex-col gap-5 rounded-[18px] border border-blush bg-white p-5 shadow-card sm:flex-row sm:gap-7 sm:p-7"
    >
      <div className="h-[146px] w-[100px] shrink-0 overflow-hidden rounded-[12px] bg-blush sm:h-[220px] sm:w-[150px] sm:rounded-[14px]">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={card.poster?.alternativeText || `${labels.poster}: ${card.title}`}
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full w-full items-center justify-center text-3xl text-rose-star">
            ✦
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <Pill>{labels.card}</Pill>
        </div>
        <div className="font-serif text-[22px] font-bold leading-tight text-burgundy sm:text-3xl">
          {card.title}
        </div>
        {facts.length > 0 && (
          <dl className="m-0 grid gap-x-6 gap-y-2 font-sans text-[15px] sm:grid-cols-2 sm:text-base">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="inline text-muted">{label} · </dt>
                <dd className="m-0 inline">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {card.rating ? (
          <div className="mt-1 flex items-center gap-2.5">
            <span className="font-sans text-[15px] text-muted">Η βαθμολογία μου</span>
            <RatingStars rating={card.rating} />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
