import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: tools, error } = await supabase
    .from("tools")
    .select("slug");

  if (error) {
    console.error("Sitemap-tools: failed to fetch tools:", error.message);
  }

  const lastmod = new Date().toISOString().split("T")[0];

  const urls = (tools || []).map((t: { slug: string }) => ({
    loc: `${baseUrl}/tool/${t.slug}`,
    changefreq: "weekly",
    priority: 0.6,
    lastmod,
  }));

  return xmlResponse(buildUrlsetXml(urls));
}
