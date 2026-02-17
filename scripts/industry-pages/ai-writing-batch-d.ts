import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-writing", [
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
], "AI Writing — Batch D (Industries 31-40)").catch(console.error);
