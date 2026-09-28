"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./lab.module.css";
import {
  OrbitPreview,
  RipplePreview,
  FieldPreview,
  SparklinePreview,
  MagnetPreview,
  NoisePreview,
  ProximityPreview,
  DragRevealPreview,
  RailPreview,
  TopbarPreview,
} from "./previews";
import {
  DRAG_REVEAL_CODE,
  DRAG_REVEAL_DEV_PROMPT,
  RAIL_CODE,
  RAIL_DEV_PROMPT,
  TOPBAR_CODE,
  TOPBAR_DEV_PROMPT,
} from "./specs";

const PROXIMITY_DEV_PROMPT = `Build a "proximity hover" effect for a UI element:

- Track the pointer's position relative to the element's bounding box on mousemove.
- Compute the distance from the pointer to the element's center, and normalize it
  against the box's half-diagonal so you get a 0-1 "proximity" value (1 = pointer at
  center, 0 = pointer at the farthest corner).
- Drive two things off that proximity value: a scale transform (e.g. 1 -> 1.7) and a
  glow via box-shadow (blur + spread + opacity all increasing with proximity).
- On mouseleave, ease both back to their resting state.
- Write the styles imperatively (element.style.transform / boxShadow) instead of
  through React state, so the glow updates on every mousemove without a re-render.
- Respect prefers-reduced-motion: skip the scale/glow entirely and show the resting
  state only.`;

type Card = {
  id: string;
  codename: string;
  tag: string;
  desc: string;
  Preview: typeof OrbitPreview;
  noPadding: boolean;
  devPrompt?: string;
  codeSnippet?: string;
  detailHref?: string;
  /** Hover/pointer pieces that mean nothing on a phone: hidden below 700px. */
  desktopOnly?: boolean;
};

const CARDS: Card[] = [
  {
    id: "orbit",
    codename: "ORBIT",
    tag: "Interaction",
    desc: "A satellite element that tracks a fixed anchor, built for cursor-follow menus.",
    Preview: OrbitPreview,
    noPadding: false,
    detailHref: "/lab-detail",
  },
  {
    id: "ripple",
    codename: "RIPPLE",
    tag: "Motion",
    desc: "A click-feedback ping for buttons that don't want a full ripple fill.",
    Preview: RipplePreview,
    noPadding: false,
  },
  {
    id: "field",
    codename: "FIELD",
    tag: "Generative",
    desc: "A grid of points breathing in a diagonal wave — loading state, reimagined.",
    Preview: FieldPreview,
    noPadding: false,
  },
  {
    id: "sparkline",
    codename: "SPARKLINE",
    tag: "Data Viz",
    desc: "A self-drawing trend line for dashboards that shouldn't feel static.",
    Preview: SparklinePreview,
    noPadding: false,
  },
  {
    id: "magnet",
    codename: "MAGNET",
    tag: "Interaction",
    desc: "Elements that lift toward the cursor before you actually click them.",
    Preview: MagnetPreview,
    noPadding: false,
  },
  {
    id: "noise",
    codename: "NOISE",
    tag: "Generative",
    desc: "A drifting dot field for empty states — texture instead of silence.",
    Preview: NoisePreview,
    noPadding: true,
  },
  {
    id: "proximity",
    codename: "PROXIMITY",
    tag: "Interaction",
    desc: "A dot that senses the cursor closing in — scale and glow scale with nearness, not click.",
    Preview: ProximityPreview,
    noPadding: false,
    devPrompt: PROXIMITY_DEV_PROMPT,
  },
  {
    id: "drag-reveal",
    codename: "DRAG-TO-REVEAL",
    tag: "Interaction",
    desc: "A cover you pull aside that overshoots, settles, and remembers which side it's on.",
    Preview: DragRevealPreview,
    noPadding: false,
    devPrompt: DRAG_REVEAL_DEV_PROMPT,
    codeSnippet: DRAG_REVEAL_CODE,
    detailHref: "/lab-detail/drag-to-reveal",
  },
  {
    id: "rail",
    codename: "RAIL",
    tag: "Interaction",
    desc: "A nav that rests as a rail and answers in type — labels roll from mono caps into serif italic.",
    Preview: RailPreview,
    noPadding: false,
    devPrompt: RAIL_DEV_PROMPT,
    codeSnippet: RAIL_CODE,
    detailHref: "/lab-detail/rail",
    desktopOnly: true,
  },
  {
    id: "topbar",
    codename: "TOPBAR",
    tag: "Interaction",
    desc: "The rail's successor — a floating bar that frosts as the page slides under it, and still answers in type.",
    Preview: TopbarPreview,
    noPadding: false,
    devPrompt: TOPBAR_DEV_PROMPT,
    codeSnippet: TOPBAR_CODE,
    detailHref: "/lab-detail/topbar",
    desktopOnly: true,
  },
];

function keyActivate(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}

