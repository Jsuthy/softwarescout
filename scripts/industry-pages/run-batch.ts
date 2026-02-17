import { runBatch } from "../insert-industry-page";
import { CategoryProfile, getCategoryProfile } from "./tool-profiles";
import { getIndustryProfile, IndustryProfile } from "./industry-profiles";
import { generateIndustryPage } from "./content-generator";

export async function runIndustryBatch(
  categorySlug: string,
  industrySlugs: string[],
  batchName: string
) {
  const category = getCategoryProfile(categorySlug);
  if (!category) {
    console.error(`Category not found: ${categorySlug}`);
    process.exit(1);
  }

  const pages = industrySlugs.map((slug) => {
    const industry = getIndustryProfile(slug);
    if (!industry) {
      console.error(`Industry not found: ${slug}`);
      process.exit(1);
    }
    return generateIndustryPage(category, industry);
  });

  await runBatch(pages, batchName);
}
