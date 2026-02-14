import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export async function GET() {
  const { data: comparisons } = await supabase
    .from("comparisons")
    .select("tool_a_slug, tool_b_slug");

  const urls = (comparisons || []).map(
    (c: { tool_a_slug: string; tool_b_slug: string }) => ({
      loc: `${baseUrl}/compare/${c.tool_a_slug}-vs-${c.tool_b_slug}`,
      changefreq: "monthly",
      priority: 0.5,
    })
  );

  return xmlResponse(buildUrlsetXml(urls));
}
