const baseUrl = "https://softwarescout.xyz";

interface SitemapUrl {
  loc: string;
  changefreq: string;
  priority: number;
}

export function buildUrlsetXml(urls: SitemapUrl[]): string {
  const entries = urls
    .map(
      (u) =>
        `<url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export function buildSitemapIndexXml(sitemaps: string[]): string {
  const entries = sitemaps
    .map(
      (url) =>
        `<sitemap><loc>${url}</loc></sitemap>`
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
