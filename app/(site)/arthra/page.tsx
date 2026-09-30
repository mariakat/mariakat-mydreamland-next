import type { Metadata } from "next";
import { ArticleArchive, parsePage } from "@/components/ArticleArchive";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Όλα τα άρθρα — My Dreamland Blog",
};

export default async function AllArticlesPage({
  searchParams,
}: PageProps<"/arthra">) {
  const { selida } = await searchParams;
  return <ArticleArchive page={parsePage(selida)} />;
}
