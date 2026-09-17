"use client";

import { useEffect, useState } from "react";

const PAIRS = [
  { jargon: "server-side rendering", plain: "Your pages load fast, even on a slow phone." },
  { jargon: "responsive breakpoints", plain: "It looks right on every screen size." },
  { jargon: "accessibility (a11y)", plain: "Everyone can use it — including people on screen readers." },
  { jargon: "SEO metadata", plain: "People can actually find you on Google." },
];

const INTERVAL = 3200;
const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";

export default function JargonTranslator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % PAIRS.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, reduced]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="overflow-hidden rounded-xl border border-accent/15 bg-[rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center gap-1.5 border-b border-accent/12 bg-band px-3.5 py-2.5">
        <span className={chromeDot} />
        <span className={chromeDot} />
        <span className={chromeDot} />
        <span className="ml-auto flex gap-1" aria-hidden>
          {PAIRS.map((p, i) => (
            <span
              key={p.jargon}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === index ? "w-5 bg-accent" : "w-2 bg-ink/15"
              }`}
            />
          ))}
        </span>
      </div>

      {/* Screen readers get the full list once; the cycling view is visual. */}
      <ul className="sr-only">
        {PAIRS.map((p) => (
          <li key={p.jargon}>
            {p.jargon}: {p.plain}
          </li>
        ))}
      </ul>

      <div aria-hidden className="relative h-[210px] max-[700px]:h-[190px]">
        {PAIRS.map((p, i) => {
          const on = i === index;
          return (
            <div
              key={p.jargon}
              className={`absolute inset-0 flex flex-col justify-center gap-4 px-7 transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] max-[700px]:px-5 ${
                on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <div className="font-mono text-[13px] text-ink/35 max-[700px]:text-xs">
                <span className="text-accent/60">$</span>{" "}
                <span className="line-through decoration-accent/60 decoration-[1.5px]">
                  {p.jargon}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 font-mono text-sm text-accent">→</span>
                <span className="text-[clamp(19px,2vw,24px)] leading-snug font-semibold text-ink">
                  {p.plain}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
