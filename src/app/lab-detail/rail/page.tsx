"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { RailDemo, CLOSE_GRACE_MS, OPENING_MS, OPEN_INTENT_MS, type RailState } from "@/app/lab/rail";
import { RAIL_CODE, RAIL_DEV_PROMPT } from "@/app/lab/specs";

const SLOW_MO = 4;

// Mirrors the opening/hover timings in src/components/nav.module.css — the
// chart is drawn from the same formula the CSS uses.
const ROLL_MS = 640;
const ROW_STEP_MS = 50;
const LETTER_STEP_MS = 18;
const OPEN_OFFSET_MS = 110;
const HOVER_ROLL_MS = 520;
const HOVER_LETTER_MS = 16;
const CHART_MS = 1100;
const CHART_ROWS = ["HOME", "WORK", "ABOUT", "WRITING"];

const DECISIONS = [
  {
    kind: "ONE BOX MOVES",
    body: "The panel's content is always laid out at the open width (232px) and clipped by the panel. Opening animates the width of one isolated, contain: layout paint box — no text reflows or re-wraps mid-flight, and the page underneath never moves.",
  },
  {
    kind: "TYPE IS THE FEEDBACK",
    body: "No hover backgrounds. Each label is a 24px mask; mono caps roll out the top while the serif italic of the wordmark rolls in, 16ms apart per letter. 105% travel, not 100%, so no antialiased edge peeks through the mask.",
  },
  {
    kind: "TWO PHASES OF OPEN",
    body: "For 900ms after opening, letters rise as a cascade (110ms + row·50ms + letter·18ms). After that the panel switches to 'open' and hover rolls go back to their own short delays — the entrance never makes hover feel slow.",
  },
  {
    kind: "INTENT, THEN GRACE",
    body: "Opens 70ms after the pointer arrives, so sweeping past the screen edge doesn't pop it. Closes 280ms after it leaves, so brushing off the edge doesn't snap it shut. Each timer cancels the other.",
  },
  {
    kind: "OPEN = ANY REASON",
    body: "expanded = hover || focus || pinned || touch || peek. Each reason is its own boolean and none fights another. After an explicit collapse, hover is ignored until the pointer leaves, so the click that closed it can't reopen it.",
  },
  {
    kind: "SIBLINGS RECEDE",
    body: ".list:has(.link:hover) dims every other row to 28% ink. Pointing at one row focuses it through type alone — the only accent mark is the 9px tick on the current page.",
  },
  {
    kind: "STATE OUTLIVES PAGES",
    body: "Every page mounts its own <Nav/>, so pin and open sections live in module scope: they survive client navigation, not a reload, so the first render always matches the collapsed server HTML.",
  },
  {
    kind: "QUIET FALLBACKS",
    body: "Keyboard opens it only on :focus-visible, Esc collapses and blurs, hidden subtrees are inert. Reduced motion zeroes every duration and delay inside the panel — same states, instant.",
  },
];

const DATA_TAGS = [
  "rail = 68px",
  "open = 232px",
  "open 520ms / close 320ms",
  "roll 520ms · 16ms/letter",
  "cascade 640ms",
  "110 + row·50 + i·18 ms",
  "intent 70ms · grace 280ms",
  "ease = cubic-bezier(0.16, 1, 0.3, 1)",
];

