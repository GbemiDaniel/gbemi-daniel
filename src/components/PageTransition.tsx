"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, HOUSE_EASE } from "@/lib/motion";

/**
 * Fades + rises each page's content in on navigation. `template.tsx`
 * remounts this on every route change, so the animation replays per page.
 *
 * Targets `#main-content` specifically rather than animating its own
 * wrapper: every page already gives its content area that id, while Nav,
 * the scroll rail, and the back-to-top button are siblings of it, not
 * descendants. Animating a `transform` on an ancestor of a `position: fixed`
 * element temporarily turns that ancestor into the fixed element's
 * containing block (a CSS spec quirk), which would yank Nav's mobile bar
 * and the other fixed UI out of their normal viewport-relative position for
 * the animation's duration. Targeting `#main-content` keeps all of that
 * untouched.
 *
 * `#main-content` isn't always there yet on mount — a page that fetches
 * data (e.g. /blog, /article) can render `loading.tsx`'s Suspense fallback
 * first, which has no `#main-content` of its own. Falling back to animating
 * the wrapper in that case previously broke `loading.tsx`'s own
 * `fixed inset-0` centering (same containing-block issue described above,
 * hitting the loader itself) and left it fading in when it's designed to
 * paint instantly. Instead, when `#main-content` isn't there yet, this
 * leaves the fallback alone and watches for the real content to swap in via
 * MutationObserver, animating it the moment it actually appears.
 *
 * Enter-only: there's no exit animation for the outgoing page. React's
 * `<ViewTransition>` would give that for free, but it isn't available in
 * this project's React build yet — and there's no visible gap between old
 * and new content during a client-side navigation, so the arriving fade
 * covers most of what a transition needs to feel intentional.
 *
 * Skips the very first mount (the initial page load) rather than every one:
 * this component's effect can fire before that first server-rendered tree
 * has finished hydrating. Animating the raw DOM at that point sets an
 * inline style React doesn't know about, which then trips a hydration
 * mismatch. It's also the semantically right call regardless — a page
 * transition is for arriving *from* a previous page, which the first load
 * never has. `hasMounted` lives at module scope so it persists across the
 * remounts every later navigation causes, only ever true once per session.
 */
let hasMounted = false;

export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!hasMounted) {
      hasMounted = true;
      return;
    }

    const animate = (target: HTMLElement) => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: HOUSE_EASE, clearProps: "transform" }
      );
    };

    const existing = wrapper.querySelector<HTMLElement>("#main-content");
    if (existing) {
      animate(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const target = wrapper.querySelector<HTMLElement>("#main-content");
      if (target) {
        observer.disconnect();
        animate(target);
      }
    });
    observer.observe(wrapper, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
