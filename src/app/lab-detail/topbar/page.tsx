"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  TopbarDemo,
  FLOAT_AT_PX,
  MENU_ENTER_MS,
  MENU_GRACE_MS,
  MENU_INTENT_MS,
  type TopbarState,
} from "@/app/lab/topbar";
import { TOPBAR_CODE, TOPBAR_DEV_PROMPT } from "@/app/lab/specs";

const SLOW_MO = 4;

// Mirrors the hover and dropdown timings in src/app/lab/topbar.module.css —
// the chart is drawn from the same formulas the CSS uses.
const HOVER_ROLL_MS = 520;
const HOVER_LETTER_MS = 16;
const MENU_ROLL_MS = 560;
const MENU_OFFSET_MS = 60;
const MENU_ROW_MS = 45;
const MENU_LETTER_MS = 14;
const CHART_MS = 1000;
const MENU_ROWS = ["OVERVIEW", "COLLABS", "CONCEPTS", "LAB"];

const DECISIONS = [
  {
    kind: "ONE FONT, ONE EXCEPTION",
    body: "Most labels roll into an identical Space Mono copy of themselves: the motion reads, but the font and the width never change, so nothing shifts. Only Writing rolls into the Instrument Serif italic of the writing pages — the one place that face already belongs.",
  },
  {
    kind: "FLAT, THEN FROSTED",
    body: "At the very top the bar is just type on the page. Once content passes under it (past 8px), it settles into a frosted capsule: blur, a hairline accent border, a soft shadow. It never hides on scroll, so the nav is always one glance away.",
  },
  {
    kind: "ON THE GRID",
    body: "The bar is capped at 1168px with 16px padding: the pages' 1200px column minus its own 32px padding. So the wordmark and Résumé land exactly on the content's text edges, and at narrower widths 16px inset + 16px padding lands on the same 32px.",
  },
  {
    kind: "OPTICAL SPACING",
    body: "Gaps are 20px measured from rendered glyphs, not boxes. The chevron is pulled in 2px, because its icon's inner padding plus the K's tracking made it float as a separate item. On the Writing pages, the serif box sizes to itself so its gaps match the rest.",
  },
  {
    kind: "INTENT, THEN GRACE",
    body: "WORK's menu opens 90ms after the pointer arrives, so passing over doesn't flash it, and closes 240ms after it leaves. A 16px invisible bridge spans the gap under the trigger, so the pointer can cross to the menu without it closing.",
  },
  {
    kind: "TWO PHASES OF OPEN",
    body: "For 700ms after opening, menu items rise as a cascade (60ms + row·45ms + letter·14ms). After that, hover rolls go back to their own quicker per-letter delay — the entrance never makes hover feel slow.",
  },
  {
    kind: "SIBLINGS RECEDE",
    body: ".list:has(.link:hover) dims every other link to 28% ink. Pointing at one focuses it through type alone. The current page is marked only by full ink — no pill, no fill, no underline.",
  },
  {
    kind: "QUIET FALLBACKS",
    body: "Esc closes the menu and returns focus to WORK; the closed menu is inert. Below 1100px the socials drop out (they're in the footer) so nothing collides. Reduced motion zeroes every duration and delay — same states, instant.",
  },
];

const DATA_TAGS = [
  "bar = 60px",
  "max 1168px",
  `frost past ${FLOAT_AT_PX}px · 420ms`,
  "roll 520ms · 16ms/letter",
  `menu intent ${MENU_INTENT_MS}ms · grace ${MENU_GRACE_MS}ms`,
  "60 + row·45 + i·14 ms",
  "page clearance 84px",
  "ease = cubic-bezier(0.16, 1, 0.3, 1)",
];

const STACK_TAGS = [
  "CSS Modules",
  "backdrop-filter",
  ":has()",
  "transition-delay: calc(var(--i))",
  "overflow: clip",
  "inert",
  "no animation library",
];

