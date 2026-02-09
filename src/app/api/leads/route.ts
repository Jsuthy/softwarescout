import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Tool } from "@/lib/types";

const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "live.com",
  "msn.com",
];

const VALID_COMPANY_SIZES = ["1-10", "11-50", "51-200", "200+"];
const VALID_BUDGETS = ["free", "under-50", "50-200", "200-plus"];

const REQUIREMENT_FEATURE_MAP: Record<string, string[]> = {
  "ease-of-use": ["easy to use", "intuitive", "simple", "user-friendly", "drag-and-drop"],
  integrations: ["integrations", "integration", "connects", "zapier", "api"],
  "mobile-app": ["mobile", "ios", "android", "app"],
  "customer-support": ["support", "24/7", "live chat", "help desk"],
  scalability: ["scalable", "enterprise", "unlimited", "growth"],
  "free-trial": ["free trial", "free plan", "freemium", "free tier"],
  "api-access": ["api", "developer", "webhook", "rest api"],
};

function getBudgetRange(budget: string): { min: number; max: number } {
  switch (budget) {
    case "free":
      return { min: 0, max: 0 };
    case "under-50":
      return { min: 0, max: 50 };
    case "50-200":
      return { min: 0, max: 200 };
    case "200-plus":
      return { min: 0, max: 999999 };
    default:
      return { min: 0, max: 999999 };
  }
}

function scoreToolForRequirements(
  tool: Tool,
  requirements: string[]
): number {
  let score = 0;
  const features = (tool.features || []).map((f) => f.toLowerCase());
  const description = (tool.description || "").toLowerCase();
  const allText = [...features, description].join(" ");

  for (const req of requirements) {
    const keywords = REQUIREMENT_FEATURE_MAP[req] || [];
    for (const keyword of keywords) {
      if (allText.includes(keyword)) {
        score += 1;
        break; // One match per requirement is enough
      }
    }
  }

  return score;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      software_category,
      industry,
      company_name,
      company_size,
      budget,
      requirements,
      name,
      email,
      phone,
      source_page,
    } = body;

    // Validate required fields
    if (!software_category || typeof software_category !== "string") {
      return NextResponse.json(
        { error: "Software category is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Reject free email domains
    const domain = email.split("@")[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      return NextResponse.json(
        { error: "Please use your work email address" },
        { status: 400 }
      );
    }

    // Validate enums
    if (company_size && !VALID_COMPANY_SIZES.includes(company_size)) {
      return NextResponse.json(
        { error: "Invalid company size" },
        { status: 400 }
      );
    }

    if (budget && !VALID_BUDGETS.includes(budget)) {
      return NextResponse.json(
        { error: "Invalid budget" },
        { status: 400 }
      );
    }

    // Auto-match tools based on category + budget + requirements
    const { data: tools } = await supabase
      .from("tools")
      .select("*")
      .eq("category_slug", software_category);

    let matchedTools: { slug: string; name: string; score: number }[] = [];

    if (tools && tools.length > 0) {
      const typedTools = tools as Tool[];
      const budgetRange = getBudgetRange(budget || "200-plus");
      const reqs = Array.isArray(requirements) ? requirements : [];

      const scored = typedTools
        .filter((t) => {
          // Filter by budget
          if (budget === "free") {
            return t.pricing_starts_at === 0 || t.pricing_starts_at === null;
          }
          if (t.pricing_starts_at === null) return true; // Unknown pricing, include
          return t.pricing_starts_at <= budgetRange.max;
        })
        .map((t) => ({
          slug: t.slug,
          name: t.name,
          score: scoreToolForRequirements(t, reqs),
        }))
        .sort((a, b) => b.score - a.score);

      matchedTools = scored.slice(0, 5);
    }

    // Insert lead into Supabase
    const { error: insertError } = await supabase.from("leads").insert({
      software_category,
      industry: industry || null,
      company_name: company_name || null,
      company_size: company_size || null,
      budget: budget || null,
      requirements: Array.isArray(requirements) ? requirements : [],
      matched_tools: matchedTools,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      source_page: source_page || null,
      status: "new",
    });

    if (insertError) {
      console.error("Failed to insert lead:", insertError);
      return NextResponse.json(
        { error: "Failed to save your information. Please try again." },
        { status: 500 }
      );
    }

    // Log notification (email integration will be added later)
    console.log(
      `[NEW LEAD] ${name} (${email}) — ${software_category} — ${budget} budget — matched ${matchedTools.length} tools`
    );

    return NextResponse.json({
      ok: true,
      matched_tools: matchedTools.map((t) => t.name),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
