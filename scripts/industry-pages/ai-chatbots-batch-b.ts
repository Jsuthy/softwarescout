import { runIndustryBatch } from "./run-batch";

runIndustryBatch("ai-chatbots", [
  "yoga-studios",
  "pet-grooming",
  "veterinary-clinics",
  "cleaning-services",
  "roofing",
  "electricians",
  "moving-companies",
  "tutoring",
  "daycares",
  "restaurants",
], "AI Chatbots — Batch B (Industries 11-20)").catch(console.error);
