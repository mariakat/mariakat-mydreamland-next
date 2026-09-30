import Image from "next/image";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { ArrowRightIcon, InstagramIcon } from "@/components/icons";
import { Pill } from "@/components/Pill";
import { CATEGORIES } from "@/lib/categories";
import {
  getArticles,
  getSiteSettings,
  type Article,
  type SiteSettings,
} from "@/lib/strapi";

// Rendered on every request so new articles show up immediately
// (and nothing is fetched from the CMS at build time).
export const dynamic = "force-dynamic";

const INSTAGRAM = "https://instagram.com/mydreamlandbl";

const container = "mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-20";

const primaryButton =
  "inline-flex min-h-11 items-center gap-2 rounded-[14px] border border-burgundy bg-burgundy px-[26px] py-3.5 font-sans text-base font-bold text-white no-underline shadow-card transition-colors hover:bg-burgundy-deep";
const secondaryButton =
  "inline-flex min-h-11 items-center gap-2 rounded-[14px] border-[1.5px] border-sage px-[26px] py-3.5 font-sans text-base font-bold text-sage no-underline shadow-card transition-colors hover:bg-sage hover:text-white";
const sageButton =
  "inline-flex min-h-11 items-center gap-2 rounded-[14px] border border-sage bg-sage px-5 py-[11px] font-sans text-base font-bold text-white no-underline shadow-card transition-opacity hover:opacity-90";

const sidebarHeading = "font-sans text-sm font-bold tracking-[0.08em] text-sage";

// Featured slot: the newest article marked "featured", else the newest one.
async function loadHomeArticles(): Promise<
  { featured: Article | null; recent: Article[] } | null
> {
  try {
    const [featuredRes, latestRes] = await Promise.all([
      getArticles({ featured: true, pageSize: 1 }),
      getArticles({ pageSize: 5 }),
    ]);
    const featured = featuredRes.data[0] ?? latestRes.data[0] ?? null;
    const recent = latestRes.data
      .filter((article) => article.documentId !== featured?.documentId)
      .slice(0, 4);
    return { featured, recent };
  } catch (error) {
    unstable_rethrow(error);
    console.error("[home] could not load articles:", error);
    return null;
  }
}

function Hero() {
  return (
    <section className={`${container} flex flex-col-reverse items-center gap-12 pb-10 pt-8 lg:flex-row lg:justify-between lg:gap-16 lg:pt-16`}>
      <div className="flex w-full max-w-[640px] flex-col gap-[22px]">
        <div>
          <Pill>✦ Καλημέρα, Dreamer</Pill>
        </div>
        <h1 className="m-0 font-serif text-[44px] font-bold leading-[1.08] text-burgundy sm:text-6xl lg:text-[68px]">
          Ιστορίες για ταινίες, βιβλία και{" "}
          <span className="border-b-[5px] border-rose">όνειρα</span>
        </h1>
        <p className="m-0 text-xl italic leading-normal sm:text-2xl">
          ό,τι ονειρευόμαστε, είμαστε — ένα ζεστό σημείο για αργά πρωινά και
          καλές κουβέντες.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <a href="#prosfata" className={primaryButton}>
            Διάβασε τα νέα
          </a>
          <Link href="/sxetika" className={secondaryButton}>
            Γνώρισέ με
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-[420px] shrink-0">
        <div className="flex aspect-[420/460] w-full items-end justify-center overflow-hidden rounded-b-[28px] rounded-t-[210px] bg-blush">
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
    </section>
  );
}

