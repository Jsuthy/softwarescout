import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-chatbots", [
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
], "AI Chatbots — Batch C (Industries 21-30)").catch(console.error);
