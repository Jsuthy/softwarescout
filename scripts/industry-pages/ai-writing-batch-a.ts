import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-writing", [
  "landscaping",
  "food-trucks",
  "dental-practices",
  "real-estate-agents",
  "plumbing",
  "hvac",
  "auto-repair",
  "salons",
  "photography",
  "personal-trainers",
], "AI Writing — Batch A (Industries 1-10)").catch(console.error);
