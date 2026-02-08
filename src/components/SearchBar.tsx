"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <svg
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-tertiary)] ${large ? "w-5 h-5" : "w-4 h-4"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search 621 tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--fg)] placeholder:text-[var(--fg-tertiary)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${
          large ? "py-4 pl-12 pr-4 text-lg" : "py-2 pl-10 pr-4 text-sm"
        }`}
      />
    </form>
  );
}
