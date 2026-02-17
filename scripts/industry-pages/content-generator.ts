import { IndustryPageData, PageRecommendation, PageFAQ } from "../insert-industry-page";
import { CategoryProfile, ToolProfile } from "./tool-profiles";
import { IndustryProfile } from "./industry-profiles";

// --- Tool-Industry matching scores ---
// Higher score = better fit for the industry

interface ToolFitConfig {
  industryTypes: Record<string, number>;
  keywords: Record<string, number>;
}

const CHATBOT_FIT: Record<string, ToolFitConfig> = {
  "microsoft-copilot": {
    industryTypes: { professional: 10, healthcare: 7, education: 6, service: 5, creative: 4, "home-service": 4, food: 3, retail: 5, wellness: 4, events: 6 },
    keywords: { "document": 8, "email": 7, "report": 8, "spreadsheet": 9, "compliance": 7, "insurance": 6, "billing": 5 },
  },
  grok: {
    industryTypes: { food: 8, creative: 7, retail: 7, wellness: 6, events: 7, service: 5, professional: 4, "home-service": 5, healthcare: 3, education: 5 },
    keywords: { "social media": 9, "trend": 8, "marketing": 7, "community": 6, "review": 5, "local": 4 },
  },
  "meta-ai": {
    industryTypes: { food: 9, retail: 8, wellness: 8, creative: 7, service: 7, "home-service": 6, events: 7, education: 5, healthcare: 3, professional: 3 },
    keywords: { "social media": 10, "customer": 7, "messaging": 8, "community": 7, "engagement": 6, "free": 5 },
  },
  poe: {
    industryTypes: { education: 8, professional: 7, creative: 7, healthcare: 5, service: 5, "home-service": 4, food: 4, retail: 5, wellness: 5, events: 5 },
    keywords: { "research": 8, "content": 7, "compare": 6, "writing": 7, "planning": 5 },
  },
  pi: {
    industryTypes: { wellness: 9, healthcare: 7, education: 7, creative: 5, events: 5, service: 4, professional: 3, "home-service": 3, food: 3, retail: 3 },
    keywords: { "coaching": 9, "support": 7, "personal": 8, "empathy": 6, "relationship": 7, "wellbeing": 8 },
  },
  "cohere-command": {
    industryTypes: { professional: 9, healthcare: 7, "home-service": 4, service: 4, education: 5, creative: 3, food: 3, retail: 4, wellness: 3, events: 4 },
    keywords: { "document": 9, "search": 8, "knowledge": 7, "compliance": 8, "enterprise": 6, "data": 7 },
  },
  "mistral-le-chat": {
    industryTypes: { professional: 6, education: 6, creative: 6, healthcare: 5, service: 6, "home-service": 6, food: 5, retail: 5, wellness: 5, events: 5 },
    keywords: { "multilingual": 10, "budget": 7, "general": 5, "writing": 6, "research": 5 },
  },
  "inflection-ai": {
    industryTypes: { wellness: 7, healthcare: 6, service: 6, creative: 5, education: 5, events: 5, professional: 4, "home-service": 4, food: 4, retail: 5 },
    keywords: { "customer": 8, "personal": 7, "empathy": 8, "interaction": 6, "communication": 5 },
  },
};

const WRITING_FIT: Record<string, ToolFitConfig> = {
  jasper: {
    industryTypes: { professional: 7, retail: 8, creative: 7, food: 6, wellness: 7, events: 7, service: 6, "home-service": 5, healthcare: 5, education: 5 },
    keywords: { "marketing": 10, "ad": 9, "social media": 8, "brand": 8, "email campaign": 7, "promotion": 6 },
  },
  "copy-ai": {
    industryTypes: { retail: 8, food: 7, service: 7, wellness: 7, events: 6, creative: 6, "home-service": 6, professional: 5, healthcare: 4, education: 5 },
    keywords: { "ad copy": 9, "description": 8, "sales": 8, "social media": 7, "marketing": 7, "email": 6 },
  },
  "hypotenuse-ai": {
    industryTypes: { retail: 10, food: 6, service: 5, "home-service": 4, wellness: 4, creative: 5, events: 4, professional: 3, healthcare: 3, education: 3 },
    keywords: { "product": 10, "catalog": 9, "e-commerce": 8, "description": 8, "inventory": 7, "showcase": 5 },
  },
  "koala-ai": {
    industryTypes: { professional: 7, service: 7, "home-service": 8, healthcare: 6, wellness: 6, retail: 6, creative: 5, food: 5, education: 6, events: 5 },
    keywords: { "SEO": 10, "blog": 9, "article": 8, "content marketing": 8, "organic traffic": 7, "local SEO": 8 },
  },
  byword: {
    industryTypes: { professional: 7, "home-service": 7, service: 7, healthcare: 5, wellness: 5, retail: 5, creative: 4, food: 4, education: 6, events: 4 },
    keywords: { "SEO": 9, "article": 8, "batch": 7, "scale": 7, "content": 6, "local pages": 8 },
  },
  textblaze: {
    industryTypes: { healthcare: 9, professional: 9, service: 7, "home-service": 7, education: 6, retail: 5, food: 4, creative: 4, wellness: 5, events: 5 },
    keywords: { "template": 10, "repetitive": 9, "form": 8, "email response": 7, "standard": 6, "intake": 7, "report": 7 },
  },
  writer: {
    industryTypes: { professional: 10, healthcare: 8, education: 5, service: 4, "home-service": 3, creative: 4, food: 3, retail: 4, wellness: 3, events: 4 },
    keywords: { "compliance": 10, "brand voice": 8, "enterprise": 7, "style guide": 8, "regulated": 9, "team": 6 },
  },
  novelai: {
    industryTypes: { creative: 9, events: 6, food: 5, wellness: 5, retail: 4, education: 4, service: 3, "home-service": 3, professional: 2, healthcare: 2 },
    keywords: { "creative": 10, "story": 9, "narrative": 8, "unique": 6, "brand story": 7, "visual": 5 },
  },
};

