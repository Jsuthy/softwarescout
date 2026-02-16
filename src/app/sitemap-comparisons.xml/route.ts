import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: comparisons, error } = await supabase
    .from("comparisons")
    .select("tool_a_slug, tool_b_slug");

  if (error) {
    console.error(
      "Sitemap-comparisons: failed to fetch comparisons:",
      error.message
    );
  }

  const lastmod = new Date().toISOString().split("T")[0];

  const urls = (comparisons || []).map(
    (c: { tool_a_slug: string; tool_b_slug: string }) => ({
      loc: `${baseUrl}/compare/${c.tool_a_slug}-vs-${c.tool_b_slug}`,
      changefreq: "monthly",
      priority: 0.5,
      lastmod,
    })
  );

  return xmlResponse(buildUrlsetXml(urls));
}
