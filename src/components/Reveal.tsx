"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, HOUSE_EASE } from "@/lib/motion";

/**
 * Fades + rises children into view on scroll. Pass `stagger` to animate
 * each direct child in sequence instead of the wrapper as one block.
 *
 * Staggered children each get their own ScrollTrigger (via
 * ScrollTrigger.batch) rather than sharing one trigger tied to the wrapper.
 * A wrapper-level trigger fires once for every child at once, so in a
 * multi-row grid a second row (still below the fold) would animate — and
 * often finish animating — before it's actually been scrolled into view.
 * Batching still staggers children that cross the threshold together; it
 * just lets a child that arrives later wait for its own turn.
 *
 * Respects prefers-reduced-motion (renders statically visible instead).
 */
export default function Reveal({
  children,
  className,
  y = 24,
  duration = 0.7,
  delay = 0,
  stagger,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (stagger) {
        const targets = Array.from(el.children);
        // ScrollTrigger.batch's onEnter only runs once a target crosses the
        // threshold — unlike a tween with an attached scrollTrigger, it
        // doesn't pre-render the "from" state on its own. Without this,
        // targets sit fully visible from first paint and only snap to
        // hidden right as onEnter fires, which for anything already inside
        // the "top 88%" band at load (most of a short page) happens on the
        // very next tick — reading as no animation at all rather than a
        // scroll-triggered fade.
        gsap.set(targets, { opacity: 0, y });
        ScrollTrigger.batch(targets, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration, delay, stagger, ease: HOUSE_EASE }),
        });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: HOUSE_EASE,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, [y, duration, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
