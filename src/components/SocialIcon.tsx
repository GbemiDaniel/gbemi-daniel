export type SocialNetwork = "x" | "linkedin" | "github" | "behance";

const DEFAULT_HREFS: Record<SocialNetwork, string> = {
  x: "https://x.com/adamsdaniel043",
  linkedin: "https://www.linkedin.com/in/gbemi-daniel",
  github: "https://github.com/GbemiDaniel",
  behance: "#",
};

const LABELS: Record<SocialNetwork, string> = {
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  github: "GitHub",
  behance: "Behance",
};

export default function SocialIcon({
  network,
  href,
  size = 36,
}: {
  network: SocialNetwork;
  href?: string;
  size?: number;
}) {
  const iconSize = Math.round(size * 0.42);

  return (
    <a
      href={href ?? DEFAULT_HREFS[network]}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={LABELS[network]}
      style={{ width: size, height: size, minWidth: size }}
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/18 text-ink/60 transition-[border-color,background,color,transform] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-accent hover:bg-accent/8 hover:text-accent"
    >
      {network === "x" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill="currentColor"
          />
        </svg>
      )}
      {network === "linkedin" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="9" width="4" height="12" fill="currentColor" />
          <circle cx="4" cy="4" r="2" fill="currentColor" />
          <path
            d="M10 9h4v2.1c.9-1.4 2.4-2.4 4.3-2.4 3.7 0 4.7 2.4 4.7 5.6V21h-4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.6-2.3 3.1V21h-4V9z"
            fill="currentColor"
          />
        </svg>
      )}
      {network === "github" && (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {network === "behance" && (
        <span
          className="font-mono font-bold leading-none tracking-[-0.02em]"
          style={{ fontSize: iconSize }}
        >
          Be
        </span>
      )}
    </a>
  );
}
