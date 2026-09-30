import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "My Dreamland Blog — σύντομα κοντά σας",
  robots: { index: false, follow: false },
};

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </svg>
  );
}

export default async function ComingSoon({
  searchParams,
}: PageProps<"/coming-soon">) {
  const { error } = await searchParams;
  const hasError = error === "1";

  return (
    <main className="flex flex-1 flex-col px-4 py-8 sm:px-10 lg:px-20">
      <div className="font-serif text-2xl font-bold text-burgundy sm:text-3xl">
        My Dreamland Blog <span className="text-rose-star">✦</span>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col-reverse items-center justify-center gap-12 py-10 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <div>
            <span className="inline-flex items-center rounded-full bg-sage-soft px-3 py-1 font-sans text-[13px] font-bold tracking-wide text-sage">
              ✦ Έρχεται σύντομα
            </span>
          </div>

          <h1 className="m-0 font-serif text-5xl font-bold leading-[1.08] text-burgundy sm:text-6xl">
            Κάτι{" "}
            <span className="border-b-[5px] border-rose">όμορφο</span>{" "}
            ετοιμάζεται
          </h1>

          <p className="m-0 text-xl italic leading-relaxed sm:text-2xl">
            ό,τι ονειρευόμαστε, είμαστε — το νέο My Dreamland ανοίγει σύντομα.
          </p>

          <div>
            <a
              href="https://instagram.com/mydreamlandbl"
              className="inline-flex min-h-11 items-center gap-2 rounded-[14px] border-[1.5px] border-sage px-5 py-3 font-sans text-base font-bold text-sage no-underline shadow-card transition-colors hover:bg-sage hover:text-white"
            >
              <InstagramIcon />
              Μέχρι τότε, στο Instagram @mydreamlandbl
            </a>
          </div>

          <form
            method="POST"
            action="/api/unlock"
            className="mt-4 flex flex-col gap-3 rounded-[18px] bg-white p-6 shadow-card"
          >
            <label
              htmlFor="password"
              className="font-sans text-sm font-bold text-burgundy-deep"
            >
              Έχεις κωδικό πρόσβασης;
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                aria-invalid={hasError}
                aria-describedby={hasError ? "password-error" : undefined}
                className="h-12 w-full rounded-[14px] sm:flex-1 border border-rose bg-white px-4 font-sans text-base text-ink outline-none focus:border-burgundy focus:ring-2 focus:ring-rose"
              />
              <button
                type="submit"
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-burgundy bg-burgundy px-6 font-sans text-base font-bold text-white shadow-card transition-colors hover:bg-burgundy-deep"
              >
                Είσοδος ✦
              </button>
            </div>
            {hasError && (
              <p
                id="password-error"
                role="alert"
                className="m-0 font-sans text-sm font-bold text-burgundy"
              >
                Ο κωδικός δεν είναι σωστός. Δοκίμασε ξανά.
              </p>
            )}
          </form>
        </div>

        <div className="relative w-full max-w-[420px] shrink-0">
          <div className="flex aspect-[420/460] w-full items-end justify-center overflow-hidden rounded-t-[210px] rounded-b-[28px] bg-blush">
            <Image
              src="/images/mascot.png"
              alt="Εικονογράφηση: κορίτσι με γυαλιά, laptop, σημειωματάριο και παγωμένο καφέ"
              width={547}
              height={462}
              priority
              className="h-auto w-[92%]"
            />
          </div>
          <span aria-hidden="true" className="absolute -left-4 top-14 text-3xl text-burgundy">✦</span>
          <span aria-hidden="true" className="absolute -right-2 top-6 text-xl text-rose-star">✦</span>
          <span aria-hidden="true" className="absolute bottom-16 right-4 text-base text-sage-line">✦</span>
        </div>
      </div>

      <footer className="border-t border-sage-line pt-5 font-sans text-sm text-muted">
        © 2026 My Dreamland Blog · Φτιαγμένο με ✦ και πολύ καφέ
      </footer>
    </main>
  );
}
