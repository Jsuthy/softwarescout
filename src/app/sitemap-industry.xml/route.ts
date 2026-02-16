import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: industryPages, error } = await supabase
    .from("industry_pages")
    .select("software_category, industry");

  if (error) {
    console.error(
      "Sitemap-industry: failed to fetch industry pages:",
      error.message
    );
  }

  const lastmod = new Date().toISOString().split("T")[0];

  const urls = (industryPages || []).map(
    (p: { software_category: string; industry: string }) => ({
      loc: `${baseUrl}/best/${p.software_category}/for/${p.industry}`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod,
    })
  );

  return xmlResponse(buildUrlsetXml(urls));
}
