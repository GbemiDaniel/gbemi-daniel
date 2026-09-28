"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DragRevealPreview } from "@/app/lab/previews";
import {
  DAMPING,
  MASS,
  OPEN_RATIO,
  STEP,
  STIFFNESS,
  THRESHOLD_RATIO,
  type DragRevealOptions,
  type DragRevealPhase,
} from "@/app/lab/dragReveal";
import { DRAG_REVEAL_CODE, DRAG_REVEAL_DEV_PROMPT } from "@/app/lab/specs";

// Plot window: 1.5s after release, y in units of the open distance
// (0 = closed, 1 = open) with headroom for overshoot on both sides.
const GRAPH_S = 1.5;
const P_MIN = -0.35;
const P_MAX = 1.35;
const SETTLE_BAND = 0.02;

const PRESETS = [
  { id: "house", label: "House", k: STIFFNESS, c: DAMPING },
  { id: "snappy", label: "Snappy", k: 480, c: 30 },
  { id: "jelly", label: "Jelly", k: 160, c: 5 },
  { id: "flat", label: "No overshoot", k: STIFFNESS, c: 33 },
] as const;

type Point = { t: number; p: number };
type Trace = { pts: Point[]; from: number; to: number };

/** Still-release step response 0 → 1, integrated exactly like the component. */
function predict(k: number, c: number) {
  const out: Point[] = [];
  let x = 0;
  let v = 0;
  const every = Math.round(1 / 60 / STEP);
  for (let i = 0; i * STEP <= GRAPH_S; i++) {
    if (i % every === 0) out.push({ t: i * STEP, p: x });
    const force = -k * (x - 1) - c * v;
    v += (force / MASS) * STEP;
    x += v * STEP;
  }
  return out;
}

function theory(k: number, c: number) {
  const zeta = c / (2 * Math.sqrt(k * MASS));
  const under = zeta < 1;
  return {
    zeta,
    overshoot: under ? Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta)) : 0,
    period: under ? (2 * Math.PI) / (Math.sqrt(k / MASS) * Math.sqrt(1 - zeta * zeta)) : null,
  };
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const DECISIONS = [
  {
    kind: "SPRING, NOT A TWEEN",
    body: "A tweened elastic ease can't start from the finger's release velocity, and has to be killed and rebuilt when grabbed mid-flight. A simulated spring (F = −kx − cv) does both for free — a hard flick swings further than a slow drag, and catching it mid-bounce never jumps.",
  },
  {
    kind: "HYSTERESIS",
    body: "The 30%-of-width threshold is measured from whichever side it's committed to, not from a fixed midline. Closed → opens past 0.3W; open → closes below 0.44W. Small nudges in either state always fall back.",
  },
  {
    kind: "VELOCITY PROJECTION",
    body: "Release decides on where the cover would be 120ms later (x + v·0.12), using only the last 100ms of pointer samples. A quick flick commits early; a finger that stopped before lifting releases with zero velocity.",
  },
  {
    kind: "RUBBER BAND",
    body: "Past either end the cover keeps following with rising resistance — the iOS curve (1 − 1/(o·0.55/D + 1))·D with D = W/2 — so it never feels like hitting a wall, and never leaves the frame.",
  },
  {
    kind: "POINTER CAPTURE",
    body: "One Pointer Events path for mouse, touch and pen. setPointerCapture keeps the gesture alive when released outside the element or window — no document listeners to leak. touch-action: pan-y hands vertical swipes back to page scroll.",
  },
  {
    kind: "REDUCED MOTION",
    body: "With prefers-reduced-motion, the cover still tracks the finger (that's direct manipulation, not animation) but clamps at both ends and snaps straight to rest on release — no rubber band, no overshoot. Read per release, so an OS toggle applies live.",
  },
];

const DATA_TAGS = [
  `m = ${MASS}`,
  `k = ${STIFFNESS}`,
  `c = ${DAMPING}`,
  "ζ ≈ 0.43",
  `open = ${OPEN_RATIO}W`,
  `threshold = ${THRESHOLD_RATIO}W`,
  "projection = 120ms",
  "dt = 1/240s",
];

const STACK_TAGS = [
  "Pointer Events",
  "setPointerCapture",
  "requestAnimationFrame",
  "semi-implicit Euler",
  "ResizeObserver",
  "no dependencies",
];

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between font-mono text-[10px] tracking-[0.06em] text-ink/45">
        <span>{label}</span>
        <span className="text-ink/70">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 w-full cursor-pointer accent-accent max-[700px]:h-11"
      />
    </label>
  );
}

