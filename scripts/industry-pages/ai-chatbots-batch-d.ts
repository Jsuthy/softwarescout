import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-chatbots", [
  "law-firms",
  "accounting-firms",
  "insurance-agencies",
  "property-management",
  "construction",
  "interior-design",
  "tattoo-shops",
  "car-washes",
  "pest-control",
  "tree-service",
], "AI Chatbots — Batch D (Industries 31-40)").catch(console.error);
