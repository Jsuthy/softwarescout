import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white text-sm font-bold">
                S
              </span>
              SoftwareScout
            </Link>
            <p className="mt-3 text-sm text-[var(--fg-secondary)]">
              Find and compare the best software tools for your business.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-tertiary)]">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/categories" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">All Categories</Link></li>
              <li><Link href="/search" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">Search Tools</Link></li>
              <li><Link href="/about" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--fg-tertiary)]">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--fg-tertiary)] text-center">
            Some links on this site are affiliate links. We may earn a commission if you make a purchase, at no extra cost to you.
          </p>
          <p className="mt-3 text-xs text-[var(--fg-tertiary)] text-center">
            &copy; {new Date().getFullYear()} SoftwareScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
