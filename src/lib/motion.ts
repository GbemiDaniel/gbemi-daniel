import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP's built-in expo-out — the closest stock ease to the
 * cubic-bezier(0.16, 1, 0.3, 1) used throughout CSS transitions, without
 * relying on CustomEase (a registered, string-keyed plugin ease that adds a
 * failure mode a built-in ease doesn't have: nothing to register, nothing
 * that can silently fail to resolve). This is also what this codebase's
 * scroll-reveal animations used successfully before this pass — same ease,
 * one shared place instead of being redeclared per component.
 */
export const HOUSE_EASE = "power3.out";

/** The CSS-side curve, for inline styles and Tailwind arbitrary values. */
export const HOUSE_EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export { gsap, ScrollTrigger };
