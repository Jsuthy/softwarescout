import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export async function GET() {
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  const urls = [
    { loc: baseUrl, changefreq: "daily", priority: 1 },
    { loc: `${baseUrl}/categories`, changefreq: "weekly", priority: 0.8 },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: 0.4 },
    { loc: `${baseUrl}/privacy`, changefreq: "monthly", priority: 0.3 },
    { loc: `${baseUrl}/terms`, changefreq: "monthly", priority: 0.3 },
    { loc: `${baseUrl}/search`, changefreq: "weekly", priority: 0.5 },
    ...(categories || []).map((c: { slug: string }) => ({
      loc: `${baseUrl}/category/${c.slug}`,
      changefreq: "weekly",
      priority: 0.7,
    })),
  ];

  return xmlResponse(buildUrlsetXml(urls));
}
