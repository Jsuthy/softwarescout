import { supabase } from "@/lib/supabase";
import type { Tool, Category } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getIndustryName } from "@/lib/industry-data";

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
    alternates: {
      canonical: `/category/${slug}`,
    },
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

  // Find the industry-page category slug that maps to this DB category slug
  const catDef = CATEGORIES.find((c) => c.dbCategorySlug === slug);
  const industryCatSlug = catDef?.slug;

  let industryGuides: { software_category: string; industry: string; title: string }[] = [];
  if (industryCatSlug) {
    const { data: guides } = await supabase
      .from("industry_pages")
      .select("software_category, industry, title")
      .eq("software_category", industryCatSlug)
      .limit(12);
    industryGuides = (guides || []) as typeof industryGuides;
  }

  return {
    category: category as Category,
    tools: (tools || []) as Tool[],
    industryGuides,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) notFound();

  const { category, tools, industryGuides } = data;

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

      {/* Industry Guides */}
      {industryGuides.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">
            {category.name} by Industry
          </h2>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Find the best {category.name.toLowerCase()} tools for your specific industry
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industryGuides.map((guide) => (
              <a
                key={`${guide.software_category}-${guide.industry}`}
                href={`/best/${guide.software_category}/for/${guide.industry}`}
                className="rounded-lg border border-[var(--border)] p-4 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]"
              >
                Best {category.name} for {getIndustryName(guide.industry)}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