function Sidebar({ settings }: { settings: SiteSettings }) {
  return (
    <aside className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3.5 rounded-[18px] bg-white p-7 text-center shadow-card">
        <AuthorAvatar settings={settings} size={120} />
        <h2 className="m-0 font-serif text-[26px] font-bold text-burgundy">
          Γεια σου, Dreamer
        </h2>
        <p className="m-0 text-[17px] leading-normal">
          {settings.authorBio ||
            "Εδώ γράφω για ταινίες, βιβλία, συνταγές, τεχνολογία και όσα με κάνουν να ονειρεύομαι."}
        </p>
        <Link href="/sxetika" className="font-sans text-base font-bold text-burgundy">
          Γνώρισέ με
        </Link>
      </div>

      <nav aria-label="Κατηγορίες" className="flex flex-col gap-1">
        <div className={`${sidebarHeading} mb-1.5`}>ΚΑΤΗΓΟΡΙΕΣ</div>
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/kategoria/${category.slug}`}
            className="flex min-h-11 items-center justify-between border-b border-blush font-sans text-[17px] text-ink no-underline transition-colors hover:text-burgundy"
          >
            {category.name}
            <ArrowRightIcon size={16} className="text-burgundy" />
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-3.5 rounded-[18px] bg-blush p-7">
        <h2 className="m-0 font-serif text-[26px] font-bold text-burgundy">
          Γράμματα από τη Dreamland
        </h2>
        <p className="m-0 text-[17px] leading-normal">
          Το newsletter έρχεται σύντομα. Μέχρι τότε, κάθε νέο άρθρο το λέω
          πρώτα στο Instagram.
        </p>
        <div>
          <a href={INSTAGRAM} className={sageButton}>
            <InstagramIcon size={18} /> Ακολούθησέ με ✦
          </a>
        </div>
      </div>
    </aside>
  );
}

export default async function Home() {
  const [articles, settings] = await Promise.all([
    loadHomeArticles(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero />

      {articles?.featured && (
        <section className={`${container} py-8`}>
          <FeaturedArticle article={articles.featured} />
        </section>
      )}

      <section
        id="prosfata"
        className={`${container} grid scroll-mt-6 gap-14 py-12 lg:grid-cols-[minmax(0,1fr)_360px]`}
      >
        <div className="flex flex-col gap-7">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="m-0 font-serif text-[32px] font-bold text-burgundy lg:text-4xl">
              <span className="text-rose-star">✦</span> Πρόσφατα
            </h2>
            <Link
              href="/arthra"
              className="inline-flex items-center gap-1.5 font-sans text-base font-bold text-burgundy no-underline hover:underline"
            >
              Όλα τα άρθρα <ArrowRightIcon size={18} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Pill tone="burgundy" href="/arthra">
              Όλα
            </Pill>
            {CATEGORIES.map((category) => (
              <Pill key={category.slug} href={`/kategoria/${category.slug}`}>
                {category.name}
              </Pill>
            ))}
          </div>

          {articles === null ? (
            <p className="m-0 rounded-[18px] bg-white p-7 text-lg shadow-card">
              Τα άρθρα δεν φορτώνουν αυτή τη στιγμή. Δοκίμασε ξανά σε λίγο ✦
            </p>
          ) : articles.recent.length === 0 ? (
            <p className="m-0 rounded-[18px] bg-white p-7 text-lg shadow-card">
              {articles.featured
                ? "Σύντομα θα βρεις εδώ κι άλλα άρθρα ✦"
                : "Τα πρώτα άρθρα ετοιμάζονται ✦"}
            </p>
          ) : (
            <div className="grid gap-7 md:grid-cols-2">
              {articles.recent.map((article) => (
                <ArticleCard key={article.documentId} article={article} />
              ))}
            </div>
          )}
        </div>

        <Sidebar settings={settings} />
      </section>

      <section className={`${container} pb-16 pt-6 lg:pb-[72px]`}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-sage-soft px-7 py-9 sm:flex-row sm:items-center sm:px-12">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 font-serif text-[32px] font-bold text-burgundy lg:text-4xl">
              <span className="text-rose-star">✦</span> Στο Instagram
            </h2>
            <p className="m-0 text-lg">
              Μικρές στιγμές, βιβλία στο κομοδίνο και ό,τι βλέπω αυτή την εβδομάδα.
            </p>
          </div>
          <a href={INSTAGRAM} className={sageButton}>
            <InstagramIcon size={18} /> @mydreamlandbl
          </a>
        </div>
      </section>
    </>
  );
}
