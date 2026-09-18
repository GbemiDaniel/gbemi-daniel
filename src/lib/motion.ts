import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // GSAP times tweens by wall clock, not frame count. Its default lag
  // smoothing only kicks in above a 500ms stall, so a shorter main-thread
  // freeze (hydration, a route swap, GC) still lets a tween's clock run the
  // whole time it's blocked — the first frame painted after the freeze can
  // already show the tween finished, which reads as "no animation played."
  // Smoothing anything past 150ms (capping it to a 33ms step, like a single
  // dropped frame) keeps a stall from silently eating the whole animation.
  gsap.ticker.lagSmoothing(150, 33);
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
