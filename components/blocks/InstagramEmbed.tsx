"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// Instagram's own embed for a public post or reel. The script turns the
// blockquote into the post; without it the link still works.
export function InstagramEmbed({ url }: { url: string }) {
  const permalink = url.split("?")[0].replace(/\/?$/, "/");

  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, [permalink]);

  return (
    <div className="flex justify-center">
      <blockquote
        className="instagram-media m-0 w-full max-w-[540px] rounded-[18px] bg-white p-6 text-center shadow-card"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
      >
        <a href={permalink} target="_blank" rel="noopener noreferrer" className="font-sans font-bold text-burgundy">
          Δες το post στο Instagram
        </a>
      </blockquote>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
    </div>
  );
}