function Switch({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full cursor-pointer items-center justify-between gap-3 py-2 text-left font-mono text-[11px] tracking-[0.06em] text-ink/60 outline-none focus-visible:text-accent"
    >
      {label}
      <span
        className="relative h-[14px] w-[26px] shrink-0 rounded-full transition-colors duration-300"
        style={{ background: on ? "#C9F31D" : "rgba(242,239,233,0.15)" }}
      >
        <span
          className="absolute top-[2px] h-[10px] w-[10px] rounded-full transition-[left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: on ? 14 : 2, background: on ? "#120E17" : "rgba(242,239,233,0.55)" }}
        />
      </span>
    </button>
  );
}

function Chip({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] transition-colors duration-200"
      style={{
        borderColor: on ? "#C9F31D" : "rgba(242,239,233,0.14)",
        background: on ? "rgba(201,243,29,0.12)" : "transparent",
        color: on ? "#C9F31D" : "rgba(242,239,233,0.35)",
      }}
    >
      {label}
    </span>
  );
}

function Bars({ letters, delay, width, color }: { letters: number; delay: (i: number) => number; width: number; color: string }) {
  const pct = (ms: number) => (ms / CHART_MS) * 100 + "%";
  return (
    <div className="relative" style={{ height: letters * 4 }}>
      {Array.from({ length: letters }, (_, i) => (
        <span
          key={i}
          className="absolute h-[2px] rounded-full"
          style={{ top: i * 4, left: pct(delay(i)), width: pct(width), background: color }}
        />
      ))}
    </div>
  );
}

function TimingChart() {
  const pct = (ms: number) => (ms / CHART_MS) * 100 + "%";
  return (
    <div>
      <div className="relative flex flex-col gap-3">
        <span
          aria-hidden
          className="absolute -top-2 -bottom-1 border-l border-dashed border-accent/50"
          style={{ left: `calc(76px + (100% - 76px) * ${MENU_ENTER_MS / CHART_MS})` }}
        />
        <div className="grid grid-cols-[64px_1fr] items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.08em] text-ink/45">HOVER</span>
          <Bars
            letters={5}
            delay={(i) => i * HOVER_LETTER_MS}
            width={HOVER_ROLL_MS}
            color="linear-gradient(90deg, rgba(242,239,233,0.6), rgba(242,239,233,0.05))"
          />
        </div>
        {MENU_ROWS.map((label, row) => (
          <div key={label} className="grid grid-cols-[64px_1fr] items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-ink/45">{label}</span>
            <Bars
              letters={label.length}
              delay={(i) => MENU_OFFSET_MS + row * MENU_ROW_MS + i * MENU_LETTER_MS}
              width={MENU_ROLL_MS}
              color="linear-gradient(90deg, #C9F31D, rgba(201,243,29,0.08))"
            />
          </div>
        ))}
      </div>
      <div className="relative mt-3 ml-[76px] h-5 border-t border-white/8 font-mono text-[9px] text-ink/30">
        {[0, 250, 500, 750, 1000].map((ms) => (
          <span key={ms} className="absolute top-1 -translate-x-1/2" style={{ left: pct(ms) }}>
            {ms}
          </span>
        ))}
        <span className="absolute top-1 text-accent/80" style={{ left: `calc(${pct(MENU_ENTER_MS)} + 6px)` }}>
          → open
        </span>
      </div>
    </div>
  );
}

