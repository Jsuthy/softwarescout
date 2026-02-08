"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

export function Header() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white text-sm font-bold">
              S
            </span>
            <span className="hidden sm:inline">SoftwareScout</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--fg-secondary)]">
            <Link href="/categories" className="transition-colors hover:text-[var(--fg)]">
              Categories
            </Link>
          </nav>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-secondary)] transition-colors hover:bg-[var(--bg-secondary)] md:hidden"
            aria-label="Menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] p-4 md:hidden">
          <div className="mb-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="text-[var(--fg-secondary)] hover:text-[var(--fg)]">
              Categories
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
