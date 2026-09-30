import { mediaUrl, type StrapiMedia } from "@/lib/strapi";

// An article's cover from the CMS, or a soft blush placeholder with a
// sparkle when the article has no cover yet.
export function CoverImage({
  media,
  alt,
  className = "",
}: {
  media: StrapiMedia | null | undefined;
  alt: string;
  className?: string;
}) {
  const src = mediaUrl(media);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={media?.alternativeText || alt}
        loading="lazy"
        className={`block h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center bg-blush text-3xl text-rose-star ${className}`}
    >
      ✦
    </div>
  );
}
