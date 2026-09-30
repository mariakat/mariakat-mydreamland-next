// The 7 categories exactly as defined in the Strapi "category" enumeration.
// `slug` is the Latin form used in URLs (/kategoria/<slug>).

export const CATEGORIES = [
  { name: "Απόψεις", slug: "apopseis" },
  { name: "Βιβλία", slug: "vivlia" },
  { name: "Κινηματογράφος", slug: "kinimatografos" },
  { name: "Συνταγές", slug: "syntages" },
  { name: "Τεχνολογία", slug: "texnologia" },
  { name: "Journal", slug: "journal" },
  { name: "Ιστορίες", slug: "istories" },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];

export function categoryHref(name: string): string {
  const match = CATEGORIES.find((c) => c.name === name);
  return match ? `/kategoria/${match.slug}` : "/arthra";
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
