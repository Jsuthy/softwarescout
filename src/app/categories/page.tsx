import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse 29 software categories including CRM, project management, design tools, and more.",
  alternates: {
    canonical: "/categories",
  },
};

async function getCategories() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (!categories) return [];

  const results = await Promise.all(
    categories.map(async (cat: Category) => {
      const { count } = await supabase
        .from("tools")
        .select("id", { count: "exact", head: true })
        .eq("category_slug", cat.slug);
      return { ...cat, tool_count: count || 0 };
    })
  );

  return results.filter((c) => c.tool_count > 0);
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Categories</h1>
        <p className="mt-2 text-[var(--fg-secondary)]">
          Browse {categories.length} software categories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors">
              {cat.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-secondary)]">
              {cat.tool_count} tools to compare
            </p>
            <span className="mt-4 text-xs text-[var(--accent)] group-hover:underline">
              Browse tools
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
