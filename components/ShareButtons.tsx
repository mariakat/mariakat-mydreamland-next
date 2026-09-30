"use client";

import { useState } from "react";

const circle =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-sage-line bg-band text-sage no-underline transition-colors hover:bg-sage hover:text-white";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

// Facebook, email and copy-link. (Instagram has no share link for websites.)
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Αντίγραψε τον σύνδεσμο:", url);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1.5 font-sans text-[15px] font-bold text-burgundy">
        Μοιράσου το
      </span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Κοινοποίηση στο Facebook"
        className={circle}
      >
        <Icon>
          <path d="M15 3h-3a4 4 0 0 0-4 4v3H6v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </Icon>
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        aria-label="Αποστολή με email"
        className={circle}
      >
        <Icon>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M3 7l9 6 9-6" />
        </Icon>
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Αντιγραφή συνδέσμου"
        className={circle}
      >
        <Icon>
          <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </Icon>
      </button>
      <span role="status" className="font-sans text-sm text-sage">
        {copied ? "Αντιγράφηκε ✦" : ""}
      </span>
    </div>
  );
}
