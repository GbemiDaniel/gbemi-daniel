"use client";

// TOPBAR: the site's floating top nav, as a self-contained demo.
// Styles live in ./topbar.module.css, a frozen copy of the live nav's, so nav
// changes can't silently break this (see RAIL). The bar sits over its own
// scrollable stand-in page instead of the window, and all state is per
// instance. `autoplay` drives the card thumbnail through a scripted loop via
// data-demo-hover, which the stylesheet treats exactly like :hover.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import SigilD from "@/components/SigilD";
import styles from "./topbar.module.css";

export type MenuPhase = "closed" | "entering" | "open";
export type TopbarState = {
  floating: boolean;
  hovering: string | null;
  menu: MenuPhase;
  active: string;
};

export const FLOAT_AT_PX = 8; // content passing under the bar → frosted capsule
export const MENU_INTENT_MS = 90; // a cursor passing over WORK doesn't flash the menu
export const MENU_GRACE_MS = 240; // a wide diagonal toward the menu doesn't snap it shut
export const MENU_ENTER_MS = 700; // item cascade, then per-letter hover rolls

type Item = { label: string; serif?: boolean; children?: string[] };
const ITEMS: Item[] = [
  { label: "HOME" },
  { label: "WORK", children: ["Overview", "Collabs", "Concepts", "Lab"] },
  { label: "ABOUT" },
  { label: "WRITING", serif: true },
];

