import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

// Every unknown URL and every notFound() (missing article, category…).
// It renders outside the (site) layout, so it brings header and footer.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto flex max-w-[760px] flex-col items-start gap-5 px-4 py-20 sm:px-10">
          <span className="font-sans text-sm font-bold tracking-[0.08em] text-sage">
            404
          </span>
          <h1 className="m-0 font-serif text-4xl font-bold leading-tight text-burgundy sm:text-5xl">
            <span className="text-rose-star">✦</span> Αυτή η σελίδα χάθηκε
            στα όνειρα
          </h1>
          <p className="m-0 text-xl leading-relaxed">
            Δεν βρήκαμε αυτό που έψαχνες. Ίσως άλλαξε διεύθυνση ή δεν υπάρχει
            πια.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-[14px] border border-burgundy bg-burgundy px-6 py-3 font-sans text-base font-bold text-white no-underline shadow-card hover:bg-burgundy-deep"
            >
              Στην αρχική
            </Link>
            <Link
              href="/arthra"
              className="inline-flex min-h-11 items-center rounded-[14px] border-[1.5px] border-sage px-6 py-3 font-sans text-base font-bold text-sage no-underline hover:bg-sage hover:text-white"
            >
              Όλα τα άρθρα
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
