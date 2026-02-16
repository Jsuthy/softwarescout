const baseUrl = "https://softwarescout.xyz";

interface SitemapUrl {
  loc: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildUrlsetXml(urls: SitemapUrl[]): string {
  const entries = urls
    .map((u) => {
      const lastmod = u.lastmod
        ? `<lastmod>${u.lastmod}</lastmod>`
        : "";
      return `<url><loc>${escapeXml(u.loc)}</loc>${lastmod}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export function buildSitemapIndexXml(
  sitemaps: { loc: string; lastmod: string }[]
): string {
  const entries = sitemaps
    .map(
      (s) =>
        `<sitemap><loc>${escapeXml(s.loc)}</loc><lastmod>${s.lastmod}</lastmod></sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

export { baseUrl };
