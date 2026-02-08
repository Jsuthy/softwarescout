import { supabase } from "@/lib/supabase";
import type { Tool } from "@/lib/types";
import { ToolCard } from "@/components/ToolCard";
import { ClickButton } from "@/components/ClickButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: tool } = await supabase
    .from("tools")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.name} — Pricing, Features & Alternatives`,
    description: tool.description?.slice(0, 160) || `Learn about ${tool.name}`,
    openGraph: {
      title: `${tool.name} — SoftwareScout`,
      description: tool.description?.slice(0, 160),
    },
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from("tools").select("slug");
  return (data || []).map((t: { slug: string }) => ({ slug: t.slug }));
}

async function getToolData(slug: string) {
  const { data: tool } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tool) return null;

  const { data: alternatives } = await supabase
    .from("tools")
    .select("*")
    .eq("category_slug", tool.category_slug)
    .neq("slug", slug)
    .limit(4);

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", tool.category_slug)
    .single();

  return {
    tool: tool as Tool,
    alternatives: (alternatives || []) as Tool[],
    categoryName: category?.name || tool.category_slug,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const data = await getToolData(slug);
  if (!data) notFound();

  const { tool, alternatives, categoryName } = data;
  const link = tool.affiliate_link || tool.website_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.website_url,
    applicationCategory: categoryName,
    offers: tool.pricing_starts_at !== null
      ? {
          "@type": "Offer",
          price: tool.pricing_starts_at,
          priceCurrency: "USD",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--fg-tertiary)]">
          <a href="/" className="hover:text-[var(--fg-secondary)]">Home</a>
          <span className="mx-2">/</span>
          <a href={`/category/${tool.category_slug}`} className="hover:text-[var(--fg-secondary)]">{categoryName}</a>
          <span className="mx-2">/</span>
          <span className="text-[var(--fg-secondary)]">{tool.name}</span>
        </nav>

        {/* Hero */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] font-bold text-2xl">
                {tool.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
              <p className="mt-1 max-w-2xl text-[var(--fg-secondary)]">
                {tool.description}
              </p>
              {tool.pricing_starts_at !== null && (
                <p className="mt-2 text-sm text-[var(--fg-tertiary)]">
                  {tool.pricing_starts_at === 0
                    ? "Free plan available"
                    : `Starting from $${tool.pricing_starts_at}/mo`}
                </p>
              )}
            </div>
          </div>
          <ClickButton
            toolSlug={tool.slug}
            href={link}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Visit Website
            <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </ClickButton>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <section>
                <h2 className="text-xl font-bold">Features</h2>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {tool.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 rounded-lg bg-[var(--bg-secondary)] p-3 text-sm"
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pros & Cons */}
            {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
              <section>
                <h2 className="text-xl font-bold">Pros & Cons</h2>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {tool.pros && tool.pros.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-green-500">Pros</h3>
                      <ul className="space-y-2">
                        {tool.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]">
                            <span className="mt-1 text-green-500">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tool.cons && tool.cons.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-red-400">Cons</h3>
                      <ul className="space-y-2">
                        {tool.cons.map((con) => (
                          <li key={con} className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]">
                            <span className="mt-1 text-red-400">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Pricing Tiers */}
            {tool.pricing_tiers && tool.pricing_tiers.length > 0 && (
              <section>
                <h2 className="text-xl font-bold">Pricing</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="pb-3 text-left font-semibold">Plan</th>
                        <th className="pb-3 text-left font-semibold">Price</th>
                        <th className="pb-3 text-left font-semibold">Features</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tool.pricing_tiers.map((tier) => (
                        <tr key={tier.name} className="border-b border-[var(--border)]">
                          <td className="py-3 font-medium">{tier.name}</td>
                          <td className="py-3 text-[var(--fg-secondary)]">{tier.price}</td>
                          <td className="py-3 text-[var(--fg-secondary)]">
                            {tier.features?.join(", ") || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
              <h3 className="text-sm font-semibold">Quick Info</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--fg-tertiary)]">Category</dt>
                  <dd>
                    <a href={`/category/${tool.category_slug}`} className="text-[var(--accent)] hover:underline">
                      {categoryName}
                    </a>
                  </dd>
                </div>
                {tool.pricing_starts_at !== null && (
                  <div>
                    <dt className="text-[var(--fg-tertiary)]">Starting Price</dt>
                    <dd>{tool.pricing_starts_at === 0 ? "Free" : `$${tool.pricing_starts_at}/mo`}</dd>
                  </div>
                )}
                {tool.features && (
                  <div>
                    <dt className="text-[var(--fg-tertiary)]">Features</dt>
                    <dd>{tool.features.length} listed</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold">
              Alternatives to {tool.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--fg-secondary)]">
              Other {categoryName} tools you might consider
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {alternatives.map((alt) => (
                <ToolCard key={alt.slug} tool={alt} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
