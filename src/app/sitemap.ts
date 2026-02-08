import { supabase } from "@/lib/supabase";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://softwarescout.xyz";

  const [
    { data: tools },
    { data: categories },
    { data: comparisons },
    { data: industryPages },
  ] = await Promise.all([
    supabase.from("tools").select("slug"),
    supabase.from("categories").select("slug"),
    supabase.from("comparisons").select("tool_a_slug, tool_b_slug"),
    supabase
      .from("industry_pages")
      .select("software_category, industry"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/search`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map(
    (c: { slug: string }) => ({
      url: `${baseUrl}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const toolPages: MetadataRoute.Sitemap = (tools || []).map(
    (t: { slug: string }) => ({
      url: `${baseUrl}/tool/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  const comparePages: MetadataRoute.Sitemap = (comparisons || []).map(
    (c: { tool_a_slug: string; tool_b_slug: string }) => ({
      url: `${baseUrl}/compare/${c.tool_a_slug}-vs-${c.tool_b_slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  const industryGuidePages: MetadataRoute.Sitemap = (industryPages || []).map(
    (p: { software_category: string; industry: string }) => ({
      url: `${baseUrl}/best/${p.software_category}/for/${p.industry}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...comparePages,
    ...industryGuidePages,
  ];
}
