"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/motion";

/** Below this distance (px) from the bar's centre line the cursor has pull. */
const REACH = 340;
/** Magnetic pull on a hovered label, as a fraction of the cursor offset. */
const MAGNET = 0.22;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * All of the desktop bar's motion in one place. Elements are found by
 * `data-fx` inside the nav root.
 *
 * The bar itself never moves — no entrance, parallax or scroll inertia;
 * all motion is local to the capsule and its labels:
 *
 * - Light: a specular sheen and a rim light track the cursor across the
 *   capsule, fading with the cursor's distance from the bar.
 * - Magnetic labels: a hovered label leans toward the cursor.
 *
 * Desktop + fine pointer only; with reduced motion nothing here runs.
 */
export function useDesktopNavMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fx = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-fx="${name}"]`);
    const surface = fx("surface");
    const list = fx("list");
    if (!surface || !list) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduced || !finePointer) return;

    // ── Capsule light + magnetic labels ─────────────────────────────────
    const prox = { v: 0 };
    const proxTo = gsap.quickTo(prox, "v", {
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => surface.style.setProperty("--prox", prox.v.toFixed(3)),
    });

    const magnets = new Map<HTMLElement, { x: gsap.QuickToFunc; y: gsap.QuickToFunc }>();
    const magnetFor = (el: HTMLElement) => {
      let m = magnets.get(el);
      if (!m) {
        m = {
          x: gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.6)" }),
          y: gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.6)" }),
        };
        magnets.set(el, m);
      }
      return m;
    };
    let magnetized: HTMLElement | null = null;
    const release = () => {
      if (!magnetized) return;
      const m = magnetFor(magnetized);
      m.x(0);
      m.y(0);
      magnetized = null;
    };

    let frame = 0;
    let px = 0;
    let py = 0;
    const update = () => {
      frame = 0;
      const rect = surface.getBoundingClientRect();
      const cy = rect.top + rect.height / 2;
      const p = clamp(1 - Math.max(0, Math.abs(py - cy) - rect.height / 2) / REACH, 0, 1);
      proxTo(p);
      surface.style.setProperty("--gx", `${px - rect.left}px`);
      surface.style.setProperty("--gy", `${py - rect.top}px`);

      // Magnet: only while the cursor is actually on a label.
      const hit = (document.elementFromPoint(px, py) as Element | null)?.closest<HTMLElement>("[data-magnet]");
      const target = hit && list.contains(hit) ? hit : null;
      if (magnetized !== target) release();
      magnetized = target;
      if (target) {
        const r = target.getBoundingClientRect();
        const m = magnetFor(target);
        m.x(clamp((px - (r.left + r.width / 2)) * MAGNET, -6, 6));
        m.y(clamp((py - (r.top + r.height / 2)) * MAGNET, -3, 3));
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeaveWindow = () => {
      proxTo(0);
      release();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      gsap.killTweensOf([prox, ...magnets.keys()]);
    };
  }, [rootRef]);
}