const CODE_FIT: Record<string, ToolFitConfig> = {
  v0: {
    industryTypes: { creative: 9, retail: 8, food: 8, wellness: 8, service: 8, events: 8, "home-service": 7, professional: 7, healthcare: 6, education: 7 },
    keywords: { "website": 10, "landing page": 9, "booking": 8, "portfolio": 8, "menu": 7, "scheduling": 7 },
  },
  bolt: {
    industryTypes: { service: 8, food: 7, retail: 7, professional: 7, wellness: 7, events: 7, "home-service": 7, creative: 7, healthcare: 6, education: 7 },
    keywords: { "app": 10, "dashboard": 9, "booking system": 8, "inventory": 7, "portal": 8, "database": 7 },
  },
  devin: {
    industryTypes: { professional: 7, healthcare: 5, education: 4, service: 4, creative: 4, retail: 4, "home-service": 3, food: 3, wellness: 3, events: 4 },
    keywords: { "custom software": 10, "complex": 8, "automation": 7, "integration": 7, "enterprise": 6 },
  },
  "amazon-codewhisperer": {
    industryTypes: { professional: 7, healthcare: 5, retail: 5, education: 4, service: 4, creative: 3, "home-service": 3, food: 3, wellness: 3, events: 3 },
    keywords: { "cloud": 10, "AWS": 9, "security": 8, "infrastructure": 7, "enterprise": 6 },
  },
  "sourcegraph-cody": {
    industryTypes: { professional: 6, healthcare: 4, education: 4, service: 4, creative: 4, retail: 3, "home-service": 3, food: 3, wellness: 3, events: 3 },
    keywords: { "codebase": 10, "documentation": 8, "search": 7, "team": 6, "large project": 7 },
  },
  aider: {
    industryTypes: { professional: 5, creative: 5, education: 4, service: 4, healthcare: 3, retail: 3, "home-service": 3, food: 3, wellness: 3, events: 3 },
    keywords: { "developer": 9, "terminal": 8, "git": 7, "coding": 7, "open-source": 6 },
  },
  "continue-dev": {
    industryTypes: { professional: 5, creative: 5, education: 4, service: 4, healthcare: 3, retail: 3, "home-service": 3, food: 3, wellness: 3, events: 3 },
    keywords: { "IDE": 9, "coding": 8, "customizable": 7, "privacy": 6, "open-source": 6 },
  },
};

const FIT_MAPS: Record<string, Record<string, ToolFitConfig>> = {
  "ai-chatbots": CHATBOT_FIT,
  "ai-writing": WRITING_FIT,
  "ai-code": CODE_FIT,
};

function scoreToolForIndustry(
  toolSlug: string,
  industry: IndustryProfile,
  fitMap: Record<string, ToolFitConfig>
): number {
  const config = fitMap[toolSlug];
  if (!config) return 0;

  let score = config.industryTypes[industry.type] || 3;

  // Bonus for keyword matches in industry content needs and pain points
  const industryText = [
    ...industry.painPoints,
    ...industry.workflows,
    ...industry.contentNeeds,
    ...industry.keyTerms,
  ].join(" ").toLowerCase();

  for (const [keyword, bonus] of Object.entries(config.keywords)) {
    if (industryText.includes(keyword.toLowerCase())) {
      score += bonus * 0.3;
    }
  }

  return score;
}

