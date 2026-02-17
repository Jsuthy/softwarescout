import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface PageRecommendation {
  tool_slug: string;
  tool_name: string;
  why_it_works: string;
  use_cases: string[];
  pros: string[];
  cons: string[];
  pricing_note: string;
}

export interface PageFAQ {
  question: string;
  answer: string;
}

export interface IndustryPageData {
  slug: string;
  software_category: string;
  industry: string;
  title: string;
  meta_description: string;
  intro: string;
  buying_guide: string;
  recommendations: PageRecommendation[];
  faq: PageFAQ[];
}

export async function upsertIndustryPage(page: IndustryPageData): Promise<boolean> {
  const { error } = await supabase
    .from("industry_pages")
    .upsert(
      {
        slug: page.slug,
        software_category: page.software_category,
        industry: page.industry,
        title: page.title,
        meta_description: page.meta_description,
        intro: page.intro,
        buying_guide: page.buying_guide,
        recommendations: page.recommendations,
        faq: page.faq,
      },
      { onConflict: "slug" }
    );

  if (error) {
    console.error(`  ERROR inserting ${page.slug}:`, error.message);
    return false;
  }
  return true;
}

export async function runBatch(pages: IndustryPageData[], batchName: string) {
  console.log(`\n🚀 ${batchName}: Inserting ${pages.length} pages...\n`);

  let success = 0;
  let failed = 0;

  for (const page of pages) {
    const ok = await upsertIndustryPage(page);
    if (ok) {
      success++;
      console.log(`  ✓ ${page.slug}`);
    } else {
      failed++;
    }
  }

  // Count total for this category
  const category = pages[0]?.software_category;
  if (category) {
    const { count } = await supabase
      .from("industry_pages")
      .select("*", { count: "exact", head: true })
      .eq("software_category", category);
    console.log(`\n  Category "${category}" now has ${count} total pages`);
  }

  // Count all industry pages
  const { count: totalCount } = await supabase
    .from("industry_pages")
    .select("*", { count: "exact", head: true });

  console.log(`\n✅ ${batchName} complete: ${success} inserted, ${failed} failed`);
  console.log(`📊 Total industry pages in database: ${totalCount}\n`);
}

export { supabase };
