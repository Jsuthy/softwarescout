import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-code", [
  "coffee-shops",
  "bakeries",
  "catering",
  "florists",
  "wedding-planners",
  "fitness-studios",
  "martial-arts-schools",
  "chiropractic",
  "optometry",
  "therapy-practices",
], "AI Code — Batch C (Industries 21-30)").catch(console.error);
