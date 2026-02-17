import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-code", [
  "painting-contractors",
  "pressure-washing",
  "home-inspectors",
  "music-schools",
  "dance-studios",
  "dry-cleaners",
  "print-shops",
  "pharmacies",
  "event-planners",
  "nonprofit-organizations",
], "AI Code — Batch E (Industries 41-51)").catch(console.error);
