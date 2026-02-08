CREATE TABLE industry_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  software_category TEXT NOT NULL,
  industry TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  intro TEXT NOT NULL,
  buying_guide TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_industry_pages_cat_industry ON industry_pages(software_category, industry);
