import { supabase } from "@/lib/supabase";
import type { IndustryPage, Tool } from "@/lib/types";
import { ClickButton } from "@/components/ClickButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CATEGORIES,
  INDUSTRIES,
  buildIndustryPageSlug,
  getCategoryName,
  getIndustryName,
} from "@/lib/industry-data";
import { LeadCapture } from "@/components/LeadCapture";

export const revalidate = 3600;

type Props = { params: Promise<{ category: string; industry: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, industry } = await params;
  const slug = buildIndustryPageSlug(category, industry);

  const { data: page } = await supabase
    .from("industry_pages")
    .select("title, meta_description")
    .eq("slug", slug)
    .single();

  if (!page) return { title: "Page Not Found" };

  return {
    title: page.title,
    description: page.meta_description,
    alternates: {
      canonical: `/best/${category}/for/${industry}`,
    },
    openGraph: {
      title: page.title,
      description: page.meta_description,
    },
  };
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("industry_pages")
    .select("software_category, industry");

  return (data || []).map(
    (p: { software_category: string; industry: string }) => ({
      category: p.software_category,
      industry: p.industry,
    })
  );
}

async function getPageData(category: string, industry: string) {
  const slug = buildIndustryPageSlug(category, industry);

  const { data: page } = await supabase
    .from("industry_pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!page) return null;

  const typedPage = page as IndustryPage;

  // Fetch live tool data for all recommended tools
  const toolSlugs = typedPage.recommendations.map((r) => r.tool_slug);
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .in("slug", toolSlugs);

  const toolMap = new Map<string, Tool>();
  for (const t of (tools || []) as Tool[]) {
    toolMap.set(t.slug, t);
  }

  // Fetch related industry pages in same category
  const { data: relatedPages } = await supabase
    .from("industry_pages")
    .select("software_category, industry, title")
    .eq("software_category", category)
    .neq("slug", slug)
    .limit(6);

  return {
    page: typedPage,
    toolMap,
    relatedPages: (relatedPages || []) as {
      software_category: string;
      industry: string;
      title: string;
    }[],
  };
}

export default async function IndustryPageRoute({ params }: Props) {
  const { category, industry } = await params;
  const data = await getPageData(category, industry);
  if (!data) notFound();

  const { page, toolMap, relatedPages } = data;
  const categoryName = getCategoryName(category);
  const industryName = getIndustryName(industry);

  // JSON-LD: WebPage + FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: page.title,
        description: page.meta_description,
        url: `https://softwarescout.xyz/best/${category}/for/${industry}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
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
          <a href="/" className="hover:text-[var(--fg-secondary)]">
            Home
          </a>
          <span className="mx-2">/</span>
          <a
            href={`/category/${CATEGORIES.find((c) => c.slug === category)?.dbCategorySlug || category}`}
            className="hover:text-[var(--fg-secondary)]"
          >
            {categoryName}
          </a>
          <span className="mx-2">/</span>
          <span className="text-[var(--fg-secondary)]">
            Best for {industryName}
          </span>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>

        {/* Intro */}
        <p className="mt-4 max-w-3xl text-lg text-[var(--fg-secondary)]">
          {page.intro}
        </p>

        {/* Buying Guide */}
        <section className="mt-12">
          <h2 className="text-xl font-bold">
            What to Look For in {categoryName} Software for {industryName}
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-[var(--fg-secondary)]">
            {page.buying_guide.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Tool Recommendation Cards */}
        <section className="mt-12">
          <h2 className="text-xl font-bold">
            Top {categoryName} Tools for {industryName}
          </h2>
          <div className="mt-6 space-y-8">
            {page.recommendations.map((rec) => {
              const tool = toolMap.get(rec.tool_slug);
              const link =
                tool?.affiliate_link || tool?.website_url || "#";

              return (
                <div
                  key={rec.tool_slug}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6"
                >
                  {/* Header with logo */}
                  <div className="flex items-start gap-4">
                    {tool?.logo_url ? (
                      <img
                        src={tool.logo_url}
                        alt={rec.tool_name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-xl object-contain"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] font-bold text-xl">
                        {rec.tool_name[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">
                        <a
                          href={`/tool/${rec.tool_slug}`}
                          className="hover:text-[var(--accent)]"
                        >
                          {rec.tool_name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-[var(--fg-secondary)]">
                        {rec.why_it_works}
                      </p>
                    </div>
                  </div>

                  {/* Use cases */}
                  {rec.use_cases.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-[var(--fg-tertiary)]">
                        Use Cases for {industryName}
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {rec.use_cases.map((uc) => (
                          <li
                            key={uc}
                            className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]"
                          >
                            <svg
                              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {uc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pros & Cons */}
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {rec.pros.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-green-500">
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {rec.pros.map((pro) => (
                            <li
                              key={pro}
                              className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]"
                            >
                              <span className="mt-0.5 text-green-500">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rec.cons.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-red-400">
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {rec.cons.map((con) => (
                            <li
                              key={con}
                              className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]"
                            >
                              <span className="mt-0.5 text-red-400">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Pricing note */}
                  {rec.pricing_note && (
                    <p className="mt-4 text-sm text-[var(--fg-tertiary)]">
                      💲 {rec.pricing_note}
                    </p>
                  )}

                  {/* CTA */}
                  <div className="mt-4">
                    <ClickButton
                      toolSlug={rec.tool_slug}
                      href={link}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
                    >
                      Try {rec.tool_name}
                      <svg
                        className="ml-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </ClickButton>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing Comparison Table */}
        {page.recommendations.length > 1 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">
              Pricing Comparison
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-3 text-left font-semibold">Tool</th>
                    <th className="pb-3 text-left font-semibold">
                      Starting Price
                    </th>
                    <th className="pb-3 text-left font-semibold">
                      Pricing Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.recommendations.map((rec) => {
                    const tool = toolMap.get(rec.tool_slug);
                    return (
                      <tr
                        key={rec.tool_slug}
                        className="border-b border-[var(--border)]"
                      >
                        <td className="py-3 font-medium">
                          <a
                            href={`/tool/${rec.tool_slug}`}
                            className="text-[var(--accent)] hover:underline"
                          >
                            {rec.tool_name}
                          </a>
                        </td>
                        <td className="py-3 text-[var(--fg-secondary)]">
                          {tool?.pricing_starts_at !== null &&
                          tool?.pricing_starts_at !== undefined
                            ? tool.pricing_starts_at === 0
                              ? "Free"
                              : `$${tool.pricing_starts_at}/mo`
                            : "—"}
                        </td>
                        <td className="py-3 text-[var(--fg-secondary)]">
                          {rec.pricing_note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Lead Capture */}
        <LeadCapture
          softwareCategory={CATEGORIES.find((c) => c.slug === category)?.dbCategorySlug || category}
          categoryDisplayName={categoryName}
          industry={industry}
          industryDisplayName={industryName}
          sourcePage={`/best/${category}/for/${industry}`}
        />

        {/* FAQ Section */}
        {page.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 space-y-3">
              {page.faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--card-bg)]"
                >
                  <summary className="cursor-pointer px-6 py-4 font-medium">
                    {f.question}
                  </summary>
                  <p className="px-6 pb-4 text-sm text-[var(--fg-secondary)]">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides */}
        {relatedPages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">
              More {categoryName} Guides
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPages.map((rp) => (
                <a
                  key={`${rp.software_category}-${rp.industry}`}
                  href={`/best/${rp.software_category}/for/${rp.industry}`}
                  className="rounded-lg border border-[var(--border)] p-4 text-sm font-medium transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  {rp.title}
                </a>
              ))}
            </div>
            <div className="mt-4">
              <a
                href={`/category/${CATEGORIES.find((c) => c.slug === category)?.dbCategorySlug || category}`}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                View all {categoryName} tools →
              </a>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
