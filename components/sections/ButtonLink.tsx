import Link from "next/link";

const primary =
  "inline-flex min-h-11 items-center gap-2 rounded-[14px] border border-burgundy bg-burgundy px-[26px] py-3.5 font-sans text-base font-bold text-white no-underline shadow-card transition-colors hover:bg-burgundy-deep";
const secondary =
  "inline-flex min-h-11 items-center gap-2 rounded-[14px] border-[1.5px] border-sage px-[26px] py-3.5 font-sans text-base font-bold text-sage no-underline shadow-card transition-colors hover:bg-sage hover:text-white";

// A button that points to a page of this site ("/arthra", "#prosfata"),
// or to anywhere else ("https://…", "mailto:…"), as typed in the CMS.
// Renders nothing when the CMS gives it no label or no address.
export function ButtonLink({
  href,
  label,
  variant = "primary",
}: {
  href: string | null | undefined;
  label: string | null | undefined;
  variant?: "primary" | "secondary";
}) {
  if (!href || !label) return null;
  const className = variant === "primary" ? primary : secondary;
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}
