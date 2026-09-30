import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { absoluteCmsUrl } from "@/lib/strapi";

// Article body (Strapi rich text = markdown) styled like the design:
// Alegreya 21px paragraphs, burgundy subheadings, blush pull-quotes.
// Raw HTML in the markdown is not rendered.
const components: Components = {
  p: ({ children }) => (
    <p className="m-0 text-[19px] leading-[1.7] sm:text-[21px]">{children}</p>
  ),
  h1: ({ children }) => (
    <h2 className="m-0 mt-3 font-serif text-3xl font-bold leading-tight text-burgundy sm:text-4xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="m-0 mt-3 font-serif text-3xl font-bold leading-tight text-burgundy sm:text-4xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="m-0 mt-2 font-serif text-2xl font-bold leading-snug text-burgundy sm:text-[28px]">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="m-0 mt-2 font-serif text-xl font-bold text-burgundy">{children}</h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 rounded-[18px] bg-blush px-6 py-[22px] font-serif text-2xl italic leading-[1.35] text-burgundy sm:px-10 sm:py-8 sm:text-[30px] [&_p]:text-[length:inherit] [&_p]:leading-[inherit]">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className="text-burgundy underline decoration-rose decoration-2 underline-offset-4 hover:text-burgundy-deep"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="m-0 flex list-disc flex-col gap-2 pl-6 text-[19px] leading-[1.7] marker:text-rose-star sm:text-[21px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="m-0 flex list-decimal flex-col gap-2 pl-6 text-[19px] leading-[1.7] marker:text-burgundy sm:text-[21px]">
      {children}
    </ol>
  ),
  hr: () => (
    <div aria-hidden="true" className="py-2 text-center text-xl tracking-[1em] text-rose-star">
      ✦✦✦
    </div>
  ),
  img: ({ src, alt }) => {
    const url = absoluteCmsUrl(typeof src === "string" ? src : null);
    if (!url) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={alt ?? ""} loading="lazy" className="my-2 block h-auto w-full rounded-[18px]" />
    );
  },
  code: ({ children }) => (
    <code className="rounded bg-band px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans text-base [&_td]:border-b [&_td]:border-blush [&_td]:p-2 [&_th]:border-b-2 [&_th]:border-rose [&_th]:p-2 [&_th]:text-left">
        {children}
      </table>
    </div>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="flex flex-col gap-7">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