function selectBestTools(
  category: CategoryProfile,
  industry: IndustryProfile,
  count: number = 4
): ToolProfile[] {
  const fitMap = FIT_MAPS[category.slug] || {};

  const scored = category.tools.map((tool) => ({
    tool,
    score: scoreToolForIndustry(tool.slug, industry, fitMap),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.tool);
}

// --- Content generation functions ---

function generateTitle(categoryName: string, industryName: string, toolCount: number): string {
  return `Best ${categoryName} for ${industryName}: Top ${toolCount} Tools in 2026`;
}

function generateMetaDescription(categoryName: string, industryName: string): string {
  const templates = [
    `Compare the best ${categoryName.toLowerCase()} for ${industryName.toLowerCase()}. Expert picks with pricing, features, and real use cases.`,
    `Find the top ${categoryName.toLowerCase()} for ${industryName.toLowerCase()} businesses. Honest reviews, pricing, and industry-specific recommendations.`,
    `Best ${categoryName.toLowerCase()} for ${industryName.toLowerCase()} in 2026. We compare features, pricing, and fit for your business.`,
  ];
  // Deterministic selection based on names
  const idx = (categoryName.length + industryName.length) % templates.length;
  const desc = templates[idx];
  return desc.length <= 155 ? desc : desc.substring(0, 152) + "...";
}

function generateIntro(
  category: CategoryProfile,
  industry: IndustryProfile
): string {
  const pain1 = industry.painPoints[0];
  const pain2 = industry.painPoints[1];
  const workflow = industry.workflows[0];

  const intros: Record<string, string[]> = {
    "ai-chatbots": [
      `Running a ${industry.name.toLowerCase()} business means ${pain1} while also ${pain2}. AI chatbots and assistants can transform how you handle ${workflow} — giving you instant support for everything from drafting client communications to answering common questions. Whether you're a ${industry.businessSize} operation or scaling up, the right AI assistant saves hours every week and helps you deliver a more professional experience to ${industry.customerType}.`,
      `${industry.name} professionals know the daily grind of ${pain1}. Add ${pain2} to your plate, and there's barely time for the actual work. AI chatbots have evolved beyond simple Q&A — today's assistants help with ${workflow}, generate ideas, and even handle research. For ${industry.name.toLowerCase()} businesses serving ${industry.customerType}, these tools are becoming essential for staying competitive.`,
      `In the ${industry.name.toLowerCase()} industry, ${pain1} is a constant challenge. AI chatbots and assistants offer a practical solution by helping with ${workflow} and streamlining how you communicate with ${industry.customerType}. These tools can draft responses, brainstorm solutions, and handle routine tasks — freeing you to focus on what matters most in your business.`,
    ],
    "ai-writing": [
      `For ${industry.name.toLowerCase()} businesses, content is king — but ${pain1} leaves little time for writing compelling ${industry.contentNeeds[0]} and ${industry.contentNeeds[1]}. AI writing tools can help you produce professional content in minutes instead of hours, from ${industry.contentNeeds[0]} to ${industry.contentNeeds[2]}. Whether you're a ${industry.businessSize} operation, these tools help you compete with larger companies that have dedicated marketing teams.`,
      `${industry.name} businesses face a unique content challenge: ${pain1} while needing to consistently produce ${industry.contentNeeds[0]} and ${industry.contentNeeds[1]}. AI writing tools solve this by generating industry-specific content that speaks directly to ${industry.customerType}. The best tools understand your tone, your terminology, and what resonates with your audience.`,
      `Content creation is critical for ${industry.name.toLowerCase()} businesses trying to attract and retain ${industry.customerType}. But when you're focused on ${workflow}, who has time to write? AI writing tools can draft ${industry.contentNeeds[0]}, create ${industry.contentNeeds[1]}, and help with ${industry.contentNeeds[2]} — all while maintaining your brand voice and industry expertise.`,
    ],
    "ai-code": [
      `${industry.name} businesses increasingly need custom digital tools — from booking systems to customer portals — but hiring developers is expensive and time-consuming. AI code assistants are changing the game by letting ${industry.businessSize} operations build professional websites, web apps, and internal tools without a computer science degree. Whether you need a simple landing page or a full ${industry.contentNeeds[0]} system, these tools can get you there.`,
      `In today's digital-first world, ${industry.name.toLowerCase()} businesses that lack a strong online presence risk losing ${industry.customerType} to competitors. AI code assistants make it possible to build custom websites, booking platforms, and business tools without hiring a developer. For ${industry.name.toLowerCase()} professionals dealing with ${pain1}, these tools offer a way to solve technology problems on your own terms.`,
      `Every ${industry.name.toLowerCase()} business needs digital tools — a professional website, online booking, customer management — but ${pain1} makes it hard to prioritize technology investments. AI code assistants now let non-technical business owners build exactly what they need. From simple portfolio sites to complex ${industry.contentNeeds[0]} systems, these tools handle the coding while you focus on serving ${industry.customerType}.`,
    ],
  };

  const categoryIntros = intros[category.slug] || intros["ai-chatbots"];
  const idx = (industry.slug.length + category.slug.length) % categoryIntros.length;
  return categoryIntros[idx];
}

function generateBuyingGuide(
  category: CategoryProfile,
  industry: IndustryProfile
): string {
  const guides: Record<string, (ind: IndustryProfile) => string> = {
    "ai-chatbots": (ind) => {
      const p1 = `When evaluating AI chatbots for your ${ind.name.toLowerCase()} business, start with your most time-consuming communication tasks. If you spend hours each week on ${ind.workflows[0]}, look for an AI assistant that excels at drafting, summarizing, and organizing that type of content. The best tool for your ${ind.name.toLowerCase()} business is the one that addresses your specific pain point of ${ind.painPoints[0]}.`;

      const p2 = `Integration matters more than raw AI power. A chatbot that connects with the tools you already use — whether that's your ${ind.techLevel === "high" ? "project management platform, email client, and document management system" : ind.techLevel === "medium" ? "scheduling software, email, and social media accounts" : "phone, text messaging, and basic business tools"} — will deliver more value than a technically superior bot that sits in its own silo. For ${ind.name.toLowerCase()} businesses, also consider whether the tool works well on mobile, since much of your work happens ${ind.type === "home-service" || ind.type === "service" ? "on job sites and in the field" : ind.type === "food" ? "in the kitchen or on the go" : "outside a traditional office"}.`;

      const p3 = `Pricing varies wildly in the AI chatbot space, from completely free tools to enterprise subscriptions exceeding $30 per user per month. As a ${ind.businessSize} operation serving ${ind.customerType}, you likely don't need the most expensive option. Many of the best AI chatbots offer generous free tiers that handle basic tasks like brainstorming, drafting messages, and answering questions — start there and upgrade only when you hit real limitations.`;

      const p4 = `One common mistake ${ind.name.toLowerCase()} professionals make is trying to use AI chatbots for everything at once. Instead, start with one specific workflow — like ${ind.workflows[1] || ind.workflows[0]} — and master it before expanding. This approach lets you build confidence with the tool and develop prompts that work specifically for ${ind.name.toLowerCase()} scenarios. Also, always review AI-generated content before sending it to ${ind.customerType}, especially for anything involving ${ind.keyTerms[0]} or ${ind.keyTerms[1]}.`;

      return [p1, p2, p3, p4].join("\n\n");
    },
    "ai-writing": (ind) => {
      const p1 = `Choosing the right AI writing tool for your ${ind.name.toLowerCase()} business starts with understanding what kind of content you need most. If ${ind.contentNeeds[0]} is your primary bottleneck, prioritize tools with strong ${ind.contentNeeds[0]} templates or capabilities. Many ${ind.name.toLowerCase()} businesses waste money on enterprise writing platforms when a focused tool that excels at ${ind.contentNeeds[1]} would serve them better.`;

      const p2 = `Look for AI writing tools that understand ${ind.name.toLowerCase()} industry terminology and tone. When you're writing about ${ind.keyTerms[0]} and ${ind.keyTerms[1]}, generic AI tools often miss the mark. The best options either let you train on your brand voice or come with industry-aware templates. For ${ind.name.toLowerCase()} businesses communicating with ${ind.customerType}, tone matters as much as accuracy.`;

      const p3 = `Consider how the tool fits into your existing workflow. If you're currently struggling with ${ind.painPoints[0]}, you need a tool that integrates seamlessly — not one that adds another step to your process. The best AI writing tools for ${ind.name.toLowerCase()} businesses let you generate content directly where you work, whether that's in your browser, email client, or content management system.`;

      const p4 = `Budget is a real concern for ${ind.businessSize} operations. AI writing tools range from free tiers with limited output to premium plans costing $50-100 per month. Calculate your actual content volume — how many ${ind.contentNeeds[0]} and ${ind.contentNeeds[1]} you produce weekly — and match that to the right pricing tier. Many ${ind.name.toLowerCase()} businesses find that a mid-tier plan covers their needs without breaking the bank.`;

      const p5 = `Finally, never publish AI-generated content without review. While these tools are remarkably capable, they can occasionally produce inaccurate information about ${ind.keyTerms[0]} or use terminology incorrectly. Use AI writing tools as a first draft generator and editing partner, not a replacement for your industry expertise. Your knowledge of ${ind.name.toLowerCase()} is what makes the content genuinely valuable to ${ind.customerType}.`;

      return [p1, p2, p3, p4, p5].join("\n\n");
    },
    "ai-code": (ind) => {
      const p1 = `For ${ind.name.toLowerCase()} businesses, the right AI code assistant depends on what you're trying to build. If you need a professional website or landing page, look for AI builders that generate polished, responsive designs from text descriptions. If you need something more complex — like a ${ind.type === "healthcare" ? "patient portal" : ind.type === "food" ? "menu and ordering system" : ind.type === "professional" ? "client dashboard" : ind.type === "education" ? "student management portal" : "booking and scheduling system"} — you'll want a tool that can handle both frontend design and backend logic.`;

      const p2 = `Don't be intimidated by the word "code." The best AI code tools for ${ind.name.toLowerCase()} businesses are designed for non-technical users. You describe what you want in plain English — "build a booking page for my ${ind.name.toLowerCase()} business with a calendar and contact form" — and the AI generates the working application. No programming knowledge required. The tools that rank highest for ${ind.name.toLowerCase()} are those with the lowest learning curve and most intuitive interfaces.`;

      const p3 = `Pricing for AI code assistants ranges from free tiers for basic projects to $500+/month for autonomous AI developers. As a ${ind.businessSize} operation, you'll likely find the most value in the $0-40/month range, which gives you access to website builders, simple web apps, and basic automation tools. Consider what you're currently paying for website hosting, third-party booking tools, or developer freelancers — an AI code assistant often replaces or reduces those costs.`;

      const p4 = `When evaluating tools, consider the ongoing maintenance factor. A website or app built with an AI tool still needs updates, hosting, and occasional fixes. The best platforms for ${ind.name.toLowerCase()} businesses include deployment and hosting, so you're not left managing servers. Also look for tools that generate clean, standard code — this means if you eventually hire a developer, they can pick up where the AI left off.`;

      const p5 = `Start small: build a single landing page or a simple booking form before committing to building your entire online presence with AI tools. This lets you evaluate the quality of output, understand the tool's limitations, and build confidence. For ${ind.name.toLowerCase()} professionals who are used to ${ind.workflows[0]}, the transition to building your own digital tools can feel empowering and save thousands in development costs annually.`;

      return [p1, p2, p3, p4, p5].join("\n\n");
    },
  };

  const generator = guides[category.slug] || guides["ai-chatbots"];
  return generator(industry);
}

function generateWhyItWorks(
  tool: ToolProfile,
  category: CategoryProfile,
  industry: IndustryProfile
): string {
  const strength = tool.strengths[0];
  const bestUse = tool.bestFor[0];

  const templates = [
    `${tool.name} stands out for ${industry.name.toLowerCase()} businesses because of its ${strength.toLowerCase()}. This directly addresses the common ${industry.name.toLowerCase()} challenge of ${industry.painPoints[0]}, making it particularly valuable for ${industry.businessSize} operations that need to ${bestUse}.`,
    `For ${industry.name.toLowerCase()} professionals, ${tool.name}'s key advantage is its ${strength.toLowerCase()}. When you're dealing with ${industry.customerType} and need to handle ${industry.workflows[0]}, ${tool.name} delivers the right combination of capability and ease of use.`,
    `${tool.name} is a strong fit for ${industry.name.toLowerCase()} because it excels at ${bestUse}. Its ${strength.toLowerCase()} makes it especially useful when ${industry.painPoints[0]} is a daily reality and you need a reliable tool to keep up.`,
  ];

  const idx = (tool.slug.length + industry.slug.length) % templates.length;
  return templates[idx];
}

function generateUseCases(
  tool: ToolProfile,
  category: CategoryProfile,
  industry: IndustryProfile
): string[] {
  const useCaseMap: Record<string, (t: ToolProfile, i: IndustryProfile) => string[]> = {
    "ai-chatbots": (t, i) => [
      `Quickly draft ${i.contentNeeds[0]} without starting from scratch`,
      `Answer common questions from ${i.customerType} about ${i.keyTerms[0]} and ${i.keyTerms[1]}`,
      `Brainstorm ideas for ${i.contentNeeds[1] || i.contentNeeds[0]} and marketing content`,
      `Research industry trends related to ${i.keyTerms[2] || i.keyTerms[0]} and best practices`,
    ],
    "ai-writing": (t, i) => [
      `Generate professional ${i.contentNeeds[0]} in minutes instead of hours`,
      `Create ${i.contentNeeds[1]} that speak directly to ${i.customerType}`,
      `Draft ${i.contentNeeds[2] || "marketing content"} with industry-appropriate tone`,
      `Produce consistent ${i.name.toLowerCase()}-specific content at scale`,
    ],
    "ai-code": (t, i) => {
      const isBuildTool = ["v0", "bolt", "devin"].includes(t.slug);
      if (isBuildTool) {
        return [
          `Build a professional ${i.name.toLowerCase()} website with online booking`,
          `Create a customer ${i.type === "healthcare" ? "patient" : "client"} portal for ${i.customerType}`,
          `Design landing pages for ${i.contentNeeds[0]} promotions`,
          `Develop internal tools for ${i.workflows[1] || i.workflows[0]}`,
        ];
      }
      return [
        `Customize and extend your ${i.name.toLowerCase()} business website`,
        `Debug and improve existing web application code`,
        `Build automation scripts for ${i.workflows[0]}`,
        `Generate documentation for your ${i.name.toLowerCase()} tech stack`,
      ];
    },
  };

  const generator = useCaseMap[category.slug] || useCaseMap["ai-chatbots"];
  return generator(tool, industry);
}

function generateToolPros(
  tool: ToolProfile,
  industry: IndustryProfile
): string[] {
  const pros: string[] = [];

  if (tool.freeOption) {
    pros.push(`Free tier available — great for ${industry.businessSize} budgets`);
  }

  // Add relevant tool strengths for this industry
  const strength = tool.strengths.find((s) =>
    industry.painPoints.some((p) => {
      const sLower = s.toLowerCase();
      const words = p.split(" ").filter((w) => w.length > 4);
      return words.some((w) => sLower.includes(w.toLowerCase()));
    })
  ) || tool.strengths[1] || tool.strengths[0];

  pros.push(strength);

  if (tool.bestFor.some((b) => b.includes("mobile") || b.includes("social") || b.includes("messaging"))) {
    pros.push(`Works where ${industry.name.toLowerCase()} professionals spend their time`);
  } else if (industry.techLevel === "low") {
    pros.push("Easy to use without technical experience");
  } else {
    pros.push(`Handles ${industry.name.toLowerCase()} workflows efficiently`);
  }

  return pros.slice(0, 3);
}

function generateToolCons(
  tool: ToolProfile,
  industry: IndustryProfile
): string[] {
  const cons: string[] = [];

  // Add relevant weakness
  cons.push(tool.weaknesses[0]);

  if (!tool.freeOption) {
    cons.push(`Paid plans may be a stretch for smaller ${industry.name.toLowerCase()} operations`);
  }

  return cons.slice(0, 2);
}

function generatePricingNote(tool: ToolProfile, industry: IndustryProfile): string {
  if (tool.freeOption) {
    return `${tool.pricing}. The free tier covers basic ${industry.name.toLowerCase()} needs; upgrade as your business grows.`;
  }
  return `${tool.pricing}. Consider the ROI against time saved on ${industry.contentNeeds[0]} and ${industry.contentNeeds[1] || "daily tasks"}.`;
}

function generateFAQs(
  category: CategoryProfile,
  industry: IndustryProfile,
  tools: ToolProfile[]
): PageFAQ[] {
  const faqGenerators: Record<string, (i: IndustryProfile, t: ToolProfile[]) => PageFAQ[]> = {
    "ai-chatbots": (ind, ts) => [
      {
        question: `What is the best AI chatbot for ${ind.name.toLowerCase()}?`,
        answer: `Based on our analysis, ${ts[0].name} is the top pick for most ${ind.name.toLowerCase()} businesses because of its ${ts[0].strengths[0].toLowerCase()}. However, ${ts[1].name} is a strong alternative if ${ts[1].bestFor[0]} is more important to your specific workflow. The best choice depends on whether you prioritize ${ts[0].bestFor[0]} or ${ts[1].bestFor[0]}.`,
      },
      {
        question: `Are there free AI chatbots that work well for ${ind.name.toLowerCase()}?`,
        answer: `Yes, several excellent AI chatbots offer free tiers suitable for the ${ind.name.toLowerCase()} industry. ${ts.filter((t) => t.freeOption).map((t) => t.name).slice(0, 3).join(", ")} all offer free access that covers basic needs like drafting communications, brainstorming, and answering questions. Most ${ind.businessSize} operations can get significant value from free tiers before needing to upgrade.`,
      },
      {
        question: `How can AI chatbots help with ${ind.workflows[0]}?`,
        answer: `AI chatbots can streamline ${ind.workflows[0]} by drafting templates, generating responses to common questions from ${ind.customerType}, and helping organize your workflow. For example, you can ask an AI assistant to draft a ${ind.contentNeeds[0]} or create a checklist for ${ind.workflows[1] || ind.workflows[0]}. This typically saves 30-60 minutes per day for busy ${ind.name.toLowerCase()} professionals.`,
      },
      {
        question: `Do I need technical skills to use AI chatbots in my ${ind.name.toLowerCase()} business?`,
        answer: `No technical skills are required. Modern AI chatbots are designed to be conversational — you simply type what you need in plain English. For ${ind.name.toLowerCase()} businesses, this means you can ask "draft an email about ${ind.keyTerms[0]}" or "create a template for ${ind.contentNeeds[0]}" and get useful results immediately. The learning curve is minimal.`,
      },
      {
        question: `Can AI chatbots handle ${ind.name.toLowerCase()}-specific terminology like ${ind.keyTerms[0]} and ${ind.keyTerms[1]}?`,
        answer: `Most modern AI chatbots have been trained on ${ind.name.toLowerCase()} industry content and understand terms like ${ind.keyTerms[0]}, ${ind.keyTerms[1]}, and ${ind.keyTerms[2] || ind.keyTerms[0]}. However, always review AI-generated content for accuracy, especially when communicating with ${ind.customerType} about technical topics. The more context you provide in your prompts, the more accurate the results.`,
      },
      {
        question: `How much time can AI chatbots save my ${ind.name.toLowerCase()} business each week?`,
        answer: `Most ${ind.name.toLowerCase()} business owners report saving 3-8 hours per week by using AI chatbots for tasks like ${ind.workflows[0]} and drafting ${ind.contentNeeds[0]}. The biggest time savings come from repetitive tasks and communications with ${ind.customerType}. Start by using the AI for your most time-consuming writing task and measure the difference.`,
      },
      {
        question: `Is it safe to use AI chatbots for ${ind.name.toLowerCase()} client communications?`,
        answer: `AI chatbots are safe for drafting communications, but you should always review content before sending it to ${ind.customerType}. ${ind.type === "healthcare" ? "For healthcare-related businesses, be especially mindful of HIPAA compliance and never input protected health information into AI tools that don't guarantee HIPAA compliance." : ind.type === "professional" ? "For professional services, review all content for accuracy and ensure it meets your industry's ethical standards before sharing with clients." : `For ${ind.name.toLowerCase()} businesses, the main risk is inaccuracy — always verify facts, prices, and technical details before sharing with clients.`}`,
      },
    ],
    "ai-writing": (ind, ts) => [
      {
        question: `What is the best AI writing tool for ${ind.name.toLowerCase()}?`,
        answer: `For most ${ind.name.toLowerCase()} businesses, ${ts[0].name} offers the best combination of features and value. It excels at ${ts[0].bestFor[0]} which is critical for ${ind.name.toLowerCase()} content. If you primarily need ${ts[1].bestFor[0]}, ${ts[1].name} may be a better fit. Consider your primary content type — ${ind.contentNeeds[0]} vs ${ind.contentNeeds[1]} — when making your choice.`,
      },
      {
        question: `Can AI writing tools create ${ind.contentNeeds[0]} for the ${ind.name.toLowerCase()} industry?`,
        answer: `Yes, modern AI writing tools are quite capable of generating ${ind.contentNeeds[0]} for ${ind.name.toLowerCase()} businesses. Tools like ${ts[0].name} and ${ts[1].name} can produce first drafts in seconds that would normally take 30-60 minutes to write. You'll still want to review and customize the output to match your specific ${ind.name.toLowerCase()} expertise and brand voice.`,
      },
      {
        question: `How much do AI writing tools cost for a ${ind.name.toLowerCase()} business?`,
        answer: `AI writing tools range from free (${ts.filter((t) => t.freeOption).map((t) => t.name).join(", ") || "limited tiers"}) to $50-100/month for premium plans. Most ${ind.businessSize} operations find good value in the $10-50/month range. Calculate how many hours you currently spend on ${ind.contentNeeds[0]} and ${ind.contentNeeds[1]} — if an AI tool saves you even 5 hours per month, it pays for itself quickly.`,
      },
      {
        question: `Will AI-written content sound authentic for my ${ind.name.toLowerCase()} business?`,
        answer: `The best AI writing tools allow you to customize tone and style to match your brand. For ${ind.name.toLowerCase()} content, provide the AI with examples of your existing writing, key terminology like ${ind.keyTerms[0]} and ${ind.keyTerms[1]}, and specific details about your ${ind.customerType}. The output improves significantly when you give industry context rather than generic prompts.`,
      },
      {
        question: `Can AI writing tools help with SEO for ${ind.name.toLowerCase()}?`,
        answer: `Several AI writing tools include SEO features specifically designed to help ${ind.name.toLowerCase()} businesses rank higher in local search. Tools like KoalaWriter and Byword analyze search intent and generate content optimized for keywords that ${ind.customerType} actually search for. This is particularly valuable for local ${ind.name.toLowerCase()} businesses trying to attract nearby customers.`,
      },
      {
        question: `How do I get the best results from AI writing tools for ${ind.name.toLowerCase()} content?`,
        answer: `The key is providing detailed prompts with ${ind.name.toLowerCase()} context. Instead of "write a blog post," try "write a blog post about ${ind.keyTerms[0]} tips for ${ind.customerType}, mentioning ${ind.keyTerms[1]} and ${ind.keyTerms[2] || ind.keyTerms[0]}." Include your target audience, desired tone, and specific points to cover. The more industry-specific your prompt, the better the output.`,
      },
    ],
    "ai-code": (ind, ts) => [
      {
        question: `Can I build a ${ind.name.toLowerCase()} website without knowing how to code?`,
        answer: `Absolutely. AI code assistants like ${ts[0].name} and ${ts[1].name} let you describe what you want in plain English, and they generate a working website. You can say "build a ${ind.name.toLowerCase()} website with a booking page, services list, and contact form" and get a professional result. No coding experience needed — the AI handles all the technical details.`,
      },
      {
        question: `What's the best AI tool for building a ${ind.name.toLowerCase()} business app?`,
        answer: `For most ${ind.name.toLowerCase()} businesses, ${ts[0].name} is the best starting point because of its ${ts[0].strengths[0].toLowerCase()}. If you need a more complex application with ${ind.type === "healthcare" ? "patient management" : ind.type === "food" ? "ordering and inventory" : "customer management"} features, ${ts[1].name} offers more full-stack capabilities. Start simple and add features as your needs grow.`,
      },
      {
        question: `How much does it cost to build a ${ind.name.toLowerCase()} website with AI tools?`,
        answer: `Many AI code tools offer free tiers that are sufficient for a basic ${ind.name.toLowerCase()} website. Premium plans typically run $20-40/month, which is significantly cheaper than hiring a web developer ($2,000-10,000+ for a custom site). For ${ind.businessSize} operations, the free or basic paid tier usually covers your needs for a professional online presence.`,
      },
      {
        question: `Can AI code tools build a booking system for my ${ind.name.toLowerCase()} business?`,
        answer: `Yes, building a booking or scheduling system is one of the most common use cases for AI code tools in the ${ind.name.toLowerCase()} industry. Tools like ${ts[0].name} and ${ts[1].name} can create a system where ${ind.customerType} book appointments, select services, and receive confirmations — all from a simple text description of what you need.`,
      },
      {
        question: `Do I need to maintain the website after the AI builds it?`,
        answer: `Websites built with AI tools do need occasional updates, but much less maintenance than traditionally coded sites. Most AI platforms include hosting and handle security updates automatically. For ${ind.name.toLowerCase()} businesses, you'll mainly need to update content like ${ind.contentNeeds[0]} and ${ind.contentNeeds[1]}, which the AI tools also make easy to modify.`,
      },
      {
        question: `Are AI-built websites professional enough for a ${ind.name.toLowerCase()} business?`,
        answer: `Modern AI code tools produce surprisingly professional results. ${ts[0].name} generates websites with clean design, mobile responsiveness, and fast loading times — the same qualities ${ind.customerType} expect. Many ${ind.name.toLowerCase()} businesses have switched to AI-built sites that look better than their previous professionally designed ones, at a fraction of the cost.`,
      },
      {
        question: `Can I add ${ind.name.toLowerCase()}-specific features to an AI-built website?`,
        answer: `Yes. The best AI code tools let you iteratively add features by describing what you need. For a ${ind.name.toLowerCase()} business, you might request a ${ind.contentNeeds[0]} section, ${ind.keyTerms[0]} information pages, or a ${ind.customerType} review gallery. The AI builds each feature and integrates it with your existing site. More complex features may require a more capable tool like ${ts[1].name} or ${ts.length > 2 ? ts[2].name : ts[1].name}.`,
      },
    ],
  };

  const generator = faqGenerators[category.slug] || faqGenerators["ai-chatbots"];
  return generator(industry, tools);
}

// --- Main generation function ---

export function generateIndustryPage(
  category: CategoryProfile,
  industry: IndustryProfile
): IndustryPageData {
  const tools = selectBestTools(category, industry, 4);
  const title = generateTitle(category.name, industry.name, tools.length);
  const metaDesc = generateMetaDescription(category.name, industry.name);
  const intro = generateIntro(category, industry);
  const buyingGuide = generateBuyingGuide(category, industry);

  const recommendations: PageRecommendation[] = tools.map((tool) => ({
    tool_slug: tool.slug,
    tool_name: tool.name,
    why_it_works: generateWhyItWorks(tool, category, industry),
    use_cases: generateUseCases(tool, category, industry),
    pros: generateToolPros(tool, industry),
    cons: generateToolCons(tool, industry),
    pricing_note: generatePricingNote(tool, industry),
  }));

  const faq = generateFAQs(category, industry, tools);

  return {
    slug: `${category.slug}-for-${industry.slug}`,
    software_category: category.slug,
    industry: industry.slug,
    title,
    meta_description: metaDesc,
    intro,
    buying_guide: buyingGuide,
    recommendations,
    faq,
  };
}
