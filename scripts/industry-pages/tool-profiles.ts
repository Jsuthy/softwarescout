export interface ToolProfile {
  slug: string;
  name: string;
  tagline: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  pricing: string;
  freeOption: boolean;
}

export interface CategoryProfile {
  slug: string;
  name: string;
  tools: ToolProfile[];
}

export const AI_CHATBOTS: CategoryProfile = {
  slug: "ai-chatbots",
  name: "AI Chatbots & Assistants",
  tools: [
    {
      slug: "microsoft-copilot",
      name: "Microsoft Copilot",
      tagline: "AI assistant integrated into Microsoft 365",
      strengths: [
        "Deep integration with Word, Excel, PowerPoint, and Outlook",
        "Enterprise-grade security and compliance",
        "Drafts documents, analyzes spreadsheets, and summarizes emails",
        "Built-in Bing search for real-time information",
      ],
      weaknesses: [
        "Full Office integration requires Copilot Pro + M365 subscription",
        "Enterprise add-on at $30/user/month is expensive for small teams",
      ],
      bestFor: [
        "document-heavy workflows",
        "email management",
        "spreadsheet analysis",
        "professional services",
        "offices using Microsoft 365",
      ],
      pricing: "Free basic tier; Copilot Pro $20/mo; M365 Business $30/user/mo",
      freeOption: true,
    },
    {
      slug: "grok",
      name: "Grok",
      tagline: "xAI chatbot with real-time X/Twitter data access",
      strengths: [
        "Real-time access to X/Twitter trends and social data",
        "Strong reasoning with Think mode",
        "Image generation capabilities",
        "Free tier available to all X users",
      ],
      weaknesses: [
        "Full access requires X Premium+ at $40/month",
        "Heavily tied to X/Twitter ecosystem",
      ],
      bestFor: [
        "social media monitoring",
        "trend awareness",
        "market research",
        "customer sentiment analysis",
        "real-time information",
      ],
      pricing: "Free basic tier; SuperGrok $30/mo; X Premium+ $40/mo",
      freeOption: true,
    },
    {
      slug: "meta-ai",
      name: "Meta AI",
      tagline: "Free AI assistant across WhatsApp, Instagram, Facebook, and Messenger",
      strengths: [
        "Completely free with no premium tier needed",
        "Available on WhatsApp, Instagram, Facebook, and Messenger",
        "Built-in image generation",
        "Reaches customers on platforms they already use",
      ],
      weaknesses: [
        "Limited to Meta platforms only",
        "Less advanced reasoning than premium competitors",
      ],
      bestFor: [
        "social media engagement",
        "customer communication via messaging",
        "small businesses on tight budgets",
        "businesses with social media presence",
      ],
      pricing: "Completely free",
      freeOption: true,
    },
    {
      slug: "poe",
      name: "Poe",
      tagline: "Multi-model AI platform with access to GPT-4, Claude, and more",
      strengths: [
        "Access to multiple AI models (GPT-4, Claude, Llama) in one place",
        "Create custom bots for specific workflows",
        "Compare responses across models",
        "Good value for accessing premium models",
      ],
      weaknesses: [
        "Subscription required for premium model access",
        "No native integrations with business tools",
      ],
      bestFor: [
        "comparing AI models",
        "custom bot creation",
        "versatile business needs",
        "content generation",
        "research",
      ],
      pricing: "Free limited tier; Poe Premium $20/mo",
      freeOption: true,
    },
    {
      slug: "pi",
      name: "Pi",
      tagline: "Personal AI designed for empathetic, supportive conversations",
      strengths: [
        "Exceptionally warm and empathetic conversational style",
        "Excellent at brainstorming and idea exploration",
        "Voice interaction support",
        "Remembers conversation context well",
      ],
      weaknesses: [
        "Limited factual accuracy compared to competitors",
        "No document or file handling",
      ],
      bestFor: [
        "client communication",
        "brainstorming",
        "personal coaching",
        "relationship-heavy businesses",
        "wellness and care industries",
      ],
      pricing: "Free",
      freeOption: true,
    },
    {
      slug: "cohere-command",
      name: "Cohere Command",
      tagline: "Enterprise-focused AI with retrieval-augmented generation",
      strengths: [
        "Enterprise-grade retrieval-augmented generation (RAG)",
        "Excellent at searching and summarizing business documents",
        "Strong multilingual support",
        "Data privacy focused with on-premise options",
      ],
      weaknesses: [
        "More technical setup required than consumer chatbots",
        "Primarily enterprise-oriented, steeper learning curve",
      ],
      bestFor: [
        "document search and analysis",
        "enterprise knowledge management",
        "multilingual businesses",
        "data-heavy industries",
        "compliance-focused organizations",
      ],
      pricing: "Free trial; pay-as-you-go starting at $1/1000 API calls",
      freeOption: true,
    },
    {
      slug: "mistral-le-chat",
      name: "Mistral Le Chat",
      tagline: "European AI chatbot with strong multilingual and coding abilities",
      strengths: [
        "Strong multilingual performance especially for European languages",
        "Fast response times",
        "Good balance of capability and affordability",
        "Open-source model foundation provides transparency",
      ],
      weaknesses: [
        "Smaller ecosystem than OpenAI or Google alternatives",
        "Fewer integrations with business tools",
      ],
      bestFor: [
        "multilingual businesses",
        "European markets",
        "budget-conscious operations",
        "general research and writing",
      ],
      pricing: "Free tier available; Pro plans from €14.99/mo",
      freeOption: true,
    },
    {
      slug: "inflection-ai",
      name: "Inflection AI",
      tagline: "AI focused on emotional intelligence and natural conversation",
      strengths: [
        "Highly natural, emotionally aware conversations",
        "Strong personal assistant capabilities",
        "Good at understanding nuanced requests",
        "Enterprise API available for custom integrations",
      ],
      weaknesses: [
        "Company pivoted to enterprise focus, consumer features uncertain",
        "Smaller user base than major competitors",
      ],
      bestFor: [
        "customer interaction",
        "personal assistance",
        "businesses needing empathetic AI",
        "client-facing applications",
      ],
      pricing: "API pricing varies; consumer product free",
      freeOption: true,
    },
  ],
};

