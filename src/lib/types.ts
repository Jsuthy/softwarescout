export interface Category {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string | null;
  website_url: string;
  affiliate_link: string | null;
  category_slug: string;
  features: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  pricing_starts_at: number | null;
  pricing_tiers: PricingTier[] | null;
  created_at: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features?: string[];
}

export interface Click {
  id: string;
  tool_slug: string;
  created_at: string;
  user_agent: string | null;
  referer: string | null;
  ip_address: string | null;
}

export interface Comparison {
  id: string;
  tool_a_slug: string;
  tool_b_slug: string;
  category_slug: string;
  tool_a_overview: string;
  tool_b_overview: string;
  feature_comparison: FeatureComparison[];
  pricing_comparison: string;
  verdict: Verdict;
  created_at: string;
}

export interface FeatureComparison {
  feature?: string;
  tool_a: string;
  tool_b: string;
}

export interface Verdict {
  choose_a_if: string;
  choose_b_if: string;
  summary?: string;
}

export interface CategoryWithCount extends Category {
  tool_count: number;
}

export interface IndustryPageRecommendation {
  tool_slug: string;
  tool_name: string;
  why_it_works: string;
  use_cases: string[];
  pros: string[];
  cons: string[];
  pricing_note: string;
}

export interface IndustryPageFAQ {
  question: string;
  answer: string;
}

export interface IndustryPage {
  id: string;
  slug: string;
  software_category: string;
  industry: string;
  title: string;
  meta_description: string;
  intro: string;
  buying_guide: string;
  recommendations: IndustryPageRecommendation[];
  faq: IndustryPageFAQ[];
  created_at: string;
}

export interface Lead {
  id: string;
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  budget: string | null;
  requirements: string[];
  software_category: string;
  matched_tools: { slug: string; name: string; score: number }[];
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
}
