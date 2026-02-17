import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-writing", [
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
], "AI Writing — Batch E (Industries 41-51)").catch(console.error);
