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
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function platformLabel(platform: Platform) {
  return platform === "x" ? "X" : platform === "devto" ? "Dev.to" : "Medium";
}
