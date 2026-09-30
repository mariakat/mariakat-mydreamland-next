// The 7 categories exactly as defined in the Strapi "category" enumeration.
// `slug` is the Latin form used in URLs (/kategoria/<slug>);
// `description` is the line under the title on the category page.

export const CATEGORIES = [
  {
    name: "Απόψεις",
    slug: "apopseis",
    description: "Σκέψεις και απόψεις για όσα συμβαίνουν γύρω μας.",
  },
  {
    name: "Βιβλία",
    slug: "vivlia",
    description: "Βιβλία που διάβασα, αγάπησα ή με έβαλαν σε σκέψεις.",
  },
  {
    name: "Κινηματογράφος",
    slug: "kinimatografos",
    description: "Ταινίες και σειρές που αξίζει να δεις — ή να ξαναδείς.",
  },
  {
    name: "Συνταγές",
    slug: "syntages",
    description: "Συνταγές για αργά πρωινά και ζεστές κουβέντες.",
  },
  {
    name: "Τεχνολογία",
    slug: "texnologia",
    description: "Εργαλεία, εφαρμογές και ιδέες που κάνουν τη μέρα πιο εύκολη.",
  },
  {
    name: "Journal",
    slug: "journal",
    description: "Σελίδες από το ημερολόγιό μου.",
  },
  {
    name: "Ιστορίες",
    slug: "istories",
    description: "Μικρές ιστορίες, αληθινές ή ονειρεμένες.",
  },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryName = Category["name"];

export function categoryHref(name: string): string {
  const match = CATEGORIES.find((c) => c.name === name);
  return match ? `/kategoria/${match.slug}` : "/arthra";
}

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
