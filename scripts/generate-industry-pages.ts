import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import {
  CATEGORIES,
  INDUSTRIES,
  buildIndustryPageSlug,
} from "../src/lib/industry-data";

// --- Config ---
const TEST_PAGES = [
  { category: "crm", industry: "landscaping" },
  { category: "crm", industry: "food-trucks" },
  { category: "crm", industry: "dental-practices" },
];

const isTest = process.argv.includes("--test");

// --- Clients ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// --- Types ---
interface ToolRow {
  slug: string;
  name: string;
  description: string;
  features: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  pricing_starts_at: number | null;
  pricing_tiers: { name: string; price: string; features?: string[] }[] | null;
  category_slug: string;
}

interface GeneratedContent {
  title: string;
  meta_description: string;
  intro: string;
  buying_guide: string;
  recommendations: {
    tool_slug: string;
    tool_name: string;
    why_it_works: string;
    use_cases: string[];
    pros: string[];
    cons: string[];
    pricing_note: string;
  }[];
  faq: { question: string; answer: string }[];
}

// --- Helpers ---
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatToolContext(tools: ToolRow[]): string {
  return tools
    .map((t) => {
      const lines = [`## ${t.name} (slug: ${t.slug})`];
      if (t.description) lines.push(`Description: ${t.description}`);
      if (t.features?.length) lines.push(`Features: ${t.features.join(", ")}`);
      if (t.pros?.length) lines.push(`Pros: ${t.pros.join(", ")}`);
      if (t.cons?.length) lines.push(`Cons: ${t.cons.join(", ")}`);
      if (t.pricing_starts_at !== null) {
        lines.push(
          `Starting price: ${t.pricing_starts_at === 0 ? "Free" : `$${t.pricing_starts_at}/mo`}`
        );
      }
      if (t.pricing_tiers?.length) {
        const tiers = t.pricing_tiers
          .map((tier) => `${tier.name}: ${tier.price}`)
          .join("; ");
        lines.push(`Pricing tiers: ${tiers}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

function buildPrompt(
  categoryName: string,
  industryName: string,
  toolContext: string,
  toolSlugs: string[]
): string {
  return `You are an expert software reviewer who deeply understands the ${industryName} industry. You're writing a guide about the best ${categoryName} software for ${industryName} businesses.

Here are ALL the ${categoryName} tools available:

${toolContext}

Write a comprehensive, industry-specific guide. Your content must feel written by someone who actually works in the ${industryName} industry — reference specific workflows, pain points, and needs that ${industryName} professionals face.

Pick the 3-5 BEST tools from the list above for ${industryName} businesses specifically. Only recommend tools from this list (use their exact slugs).

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "title": "Best ${categoryName} for ${industryName}: Top [N] Tools in 2026",
  "meta_description": "A <155 character description targeting the search query 'best ${categoryName.toLowerCase()} for ${industryName.toLowerCase()}'",
  "intro": "2-3 sentences introducing why ${industryName} businesses need ${categoryName} software. Be specific about industry pain points.",
  "buying_guide": "3-5 paragraphs about what ${industryName} professionals should look for in ${categoryName} software. Separate paragraphs with double newlines. Cover industry-specific features, integrations, pricing considerations, and common mistakes.",
  "recommendations": [
    {
      "tool_slug": "exact-slug-from-list",
      "tool_name": "Tool Name",
      "why_it_works": "2-3 sentences about why this specific tool is great for ${industryName}",
      "use_cases": ["3-4 specific use cases for ${industryName}"],
      "pros": ["2-3 pros relevant to ${industryName}"],
      "cons": ["1-2 cons relevant to ${industryName}"],
      "pricing_note": "Brief pricing summary relevant to ${industryName} business size"
    }
  ],
  "faq": [
    {
      "question": "Industry-specific question about ${categoryName} for ${industryName}?",
      "answer": "Detailed answer (2-4 sentences)"
    }
  ]
}

Requirements:
- title: Include the year 2026 and the number of tools recommended
- meta_description: Under 155 characters, naturally include "${categoryName.toLowerCase()} for ${industryName.toLowerCase()}"
- intro: Reference specific ${industryName} workflows or challenges
- buying_guide: 3-5 paragraphs separated by \\n\\n — practical, not generic
- recommendations: 3-5 tools, each tool_slug MUST be one of: ${toolSlugs.join(", ")}
- faq: 5-7 questions that ${industryName} business owners would actually search for
- ALL content must be specific to ${industryName}, not generic advice`;
}

function validateContent(
  content: GeneratedContent,
  validSlugs: Set<string>
): string[] {
  const errors: string[] = [];
  if (!content.title) errors.push("Missing title");
  if (!content.meta_description) errors.push("Missing meta_description");
  if (content.meta_description && content.meta_description.length > 160)
    errors.push(`meta_description too long (${content.meta_description.length})`);
  if (!content.intro) errors.push("Missing intro");
  if (!content.buying_guide) errors.push("Missing buying_guide");
  if (!content.recommendations?.length)
    errors.push("Missing recommendations");
  if (!content.faq?.length) errors.push("Missing faq");

  for (const rec of content.recommendations || []) {
    if (!validSlugs.has(rec.tool_slug)) {
      errors.push(`Invalid tool_slug: ${rec.tool_slug}`);
    }
  }

  return errors;
}

// --- Main ---
async function main() {
  console.log(
    `\n🚀 Industry Pages Generator ${isTest ? "(TEST MODE — 3 pages)" : ""}\n`
  );

  // 1. Pre-fetch existing slugs for resume
  console.log("Loading existing pages...");
  const { data: existingRows } = await supabase
    .from("industry_pages")
    .select("slug");
  const existingSlugs = new Set((existingRows || []).map((r: { slug: string }) => r.slug));
  console.log(`  ${existingSlugs.size} existing pages found\n`);

  // 2. Pre-fetch all tools grouped by category
  console.log("Loading tools by category...");
  const toolsByCategory = new Map<string, ToolRow[]>();
  for (const cat of CATEGORIES) {
    const { data: tools } = await supabase
      .from("tools")
      .select(
        "slug, name, description, features, pros, cons, pricing_starts_at, pricing_tiers, category_slug"
      )
      .eq("category_slug", cat.dbCategorySlug);
    if (tools && tools.length > 0) {
      toolsByCategory.set(cat.slug, tools as ToolRow[]);
    }
  }
  console.log(
    `  ${toolsByCategory.size} categories with tools loaded\n`
  );

  // 3. Build work list
  type WorkItem = { categorySlug: string; industrySlug: string };
  let workItems: WorkItem[];

  if (isTest) {
    workItems = TEST_PAGES.map((p) => ({
      categorySlug: p.category,
      industrySlug: p.industry,
    }));
  } else {
    workItems = [];
    for (const cat of CATEGORIES) {
      for (const ind of INDUSTRIES) {
        workItems.push({
          categorySlug: cat.slug,
          industrySlug: ind.slug,
        });
      }
    }
  }

  const total = workItems.length;
  let generated = 0;
  let skipped = 0;
  let errored = 0;
  const failedSlugs: string[] = [];

  console.log(`Processing ${total} pages...\n`);

  for (let i = 0; i < workItems.length; i++) {
    const { categorySlug, industrySlug } = workItems[i];
    const slug = buildIndustryPageSlug(categorySlug, industrySlug);
    const num = i + 1;

    // Skip if already exists
    if (existingSlugs.has(slug)) {
      skipped++;
      console.log(`[${num}/${total}] SKIP: ${slug} (exists)`);
      continue;
    }

    // Skip if category has < 2 tools
    const tools = toolsByCategory.get(categorySlug);
    if (!tools || tools.length < 2) {
      skipped++;
      console.log(
        `[${num}/${total}] SKIP: ${slug} (category has ${tools?.length ?? 0} tools)`
      );
      continue;
    }

    const cat = CATEGORIES.find((c) => c.slug === categorySlug)!;
    const ind = INDUSTRIES.find((i) => i.slug === industrySlug)!;

    const start = Date.now();

    try {
      const toolContext = formatToolContext(tools);
      const toolSlugs = tools.map((t) => t.slug);
      const prompt = buildPrompt(cat.name, ind.name, toolContext, toolSlugs);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Parse JSON — handle potential markdown wrapping
      let jsonStr = text.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const content: GeneratedContent = JSON.parse(jsonStr);

      // Validate
      const validSlugs = new Set(toolSlugs);
      const errors = validateContent(content, validSlugs);

      // Filter out invalid recommendations rather than failing
      if (errors.some((e) => e.startsWith("Invalid tool_slug"))) {
        content.recommendations = content.recommendations.filter((r) =>
          validSlugs.has(r.tool_slug)
        );
      }

      const criticalErrors = errors.filter(
        (e) => !e.startsWith("Invalid tool_slug")
      );
      if (criticalErrors.length > 0) {
        throw new Error(`Validation: ${criticalErrors.join(", ")}`);
      }

      if (content.recommendations.length < 2) {
        throw new Error("Too few valid recommendations after filtering");
      }

      // Insert
      const { error: insertError } = await supabase
        .from("industry_pages")
        .insert({
          slug,
          software_category: categorySlug,
          industry: industrySlug,
          title: content.title,
          meta_description: content.meta_description,
          intro: content.intro,
          buying_guide: content.buying_guide,
          recommendations: content.recommendations,
          faq: content.faq,
        });

      if (insertError) throw insertError;

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      generated++;
      existingSlugs.add(slug);
      console.log(`[${num}/${total}] OK: ${slug} (${elapsed}s)`);
    } catch (err) {
      errored++;
      failedSlugs.push(slug);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.error(
        `[${num}/${total}] ERR: ${slug} (${elapsed}s) — ${err instanceof Error ? err.message : err}`
      );
    }

    // Rate limit delay
    await sleep(1000);
  }

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done! Generated: ${generated} | Skipped: ${skipped} | Errors: ${errored}`);
  if (failedSlugs.length > 0) {
    console.log(`\nFailed slugs:`);
    failedSlugs.forEach((s) => console.log(`  - ${s}`));
  }
  console.log();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
