import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getTopCategories() {
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name")
    .limit(50);

  if (!categories) return [];

  const results = await Promise.all(
    categories.map(async (cat: { slug: string; name: string }) => {
      const { count } = await supabase
        .from("tools")
        .select("id", { count: "exact", head: true })
        .eq("category_slug", cat.slug);
      return { ...cat, tool_count: count || 0 };
    })
  );

  return results
    .filter((c) => c.tool_count > 0)
    .sort((a, b) => b.tool_count - a.tool_count)
    .slice(0, 8);
}

export async function Footer() {
  const topCategories = await getTopCategories();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white text-sm font-bold">
                S
              </span>
              SoftwareScout
            </Link>
            <p className="mt-3 text-sm text-[var(--fg-secondary)]">
              Find and compare the best software tools for your business.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-tertiary)]">Top Categories</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-tertiary)]">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/categories" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">All Categories</Link></li>
              <li><Link href="/search" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">Search Tools</Link></li>
              <li><Link href="/about" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-tertiary)]">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--fg-tertiary)] text-center">
            Some links on this site are affiliate links. We may earn a commission if you make a purchase, at no extra cost to you.
          </p>
          <p className="mt-3 text-xs text-[var(--fg-tertiary)] text-center">
            &copy; {new Date().getFullYear()} SoftwareScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
