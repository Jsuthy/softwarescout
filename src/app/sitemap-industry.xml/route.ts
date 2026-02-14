import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export async function GET() {
  const { data: industryPages } = await supabase
    .from("industry_pages")
    .select("software_category, industry");

  const urls = (industryPages || []).map(
    (p: { software_category: string; industry: string }) => ({
      loc: `${baseUrl}/best/${p.software_category}/for/${p.industry}`,
      changefreq: "monthly",
      priority: 0.6,
    })
  );

  return xmlResponse(buildUrlsetXml(urls));
}
