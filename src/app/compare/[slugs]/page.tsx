import { supabase } from "@/lib/supabase";
import type { Tool, Comparison } from "@/lib/types";
import { ClickButton } from "@/components/ClickButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slugs: string }> };

function parseSlugs(slugs: string): { a: string; b: string } | null {
  const match = slugs.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  return { a: match[1], b: match[2] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) return { title: "Comparison Not Found" };

  const [{ data: toolA }, { data: toolB }] = await Promise.all([
    supabase.from("tools").select("name").eq("slug", parsed.a).single(),
    supabase.from("tools").select("name").eq("slug", parsed.b).single(),
  ]);

  const nameA = toolA?.name || parsed.a;
  const nameB = toolB?.name || parsed.b;

  return {
    title: `${nameA} vs ${nameB} — Detailed Comparison`,
    description: `Compare ${nameA} and ${nameB} side-by-side. Features, pricing, pros & cons.`,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("comparisons")
    .select("tool_a_slug, tool_b_slug");
  return (data || []).map(
    (c: { tool_a_slug: string; tool_b_slug: string }) => ({
      slugs: `${c.tool_a_slug}-vs-${c.tool_b_slug}`,
    })
  );
}

async function getCompareData(a: string, b: string) {
  const [{ data: toolA }, { data: toolB }, { data: comparison }] =
    await Promise.all([
      supabase.from("tools").select("*").eq("slug", a).single(),
      supabase.from("tools").select("*").eq("slug", b).single(),
      supabase
        .from("comparisons")
        .select("*")
        .eq("tool_a_slug", a)
        .eq("tool_b_slug", b)
        .single(),
    ]);

  if (!toolA || !toolB) return null;

  return {
    toolA: toolA as Tool,
    toolB: toolB as Tool,
    comparison: comparison as Comparison | null,
  };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();

  const data = await getCompareData(parsed.a, parsed.b);
  if (!data) notFound();

  const { toolA, toolB, comparison } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${toolA.name} vs ${toolB.name}`,
    description: `Compare ${toolA.name} and ${toolB.name} side-by-side`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {toolA.name}{" "}
            <span className="text-[var(--fg-tertiary)]">vs</span>{" "}
            {toolB.name}
          </h1>
          <p className="mt-2 text-[var(--fg-secondary)]">
            Detailed side-by-side comparison
          </p>
        </div>

        {/* Tool headers side by side */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[toolA, toolB].map((tool) => (
            <div
              key={tool.slug}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6"
            >
              <div className="flex items-center gap-3">
                {tool.logo_url ? (
                  <img src={tool.logo_url} alt={tool.name} width={48} height={48} className="h-12 w-12 rounded-xl object-contain" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] font-bold text-lg">
                    {tool.name[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold">{tool.name}</h2>
                  {tool.pricing_starts_at !== null && (
                    <span className="text-sm text-[var(--fg-tertiary)]">
                      {tool.pricing_starts_at === 0 ? "Free" : `From $${tool.pricing_starts_at}/mo`}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--fg-secondary)]">
                {comparison
                  ? tool === toolA
                    ? comparison.tool_a_overview
                    : comparison.tool_b_overview
                  : tool.description}
              </p>
              <ClickButton
                toolSlug={tool.slug}
                href={tool.affiliate_link || tool.website_url}
                className="mt-4 inline-flex items-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
              >
                Visit {tool.name}
              </ClickButton>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        {comparison?.feature_comparison && comparison.feature_comparison.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Feature Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-secondary)]">
                    <th className="p-4 text-left font-semibold text-[var(--fg-tertiary)]">Feature</th>
                    <th className="p-4 text-left font-semibold">{toolA.name}</th>
                    <th className="p-4 text-left font-semibold">{toolB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.feature_comparison.map((row, i) => (
                    <tr key={i} className="border-t border-[var(--border)]">
                      <td className="p-4 font-medium text-[var(--fg-secondary)]">
                        {row.feature || `Feature ${i + 1}`}
                      </td>
                      <td className="p-4 text-[var(--fg-secondary)]">{row.tool_a}</td>
                      <td className="p-4 text-[var(--fg-secondary)]">{row.tool_b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Basic feature comparison if no AI comparison exists */}
        {!comparison && (toolA.features || toolB.features) && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[toolA, toolB].map((tool) => (
                <div key={tool.slug}>
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <div className="space-y-1">
                    {tool.features?.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-[var(--fg-secondary)]">
                        <svg className="h-3.5 w-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing comparison */}
        {comparison?.pricing_comparison && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Pricing Comparison</h2>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
              <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                {comparison.pricing_comparison}
              </p>
            </div>
          </section>
        )}

        {/* Verdict */}
        {comparison?.verdict && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Verdict</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
                <h3 className="mb-2 text-sm font-semibold text-[var(--accent)]">
                  Choose {toolA.name} if...
                </h3>
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                  {comparison.verdict.choose_a_if}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
                <h3 className="mb-2 text-sm font-semibold text-[var(--accent)]">
                  Choose {toolB.name} if...
                </h3>
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                  {comparison.verdict.choose_b_if}
                </p>
              </div>
            </div>
            {comparison.verdict.summary && (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                  {comparison.verdict.summary}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Pros & Cons side by side */}
        {(toolA.pros || toolB.pros) && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Pros & Cons</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[toolA, toolB].map((tool) => (
                <div key={tool.slug} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
                  <h3 className="font-semibold mb-4">{tool.name}</h3>
                  {tool.pros && tool.pros.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-green-500 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {tool.pros.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]">
                            <span className="text-green-500">+</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tool.cons && tool.cons.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-400 mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {tool.cons.map((c) => (
                          <li key={c} className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]">
                            <span className="text-red-400">-</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
