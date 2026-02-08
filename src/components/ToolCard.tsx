import Link from "next/link";
import type { Tool } from "@/lib/types";

export function ToolCard({ tool }: { tool: Tool }) {
  const features = tool.features?.slice(0, 3) || [];
  const price =
    tool.pricing_starts_at !== null && tool.pricing_starts_at !== undefined
      ? tool.pricing_starts_at === 0
        ? "Free"
        : `From $${tool.pricing_starts_at}/mo`
      : null;

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        {tool.logo_url ? (
          <img
            src={tool.logo_url}
            alt={tool.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] font-bold text-sm">
            {tool.name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors truncate">
            {tool.name}
          </h3>
          {price && (
            <span className="text-xs text-[var(--fg-tertiary)]">{price}</span>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-[var(--fg-secondary)] line-clamp-2 leading-relaxed">
        {tool.description}
      </p>
      {features.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {features.map((f) => (
            <span
              key={f}
              className="rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--fg-secondary)]"
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