// The card thumbnail's loop: one step every STEP_MS.
type Step = { hover?: string; menu?: boolean; sub?: string; scroll?: number };
const STEP_MS = 900;
const SCRIPT: Step[] = [
  { scroll: 0 },
  { hover: "HOME" },
  { hover: "WORK", menu: true },
  { hover: "WORK", menu: true, sub: "Concepts" },
  { hover: "ABOUT" },
  { hover: "WRITING" },
  { scroll: 160 },
  { hover: "HOME", scroll: 160 },
  { scroll: 160 },
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

/** Rolls into a mono copy of itself, or into the serif italic with `serif`. */
function RollLabel({ label, serif = false, xray }: { label: string; serif?: boolean; xray: boolean }) {
  const name = /[a-z]/.test(label) ? label : titleCase(label);
  const caps = label.toUpperCase();
  return (
    <>
      <span
        aria-hidden
        className={styles.roll}
        data-face={serif ? "serif" : "mono"}
        style={xray ? { outline: "1px dashed rgba(201,243,29,0.55)" } : undefined}
      >
        <Letters text={caps} className={styles.mono} />
        <Letters text={serif ? name : caps} className={styles.back} />
      </span>
      <span className="sr-only">{name}</span>
    </>
  );
}

type ItemProps = HTMLAttributes<HTMLElement> & {
  interactive: boolean;
  "data-active"?: boolean;
  "data-demo-hover"?: boolean;
  "aria-current"?: "page";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

// Buttons when the demo stands alone; plain spans inside a Lab card, where the
// card itself is the control and nested buttons would be unreachable noise.
function ItemEl({ interactive, ...props }: ItemProps) {
  return interactive ? <button type="button" {...props} /> : <span {...props} />;
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TopbarDemo({
  interactive = true,
  autoplay = false,
  xray = false,
  timeScale = 1,
  onState,
}: {
  interactive?: boolean;
  autoplay?: boolean;
  xray?: boolean;
  /** Stretches the JS timers to match slowed-down CSS (breakdown slow-mo). */
  timeScale?: number;
  onState?: (s: TopbarState) => void;
}) {
  const [floating, setFloating] = useState(false);
  const [active, setActive] = useState("HOME");
  const [menuOpen, setMenuOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const [pointerOn, setPointerOn] = useState<string | null>(null);
  const [demoHover, setDemoHover] = useState<string | null>(null);
  const [demoSub, setDemoSub] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const menuOpenRef = useRef(false);
  const setMenu = useCallback(
    (next: boolean) => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      if (next && !menuOpenRef.current) {
        setEntering(true);
        clearTimeout(enterTimer.current);
        enterTimer.current = setTimeout(() => setEntering(false), MENU_ENTER_MS * timeScale);
      }
      menuOpenRef.current = next;
      setMenuOpen(next);
    },
    [timeScale]
  );

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
    },
    []
  );

  const menu: MenuPhase = !menuOpen ? "closed" : entering ? "entering" : "open";
  useEffect(() => {
    onState?.({ floating, hovering: pointerOn ?? demoHover, menu, active });
  }, [floating, pointerOn, demoHover, menu, active, onState]);

  // Frosted once the stand-in page scrolls under the bar.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setFloating(scroller.scrollTop > FLOAT_AT_PX);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu on a press anywhere outside WORK.
  useEffect(() => {
    if (!menuOpen || !interactive) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (!workRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menuOpen, interactive, setMenu]);

  // Card thumbnail only: play the script while on screen, with the tab
  // visible, and never under reduced motion.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!autoplay || !scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let step = 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(scroller);
    const tick = setInterval(() => {
      if (!visible || document.hidden) return;
      const s = SCRIPT[step];
      step = (step + 1) % SCRIPT.length;
      setDemoHover(s.hover ?? null);
      setDemoSub(s.sub ?? null);
      setMenu(Boolean(s.menu));
      if (s.scroll !== undefined) scroller.scrollTo({ top: s.scroll, behavior: "smooth" });
    }, STEP_MS);
    return () => {
      clearInterval(tick);
      io.disconnect();
    };
  }, [autoplay, setMenu]);

  const track = (label: string) =>
    interactive
      ? {
          onPointerEnter: () => setPointerOn(label),
          onPointerLeave: () => setPointerOn((cur) => (cur === label ? null : cur)),
        }
      : {};

  const workHandlers = interactive
    ? {
        // Hover intent both ways: passing over doesn't flash it open, and a
        // slightly wide diagonal toward the menu doesn't snap it shut.
        onPointerEnter: (e: PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse") return;
          clearTimeout(closeTimer.current);
          openTimer.current = setTimeout(() => setMenu(true), MENU_INTENT_MS * timeScale);
        },
        onPointerLeave: (e: PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse") return;
          clearTimeout(openTimer.current);
          closeTimer.current = setTimeout(() => setMenu(false), MENU_GRACE_MS * timeScale);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (e.key === "Escape" && menuOpen) {
            e.stopPropagation();
            setMenu(false);
            workRef.current?.querySelector("button")?.focus();
          }
        },
      }
    : {};

  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden={interactive ? undefined : true}>
      {/* A stand-in page that scrolls under the bar. */}
      <div
        ref={scrollerRef}
        className={`absolute inset-0 ${interactive ? "overflow-y-auto" : "overflow-hidden"}`}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? "Demo page, scroll to frost the bar" : undefined}
      >
        <div aria-hidden className="flex flex-col gap-3 px-8 pt-23 pb-10" style={{ height: 820 }}>
          <div className="h-2 w-24 rounded-full bg-accent/40" />
          <div className="h-5 w-3/5 rounded-full bg-ink/14" />
          <div className="h-5 w-2/5 rounded-full bg-accent/25" />
          <div className="mt-1 h-2 w-4/5 rounded-full bg-ink/8" />
          <div className="h-2 w-3/5 rounded-full bg-ink/8" />
          <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
            <div className="rounded-xl border border-accent/12 bg-accent/5" />
            <div className="rounded-xl border border-ink/8 bg-ink/4" />
            <div className="rounded-xl border border-ink/8 bg-ink/4" />
          </div>
        </div>
      </div>

      <div
        className={styles.bar + " absolute inset-x-3 top-3 z-20"}
        data-floating={floating || undefined}
        role={interactive ? "navigation" : undefined}
        aria-label={interactive ? "Demo navigation" : undefined}
      >
        <div
          className={styles.surface + " flex h-15 items-center gap-6 px-4"}
          style={xray ? { outline: "1px dashed rgba(201,243,29,0.4)", outlineOffset: 2 } : undefined}
        >
          <span className="flex shrink-0 items-baseline gap-2">
            <span className="flex items-baseline gap-px">
              <span className="font-script text-[32px] leading-none font-bold text-accent">G</span>
              <span className="font-serif-italic text-[16px] text-ink/85 italic">bemi</span>
            </span>
            <span className="flex items-baseline gap-1">
              <SigilD style={{ height: 25, width: "auto" }} />
              <span className="font-serif-italic text-[16px] text-ink/85 italic">aniel</span>
            </span>
          </span>

          <div className={styles.list + " ml-auto flex items-center gap-5"}>
            {ITEMS.map((item) => {
              const isActive =
                item.label === active || Boolean(item.children?.includes(active));
              if (!item.children) {
                return (
                  <ItemEl
                    key={item.label}
                    interactive={interactive}
                    onClick={interactive ? () => setActive(item.label) : undefined}
                    aria-current={interactive && isActive ? "page" : undefined}
                    data-active={isActive || undefined}
                    data-demo-hover={demoHover === item.label || undefined}
                    className={styles.link}
                    {...track(item.label)}
                  >
                    <RollLabel label={item.label} serif={item.serif} xray={xray} />
                  </ItemEl>
                );
              }
              return (
                <div key={item.label} ref={workRef} className="relative" {...workHandlers}>
                  <ItemEl
                    interactive={interactive}
                    onClick={interactive ? () => setMenu(!menuOpen) : undefined}
                    aria-expanded={interactive ? menuOpen : undefined}
                    aria-controls={interactive ? "topbar-demo-work" : undefined}
                    data-active={isActive || undefined}
                    data-demo-hover={demoHover === item.label || undefined}
                    className={styles.link}
                    {...track(item.label)}
                  >
                    <RollLabel label={item.label} xray={xray} />
                    <span aria-hidden className={styles.chevron} data-open={menuOpen || undefined}>
                      <Chevron />
                    </span>
                  </ItemEl>
                  <div
                    id={interactive ? "topbar-demo-work" : undefined}
                    inert={!menuOpen}
                    className={styles.menu}
                    data-open={menuOpen || undefined}
                    data-entering={entering || undefined}
                  >
                    <div className={styles.tree}>
                      {item.children.map((child, row) => (
                        <ItemEl
                          key={child}
                          interactive={interactive}
                          onClick={
                            interactive
                              ? () => {
                                  setActive(child);
                                  setMenu(false);
                                }
                              : undefined
                          }
                          aria-current={interactive && active === child ? "page" : undefined}
                          data-active={active === child || undefined}
                          data-demo-hover={demoSub === child || undefined}
                          className={styles.link + " " + styles.sub}
                          style={{ "--row": row } as CSSProperties}
                          {...track(child)}
                        >
                          <span aria-hidden className={styles.tick} />
                          <RollLabel label={child} xray={xray} />
                        </ItemEl>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ItemEl interactive={interactive} className={styles.link} {...track("RÉSUMÉ")}>
            <RollLabel label="Résumé" xray={xray} />
            <span aria-hidden className="ml-1 font-mono text-[11px] text-accent/80">
              ↓
            </span>
          </ItemEl>
        </div>
      </div>
    </div>
  );
}
