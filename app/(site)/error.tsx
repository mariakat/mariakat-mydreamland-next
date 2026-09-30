"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown when a page can't load, e.g. the CMS is unreachable for a moment.
export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-[760px] flex-col items-start gap-5 px-4 py-20 sm:px-10">
      <h1 className="m-0 font-serif text-4xl font-bold text-burgundy sm:text-5xl">
        <span className="text-rose-star">✦</span> Κάτι δεν πήγε καλά
      </h1>
      <p className="m-0 text-xl leading-relaxed">
        Η σελίδα δεν φόρτωσε αυτή τη στιγμή. Δοκίμασε ξανά σε λίγο.
      </p>
      <div className="flex flex-wrap gap-3.5">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 cursor-pointer items-center rounded-[14px] border border-burgundy bg-burgundy px-6 py-3 font-sans text-base font-bold text-white shadow-card hover:bg-burgundy-deep"
        >
          Ξαναδοκίμασε
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-[14px] border-[1.5px] border-sage px-6 py-3 font-sans text-base font-bold text-sage no-underline hover:bg-sage hover:text-white"
        >
          Στην αρχική
        </Link>
      </div>
    </div>
  );
}
