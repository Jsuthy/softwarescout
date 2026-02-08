import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SoftwareScout",
  description: "Terms of Service for SoftwareScout, a software comparison platform by The Sutherland Legacy.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--fg-tertiary)]">Last updated: February 8, 2026</p>

      <div className="mt-8 space-y-8 text-[var(--fg-secondary)] text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing and using SoftwareScout (softwarescout.xyz), operated by The Sutherland Legacy,
            you agree to be bound by these Terms of Service. If you do not agree to these terms, please
            do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">2. Description of Service</h2>
          <p className="mt-2">
            SoftwareScout is a software comparison and review platform that provides information about
            SaaS products, including features, pricing, and side-by-side comparisons. Our content is
            provided for informational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">3. Accuracy of Information</h2>
          <p className="mt-2">
            We strive to provide accurate and up-to-date information about software products. However,
            pricing, features, and availability are subject to change by the respective software vendors.
            We do not guarantee the accuracy, completeness, or timeliness of any information on this site.
            Always verify details directly with the software vendor before making a purchase decision.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">4. Affiliate Disclosure</h2>
          <p className="mt-2">
            Some links on SoftwareScout are affiliate links. This means we may earn a commission if you
            click on a link and make a purchase, at no additional cost to you. Affiliate relationships
            do not influence our reviews or comparisons. We are committed to providing honest, unbiased
            information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">5. Intellectual Property</h2>
          <p className="mt-2">
            All content on SoftwareScout, including text, graphics, logos, and software, is the property
            of The Sutherland Legacy or its content suppliers and is protected by intellectual property
            laws. You may not reproduce, distribute, or create derivative works from our content without
            express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">6. User Conduct</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to interfere with the proper functioning of the website</li>
            <li>Scrape, crawl, or use automated means to access the website without permission</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">7. Third-Party Links</h2>
          <p className="mt-2">
            Our website contains links to third-party websites and services. We are not responsible for
            the content, privacy practices, or terms of any third-party sites. Accessing third-party
            links is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">8. Disclaimer of Warranties</h2>
          <p className="mt-2">
            SoftwareScout is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either
            express or implied. We disclaim all warranties, including implied warranties of merchantability,
            fitness for a particular purpose, and non-infringement. We do not warrant that the website will
            be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">9. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, The Sutherland Legacy shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising from your use of
            the website, including any decisions made based on information provided on the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">10. Changes to These Terms</h2>
          <p className="mt-2">
            We reserve the right to modify these Terms of Service at any time. Changes will be posted on
            this page with an updated revision date. Your continued use of the website after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">11. Contact Us</h2>
          <p className="mt-2">
            If you have questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:admin@softwarescout.xyz" className="text-[var(--accent)] hover:underline">
              admin@softwarescout.xyz
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
