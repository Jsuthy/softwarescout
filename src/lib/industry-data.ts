export interface CategoryDef {
  slug: string;
  name: string;
  dbCategorySlug: string;
}

export interface IndustryDef {
  slug: string;
  name: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "crm", name: "CRM", dbCategorySlug: "crm" },
  { slug: "email-marketing", name: "Email Marketing", dbCategorySlug: "email-marketing" },
  { slug: "project-management", name: "Project Management", dbCategorySlug: "project-management" },
  { slug: "accounting", name: "Accounting", dbCategorySlug: "accounting" },
  { slug: "scheduling", name: "Scheduling", dbCategorySlug: "scheduling" },
  { slug: "social-media-management", name: "Social Media Management", dbCategorySlug: "social-media" },
  { slug: "website-builders", name: "Website Builders", dbCategorySlug: "website-builders" },
  { slug: "ecommerce", name: "Ecommerce", dbCategorySlug: "ecommerce" },
  { slug: "customer-support", name: "Customer Support", dbCategorySlug: "customer-support" },
  { slug: "hr-recruiting", name: "HR & Recruiting", dbCategorySlug: "hr-recruiting" },
  { slug: "video-conferencing", name: "Video Conferencing", dbCategorySlug: "video-conferencing" },
  { slug: "design-tools", name: "Design Tools", dbCategorySlug: "design-tools" },
  { slug: "analytics", name: "Analytics", dbCategorySlug: "analytics" },
  { slug: "marketing-automation", name: "Marketing Automation", dbCategorySlug: "marketing-automation" },
  { slug: "cloud-storage", name: "Cloud Storage", dbCategorySlug: "cloud-storage" },
  { slug: "seo-tools", name: "SEO Tools", dbCategorySlug: "seo-tools" },
  { slug: "developer-tools", name: "Developer Tools", dbCategorySlug: "developer-tools" },
  { slug: "communication", name: "Communication", dbCategorySlug: "communication" },
  { slug: "vpn", name: "VPN", dbCategorySlug: "vpn" },
  { slug: "learning-management", name: "Learning Management", dbCategorySlug: "course-platforms" },
  { slug: "ai-tools", name: "AI Tools", dbCategorySlug: "ai-tools" },
  { slug: "hosting", name: "Hosting", dbCategorySlug: "hosting" },
  { slug: "password-managers", name: "Password Managers", dbCategorySlug: "password-managers" },
  { slug: "form-builders", name: "Form Builders", dbCategorySlug: "form-builders" },
  { slug: "nocode-tools", name: "No-Code Tools", dbCategorySlug: "nocode-tools" },
  { slug: "ai-writing", name: "AI Writing Tools", dbCategorySlug: "ai-writing" },
  { slug: "ai-image", name: "AI Image Generation", dbCategorySlug: "ai-image" },
  { slug: "ai-code", name: "AI Code Assistants", dbCategorySlug: "ai-code" },
  { slug: "ai-marketing", name: "AI Marketing Tools", dbCategorySlug: "ai-marketing" },
  { slug: "ai-video", name: "AI Video Tools", dbCategorySlug: "ai-video" },
  { slug: "ai-voice", name: "AI Voice & Audio", dbCategorySlug: "ai-voice" },
  { slug: "ai-chatbots", name: "AI Chatbots & Assistants", dbCategorySlug: "ai-chatbots" },
  { slug: "ai-data", name: "AI Data & Analytics", dbCategorySlug: "ai-data" },
  { slug: "ai-customer-service", name: "AI Customer Service", dbCategorySlug: "ai-customer-service" },
  { slug: "ai-productivity", name: "AI Productivity Tools", dbCategorySlug: "ai-productivity" },
];

export const INDUSTRIES: IndustryDef[] = [
  { slug: "landscaping", name: "Landscaping" },
  { slug: "food-trucks", name: "Food Trucks" },
  { slug: "dental-practices", name: "Dental Practices" },
  { slug: "real-estate-agents", name: "Real Estate Agents" },
  { slug: "plumbing", name: "Plumbing" },
  { slug: "hvac", name: "HVAC" },
  { slug: "auto-repair", name: "Auto Repair" },
  { slug: "salons", name: "Salons" },
  { slug: "photography", name: "Photography" },
  { slug: "personal-trainers", name: "Personal Trainers" },
  { slug: "yoga-studios", name: "Yoga Studios" },
  { slug: "pet-grooming", name: "Pet Grooming" },
  { slug: "veterinary-clinics", name: "Veterinary Clinics" },
  { slug: "cleaning-services", name: "Cleaning Services" },
  { slug: "roofing", name: "Roofing" },
  { slug: "electricians", name: "Electricians" },
  { slug: "moving-companies", name: "Moving Companies" },
  { slug: "tutoring", name: "Tutoring" },
  { slug: "daycares", name: "Daycares" },
  { slug: "restaurants", name: "Restaurants" },
  { slug: "coffee-shops", name: "Coffee Shops" },
  { slug: "bakeries", name: "Bakeries" },
  { slug: "catering", name: "Catering" },
  { slug: "florists", name: "Florists" },
  { slug: "wedding-planners", name: "Wedding Planners" },
  { slug: "fitness-studios", name: "Fitness Studios" },
  { slug: "martial-arts-schools", name: "Martial Arts Schools" },
  { slug: "chiropractic", name: "Chiropractic" },
  { slug: "optometry", name: "Optometry" },
  { slug: "therapy-practices", name: "Therapy Practices" },
  { slug: "law-firms", name: "Law Firms" },
  { slug: "accounting-firms", name: "Accounting Firms" },
  { slug: "insurance-agencies", name: "Insurance Agencies" },
  { slug: "property-management", name: "Property Management" },
  { slug: "construction", name: "Construction" },
  { slug: "interior-design", name: "Interior Design" },
  { slug: "tattoo-shops", name: "Tattoo Shops" },
  { slug: "car-washes", name: "Car Washes" },
  { slug: "pest-control", name: "Pest Control" },
  { slug: "tree-service", name: "Tree Service" },
  { slug: "painting-contractors", name: "Painting Contractors" },
  { slug: "pressure-washing", name: "Pressure Washing" },
  { slug: "home-inspectors", name: "Home Inspectors" },
  { slug: "music-schools", name: "Music Schools" },
  { slug: "dance-studios", name: "Dance Studios" },
  { slug: "dry-cleaners", name: "Dry Cleaners" },
  { slug: "print-shops", name: "Print Shops" },
  { slug: "pharmacies", name: "Pharmacies" },
  { slug: "event-planners", name: "Event Planners" },
  { slug: "nonprofit-organizations", name: "Nonprofit Organizations" },
];

export function buildIndustryPageSlug(categorySlug: string, industrySlug: string): string {
  return `${categorySlug}-for-${industrySlug}`;
}

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getIndustryBySlug(slug: string): IndustryDef | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}

export function getIndustryName(slug: string): string {
  return getIndustryBySlug(slug)?.name ?? slug;
}
