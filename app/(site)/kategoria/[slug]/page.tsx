import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleArchive, parsePage } from "@/components/ArticleArchive";
import { categoryBySlug } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/kategoria/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} — My Dreamland Blog`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/kategoria/[slug]">) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();
  const { selida } = await searchParams;
  return <ArticleArchive category={category} page={parsePage(selida)} />;
}