export default function DragRevealDetail() {
  const [k, setK] = useState<number>(STIFFNESS);
  const [c, setC] = useState<number>(DAMPING);
  const [threshold, setThreshold] = useState(THRESHOLD_RATIO);
  const [copied, setCopied] = useState<"prompt" | "code" | null>(null);
  // One stable, mutable object: attachDragReveal reads it every frame, so the
  // sliders retune the live instance without re-mounting it.
  const optionsRef = useRef<DragRevealOptions>({
    stiffness: STIFFNESS,
    damping: DAMPING,
    thresholdRatio: THRESHOLD_RATIO,
  });
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const peakRef = useRef<HTMLSpanElement>(null);
  const settleRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<HTMLSpanElement>(null);
  const predictedRef = useRef<Point[]>(predict(STIFFNESS, DAMPING));
  const paintRef = useRef<() => void>(() => {});

  // Plot + instrumentation. Everything here is imperative: the trace grows
  // inside the spring's own rAF tick and never goes through React state.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const options = optionsRef.current;
    if (!canvas || !ctx) return;

    let trace: Trace | null = null;
    let phaseWas: DragRevealPhase = "rest";
    let lastP = 0;
    let t0 = 0;
    let dpr = 1;
    let finalized = false;

    const paint = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const X = (t: number) => (t / GRAPH_S) * w;
      const Y = (p: number) => (1 - (p - P_MIN) / (P_MAX - P_MIN)) * h;

      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = "rgba(242,239,233,0.14)";
      for (const p of [0, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, Y(p));
        ctx.lineTo(w, Y(p));
        ctx.stroke();
      }

      // Prediction for a still release from the trace's actual start point.
      const from = trace?.from ?? 0;
      const to = trace?.to ?? 1;
      ctx.strokeStyle = "rgba(242,239,233,0.3)";
      ctx.beginPath();
      predictedRef.current.forEach((pt, i) => {
        const y = Y(from + (to - from) * pt.p);
        if (i === 0) ctx.moveTo(X(pt.t), y);
        else ctx.lineTo(X(pt.t), y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      if (!trace || trace.pts.length < 2) return;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#C9F31D";
      ctx.shadowColor = "rgba(201,243,29,0.45)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      trace.pts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(X(pt.t), Y(pt.p));
        else ctx.lineTo(X(pt.t), Y(pt.p));
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      const dir = Math.sign(trace.to - trace.from);
      let peak = trace.pts[0];
      for (const pt of trace.pts) if ((pt.p - peak.p) * dir > 0) peak = pt;
      if ((peak.p - trace.to) * dir > 0.005) {
        ctx.fillStyle = "#C9F31D";
        ctx.beginPath();
        ctx.arc(X(peak.t), Y(peak.p), 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    paintRef.current = paint;

    const finalize = (mode: string) => {
      if (!trace || !peakRef.current || !settleRef.current || !modeRef.current) return;
      const travel = trace.to - trace.from;
      const dir = Math.sign(travel);
      let over = 0;
      let settledAt = 0;
      for (const pt of trace.pts) {
        over = Math.max(over, (pt.p - trace.to) * dir);
        if (Math.abs(pt.p - trace.to) > SETTLE_BAND) settledAt = pt.t;
      }
      const last = trace.pts[trace.pts.length - 1];
      const pct = Math.abs(travel) > 0.01 ? (over / Math.abs(travel)) * 100 : 0;
      peakRef.current.textContent = pct.toFixed(1) + "%";
      settleRef.current.textContent =
        Math.abs(last.p - trace.to) > SETTLE_BAND ? `> ${GRAPH_S}s` : settledAt.toFixed(2) + "s";
      modeRef.current.textContent = mode;
      paint();
    };

    options.onFrame = (x, openX, phase, open) => {
      const p = x / openX;
      const now = performance.now();
      const to = open ? 1 : 0;
      const springMode = open ? "spring → open" : "spring → closed";
      if (phase === "spring") {
        if (phaseWas !== "spring") {
          t0 = now;
          finalized = false;
          trace = { pts: [{ t: 0, p: lastP }], from: lastP, to };
          if (hintRef.current) hintRef.current.style.opacity = "0";
        }
        const t = (now - t0) / 1000;
        if (trace && t <= GRAPH_S) {
          trace.pts.push({ t, p });
          paint();
        } else if (!finalized) {
          // A low-damping spring can ring for seconds past the plot window:
          // report as soon as the window is full, then stop repainting.
          finalized = true;
          finalize(springMode);
        }
      } else if (phase === "rest" && phaseWas === "spring") {
        if (!finalized) {
          trace?.pts.push({ t: Math.min(GRAPH_S, (now - t0) / 1000), p });
          finalize(springMode);
        }
      } else if (phase === "rest" && phaseWas === "drag") {
        // Reduced motion: no spring frames at all, just a step to rest.
        trace = { pts: [{ t: 0, p: lastP }, { t: 0, p }, { t: GRAPH_S, p }], from: lastP, to };
        if (hintRef.current) hintRef.current.style.opacity = "0";
        finalize("snapped (reduced motion)");
      } else if (phase === "drag" && phaseWas === "spring") {
        finalize("caught mid-flight");
      }
      phaseWas = phase;
      lastP = p;
    };

    const ro = new ResizeObserver(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      paint();
    });
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      options.onFrame = undefined;
      paintRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    const options = optionsRef.current;
    options.stiffness = k;
    options.damping = c;
    options.thresholdRatio = threshold;
    predictedRef.current = predict(k, c);
    paintRef.current();
  }, [k, c, threshold]);

  const tune = (next: { k?: number; c?: number; threshold?: number }) => {
    if (next.k !== undefined) setK(next.k);
    if (next.c !== undefined) setC(next.c);
    if (next.threshold !== undefined) setThreshold(next.threshold);
  };

  const copy = async (kind: "prompt" | "code") => {
    try {
      await navigator.clipboard.writeText(kind === "prompt" ? DRAG_REVEAL_DEV_PROMPT : DRAG_REVEAL_CODE);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const th = theory(k, c);
  const activePreset = PRESETS.find((p) => p.k === k && p.c === c)?.id;

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
            <h1 className="m-0 text-[clamp(22px,5.5vw,36px)] font-bold">DRAG-TO-REVEAL</h1>
            <span className="rounded-full border border-accent/30 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-accent">
              Interaction
            </span>
          </div>
          <p className="m-0 mt-3 max-w-[620px] text-sm leading-relaxed text-ink/60 max-[700px]:text-[13.5px]">
            A cover you pull aside that overshoots, settles, and remembers which side it&apos;s on.
            The overshoot is the whole piece — so here it&apos;s plotted live, and every constant
            behind it is on a slider.
          </p>
        </section>

        {/* WORKSHOP */}
        <section className="mx-auto grid max-w-[1200px] gap-5 px-8 pb-8 max-[700px]:gap-4 max-[700px]:px-5 min-[900px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* STAGE + PLOT */}
          <div className="overflow-hidden rounded-2xl border border-accent/12 bg-band">
            <div className="relative flex h-[230px] items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(201,243,29,0.05),transparent_65%)] max-[700px]:h-[170px]">
              <span className="absolute top-4 left-5 font-mono text-[10px] tracking-[0.08em] text-ink/30">
                LIVE
              </span>
              <DragRevealPreview size="lg" optionsRef={optionsRef} />
            </div>

            <div className="border-t border-accent/12 px-5 pt-4 pb-5 max-[700px]:px-4">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.08em] text-ink/30">
                <span>RELEASE → REST</span>
                <span>{GRAPH_S}s</span>
              </div>
              <div className="relative h-[170px] max-[700px]:h-[140px]">
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                {(
                  [
                    [1, "OPEN"],
                    [0, "CLOSED"],
                  ] as const
                ).map(([p, label]) => (
                  <span
                    key={label}
                    className="pointer-events-none absolute right-0 -translate-y-full pb-0.5 font-mono text-[9px] tracking-[0.08em] text-ink/30"
                    style={{ top: `${(1 - (p - P_MIN) / (P_MAX - P_MIN)) * 100}%` }}
                  >
                    {label}
                  </span>
                ))}
                <div
                  ref={hintRef}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] text-ink/40 transition-opacity duration-300"
                >
                  drag, flick, or grab it mid-bounce
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 font-mono text-[10px] tracking-[0.06em] text-ink/40">
                <div>
                  OVERSHOOT
                  <span ref={peakRef} className="mt-1 block text-[15px] text-accent">
                    —
                  </span>
                </div>
                <div>
                  SETTLED (±2%)
                  <span ref={settleRef} className="mt-1 block text-[15px] text-ink/85">
                    —
                  </span>
                </div>
                <div>
                  LAST
                  <span ref={modeRef} className="mt-1 block text-[11px] leading-snug text-ink/70">
                    —
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-ink/35">
                <span className="inline-block h-px w-4 border-t border-dashed border-ink/40" />
                still-release prediction for the current spring
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col rounded-2xl border border-accent/12 bg-band">
            <div className="px-5 pt-4 font-mono text-[10px] tracking-[0.08em] text-ink/30 max-[700px]:px-4">
              TUNE
            </div>
            <div className="flex flex-wrap gap-2 px-5 pt-3 max-[700px]:px-4">
              {PRESETS.map((preset) => {
                const on = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => tune({ k: preset.k, c: preset.c })}
                    className="cursor-pointer rounded-full border px-3.5 py-2 font-mono max-[700px]:min-h-11 max-[700px]:px-4 text-[10px] tracking-[0.05em] transition-colors duration-200"
                    style={{
                      borderColor: on ? "#C9F31D" : "rgba(242,239,233,0.15)",
                      background: on ? "#C9F31D" : "transparent",
                      color: on ? "#120E17" : "rgba(242,239,233,0.6)",
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 px-5 pt-4 max-[700px]:px-4">
              <Slider
                label="STIFFNESS  k"
                value={k}
                display={String(k)}
                min={100}
                max={600}
                step={10}
                onChange={(v) => tune({ k: v })}
              />
              <Slider
                label="DAMPING  c"
                value={c}
                display={String(c)}
                min={4}
                max={40}
                step={1}
                onChange={(v) => tune({ c: v })}
              />
              <Slider
                label="THRESHOLD"
                value={threshold}
                display={`${Math.round(threshold * 100)}% of width`}
                min={0.15}
                max={0.5}
                step={0.05}
                onChange={(v) => tune({ threshold: v })}
              />
            </div>

            <div className="mx-5 mt-4 grid grid-cols-3 gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3 font-mono text-[10px] tracking-[0.06em] text-ink/40 max-[700px]:mx-4">
              <div>
                ζ
                <span className="mt-1 block text-[14px] text-ink/85">{th.zeta.toFixed(2)}</span>
              </div>
              <div>
                OVERSHOOT
                <span className="mt-1 block text-[14px] text-ink/85">
                  {(th.overshoot * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                PERIOD
                <span className="mt-1 block text-[14px] text-ink/85">
                  {th.period ? th.period.toFixed(2) + "s" : "—"}
                </span>
              </div>
            </div>

            <p className="m-0 mx-5 mt-3 font-mono text-[10.5px] leading-relaxed text-ink/40 max-[700px]:mx-4">
              {reduced
                ? "Your system has reduced motion on — the spring is skipped and the cover snaps to rest. Turn it off to see the overshoot."
                : "Reduced motion is off on this device. With it on, the cover snaps straight to rest and the plot shows a step."}
            </p>

            <div className="mt-auto flex flex-wrap gap-2 border-t border-accent/12 px-5 py-4 max-[700px]:px-4">
              <button
                type="button"
                onClick={() => copy("prompt")}
                className="inline-flex cursor-pointer items-center rounded-full border border-accent/30 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] text-accent max-[700px]:min-h-11 transition-colors duration-200 hover:bg-accent/10"
              >
                {copied === "prompt" ? "Copied ✓" : "Copy prompt for devs"}
              </button>
              <button
                type="button"
                onClick={() => copy("code")}
                className="inline-flex cursor-pointer items-center rounded-full border border-accent/30 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] text-accent max-[700px]:min-h-11 transition-colors duration-200 hover:bg-accent/10"
              >
                {copied === "code" ? "Copied ✓" : "Copy code"}
              </button>
            </div>
          </div>
        </section>

        {/* DECISIONS */}
        <section className="mx-auto max-w-[1200px] px-8 pb-24 max-[700px]:px-5 max-[700px]:pb-14">
          <div className="mb-4 mt-6 font-mono text-[11px] tracking-[0.1em] text-ink/40">
            <span className="text-accent">—</span> DECISIONS
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))" }}
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
        </section>

        <Footer />
      </div>
    </div>
  );
}