export default function Lab() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<"prompt" | "code" | null>(null);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedCard = CARDS.find((c) => c.id === selected);

  const copy = async (kind: "prompt" | "code") => {
    const text = kind === "prompt" ? selectedCard?.devPrompt : selectedCard?.codeSnippet;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
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
        <section className="mx-auto max-w-[1200px] px-8 pt-16 pb-12 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-8">
          <div className="mb-4 font-mono text-xs tracking-[0.1em] text-ink/40 max-[700px]:mb-3">
            <span className="text-accent">05</span> — LAB
          </div>
          <h1 className="m-0 mb-4 max-w-[640px] text-[clamp(26px,6.5vw,44px)] leading-[1.15] font-bold max-[700px]:mb-3">
            A notebook of interfaces, <span className="text-accent">mid-thought.</span>
          </h1>
          <p className="m-0 max-w-[560px] text-[15px] leading-relaxed text-ink/60 max-[700px]:text-[13.5px]">
            Small components, interaction studies, and design-system experiments — some
            finished, some just proof a hunch works. Click any card to open it up.
          </p>
        </section>

        {/* GRID */}
        <section className="mx-auto max-w-[1200px] px-8 pb-24 max-[700px]:px-5 max-[700px]:pb-14">
          <div
            className="grid gap-6 max-[700px]:gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))" }}
          >
            {CARDS.map((card) => {
              const on = hovered === card.id;
              const open = () => {
                setCopied(null);
                setSelected(card.id);
              };
              return (
                <div
                  key={card.id}
                  onClick={open}
                  onKeyDown={keyActivate(open)}
                  onMouseEnter={() => setHovered(card.id)}
                  onMouseLeave={() => setHovered(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${card.codename} lab file`}
                  className={`cursor-pointer overflow-hidden rounded-2xl bg-band outline-none transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] focus-visible:border-accent ${card.desktopOnly ? "max-[700px]:hidden" : ""}`}
                  style={{
                    border: `1px solid ${on ? "rgba(201,243,29,0.5)" : "rgba(201,243,29,0.12)"}`,
                    boxShadow: on ? "0 16px 36px -12px rgba(201,243,29,0.18)" : "0 0 0 rgba(0,0,0,0)",
                  }}
                >
                  <div
                    className={`relative flex h-[170px] items-center justify-center border-b border-accent/10 max-[700px]:h-[120px] ${card.noPadding ? "overflow-hidden" : ""}`}
                  >
                    <card.Preview size="sm" />
                  </div>
                  <div className="p-5 max-[700px]:p-4">
                    <div className="mb-2 flex items-center justify-between max-[700px]:mb-1.5">
                      <span className="text-base font-bold max-[700px]:text-[14px]">
                        {card.codename}
                      </span>
                      <span className="rounded-full border border-accent/30 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-accent">
                        {card.tag}
                      </span>
                    </div>
                    <p className="m-0 text-[13px] leading-[1.5] text-ink/55 max-[700px]:line-clamp-2 max-[700px]:text-[12px]">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Footer />
      </div>

      {/* PLAYGROUND MODAL */}
      {selectedCard && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,8,16,0.82)] p-6 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-[680px] overflow-hidden rounded-[18px] border border-accent/25 bg-bg ${styles.modalIn}`}
          >
            <div className="flex items-center justify-between border-b border-accent/12 bg-band px-5 py-4">
              <span className="font-mono text-[11px] tracking-[0.08em] text-ink/40">
                LAB_FILE — {selectedCard.codename}
              </span>
              <span
                onClick={() => setSelected(null)}
                onKeyDown={keyActivate(() => setSelected(null))}
                tabIndex={0}
                role="button"
                aria-label="Close"
                className="cursor-pointer text-base leading-none text-ink/50 outline-none hover:text-accent focus-visible:text-accent"
              >
                ×
              </span>
            </div>
            <div className="relative flex h-[280px] items-center justify-center overflow-hidden border-b border-accent/10 max-[700px]:h-[180px]">
              <selectedCard.Preview size="lg" />
            </div>
            <div className="p-7 max-[700px]:p-4">
              <div className="mb-2.5 flex items-start justify-between gap-4 max-[700px]:mb-1.5">
                <h3 className="m-0 text-[22px] font-bold max-[700px]:text-[17px]">
                  {selectedCard.codename}
                </h3>
                <span className="shrink-0 rounded-full border border-accent/30 px-2.5 py-[3px] font-mono text-[10px] tracking-[0.05em] text-accent">
                  {selectedCard.tag}
                </span>
              </div>
              <p className="m-0 text-sm leading-relaxed text-ink/60">{selectedCard.desc}</p>
              {selectedCard.detailHref && (
                <div>
                  <Link
                    href={selectedCard.detailHref}
                    className="mt-4 inline-flex items-center gap-2 text-[13px] text-accent no-underline hover:underline"
                  >
                    Open full breakdown →
                  </Link>
                </div>
              )}
              {selectedCard.devPrompt && (
                <button
                  type="button"
                  onClick={() => copy("prompt")}
                  className="mt-4 mr-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent/30 bg-transparent px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-accent transition-colors duration-200 hover:bg-accent/10"
                >
                  {copied === "prompt" ? "Copied ✓" : "Copy prompt for devs"}
                </button>
              )}
              {selectedCard.codeSnippet && (
                <button
                  type="button"
                  onClick={() => copy("code")}
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent/30 bg-transparent px-4 py-2 font-mono text-[11px] tracking-[0.06em] text-accent transition-colors duration-200 hover:bg-accent/10"
                >
                  {copied === "code" ? "Copied ✓" : "Copy code"}
                </button>
              )}
              <div className="mt-5 border-t border-white/8 pt-4 font-mono text-[11px] text-ink/35">
                status: experimental — not yet shipped
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