export default function TopbarDetail() {
  const [state, setState] = useState<TopbarState>({
    floating: false,
    hovering: null,
    menu: "closed",
    active: "HOME",
  });
  const [slow, setSlow] = useState(false);
  const [xray, setXray] = useState(false);
  const [copied, setCopied] = useState<"prompt" | "code" | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Slow motion slows the real CSS transitions rather than a re-implementation:
  // each transition is a Web Animation, so set its playbackRate as it starts.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rate = slow ? 1 / SLOW_MO : 1;
    const retime = (el: Element) => {
      for (const a of el.getAnimations({ subtree: true })) a.playbackRate = rate;
    };
    retime(stage);
    if (!slow) return;
    const onRun = (e: TransitionEvent) => retime(e.target as Element);
    stage.addEventListener("transitionrun", onRun);
    return () => stage.removeEventListener("transitionrun", onRun);
  }, [slow]);

  const copy = async (kind: "prompt" | "code") => {
    try {
      await navigator.clipboard.writeText(kind === "prompt" ? TOPBAR_DEV_PROMPT : TOPBAR_CODE);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const hovering = state.hovering
    ? /[a-z]/.test(state.hovering)
      ? state.hovering.toUpperCase()
      : state.hovering
    : null;

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HEADER */}
        <section className="mx-auto max-w-[1200px] px-8 pt-10 pb-8 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-5">
          <Link href="/lab" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Lab
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="m-0 text-[clamp(22px,5.5vw,36px)] font-bold">TOPBAR</h1>
            <span className="rounded-full border border-accent/30 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-accent">
              Interaction
            </span>
            <span className="rounded-full border border-ink/15 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-ink/45">
              Desktop
            </span>
          </div>
          <p className="m-0 mt-3 max-w-[640px] text-sm leading-relaxed text-ink/60 max-[700px]:text-[13.5px]">
            The nav this site runs on now — the rail&apos;s successor, pulled out to look at. It floats
            at the top, frosts once the page slides under it, and still answers everything in type:
            labels roll into a copy of themselves, and only Writing rolls into the serif of the writing
            pages.
          </p>
        </section>

        {/* PHONE NOTICE — the piece is hover and keyboard focus; there's nothing to feel on touch */}
        <section className="mx-auto max-w-[1200px] px-5 pb-6 min-[700px]:hidden">
          <div className="rounded-2xl border border-accent/15 bg-band p-5">
            <div className="mb-2 font-mono text-[10px] tracking-[0.1em] text-accent">DESKTOP PIECE</div>
            <p className="m-0 text-[13.5px] leading-relaxed text-ink/60">
              The whole interaction is hover and keyboard focus, so there&apos;s nothing to feel on a
              phone. Open this page on a larger screen to play with it — the notes below still apply.
            </p>
          </div>
        </section>

        {/* WORKSHOP */}
        <section className="mx-auto grid max-w-[1200px] gap-5 px-8 pb-8 max-[700px]:hidden">
          <div
            ref={stageRef}
            className="relative h-[420px] overflow-hidden rounded-2xl border border-accent/12 bg-band"
          >
            <TopbarDemo xray={xray} timeScale={slow ? SLOW_MO : 1} onState={setState} />
          </div>

          <div className="grid rounded-2xl border border-accent/12 bg-band min-[1000px]:grid-cols-[1.1fr_1fr_1.3fr]">
            <div className="border-b border-accent/12 px-5 py-4 min-[1000px]:border-r min-[1000px]:border-b-0">
              <div className="mb-3 font-mono text-[10px] tracking-[0.08em] text-ink/30">SURFACE</div>
              <div className="flex flex-wrap gap-2">
                <Chip label="flat" on={!state.floating} />
                <Chip label="frosted" on={state.floating} />
              </div>
              <div className="mt-4 mb-3 font-mono text-[10px] tracking-[0.08em] text-ink/30">WORK MENU</div>
              <div className="flex flex-wrap gap-2">
                <Chip label="closed" on={state.menu === "closed"} />
                <Chip label="entering" on={state.menu === "entering"} />
                <Chip label="open" on={state.menu === "open"} />
              </div>
              <div className="mt-4 mb-3 font-mono text-[10px] tracking-[0.08em] text-ink/30">HOVERING</div>
              <Chip label={hovering ?? "—"} on={Boolean(hovering)} />
            </div>

            <div className="border-b border-accent/12 px-5 py-3 min-[1000px]:border-r min-[1000px]:border-b-0">
              <Switch label={`SLOW MOTION ×${SLOW_MO}`} on={slow} onChange={setSlow} />
              <Switch label="X-RAY: MASKS + SURFACE" on={xray} onChange={setXray} />
              <div className="mt-3 flex flex-wrap gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => copy("prompt")}
                  className="inline-flex cursor-pointer items-center rounded-full border border-accent/30 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] text-accent transition-colors duration-200 hover:bg-accent/10"
                >
                  {copied === "prompt" ? "Copied ✓" : "Copy prompt for devs"}
                </button>
                <button
                  type="button"
                  onClick={() => copy("code")}
                  className="inline-flex cursor-pointer items-center rounded-full border border-accent/30 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] text-accent transition-colors duration-200 hover:bg-accent/10"
                >
                  {copied === "code" ? "Copied ✓" : "Copy code"}
                </button>
              </div>
            </div>

            <ul className="m-0 flex list-none flex-col gap-2 px-5 py-4 font-mono text-[11px] leading-relaxed text-ink/45">
              <li>
                <span className="text-ink/75">Scroll</span> the page under the bar — it frosts past{" "}
                {FLOAT_AT_PX}px
              </li>
              <li>
                <span className="text-ink/75">Hover</span> a link — it rolls into a copy of itself;
                Writing is the only serif
              </li>
              <li>
                <span className="text-ink/75">Hover WORK</span> — opens after {MENU_INTENT_MS}ms, closes{" "}
                {MENU_GRACE_MS}ms after you leave
              </li>
              <li>
                <span className="text-ink/75">Click</span> Writing — it rests in the serif and its box
                shrinks to fit
              </li>
            </ul>
          </div>
        </section>

        {/* TIMING */}
        <section className="mx-auto max-w-[1200px] px-8 pb-8 max-[700px]:px-5">
          <div className="rounded-2xl border border-accent/12 bg-band p-6 max-[700px]:p-4">
            <div className="mb-1 font-mono text-[10px] tracking-[0.08em] text-ink/30">
              HOVER ROLL VS MENU CASCADE · ONE BAR PER LETTER
            </div>
            <p className="m-0 mb-5 max-w-[620px] text-[13px] leading-relaxed text-ink/50">
              Each letter&apos;s roll plotted from the CSS formula. A hover rolls a word in 16ms steps
              (top). When WORK&apos;s menu opens, items start 45ms apart and letters 14ms apart, so the
              list reads top-down. At {MENU_ENTER_MS}ms the menu flips to &ldquo;open&rdquo; and its
              items go back to the quicker hover stagger.
            </p>
            <TimingChart />
          </div>
        </section>

        {/* DECISIONS */}
        <section className="mx-auto max-w-[1200px] px-8 pb-24 max-[700px]:px-5 max-[700px]:pb-14">
          <div className="mt-2 mb-4 font-mono text-[11px] tracking-[0.1em] text-ink/40">
            <span className="text-accent">—</span> DECISIONS
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))" }}
          >
            {DECISIONS.map((d) => (
              <div key={d.kind} className="rounded-xl border border-accent/12 bg-band p-5 max-[700px]:p-4">
                <div className="mb-2 font-mono text-[10px] tracking-[0.1em] text-accent">{d.kind}</div>
                <p className="m-0 text-[13px] leading-relaxed text-ink/60">{d.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 min-[700px]:grid-cols-2">
            {(
              [
                ["DATA", DATA_TAGS],
                ["STACK", STACK_TAGS],
              ] as const
            ).map(([kind, tags]) => (
              <div key={kind} className="rounded-xl border border-accent/12 bg-band p-5 max-[700px]:p-4">
                <div className="mb-3 font-mono text-[10px] tracking-[0.1em] text-accent">{kind}</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[10px] text-ink/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 min-[700px]:hidden">
            <button
              type="button"
              onClick={() => copy("prompt")}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-accent/30 bg-transparent px-4 font-mono text-[11px] tracking-[0.06em] text-accent"
            >
              {copied === "prompt" ? "Copied ✓" : "Copy prompt for devs"}
            </button>
            <button
              type="button"
              onClick={() => copy("code")}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-accent/30 bg-transparent px-4 font-mono text-[11px] tracking-[0.06em] text-accent"
            >
              {copied === "code" ? "Copied ✓" : "Copy code"}
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
