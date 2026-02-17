import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-chatbots", [
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
], "AI Chatbots — Batch A (Industries 1-10)").catch(console.error);
