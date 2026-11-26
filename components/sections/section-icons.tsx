import type { CardIcon } from "@/lib/strapi";

// Icons for the cards of a page section (the "icon" choice in the CMS).
// Same look as components/icons.tsx: 24px grid, 1.6 stroke.

export function CardIconGlyph({
  name,
  size = 24,
}: {
  name: CardIcon | null | undefined;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph(name ?? "pen")}
    </svg>
  );
}

function glyph(name: CardIcon) {
  switch (name) {
    case "book":
      return (
        <>
          <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
        </>
      );
    case "notebook":
      return (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="M13 8h3" />
          <path d="M13 12h3" />
        </>
      );
    case "camera":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </>
      );
    case "film":
      return (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 4v16" />
          <path d="M17 4v16" />
          <path d="M3 9h4" />
          <path d="M3 15h4" />
          <path d="M17 9h4" />
          <path d="M17 15h4" />
        </>
      );
    case "heart":
      return (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      );
    case "pen":
    default:
      return (
        <>
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </>
      );
  }
}
