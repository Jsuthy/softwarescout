import { supabase } from "@/lib/supabase";
import { baseUrl, buildUrlsetXml, xmlResponse } from "@/lib/sitemap-utils";

export async function GET() {
  const { data: tools } = await supabase.from("tools").select("slug");

  const urls = (tools || []).map((t: { slug: string }) => ({
    loc: `${baseUrl}/tool/${t.slug}`,
    changefreq: "weekly",
    priority: 0.6,
  }));

  return xmlResponse(buildUrlsetXml(urls));
}
