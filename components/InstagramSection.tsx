import type { InstagramPost } from "@/lib/instagram";
import { InstagramIcon } from "./icons";

const INSTAGRAM = "https://instagram.com/mydreamlandbl";

const MAX_HASHTAGS = 3;

const sageButton =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[14px] border border-sage bg-sage px-5 py-[11px] font-sans text-base font-bold text-white no-underline shadow-card transition-opacity hover:opacity-90";

function postLabel(post: InstagramPost): string {
  const text = (post.altText || post.caption || "").replace(/\s+/g, " ").trim();
  if (!text) return "Post στο Instagram";
  return text.length > 120 ? `${text.slice(0, 120).replace(/\s+\S*$/, "")}…` : text;
}

function Heading() {
  return (
    <h2 className="m-0 font-serif text-[32px] font-bold text-burgundy lg:text-4xl">
      <span className="text-rose-star">✦</span> Στο Instagram
    </h2>
  );
}

// The 6 latest posts as in the design; without posts (no token yet, or
// Instagram unreachable) it falls back to a simple banner.
export function InstagramSection({
  posts,
  className,
}: {
  posts: InstagramPost[];
  className: string;
}) {
  if (posts.length === 0) {
    return (
      <section className={className}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-blush px-7 py-9 sm:flex-row sm:items-center sm:px-12">
          <div className="flex flex-col gap-2">
            <Heading />
            <p className="m-0 text-lg">
              Μικρές στιγμές, βιβλία στο κομοδίνο και ό,τι βλέπω αυτή την εβδομάδα.
            </p>
          </div>
          <a href={INSTAGRAM} className={sageButton}>
            <InstagramIcon size={18} /> @mydreamlandbl
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className={`${className} flex flex-col gap-7`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading />
        <a href={INSTAGRAM} className={sageButton}>
          <InstagramIcon size={18} /> @mydreamlandbl
        </a>
      </div>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {posts.map((post) => (
          <li key={post.id} className="flex flex-col gap-2">
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-[18px] bg-blush shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={postLabel(post)}
                loading="lazy"
                className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className={`absolute inset-0 bg-burgundy/0 transition-colors group-hover:bg-burgundy/15`} aria-hidden="true" />
              {post.isVideo && (
                <span
                  aria-hidden="true"
                  className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-burgundy"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </a>
            {post.hashtags.length > 0 && (
              <ul aria-label="Hashtags" className="m-0 flex list-none flex-wrap gap-x-2 gap-y-0.5 p-0 px-1">
                {post.hashtags.slice(0, MAX_HASHTAGS).map((tag) => (
                  <li key={tag} className="min-w-0">
                    <a
                      href={`https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-sans text-[13px] font-bold text-sage no-underline hover:text-burgundy hover:underline"
                    >
                      #{tag}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
