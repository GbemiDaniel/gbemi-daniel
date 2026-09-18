import type { Platform } from "@/lib/writing";

export default function PlatformBadge({ platform, size = 12 }: { platform: Platform; size?: number }) {
  if (platform === "x") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (platform === "devto") {
    return <span className="font-bold">dev</span>;
  }
  if (platform === "linkedin") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="9" width="4" height="12" fill="currentColor" />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
        <path
          d="M10 9h4v2.1c.9-1.4 2.4-2.4 4.3-2.4 3.7 0 4.7 2.4 4.7 5.6V21h-4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.6-2.3 3.1V21h-4V9z"
          fill="currentColor"
        />
      </svg>
    );
  }
  // Medium fallback
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Full platform name for prose contexts (e.g. "Read the full piece on X"). */
export function platformName(platform: Platform) {
  if (platform === "x") return "X";
  if (platform === "devto") return "Dev.to";
  if (platform === "linkedin") return "LinkedIn";
  return "Medium";
}
