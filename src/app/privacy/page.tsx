import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SoftwareScout",
  description: "Privacy Policy for SoftwareScout, a software comparison platform by The Sutherland Legacy.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--fg-tertiary)]">Last updated: February 8, 2026</p>

      <div className="mt-8 space-y-8 text-[var(--fg-secondary)] text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">1. Introduction</h2>
          <p className="mt-2">
            The Sutherland Legacy (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates SoftwareScout
            (softwarescout.xyz). This Privacy Policy explains how we collect, use, and protect your
            information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">2. Information We Collect</h2>
          <p className="mt-2">We may collect the following types of information:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, browser type, device type, and referring URLs.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to analyze traffic and improve your experience.</li>
            <li><strong>Information You Provide:</strong> If you contact us via email at admin@softwarescout.xyz, we collect the information you include in your message.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>To operate, maintain, and improve our website</li>
            <li>To analyze usage patterns and optimize content</li>
            <li>To respond to your inquiries</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">4. Affiliate Links and Third Parties</h2>
          <p className="mt-2">
            Our website contains affiliate links to third-party software products. When you click on these
            links and make a purchase, we may earn a commission at no extra cost to you. These third-party
            sites have their own privacy policies, which we encourage you to review. We are not responsible
            for the privacy practices of external websites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">5. Cookies</h2>
          <p className="mt-2">
            We use cookies to store your preferences (such as theme settings) and to collect analytics data.
            You can control cookies through your browser settings. Disabling cookies may affect some
            functionality of the website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">6. Data Sharing</h2>
          <p className="mt-2">
            We do not sell your personal information. We may share anonymized, aggregated data with analytics
            providers to help us understand website usage. We may also disclose information if required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">7. Data Security</h2>
          <p className="mt-2">
            We take reasonable measures to protect your information from unauthorized access, alteration, or
            destruction. However, no method of internet transmission is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">8. Children&apos;s Privacy</h2>
          <p className="mt-2">
            Our website is not directed at children under 13. We do not knowingly collect personal information
            from children under 13. If you believe we have collected such information, please contact us so we
            can delete it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">9. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an
            updated revision date. Your continued use of the website after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--fg)]">10. Contact Us</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:admin@softwarescout.xyz" className="text-[var(--accent)] hover:underline">
              admin@softwarescout.xyz
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
