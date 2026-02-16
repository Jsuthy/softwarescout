import {
  baseUrl,
  buildSitemapIndexXml,
  xmlResponse,
} from "@/lib/sitemap-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const xml = buildSitemapIndexXml([
    { loc: `${baseUrl}/sitemap-main.xml`, lastmod },
    { loc: `${baseUrl}/sitemap-tools.xml`, lastmod },
    { loc: `${baseUrl}/sitemap-comparisons.xml`, lastmod },
    { loc: `${baseUrl}/sitemap-industry.xml`, lastmod },
  ]);

  return xmlResponse(xml);
}
