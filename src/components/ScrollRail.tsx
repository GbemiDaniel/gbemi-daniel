"use client";

import { useEffect, useRef, useState } from "react";

const textShadow = "[text-shadow:0_1px_4px_rgba(0,0,0,0.7)]";

/**
 * Fixed right-edge rail: a live section counter plus a scroll hint — the
 * page's counterpart to the custom scrollbar. Counts whatever
 * [data-section-index] elements exist on the page it's mounted in, so a page
 * doesn't need to hand it a total; pages with none just skip the counter.
 * Every line carries its own drop shadow rather than a backdrop chip, so it
 * stays legible over whatever's directly behind it without changing look.
 */
export default function ScrollRail() {
  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    // Sorted by declared index rather than DOM order, so a page that
    // doesn't happen to write its sections in numeric order still tracks
    // correctly — the numbers on screen are the source of truth, not markup
    // position.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section-index]"))
      .map((el) => ({ el, index: Number(el.getAttribute("data-section-index")) }))
      .filter((s) => Number.isFinite(s.index))
      .sort((a, b) => a.index - b.index);
    if (sections.length === 0) return;

    const firstIndex = sections[0].index;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY + window.innerHeight * 0.3;
        let current = firstIndex;
        for (const { el, index } of sections) {
          if (el.offsetTop <= y) current = index;
        }
        setActive(current);
        setTotal(sections.length);
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-1/2 right-7 z-50 hidden -translate-y-1/2 flex-col items-end min-[1025px]:flex">
      {total > 0 && (
        <>
          <div
            className={`text-right font-mono text-[10px] leading-[1.7] tracking-wider text-ink/65 ${textShadow}`}
          >
            {String(active).padStart(2, "0")}
            <br />/<br />
            {String(total).padStart(2, "0")}
          </div>
          <div className="my-3.5 mx-0.75 h-27.5 w-px bg-ink/25 shadow-[0_0_4px_rgba(0,0,0,0.6)]" />
        </>
      )}
      <div
        className={`text-right font-mono text-[9px] leading-[1.7] tracking-widest whitespace-nowrap text-ink/45 ${textShadow}`}
      >
        CREATIVE
        <br />
        <strong className="font-bold text-ink">DEVELOPER</strong>
        <br />/<br />
        FRONTEND
        <br />
        ENGINEER
      </div>
      <span className="my-4 mx-0.75 h-1 w-1 rounded-full bg-accent shadow-[0_0_4px_rgba(0,0,0,0.6)]" />
      <div
        className={`font-mono text-[9px] tracking-[0.15em] whitespace-nowrap text-ink/45 [writing-mode:vertical-rl] ${textShadow}`}
      >
        SCROLL TO EXPLORE
      </div>
    </div>
  );
}
