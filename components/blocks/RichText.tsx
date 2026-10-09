"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { ComponentProps } from "react";
import type { RichTextNode } from "@/lib/strapi";

type BlocksContent = ComponentProps<typeof BlocksRenderer>["content"];

// Strapi "Blocks" rich text, styled like the rest of the article.
// (The renderer is a client component, so this wrapper is one too.)
export function RichText({
  content,
  cmsBase,
}: {
  content: RichTextNode[];
  cmsBase: string;
}) {
  const absolute = (url: string) =>
    /^(https?:)?\/\//.test(url) ? url : `${cmsBase}${url.startsWith("/") ? "" : "/"}${url}`;

  return (
    <div className="flex flex-col gap-7">
      <BlocksRenderer
        content={content as unknown as BlocksContent}
        blocks={{
          paragraph: ({ children }) => (
            <p className="m-0 text-[19px] leading-[1.7] sm:text-[21px]">{children}</p>
          ),
          heading: ({ children, level }) => {
            if (level <= 2) {
              return (
                <h2 className="m-0 mt-3 font-serif text-3xl font-bold leading-tight text-burgundy sm:text-4xl">
                  {children}
                </h2>
              );
            }
            if (level === 3) {
              return (
                <h3 className="m-0 mt-2 font-serif text-2xl font-bold leading-snug text-burgundy sm:text-[28px]">
                  {children}
                </h3>
              );
            }
            return <h4 className="m-0 mt-2 font-serif text-xl font-bold text-burgundy">{children}</h4>;
          },
          quote: ({ children }) => (
            <blockquote className="my-2 rounded-[18px] bg-blush px-6 py-[22px] font-serif text-2xl italic leading-[1.35] text-burgundy sm:px-10 sm:py-8 sm:text-[30px]">
              {children}
            </blockquote>
          ),
          list: ({ children, format }) =>
            format === "ordered" ? (
              <ol className="m-0 flex list-decimal flex-col gap-2 pl-6 text-[19px] leading-[1.7] marker:text-burgundy sm:text-[21px]">
                {children}
              </ol>
            ) : (
              <ul className="m-0 flex list-disc flex-col gap-2 pl-6 text-[19px] leading-[1.7] marker:text-rose-star sm:text-[21px]">
                {children}
              </ul>
            ),
          "list-item": ({ children }) => <li>{children}</li>,
          link: ({ children, url }) => {
            const external = /^https?:\/\//.test(url);
            return (
              <a
                href={url}
                className="text-burgundy underline decoration-rose decoration-2 underline-offset-4 hover:text-burgundy-deep"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
          image: ({ image }) => (
            <figure className="m-0 my-2 flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={absolute(image.url)}
                alt={image.alternativeText || ""}
                loading="lazy"
                className="block h-auto w-full rounded-[18px]"
              />
              {image.caption && (
                <figcaption className="text-center font-sans text-sm text-muted">{image.caption}</figcaption>
              )}
            </figure>
          ),
          code: ({ plainText }) => (
            <pre className="m-0 overflow-x-auto rounded-[14px] bg-band p-4 font-mono text-sm">
              <code>{plainText}</code>
            </pre>
          ),
        }}
        modifiers={{
          bold: ({ children }) => <strong>{children}</strong>,
          italic: ({ children }) => <em>{children}</em>,
          code: ({ children }) => (
            <code className="rounded bg-band px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
          ),
        }}
      />
    </div>
  );
}
