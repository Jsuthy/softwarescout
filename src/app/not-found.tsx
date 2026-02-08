import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[var(--fg-tertiary)]">404</h1>
      <p className="mt-4 text-lg text-[var(--fg-secondary)]">Page not found</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
      >
        Go Home
      </Link>
    </div>
  );
}
