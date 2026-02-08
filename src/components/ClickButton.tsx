"use client";

export function ClickButton({
  toolSlug,
  href,
  children,
  className,
}: {
  toolSlug: string;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const handleClick = async () => {
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_slug: toolSlug }),
      });
    } catch {
      // fire and forget
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
