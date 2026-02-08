# SoftwareScout

A SaaS comparison directory with 621+ tools across 29 categories. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

**Live:** [softwarescout.xyz](https://softwarescout.xyz)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Features

- 621 tools across 29 categories with full-text search
- 116 AI-generated side-by-side comparisons with verdicts
- Static generation (SSG) for all tool/category/comparison pages (834 pages)
- 1-hour ISR revalidation for fresh data
- Dark mode default with light mode toggle
- Click tracking for affiliate/website links
- SEO: meta tags, Open Graph, JSON-LD schema, auto-generated sitemap
- Mobile responsive

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — search, categories, featured tools, recent comparisons |
| `/categories` | All categories grid with tool counts |
| `/category/[slug]` | Category page with tool cards |
| `/tool/[slug]` | Tool detail — features, pros/cons, pricing, alternatives |
| `/compare/[a]-vs-[b]` | Side-by-side comparison with feature table and verdict |
| `/search?q=...` | Full-text search results |

## Setup

```bash
npm install
cp .env.local.example .env.local  # Add your Supabase credentials
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Deploy

```bash
vercel
```
