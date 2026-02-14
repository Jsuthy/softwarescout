import { baseUrl, buildSitemapIndexXml, xmlResponse } from "@/lib/sitemap-utils";

export async function GET() {
  const xml = buildSitemapIndexXml([
    `${baseUrl}/sitemap-main.xml`,
    `${baseUrl}/sitemap-tools.xml`,
    `${baseUrl}/sitemap-comparisons.xml`,
    `${baseUrl}/sitemap-industry.xml`,
  ]);

  return xmlResponse(xml);
}