export const AI_WRITING: CategoryProfile = {
  slug: "ai-writing",
  name: "AI Writing Tools",
  tools: [
    {
      slug: "jasper",
      name: "Jasper",
      tagline: "AI marketing copywriter with brand voice and templates",
      strengths: [
        "50+ marketing-specific templates (ads, emails, social posts, blogs)",
        "Brand voice customization maintains consistent tone",
        "Team collaboration features",
        "SEO optimization integration with Surfer SEO",
      ],
      weaknesses: [
        "Starts at $49/mo, expensive for solopreneurs",
        "Occasional generic-sounding output without brand voice training",
      ],
      bestFor: [
        "marketing content",
        "ad copy",
        "social media posts",
        "email campaigns",
        "brand-consistent content",
      ],
      pricing: "Creator $49/mo; Pro $69/mo; Business custom pricing",
      freeOption: false,
    },
    {
      slug: "copy-ai",
      name: "Copy.ai",
      tagline: "AI-powered marketing copy and sales workflow automation",
      strengths: [
        "Excellent for short-form marketing copy",
        "Sales workflow automation features",
        "90+ copywriting tools and templates",
        "Free tier with 2,000 words/month",
      ],
      weaknesses: [
        "Long-form content less polished than competitors",
        "Free tier limited to 2,000 words/month",
      ],
      bestFor: [
        "ad copy",
        "product descriptions",
        "sales emails",
        "social media captions",
        "marketing workflows",
      ],
      pricing: "Free (2K words/mo); Pro $49/mo; Enterprise custom",
      freeOption: true,
    },
    {
      slug: "hypotenuse-ai",
      name: "Hypotenuse AI",
      tagline: "AI content platform specialized for e-commerce and product content",
      strengths: [
        "Specialized in product descriptions and e-commerce content",
        "Bulk content generation for product catalogs",
        "SEO-optimized output",
        "Image-to-text capabilities for product photos",
      ],
      weaknesses: [
        "Less versatile for non-commerce content",
        "Smaller community and fewer integrations",
      ],
      bestFor: [
        "product descriptions",
        "e-commerce content",
        "catalog management",
        "retail businesses",
        "inventory-based businesses",
      ],
      pricing: "Starter $29/mo; Growth $59/mo; Enterprise custom",
      freeOption: false,
    },
    {
      slug: "koala-ai",
      name: "KoalaWriter",
      tagline: "One-click SEO blog articles powered by real-time SERP data",
      strengths: [
        "One-click full blog article generation",
        "Uses real-time Google SERP data for SEO optimization",
        "Built-in Amazon affiliate content generation",
        "Automatic internal linking suggestions",
      ],
      weaknesses: [
        "Focused on blog content, less useful for other formats",
        "Quality varies with niche specificity",
      ],
      bestFor: [
        "SEO blog content",
        "long-form articles",
        "content marketing",
        "organic traffic growth",
        "affiliate content",
      ],
      pricing: "Essentials $9/mo; Professional $25/mo; Boost $49/mo",
      freeOption: false,
    },
    {
      slug: "byword",
      name: "Byword",
      tagline: "AI article generator producing publish-ready SEO content at scale",
      strengths: [
        "Generates full, publish-ready articles from a keyword",
        "Batch article generation for scaling content",
        "Programmatic SEO support",
        "Multilingual article generation",
      ],
      weaknesses: [
        "Less control over article structure than manual tools",
        "Credit-based system can get expensive at scale",
      ],
      bestFor: [
        "batch content production",
        "programmatic SEO",
        "scaling blog output",
        "multilingual content",
        "local SEO pages",
      ],
      pricing: "Starter $99/mo (25 articles); Standard $299/mo; Scale $999/mo",
      freeOption: false,
    },
    {
      slug: "textblaze",
      name: "Text Blaze",
      tagline: "Text expansion and template tool for eliminating repetitive typing",
      strengths: [
        "Saves hours on repetitive text entry with snippets and templates",
        "Dynamic fields and form fill capabilities",
        "Works across any website or application",
        "Team sharing for consistent communications",
      ],
      weaknesses: [
        "Not an AI content generator — focused on templates and expansion",
        "Requires upfront time to set up templates",
      ],
      bestFor: [
        "repetitive communications",
        "customer email responses",
        "form filling",
        "standard operating procedures",
        "intake forms and reports",
      ],
      pricing: "Free basic tier; Pro $2.99/mo; Business $6.99/mo",
      freeOption: true,
    },
    {
      slug: "writer",
      name: "Writer",
      tagline: "Enterprise AI writing platform with style guides and compliance",
      strengths: [
        "Enterprise-grade AI writing with style guide enforcement",
        "Compliance and terminology management",
        "Team-wide brand voice consistency",
        "Industry-specific content guidelines",
      ],
      weaknesses: [
        "Enterprise pricing not suitable for small businesses",
        "Requires setup and training for best results",
      ],
      bestFor: [
        "regulated industries",
        "brand consistency",
        "team-wide writing standards",
        "compliance-heavy content",
        "professional services",
      ],
      pricing: "Team $18/user/mo; Enterprise custom pricing",
      freeOption: false,
    },
    {
      slug: "novelai",
      name: "NovelAI",
      tagline: "AI storytelling and creative writing assistant",
      strengths: [
        "Exceptional for creative and narrative writing",
        "Advanced memory system for long stories",
        "AI image generation for visual content",
        "Highly customizable writing styles and tones",
      ],
      weaknesses: [
        "Not designed for business or marketing content",
        "Niche audience, less community support for business use",
      ],
      bestFor: [
        "creative content",
        "storytelling",
        "brand narratives",
        "unique marketing angles",
        "visual content ideas",
      ],
      pricing: "Tablet $10/mo; Scroll $15/mo; Opus $25/mo",
      freeOption: false,
    },
  ],
};