const STACK_TAGS = [
  "CSS Modules",
  "transition-delay: calc(var(--i))",
  ":has()",
  "contain: layout paint style",
  "writing-mode: vertical-rl",
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

function OpeningChart() {
  const pct = (ms: number) => (ms / CHART_MS) * 100 + "%";
  return (
    <div>
      <div className="relative flex flex-col gap-3">
        <span
          aria-hidden
          className="absolute -top-2 -bottom-1 border-l border-dashed border-accent/50"
          style={{ left: `calc(76px + (100% - 76px) * ${OPENING_MS / CHART_MS})` }}
        />
        {CHART_ROWS.map((label, row) => (
          <div key={label} className="grid grid-cols-[64px_1fr] items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.08em] text-ink/45">{label}</span>
            <div className="relative" style={{ height: label.length * 4 }}>
              {label.split("").map((_, i) => {
                const delay = OPEN_OFFSET_MS + row * ROW_STEP_MS + i * LETTER_STEP_MS;
                return (
                  <span
                    key={i}
                    className="absolute h-[2px] rounded-full"
                    style={{
                      top: i * 4,
                      left: pct(delay),
                      width: pct(ROLL_MS),
                      background: "linear-gradient(90deg, #C9F31D, rgba(201,243,29,0.08))",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[64px_1fr] items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.08em] text-ink/30">HOVER</span>
          <div className="relative" style={{ height: 7 * 4 }}>
            {Array.from({ length: 7 }, (_, i) => (
              <span
                key={i}
                className="absolute h-[2px] rounded-full"
                style={{
                  top: i * 4,
                  left: pct(i * HOVER_LETTER_MS),
                  width: pct(HOVER_ROLL_MS),
                  background: "linear-gradient(90deg, rgba(242,239,233,0.6), rgba(242,239,233,0.05))",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative mt-3 ml-[76px] h-5 border-t border-white/8 font-mono text-[9px] text-ink/30">
        {[0, 250, 500, 750, 1000].map((ms) => (
          <span key={ms} className="absolute top-1 -translate-x-1/2" style={{ left: pct(ms) }}>
            {ms}
          </span>
        ))}
        <span className="absolute top-1 text-accent/80" style={{ left: `calc(${pct(OPENING_MS)} + 6px)` }}>
          → open
        </span>
      </div>
    </div>
  );
}

export default function RailDetail() {
  const [state, setState] = useState<RailState>({ hover: false, focus: false, pin: false, phase: "closed" });
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
      await navigator.clipboard.writeText(kind === "prompt" ? RAIL_DEV_PROMPT : RAIL_CODE);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

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
            <h1 className="m-0 text-[clamp(22px,5.5vw,36px)] font-bold">RAIL</h1>
            <span className="rounded-full border border-accent/30 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-accent">
              Interaction
            </span>
            <span className="rounded-full border border-ink/15 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-ink/45">
              Desktop
            </span>
          </div>
          <p className="m-0 mt-3 max-w-[640px] text-sm leading-relaxed text-ink/60 max-[700px]:text-[13.5px]">
            The sidebar this site actually runs on, pulled out to look at. It rests as a rail of
            numerals, floats open over the page instead of pushing it, and answers everything in type —
            labels roll from mono caps into the serif italic of the wordmark.
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
        <section className="mx-auto grid max-w-[1200px] gap-5 px-8 pb-8 max-[700px]:hidden min-[1000px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div
            ref={stageRef}
            className="relative h-[540px] overflow-hidden rounded-2xl border border-accent/12 bg-band"
          >
            <RailDemo tree xray={xray} timeScale={slow ? SLOW_MO : 1} onState={setState} />
          </div>

          <div className="flex flex-col rounded-2xl border border-accent/12 bg-band">
            <div className="border-b border-accent/12 px-5 py-4">
              <div className="mb-3 font-mono text-[10px] tracking-[0.08em] text-ink/30">OPEN BECAUSE</div>
              <div className="flex flex-wrap gap-2">
                <Chip label="HOVER" on={state.hover} />
                <Chip label="FOCUS" on={state.focus} />
                <Chip label="PIN" on={state.pin} />
              </div>
              <div className="mt-4 mb-3 font-mono text-[10px] tracking-[0.08em] text-ink/30">PHASE</div>
              <div className="flex flex-wrap gap-2">
                <Chip label="closed" on={state.phase === "closed"} />
                <Chip label="opening" on={state.phase === "opening"} />
                <Chip label="open" on={state.phase === "open"} />
              </div>
            </div>

            <div className="border-b border-accent/12 px-5 py-3">
              <Switch label={`SLOW MOTION ×${SLOW_MO}`} on={slow} onChange={setSlow} />
              <Switch label="X-RAY: MASKS + LAYOUT BOX" on={xray} onChange={setXray} />
            </div>

            <ul className="m-0 flex list-none flex-col gap-2 px-5 py-4 font-mono text-[11px] leading-relaxed text-ink/45">
              <li>
                <span className="text-ink/75">Hover</span> the rail — opens after {OPEN_INTENT_MS}ms,
                closes {CLOSE_GRACE_MS}ms after you leave
              </li>
              <li>
                <span className="text-ink/75">Tab</span> into it — focus-visible opens it, Esc collapses
              </li>
              <li>
                <span className="text-ink/75">Pin</span> it with the chevron, then open WORK for the tree
              </li>
              <li>
                <span className="text-ink/75">Click</span> a row — the current page keeps its serif
              </li>
            </ul>

            <div className="mt-auto flex flex-wrap gap-2 border-t border-accent/12 px-5 py-4">
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
        </section>

        {/* OPENING CASCADE */}
        <section className="mx-auto max-w-[1200px] px-8 pb-8 max-[700px]:px-5">
          <div className="rounded-2xl border border-accent/12 bg-band p-6 max-[700px]:p-4">
            <div className="mb-1 font-mono text-[10px] tracking-[0.08em] text-ink/30">
              OPENING CASCADE · ONE BAR PER LETTER
            </div>
            <p className="m-0 mb-5 max-w-[620px] text-[13px] leading-relaxed text-ink/50">
              Each letter&apos;s roll plotted from the CSS formula. Rows start 50ms apart and letters 18ms
              apart, so the list reads top-down and every word reads left-to-right. At {OPENING_MS}ms the
              panel flips to &ldquo;open&rdquo; and hover rolls switch to their own quicker stagger (bottom).
            </p>
            <OpeningChart />
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
