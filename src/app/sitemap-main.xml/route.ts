import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("slug");

  if (error) {
    console.error("Sitemap-main: failed to fetch categories:", error.message);
  }

  const lastmod = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: baseUrl, changefreq: "daily", priority: 1, lastmod },
    {
      loc: `${baseUrl}/categories`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod,
    },
    {
      loc: `${baseUrl}/about`,
      changefreq: "monthly",
      priority: 0.4,
      lastmod,
    },
    {
      loc: `${baseUrl}/privacy`,
      changefreq: "monthly",
      priority: 0.3,
      lastmod,
    },
    {
      loc: `${baseUrl}/terms`,
      changefreq: "monthly",
      priority: 0.3,
      lastmod,
    },
    {
      loc: `${baseUrl}/search`,
      changefreq: "weekly",
      priority: 0.5,
      lastmod,
    },
    ...(categories || []).map((c: { slug: string }) => ({
      loc: `${baseUrl}/category/${c.slug}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod,
    })),
  ];

  return xmlResponse(buildUrlsetXml(urls));
}
