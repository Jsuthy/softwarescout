"use client";

import { useState } from "react";
import { CATEGORIES, INDUSTRIES } from "@/lib/industry-data";

interface LeadCaptureProps {
  softwareCategory?: string; // DB category slug (e.g. "crm")
  categoryDisplayName?: string; // Display name (e.g. "CRM")
  industry?: string; // Industry slug for auto-fill
  industryDisplayName?: string;
  sourcePage?: string;
}

const REQUIREMENT_OPTIONS = [
  { id: "ease-of-use", label: "Ease of Use" },
  { id: "integrations", label: "Integrations" },
  { id: "mobile-app", label: "Mobile App" },
  { id: "customer-support", label: "Customer Support" },
  { id: "scalability", label: "Scalability" },
  { id: "free-trial", label: "Free Trial" },
  { id: "api-access", label: "API Access" },
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "200+", label: "200+ employees" },
];

const BUDGET_OPTIONS = [
  { value: "free", label: "Free only" },
  { value: "under-50", label: "Under $50/mo" },
  { value: "50-200", label: "$50-200/mo" },
  { value: "200-plus", label: "$200+/mo" },
];

const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "live.com",
  "msn.com",
];

export function LeadCapture({
  softwareCategory,
  categoryDisplayName,
  industry,
  industryDisplayName,
  sourcePage,
}: LeadCaptureProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matchedTools, setMatchedTools] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Form state
  const [category, setCategory] = useState(softwareCategory || "");
  const [selectedIndustry, setSelectedIndustry] = useState(industry || "");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");

  const totalSteps = 4;

  function toggleRequirement(id: string) {
    setRequirements((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  function validateEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    const domain = value.split("@")[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      setEmailError("Please use your work email address");
      return false;
    }
    setEmailError("");
    return true;
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return category !== "";
      case 2:
        return companySize !== "" && budget !== "";
      case 3:
        return requirements.length > 0;
      case 4:
        return name.trim() !== "" && email.trim() !== "" && emailError === "";
      default:
        return false;
    }
  }

  async function handleSubmit() {
    if (!validateEmail(email)) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          software_category: category,
          industry: selectedIndustry || null,
          company_name: companyName || null,
          company_size: companySize,
          budget,
          requirements,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          source_page: sourcePage || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      setMatchedTools(data.matched_tools || []);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="my-12 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <svg
            className="h-8 w-8 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">You&apos;re all set!</h3>
        <p className="mt-2 text-[var(--fg-secondary)]">
          We&apos;ll email your personalized top 3 picks within 24 hours.
        </p>
        {matchedTools.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-[var(--fg-tertiary)]">
              Preview of your matches
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {matchedTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg bg-[var(--accent-muted)] px-3 py-1.5 text-sm font-medium text-[var(--accent)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-12 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-5 sm:px-8">
        <h3 className="text-lg font-bold">Get Your Free Software Recommendation</h3>
        <p className="mt-1 text-sm text-[var(--fg-secondary)]">
          Answer a few quick questions and we&apos;ll match you with the perfect tools
        </p>
        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  background:
                    i + 1 <= step ? "var(--accent)" : "var(--border)",
                }}
              />
            </div>
          ))}
          <span className="ml-2 text-xs text-[var(--fg-tertiary)]">
            {step}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="px-6 py-6 sm:px-8">
        {/* Step 1: Software Category */}
        {step === 1 && (
          <div>
            <label className="mb-1 block text-sm font-semibold">
              What type of software are you looking for?
            </label>
            <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
              Select the category that best fits your needs
            </p>
            {softwareCategory ? (
              <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-muted)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--accent)]">
                  {categoryDisplayName ||
                    CATEGORIES.find((c) => c.dbCategorySlug === softwareCategory || c.slug === softwareCategory)?.name ||
                    softwareCategory}
                </span>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.dbCategorySlug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Tell us about your business
              </label>
              <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
                This helps us find software that fits your scale
              </p>
            </div>

            {!industry && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="">Select your industry (optional)...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.slug} value={ind.slug}>
                      {ind.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {industry && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                  Industry
                </label>
                <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-muted)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {industryDisplayName || industry}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name (optional)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm transition-colors placeholder:text-[var(--fg-tertiary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                Company Size *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setCompanySize(size.value)}
                    className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                      companySize === size.value
                        ? "border-[var(--accent)] bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                Monthly Budget *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setBudget(b.value)}
                    className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                      budget === b.value
                        ? "border-[var(--accent)] bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Requirements */}
        {step === 3 && (
          <div>
            <label className="mb-1 block text-sm font-semibold">
              What matters most to you?
            </label>
            <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
              Select all that apply — this helps us rank the best matches
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {REQUIREMENT_OPTIONS.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => toggleRequirement(req.id)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    requirements.includes(req.id)
                      ? "border-[var(--accent)] bg-[var(--accent-muted)] font-medium text-[var(--accent)]"
                      : "border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-all ${
                      requirements.includes(req.id)
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {requirements.includes(req.id) && (
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  {req.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Contact Info */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Where should we send your recommendations?
              </label>
              <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
                We&apos;ll email your personalized picks — no spam, ever
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm transition-colors placeholder:text-[var(--fg-tertiary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                Work Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => {
                  if (email) validateEmail(email);
                }}
                placeholder="jane@company.com"
                className={`w-full rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm transition-colors placeholder:text-[var(--fg-tertiary)] focus:outline-none ${
                  emailError
                    ? "border-red-400 focus:border-red-400"
                    : "border-[var(--border)] focus:border-[var(--accent)]"
                }`}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--fg-secondary)]">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567 (optional)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm transition-colors placeholder:text-[var(--fg-tertiary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with navigation */}
      <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-4 sm:px-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--fg-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className="rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Finding your matches..." : "Get My Recommendations"}
          </button>
        )}
      </div>
    </div>
  );
}