export const AI_CODE: CategoryProfile = {
  slug: "ai-code",
  name: "AI Code Assistants",
  tools: [
    {
      slug: "v0",
      name: "v0",
      tagline: "Vercel's AI UI builder that generates React and Next.js components",
      strengths: [
        "Generates production-ready React/Next.js UI from text descriptions",
        "Beautiful default designs with Tailwind CSS and shadcn/ui",
        "Real-time preview and iteration",
        "One-click deployment to Vercel",
      ],
      weaknesses: [
        "Limited to React/Next.js ecosystem",
        "Generated code may need refinement for complex business logic",
      ],
      bestFor: [
        "building websites and landing pages",
        "creating web apps without coding",
        "UI prototyping",
        "small business websites",
        "booking and portfolio pages",
      ],
      pricing: "Free tier available; Premium $20/mo",
      freeOption: true,
    },
    {
      slug: "bolt",
      name: "Bolt",
      tagline: "AI full-stack web app builder from StackBlitz",
      strengths: [
        "Builds complete full-stack web applications from text prompts",
        "In-browser development environment, no setup needed",
        "Supports multiple frameworks (React, Vue, Svelte)",
        "Includes database and API setup",
      ],
      weaknesses: [
        "Complex applications may need significant manual refinement",
        "Token-based usage can get expensive for large projects",
      ],
      bestFor: [
        "building web applications",
        "creating business tools",
        "internal dashboards",
        "customer portals",
        "booking systems",
      ],
      pricing: "Free tier; Pro $20/mo; Team $40/mo",
      freeOption: true,
    },
    {
      slug: "devin",
      name: "Devin",
      tagline: "Autonomous AI software engineer by Cognition",
      strengths: [
        "Autonomously plans, codes, debugs, and deploys software",
        "Can handle complex multi-step engineering tasks",
        "Learns from codebases and adapts to project patterns",
        "Reduces need for full-time developer hires",
      ],
      weaknesses: [
        "Premium pricing at $500/month",
        "Best suited for technical teams with existing dev processes",
      ],
      bestFor: [
        "businesses needing custom software",
        "automating development tasks",
        "building complex features",
        "technical businesses",
      ],
      pricing: "Starting at $500/mo for team access",
      freeOption: false,
    },
    {
      slug: "amazon-codewhisperer",
      name: "Amazon CodeWhisperer",
      tagline: "AWS AI code assistant (now Amazon Q Developer)",
      strengths: [
        "Deep AWS service integration for cloud applications",
        "Real-time code suggestions and completion",
        "Security scanning for vulnerabilities",
        "Free tier for individual developers",
      ],
      weaknesses: [
        "Best value only within AWS ecosystem",
        "Less capable than competitors for non-AWS code",
      ],
      bestFor: [
        "AWS-based applications",
        "cloud infrastructure",
        "security-conscious development",
        "enterprise applications",
      ],
      pricing: "Free for individuals; Professional $19/user/mo",
      freeOption: true,
    },
    {
      slug: "sourcegraph-cody",
      name: "Sourcegraph Cody",
      tagline: "AI coding assistant that understands your entire codebase",
      strengths: [
        "Understands entire codebase context, not just open files",
        "Powerful code search across repositories",
        "Explains unfamiliar code and generates documentation",
        "Works with VS Code and JetBrains IDEs",
      ],
      weaknesses: [
        "Most valuable with larger codebases",
        "Enterprise pricing for full features",
      ],
      bestFor: [
        "large codebase management",
        "code understanding",
        "developer onboarding",
        "documentation generation",
      ],
      pricing: "Free tier; Pro $9/mo; Enterprise custom",
      freeOption: true,
    },
    {
      slug: "aider",
      name: "Aider",
      tagline: "Terminal-based AI pair programming tool",
      strengths: [
        "Works directly in your terminal with git integration",
        "Supports multiple AI models (GPT-4, Claude, etc.)",
        "Automatic git commits for changes",
        "Open-source and highly customizable",
      ],
      weaknesses: [
        "Requires terminal/command-line comfort",
        "Requires bringing your own AI API key",
      ],
      bestFor: [
        "terminal-based development",
        "git-integrated workflows",
        "developers who prefer command-line tools",
        "open-source enthusiasts",
      ],
      pricing: "Free (open-source); requires own API key ($5-20/mo typical)",
      freeOption: true,
    },
    {
      slug: "continue-dev",
      name: "Continue",
      tagline: "Open-source AI code assistant for VS Code and JetBrains",
      strengths: [
        "Open-source with full customization",
        "Works with any AI model (local or cloud)",
        "IDE-native experience in VS Code and JetBrains",
        "Context-aware code suggestions",
      ],
      weaknesses: [
        "Requires more setup than commercial alternatives",
        "Performance depends on chosen AI model",
      ],
      bestFor: [
        "customizable AI coding",
        "privacy-focused development",
        "teams wanting model flexibility",
        "open-source advocates",
      ],
      pricing: "Free (open-source); model costs vary",
      freeOption: true,
    },
  ],
};

export const ALL_CATEGORIES: CategoryProfile[] = [AI_CHATBOTS, AI_WRITING, AI_CODE];

export function getCategoryProfile(slug: string): CategoryProfile | undefined {
  return ALL_CATEGORIES.find((c) => c.slug === slug);
}
