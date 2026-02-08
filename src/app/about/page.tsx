import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - SoftwareScout",
  description: "SoftwareScout is an independent software comparison platform that helps businesses find the right tools.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">About SoftwareScout</h1>

      <div className="mt-8 space-y-6 text-[var(--fg-secondary)] text-sm leading-relaxed">
        <p className="text-base">
          SoftwareScout is an independent software comparison platform that helps businesses find the
          right tools. We research, compare, and review SaaS products across 25+ categories to help
          you make informed decisions.
        </p>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-lg font-semibold text-[var(--fg)]">What We Do</h2>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span>Research and catalog 600+ SaaS tools across 25+ categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span>Provide detailed feature breakdowns and pricing information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span>Offer side-by-side comparisons so you can evaluate your options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span>Keep information updated regularly to reflect the latest changes</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Our Independence</h2>
          <p className="mt-2">
            SoftwareScout is not affiliated with any software vendor. Our goal is to provide unbiased,
            honest information to help you make the best choice for your business. While some links on
            our site are affiliate links, this never influences our reviews or comparisons.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Contact</h2>
          <p className="mt-2">
            Have questions or suggestions? Reach out to us at{" "}
            <a href="mailto:admin@softwarescout.xyz" className="text-[var(--accent)] hover:underline">
              admin@softwarescout.xyz
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
