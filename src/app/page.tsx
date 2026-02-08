import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Tool, Category, Comparison } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { ToolCard } from "@/components/ToolCard";

export const revalidate = 3600;

async function getCategories() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (!categories) return [];

  const counts: Record<string, number> = {};
  for (const cat of categories) {
    const { count } = await supabase
      .from("tools")
      .select("id", { count: "exact", head: true })
      .eq("category_slug", cat.slug);
    counts[cat.slug] = count || 0;
  }

  return categories
    .filter((c: Category) => counts[c.slug] > 0)
    .map((c: Category) => ({ ...c, tool_count: counts[c.slug] }));
}

async function getFeaturedTools() {
  const { data } = await supabase
    .from("tools")
    .select("*")
    .not("features", "is", null)
    .not("description", "is", null)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data || []) as Tool[];
}

async function getRecentComparisons() {
  const { data } = await supabase
    .from("comparisons")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);
  return (data || []) as Comparison[];
}

export default async function HomePage() {
  const [categories, featuredTools, comparisons] = await Promise.all([
    getCategories(),
    getFeaturedTools(),
    getRecentComparisons(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-muted)] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find the{" "}
              <span className="text-[var(--accent)]">perfect software</span>{" "}
              for your business
            </h1>
            <p className="mt-4 text-lg text-[var(--fg-secondary)]">
              Compare 600+ SaaS tools across {categories.length} categories. Detailed
              features, pricing, and side-by-side comparisons.
            </p>
            <div className="mx-auto mt-8 max-w-lg">
              <SearchBar large />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <Link
            href="/categories"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-start rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)]"
            >
              <span className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors">
                {cat.name}
              </span>
              <span className="mt-1 text-xs text-[var(--fg-tertiary)]">
                {cat.tool_count} tools
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Featured Tools</h2>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Recently added tools with the most features
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Comparisons */}
      {comparisons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Recent Comparisons
          </h2>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Side-by-side tool comparisons with detailed verdicts
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comp) => (
              <Link
                key={comp.id}
                href={`/compare/${comp.tool_a_slug}-vs-${comp.tool_b_slug}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)]"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="truncate">{comp.tool_a_slug}</span>
                  <span className="text-[var(--fg-tertiary)] text-xs">vs</span>
                  <span className="truncate">{comp.tool_b_slug}</span>
                </div>
                <p className="mt-2 text-xs text-[var(--fg-secondary)] line-clamp-2">
                  {comp.pricing_comparison}
                </p>
                <span className="mt-3 inline-block text-xs text-[var(--accent)] group-hover:underline">
                  Read comparison
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
