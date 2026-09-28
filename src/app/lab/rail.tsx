"use client";

// RAIL: the site's floating sidebar nav, as a self-contained demo.
// Styles live in ./rail.module.css, a frozen copy of the sidebar design:
// the live nav has since become a top bar, and sharing its stylesheet meant
// every nav change silently broke this demo. State is per instance here.

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import styles from "./rail.module.css";

export type RailPhase = "closed" | "opening" | "open";
export type RailState = { hover: boolean; focus: boolean; pin: boolean; phase: RailPhase };

export const OPEN_INTENT_MS = 70; // a cursor sweeping past the edge doesn't pop it
export const CLOSE_GRACE_MS = 280; // brushing off the edge doesn't snap it shut
export const OPENING_MS = 900; // row-by-row entrance, then per-letter hover rolls
const PEEK_EVERY_MS = 4200;
const PEEK_OPEN_MS = 1700;

type Row = { label: string; children?: string[] };
const ROWS: Row[] = [
  { label: "HOME" },
  { label: "WORK", children: ["Overview", "Collabs", "Concepts", "Lab"] },
  { label: "ABOUT" },
  { label: "WRITING" },
];

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Letters({ text, className }: { text: string; className: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ "--i": i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Mono caps roll out of a 24px mask while the serif italic rolls in. */
function RollLabel({ label, xray }: { label: string; xray: boolean }) {
  const serif = /[a-z]/.test(label) ? label : titleCase(label);
  return (
    <>
      <span
        aria-hidden
        className={styles.roll}
        style={xray ? { outline: "1px dashed rgba(201,243,29,0.55)" } : undefined}
      >
        <Letters text={label.toUpperCase()} className={styles.mono} />
        <Letters text={serif} className={styles.serif} />
      </span>
      <span className="sr-only">{serif}</span>
    </>
  );
}

type RowProps = HTMLAttributes<HTMLElement> & {
  interactive: boolean;
  "data-active"?: boolean;
  "aria-current"?: "page";
  "aria-expanded"?: boolean;
};

// Buttons when the demo stands alone; plain spans inside a Lab card, where the
// card itself is the control and nested buttons would be unreachable noise.
function RowEl({ interactive, ...props }: RowProps) {
  return interactive ? <button type="button" {...props} /> : <span {...props} />;
}

export function RailDemo({
  interactive = true,
  tree = false,
  autoPeek = false,
  hoverArea = "panel",
  xray = false,
  timeScale = 1,
  onState,
}: {
  interactive?: boolean;
  tree?: boolean;
  autoPeek?: boolean;
  hoverArea?: "panel" | "scene";
  xray?: boolean;
  /** Stretches the JS timers to match slowed-down CSS (breakdown slow-mo). */
  timeScale?: number;
  onState?: (s: RailState) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [peek, setPeek] = useState(false);
  const [active, setActive] = useState("HOME");
  const [treeOpen, setTreeOpen] = useState(false);
  const expanded = hovered || focused || pinned || peek;

  // "opening" staggers labels in row by row; once settled, hover rolls use
  // their own short per-letter delay instead.
  const [settled, setSettled] = useState(expanded);
  useEffect(() => {
    const t = setTimeout(() => setSettled(expanded), expanded ? OPENING_MS * timeScale : 0);
    return () => clearTimeout(t);
  }, [expanded, timeScale]);
  const phase: RailPhase = !expanded ? "closed" : settled ? "open" : "opening";

  useEffect(() => {
    onState?.({ hover: hovered, focus: focused, pin: pinned, phase });
  }, [hovered, focused, pinned, phase, onState]);

  const sceneRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // After an explicit collapse, ignore the pointer still resting on the panel
  // until it leaves; otherwise the same click would reopen it instantly.
  const suppressHover = useRef(false);
  const pointerInside = useRef(false);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  // Card thumbnail only: tuck out and back now and then, but only while on
  // screen, with the tab visible, and never under reduced motion.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!autoPeek || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let hide: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(scene);
    const cycle = setInterval(() => {
      if (!visible || document.hidden) return;
      setPeek(true);
      hide = setTimeout(() => setPeek(false), PEEK_OPEN_MS);
    }, PEEK_EVERY_MS);
    return () => {
      clearInterval(cycle);
      clearTimeout(hide);
      io.disconnect();
    };
  }, [autoPeek]);

  const collapse = () => {
    // A hover-open still pending from the pointer that just arrived would
    // otherwise re-open the panel right after this collapse.
    clearTimeout(openTimer.current);
    setPinned(false);
    setHovered(false);
    setFocused(false);
    setPeek(false);
    // Only when the pointer is actually on the panel: after a keyboard Esc
    // with the pointer elsewhere, the next hover must still open it.
    suppressHover.current = pointerInside.current;
  };

  const hoverHandlers = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "touch") return;
      pointerInside.current = true;
      if (suppressHover.current) return;
      clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => setHovered(true), OPEN_INTENT_MS * timeScale);
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "touch") return;
      pointerInside.current = false;
      suppressHover.current = false;
      clearTimeout(openTimer.current);
      closeTimer.current = setTimeout(() => setHovered(false), CLOSE_GRACE_MS * timeScale);
    },
  };

  const focusHandlers = interactive
    ? {
        onFocus: (e: FocusEvent<HTMLElement>) => {
          if (e.target.matches(":focus-visible")) setFocused(true);
        },
        onBlur: (e: FocusEvent<HTMLElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (e.key === "Escape" && expanded) {
            e.stopPropagation();
            collapse();
            (document.activeElement as HTMLElement | null)?.blur();
          }
        },
      }
    : {};

  const toggle = () => (expanded ? collapse() : setPinned(true));

  const activeRow = ROWS.find((r) => r.label === active || r.children?.includes(active));
  const section = activeRow
    ? activeRow.children && active !== activeRow.children[0]
      ? titleCase(activeRow.label) + " · " + active
      : titleCase(activeRow.label)
    : null;
  const treeShown = tree && treeOpen && expanded;

  return (
    <div
      ref={sceneRef}
      className="relative h-full w-full overflow-hidden"
      {...(hoverArea === "scene" ? hoverHandlers : {})}
    >
      {/* A stand-in page: the panel floats over it and never pushes it. */}
      <div aria-hidden className="absolute inset-y-4 right-5 left-[100px] flex flex-col gap-3">
        <div className="h-3.5 w-2/5 rounded-full bg-ink/12" />
        <div className="h-2 w-4/5 rounded-full bg-ink/7" />
        <div className="h-2 w-3/5 rounded-full bg-ink/7" />
        <div className="mt-2 grid flex-1 grid-cols-2 gap-3">
          <div className="rounded-xl border border-accent/10 bg-accent/[0.04]" />
          <div className="rounded-xl border border-ink/8 bg-ink/[0.03]" />
        </div>
      </div>

      {xray && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-3 bottom-3 left-3 z-30 w-[232px] rounded-[22px] border border-dashed border-accent/40"
        >
          <span className="absolute right-3 bottom-2 font-mono text-[9px] tracking-[0.08em] text-accent/70">
            LAYOUT BOX · 232PX
          </span>
        </div>
      )}

      <div
        className="absolute top-3 bottom-3 left-3 z-20 flex"
        aria-hidden={interactive ? undefined : true}
        role={interactive ? "navigation" : undefined}
        aria-label={interactive ? "Demo navigation" : undefined}
        {...(hoverArea === "panel" ? hoverHandlers : {})}
        {...focusHandlers}
      >
        <div className={styles.panel + " h-full"} data-expanded={expanded || undefined} data-phase={phase}>
          <div className={styles.inner + " flex h-full flex-col px-[22px] pt-5 pb-4"}>
            <span className="flex items-baseline gap-px">
              <span className="font-script text-[32px] leading-none font-bold text-accent">G</span>
              <span data-word="bemi" className="font-serif-italic text-[16px] text-ink/85 italic">
                bemi
              </span>
            </span>

            <div className="flex w-full flex-1 flex-col py-3" style={{ justifyContent: "safe center" }}>
              <div className={styles.list + " flex w-full flex-col gap-1"}>
                {ROWS.map((row, i) => {
                  const rowStyle = { "--row": i } as CSSProperties;
                  const isActive = activeRow === row;
                  const num = <span className={styles.num}>{"0" + (i + 1)}</span>;
                  if (!row.children || !tree) {
                    return (
                      <RowEl
                        key={row.label}
                        interactive={interactive}
                        onClick={interactive ? () => setActive(row.label) : undefined}
                        aria-current={interactive && isActive ? "page" : undefined}
                        data-active={isActive || undefined}
                        className={styles.link}
                        style={rowStyle}
                      >
                        {num}
                        <span aria-hidden className={styles.tick} />
                        <RollLabel label={row.label} xray={xray} />
                      </RowEl>
                    );
                  }
                  return (
                    <div key={row.label} className="flex w-full flex-col">
                      <RowEl
                        interactive={interactive}
                        onClick={interactive ? () => setTreeOpen((v) => !v) : undefined}
                        aria-expanded={interactive ? treeOpen : undefined}
                        data-active={isActive || undefined}
                        className={styles.link}
                        style={rowStyle}
                      >
                        {num}
                        <span aria-hidden className={styles.tick} />
                        <RollLabel label={row.label} xray={xray} />
                        <span aria-hidden className={styles.chevron} data-open={treeOpen || undefined}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </RowEl>
                      {/* inert while hidden keeps the sub-links out of the tab order. */}
                      <div
                        inert={!treeShown}
                        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ gridTemplateRows: treeShown ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-0.5 mb-2 ml-3 flex flex-col border-l border-ink/10">
                            {row.children.map((child) => (
                              <RowEl
                                key={child}
                                interactive={interactive}
                                onClick={interactive ? () => setActive(child) : undefined}
                                aria-current={interactive && active === child ? "page" : undefined}
                                data-active={active === child || undefined}
                                className={styles.link + " " + styles.sub}
                                style={rowStyle}
                              >
                                <span aria-hidden className={styles.tick} />
                                <RollLabel label={child} xray={xray} />
                              </RowEl>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {tree && (
              <div className="grid items-end *:[grid-area:1/1]">
                <div className={styles.openOnly + " font-mono text-[10px] tracking-[0.08em] text-accent/70"}>
                  RÉSUMÉ ↓
                </div>
                {section && (
                  <div aria-hidden className={styles.railOnly + " flex w-6 justify-center"}>
                    <span className={styles.vertical}>{section}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 flex w-6 justify-center">
              {interactive ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={expanded}
                  aria-label={expanded ? "Collapse demo navigation" : "Expand demo navigation"}
                  className={styles.toggle}
                >
                  <ToggleIcon />
                </button>
              ) : (
                <span className={styles.toggle}>
                  <ToggleIcon />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
