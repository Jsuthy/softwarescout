import { supabase } from "@/lib/supabase";
import type { Tool } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import type { Metadata } from "next";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search Tools",
    description: q
      ? `Search results for "${q}" — SoftwareScout`
      : "Search 621+ software tools",
  };
}

async function searchTools(query: string) {
  if (!query) return [];

  const searchTerm = `%${query}%`;
  const { data } = await supabase
    .from("tools")
    .select("*")
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order("name")
    .limit(50);

  return (data || []) as Tool[];
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const tools = await searchTools(query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <div className="mt-4">
          <SearchBar large />
        </div>
      </div>

      {query && (
        <p className="mb-6 text-sm text-[var(--fg-secondary)]">
          {tools.length} result{tools.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : query ? (
        <div className="py-16 text-center">
          <p className="text-[var(--fg-secondary)]">
            No tools found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 text-sm text-[var(--fg-tertiary)]">
            Try a different search term or browse categories
          </p>
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-[var(--fg-secondary)]">
            Enter a search term to find tools
          </p>
        </div>
      )}
    </div>
  );
}
