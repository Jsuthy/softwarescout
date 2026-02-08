import { supabase } from "@/lib/supabase";
import type { Tool, Category } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Software — Compare Tools`,
    description: `Compare the best ${category.name} tools. Find pricing, features, and detailed comparisons.`,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from("categories").select("slug");
  return (data || []).map((c: { slug: string }) => ({ slug: c.slug }));
}

async function getCategoryData(slug: string) {
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return null;

  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("category_slug", slug)
    .order("name");

  return { category: category as Category, tools: (tools || []) as Tool[] };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) notFound();

  const { category, tools } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-[var(--fg-secondary)]">
          {tools.length} tools to compare
        </p>
      </div>

      {tools.length === 0 ? (
        <p className="text-[var(--fg-secondary)]">No tools found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
