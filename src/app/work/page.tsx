/* eslint-disable react-hooks/refs -- wrapperElRef.current is only ever read inside
   goTo/updateFromScroll, which only run from scroll/click/keydown handlers, never
   during render; the static check can't verify that but the pattern is correct. */
/* eslint-disable react-hooks/set-state-in-effect -- restoring the active index from
   sessionStorage must happen client-only (no window/sessionStorage at SSR time), so
   a lazy useState initializer would mismatch on hydration; this one-time mount effect
   is the correct place for it. */
"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import styles from "./work.module.css";

type CombinedItem = {
  key: string;
  title: string;
  category: string;
  year: string;
  href: string;
  imgSrc?: string;
  isLab?: boolean;
};

type RawProject = {
  key: string;
  num: string;
  title: string;
  description: string;
  category: string;
  tagList: string[];
  year: string;
  href: string;
  imgSrc: string;
  featured: boolean;
  group: "main" | "concept";
};

const COMBINED: CombinedItem[] = [
  {
    key: "security-engineer-portfolio",
    title: "Security Engineer Portfolio",
    category: "Collab",
    year: "2026",
    href: "/case-study/security-engineer-portfolio",
    imgSrc: "/images/projects/security-engineer-portfolio/desktop.png",
  },
  {
    key: "dice-portfolio",
    title: "Dice Portfolio",
    category: "Collab",
    year: "2026",
    href: "/case-study/dice-portfolio",
    imgSrc: "/images/projects/dice-portfolio/desktop.png",
  },
  {
    key: "skillzbloom",
    title: "SkillzBloom",
    category: "Team Project",
    year: "2025",
    href: "/case-study/skillzbloom",
    imgSrc: "/images/projects/skillzbloom/desktop.png",
  },
  {
    key: "handshakers",
    title: "Handshakers",
    category: "Independent",
    year: "—",
    href: "/work",
  },
  {
    key: "chronovault",
    title: "ChronoVault",
    category: "Collab",
    year: "2026",
    href: "/case-study/chronovault",
  },
  {
    key: "thrifty",
    title: "Thrifty",
    category: "Collab",
    year: "2026",
    href: "/case-study/thrifty",
    imgSrc: "/images/projects/thrifty/desktop.png",
  },
  {
    key: "lab",
    title: "The Lab",
    category: "Experiments",
    year: "Ongoing",
    href: "/lab",
    isLab: true,
  },
];

const RAW_PROJECTS: RawProject[] = [
  {
    key: "security-engineer-portfolio-g",
    num: "01",
    title: "Security Engineer Portfolio",
    description: "Built a personal website for a security engineer — designed to feel serious, sharp, and trustworthy, the way his work is.",
    category: "COLLAB",
    tagList: ["React", "Tailwind"],
    year: "2026",
    href: "/case-study/security-engineer-portfolio",
    imgSrc: "/images/projects/security-engineer-portfolio/desktop.png",
    featured: true,
    group: "main",
  },
  {
    key: "dice-portfolio-g",
    num: "02",
    title: "Dice Portfolio",
    description: "Worked with a brand and product designer to turn his design into a real, working website — then added extra touches beyond what was originally asked for.",
    category: "COLLAB",
    tagList: ["React", "Tailwind"],
    year: "2026",
    href: "/case-study/dice-portfolio",
    imgSrc: "/images/projects/dice-portfolio/desktop.png",
    featured: false,
    group: "main",
  },
  {
    key: "skillzbloom-g",
    num: "03",
    title: "SkillzBloom",
    description: "Helped build a platform that helps students track their learning. I built the entire Skills section plus a reusable design system used across the app.",
    category: "TEAM PROJECT",
    tagList: ["TypeScript", "Tailwind"],
    year: "2025",
    href: "/case-study/skillzbloom",
    imgSrc: "/images/projects/skillzbloom/desktop.png",
    featured: false,
    group: "main",
  },
  {
    key: "handshakers-g",
    num: "04",
    title: "Handshakers",
    description: "Details coming soon — my newest build.",
    category: "INDEPENDENT",
    tagList: [],
    year: "—",
    href: "/work",
    imgSrc: "",
    featured: false,
    group: "main",
  },
  {
    key: "chronovault-g",
    num: "01",
    title: "ChronoVault",
    description: "A digital time-capsule idea that lets people lock away files or messages until a future date. I built the interface from a collaborator's design, bringing the whole idea to life on screen.",
    category: "COLLAB",
    tagList: ["React", "Framer Motion"],
    year: "2026",
    href: "/case-study/chronovault",
    imgSrc: "",
    featured: false,
    group: "concept",
  },
  {
    key: "thrifty-g",
    num: "02",
    title: "Thrifty",
    description: "An online clothing store frontend — I built out a collaborator's design into a real, working shopping experience.",
    category: "COLLAB",
    tagList: ["React", "Next.js"],
    year: "2026",
    href: "/case-study/thrifty",
    imgSrc: "/images/projects/thrifty/desktop.png",
    featured: false,
    group: "concept",
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

const stackClassFor = (i: number) =>
  i === 0 ? styles.stack0 : i === 1 ? styles.stack1 : styles.stack2;

type WallCard = {
  key: string;
  node: ReactNode;
  title: string;
  subtitle: string;
};

const WALL_CARD_WIDTH = 320;
const WALL_GAP = 28;
const WALL_MAX_ANGLE = 46;
const WALL_SPEED = 30; // px/sec
const WALL_RESUME_DELAY = 500; // ms after the user stops interacting

/**
 * Curved-wall carousel: cards auto-scroll in an infinite loop (two copies of
 * the list back to back, with scrollLeft wrapped once it passes one full
 * copy) and bend in 3D based on distance from the row's horizontal center,
 * as if mounted on the inside of a cylinder. Bend math runs on every animation
 * frame via direct DOM writes (not React state) so it stays cheap; only the
 * "which card is centered" index is lifted into state, and only when it
 * actually changes.
 */
function CurvedWallRow({ cards }: { cards: WallCard[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const count = cards.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    let singleSetWidth = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      const firstEl = cardElsRef.current[0];
      const lastOfFirstCopy = cardElsRef.current[count - 1];
      if (firstEl && lastOfFirstCopy) {
        singleSetWidth =
          lastOfFirstCopy.offsetLeft + lastOfFirstCopy.offsetWidth + WALL_GAP - firstEl.offsetLeft;
      }
    };
    measure();

    const applyTransforms = () => {
      const rect = track.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const half = rect.width / 2 || 1;
      let closestIdx = 0;
      let closestDist = Infinity;

      cardElsRef.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = r.left + r.width / 2 - centerX;
        const normalized = Math.max(-1, Math.min(1, dist / half));
        el.style.transform = `rotateY(${normalized * WALL_MAX_ANGLE}deg)`;
        el.style.transformOrigin = normalized < 0 ? "right center" : "left center";
        const fringe = Math.max(0, (Math.abs(normalized) - 0.72) / 0.28);
        el.style.setProperty("--fringe", String(fringe));
        el.style.setProperty("--fringe-dir", normalized < 0 ? "1" : "-1");

        const absDist = Math.abs(dist);
        if (absDist < closestDist) {
          closestDist = absDist;
          closestIdx = i % count;
        }
      });

      if (closestIdx !== activeIndexRef.current) {
        activeIndexRef.current = closestIdx;
        setActiveIndex(closestIdx);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!pausedRef.current) {
        track.scrollLeft += WALL_SPEED * dt;
        if (singleSetWidth > 0 && track.scrollLeft >= singleSetWidth) {
          track.scrollLeft -= singleSetWidth;
        }
      }
      applyTransforms();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const pause = () => {
      clearTimeout(resumeTimer);
      pausedRef.current = true;
    };
    const scheduleResume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        pausedRef.current = false;
      }, WALL_RESUME_DELAY);
    };
    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", scheduleResume);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchend", scheduleResume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", scheduleResume);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      window.removeEventListener("resize", onResize);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", scheduleResume);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", scheduleResume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", scheduleResume);
    };
  }, [count]);

  const active = cards[activeIndex];
  const doubled = [...cards, ...cards];

  return (
    <div>
      <div className="mb-5 text-center">
        <div className="text-[17px] font-semibold">{active?.title}</div>
        <div className="mt-0.5 font-mono text-[11px] text-ink/45">{active?.subtitle}</div>
      </div>
      <div
        ref={trackRef}
        className={`flex overflow-x-auto ${styles.noScrollbar}`}
        style={{ gap: WALL_GAP, perspective: 1100 }}
      >
        {doubled.map((card, i) => {
          const isDuplicate = i >= count;
          const node = isDuplicate
            ? cloneElement(card.node as ReactElement<{ tabIndex?: number }>, { tabIndex: -1 })
            : card.node;
          return (
            <div
              key={`${card.key}-${i}`}
              ref={(el) => {
                cardElsRef.current[i] = el;
              }}
              aria-hidden={isDuplicate || undefined}
              className={`relative flex-none ${styles.wallCard}`}
              style={{ width: WALL_CARD_WIDTH }}
            >
              {node}
              <span aria-hidden className={styles.fringe} />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center">
        <span className="rounded-full border border-accent/25 px-3 py-1 font-mono text-[11px] text-accent/80">
          {String(activeIndex + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);

  const wrapperElRef = useRef<HTMLDivElement | null>(null);
  const tickingRef = useRef(false);
  const restorePendingRef = useRef(false);
  const featuredRowRef = useRef<HTMLDivElement | null>(null);
  const conceptsRowRef = useRef<HTMLDivElement | null>(null);

  const stageH = isMobile ? 600 : isNarrow ? 660 : 760;

  useEffect(() => {
    if (!isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = [featuredRowRef.current, conceptsRowRef.current].filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (rows.length === 0) return;

    // Continuously scale/fade each card by its own distance from the row's
    // horizontal center — direct DOM writes each frame, no React state, so
    // it tracks scroll position exactly (not just at two fixed trigger
    // points) and stays cheap.
    let raf = 0;
    const applyRow = (row: HTMLDivElement) => {
      const rect = row.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const half = rect.width / 2 || 1;
      Array.from(row.children).forEach((child) => {
        const el = child as HTMLElement;
        const r = el.getBoundingClientRect();
        const normalized = Math.min(1, Math.abs(r.left + r.width / 2 - centerX) / half);
        el.style.transform = `scale(${1 - normalized * 0.12})`;
        el.style.opacity = String(1 - normalized * 0.45);
      });
    };
    const tick = () => {
      rows.forEach(applyRow);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // One-time nudge per row, once it's in view, so the horizontal
    // momentum-scroll feel is discoverable before the user touches it.
    const nudged = new Set<HTMLDivElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const row = entry.target as HTMLDivElement;
          if (!entry.isIntersecting || nudged.has(row)) return;
          nudged.add(row);
          const start = row.scrollLeft;
          row.scrollTo({ left: start + 44, behavior: "smooth" });
          setTimeout(() => row.scrollTo({ left: start, behavior: "smooth" }), 550);
        });
      },
      { threshold: 0.4 }
    );
    rows.forEach((row) => io.observe(row));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [isMobile]);

  const updateFromScroll = useCallback(() => {
    const wrapperEl = wrapperElRef.current;
    if (!wrapperEl) return;
    const total = wrapperEl.offsetHeight - stageH;
    if (total <= 0) return;
    const rect = wrapperEl.getBoundingClientRect();
    let progress = -rect.top / total;
    progress = Math.max(0, Math.min(1, progress));
    const idx = Math.round(progress * (COMBINED.length - 1));
    const top = window.scrollY > 600;
    setActive((prev) => (prev !== idx ? idx : prev));
    setShowTop((prev) => (prev !== top ? top : prev));
    if (idx !== active) sessionStorage.setItem("work-active-index", String(idx));
  }, [active, stageH]);

  const goTo = useCallback(
    (i: number, instant?: boolean) => {
      const target = Math.max(0, Math.min(COMBINED.length - 1, i));
      sessionStorage.setItem("work-active-index", String(target));
      if (!instant) restorePendingRef.current = false;
      const wrapperEl = wrapperElRef.current;
      if (!wrapperEl) {
        setActive(target);
        return;
      }
      const total = wrapperEl.offsetHeight - stageH;
      const wrapperTop = wrapperEl.getBoundingClientRect().top + window.scrollY;
      const targetScroll = wrapperTop + (target / (COMBINED.length - 1)) * total;
      window.scrollTo({ top: targetScroll, behavior: instant ? "auto" : "smooth" });
      setActive(target);
    },
    [stageH]
  );

  useEffect(() => {
    const checkSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 700);
      setIsNarrow(w < 950);
    };
    checkSize();
    window.addEventListener("resize", checkSize);

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        updateFromScroll();
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const cancelRestore = () => {
      restorePendingRef.current = false;
    };
    window.addEventListener("wheel", cancelRestore, { passive: true, once: true });
    window.addEventListener("touchstart", cancelRestore, { passive: true, once: true });

    const attemptRestore = (idx: number, tries: number) => {
      if (!restorePendingRef.current || tries > 20) {
        restorePendingRef.current = false;
        return;
      }
      const wrapperEl = wrapperElRef.current;
      if (!wrapperEl || wrapperEl.offsetHeight < stageH + 10) {
        setTimeout(() => attemptRestore(idx, tries + 1), 100);
        return;
      }
      goTo(idx, true);
      restorePendingRef.current = false;
    };

    const saved = sessionStorage.getItem("work-active-index");
    const idx = saved !== null ? parseInt(saved, 10) : NaN;
    if (!isNaN(idx) && idx > 0) {
      setActive(idx);
      restorePendingRef.current = true;
      attemptRestore(idx, 0);
    } else {
      updateFromScroll();
    }

    return () => {
      window.removeEventListener("resize", checkSize);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardH = isMobile ? 224 : isNarrow ? 232 : 280;
  const cardW = isMobile ? 272 : isNarrow ? 300 : 380;
  const gap = isMobile ? 46 : 64;
  const step1 = cardH / 2 + gap;
  const step2 = step1 + cardH * 0.62 + gap * 0.7;
  const perItem = isMobile ? 220 : 320;
  const wrapperHeight = stageH + perItem * (COMBINED.length - 1);

  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  const mainProjects = RAW_PROJECTS.filter((p) => p.group === "main");
  const conceptProjects = RAW_PROJECTS.filter((p) => p.group === "concept");
  const activeItem = COMBINED[active];

  const projectCard = (p: RawProject, i: number) => {
    const on = hovered === p.key;
    return (
      <Link
        key={p.key}
        href={p.href}
        onMouseEnter={() => setHovered(p.key)}
        onMouseLeave={() => setHovered(null)}
        className={`group relative block w-[min(320px,80vw)] flex-none shrink-0 snap-center overflow-hidden rounded-xl text-inherit no-underline transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 max-[700px]:w-[72vw] ${stackClassFor(i)}`}
        style={{
          border: `1px solid ${on ? "rgba(201,243,29,0.4)" : "rgba(201,243,29,0.15)"}`,
          boxShadow: on ? "0 20px 40px -14px rgba(0,0,0,0.55)" : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        <div className="relative flex items-center justify-between gap-1.5 bg-band px-3.5 py-2.5 max-[700px]:px-2.5 max-[700px]:py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-[7px] w-[7px] rounded-full bg-ink/20" />
            <span className="h-[7px] w-[7px] rounded-full bg-ink/20" />
            <span className="h-[7px] w-[7px] rounded-full bg-ink/20" />
          </div>
          {p.featured && (
            <span className="shrink-0 rounded bg-accent px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.05em] text-bg max-[700px]:px-1.5 max-[700px]:text-[9px]">
              FEATURED
            </span>
          )}
        </div>
        <div className="relative overflow-hidden">
          <ImageSlot
            alt={p.title}
            placeholder="Drop project image"
            src={p.imgSrc}
            shape="rect"
            className="h-[200px] w-full max-[700px]:h-[120px]"
          />
          <span className="pointer-events-none absolute top-3.5 right-3.5 font-mono text-[44px] leading-none font-bold text-ink/10 max-[700px]:top-2 max-[700px]:right-2 max-[700px]:text-[28px]">
            {p.num}
          </span>
        </div>
        <div className="p-5 max-[700px]:p-3.5">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-accent max-[700px]:mb-1.5 max-[700px]:text-[10px]">
            <span>{p.category}</span>
            <span className="transition-opacity duration-300" style={{ opacity: on ? 1 : 0 }}>
              →
            </span>
          </div>
          <h3 className="m-0 mb-2 text-[19px] font-semibold max-[700px]:mb-1 max-[700px]:text-[15px]">
            {p.title}
          </h3>
          <p className="m-0 mb-3.5 text-[13px] leading-[1.5] text-ink/55 max-[700px]:mb-2 max-[700px]:line-clamp-2 max-[700px]:text-[11.5px]">
            {p.description}
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5 max-[700px]:mb-2">
            {p.tagList.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink/15 px-2 py-[3px] font-mono text-[10px] text-ink/55 max-[700px]:px-1.5 max-[700px]:text-[9px]"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto self-center font-mono text-[10px] text-ink/35 max-[700px]:text-[9px]">
              {p.year}
            </span>
          </div>
          <div
            className="h-px bg-accent transition-[width] duration-400 ease-in-out"
            style={{ width: on ? "48px" : "0px" }}
          />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HEADER */}
        <section className="relative mx-auto max-w-[1200px] overflow-hidden px-8 pt-16 pb-10 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-6">
          <div className="pointer-events-none absolute -top-[100px] -right-[5%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(140,210,60,0.12),transparent_70%)] blur-[50px]" />
          <div className="relative mb-4 text-[13px] tracking-[0.1em] text-ink/50 uppercase">
            Selected Work
          </div>
          <h1 className="relative m-0 mb-3 text-[clamp(28px,4.2vw,44px)] leading-[1.15] font-bold">
            A gallery of things I&apos;ve{" "}
            <span className="text-accent">shipped, broken, and rebuilt.</span>
          </h1>
          <p className="relative m-0 max-w-[560px] text-[15px] text-ink/55">
            Real projects for real people — each one built to fit who it&apos;s actually for, not
            copied from the last one.
          </p>
        </section>

        {/* PROJECT CHAIN */}
        <div
          ref={wrapperElRef}
          className="relative mx-auto max-w-[1200px] px-8 pb-24"
          style={{ height: wrapperHeight }}
        >
          <section
            className={`sticky top-0 overflow-hidden ${isMobile ? "flex flex-col" : ""}`}
            style={{ height: stageH }}
          >
            {!isMobile && (
              <>
                <div className="absolute top-1/2 left-8 z-[5] flex max-w-[160px] -translate-y-1/2 items-baseline gap-3.5">
                  <span className="font-mono text-xs text-accent">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg leading-[1.3] font-semibold">{activeItem.title}</span>
                </div>
                <div className="absolute right-8 bottom-6 z-[5] text-right">
                  <div className="mb-0.5 text-[15px] font-semibold">{activeItem.category}</div>
                  <div className="font-mono text-[11px] text-ink/40">{activeItem.year}</div>
                </div>
              </>
            )}
            {!isMobile && (
              <div className="absolute top-0 right-8 z-[5] flex flex-col gap-1.5 text-right">
                {COMBINED.map((c, i) => (
                  <span
                    key={c.key}
                    onClick={() => goTo(i)}
                    onKeyDown={keyActivate(() => goTo(i))}
                    tabIndex={0}
                    role="button"
                    aria-label={c.title}
                    className="cursor-pointer font-mono text-[11px] tracking-[0.02em] outline-none transition-colors duration-300 focus-visible:underline"
                    style={{
                      color: i === active ? "#C9F31D" : "rgba(242,239,233,0.35)",
                      fontWeight: i === active ? 700 : 400,
                    }}
                  >
                    {c.title}
                  </span>
                ))}
              </div>
            )}

            <div
              className={
                isMobile
                  ? "relative flex flex-1 items-center justify-center"
                  : "absolute inset-0 flex items-center justify-center"
              }
            >
              {COMBINED.map((card, i) => {
                const offset = i - active;
                const abs = Math.abs(offset);
                let transform: string;
                let opacity: number;
                let z: number;
                let pe: "auto" | "none";
                if (offset === 0) {
                  transform = "translateY(0) scale(1) rotate(0deg)";
                  opacity = 1;
                  z = 3;
                  pe = "auto";
                } else if (abs === 1) {
                  transform = `translateY(${offset * step1}px) scale(0.78) rotate(${offset * 4}deg)`;
                  opacity = 0.3;
                  z = 2;
                  pe = "auto";
                } else if (abs === 2) {
                  transform = `translateY(${offset * step2}px) scale(0.58) rotate(${offset * 6}deg)`;
                  opacity = 0;
                  z = 1;
                  pe = "none";
                } else {
                  transform = `translateY(${offset * step2 * 1.4}px) scale(0.45)`;
                  opacity = 0;
                  z = 0;
                  pe = "none";
                }
                const onClick =
                  offset === 0 ? () => (window.location.href = card.href) : () => goTo(i);
                return (
                  <div
                    key={card.key}
                    onClick={onClick}
                    onKeyDown={keyActivate(onClick)}
                    tabIndex={pe === "none" ? -1 : 0}
                    role="button"
                    aria-label={card.title}
                    className="absolute cursor-pointer overflow-hidden rounded-2xl outline-none"
                    style={{
                      width: cardW,
                      height: cardH,
                      transform,
                      opacity,
                      zIndex: z,
                      pointerEvents: pe,
                      transition:
                        "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",
                      boxShadow: "0 24px 50px -20px rgba(0,0,0,0.6)",
                    }}
                  >
                    {card.isLab ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-4 border border-accent/20 bg-band">
                        <div className="relative h-14 w-14">
                          <div className={`absolute inset-0 ${styles.orbitSpin}`}>
                            <span className="absolute top-0 left-1/2 h-2 w-2 -ml-1 rounded-full bg-accent shadow-[0_0_10px_3px_rgba(201,243,29,0.5)]" />
                          </div>
                          <span className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -m-[5px] rounded-full bg-ink/50" />
                        </div>
                        <span className="font-mono text-[11px] tracking-[0.08em] text-ink/50">
                          VISIT THE LAB →
                        </span>
                      </div>
                    ) : (
                      <>
                        <ImageSlot
                          alt={card.title}
                          placeholder="Drop project image"
                          src={card.imgSrc}
                          shape="rect"
                          className="h-full w-full"
                        />
                        {offset === 0 && (
                          <span className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-[rgba(11,8,16,0.7)] px-3 py-1.5 font-mono text-[10px] tracking-[0.05em] text-ink backdrop-blur-sm">
                            ↗ VIEW
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {!isMobile && (
              <div className="absolute bottom-6 left-8 z-[5] flex gap-2">
                <span
                  onClick={prev}
                  onKeyDown={keyActivate(prev)}
                  tabIndex={0}
                  role="button"
                  aria-label="Previous project"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-accent/25 text-ink/60 outline-none transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
                >
                  ↑
                </span>
                <span
                  onClick={next}
                  onKeyDown={keyActivate(next)}
                  tabIndex={0}
                  role="button"
                  aria-label="Next project"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-accent/25 text-ink/60 outline-none transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
                >
                  ↓
                </span>
              </div>
            )}

            {isMobile && (
              <div className="flex shrink-0 flex-col gap-3 border-t border-accent/10 px-1 pt-4 pb-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <span className="shrink-0 font-mono text-xs text-accent">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-base font-semibold">{activeItem.title}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[12px] font-semibold">{activeItem.category}</div>
                    <div className="font-mono text-[10px] text-ink/40">{activeItem.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      onClick={prev}
                      onKeyDown={keyActivate(prev)}
                      tabIndex={0}
                      role="button"
                      aria-label="Previous project"
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent/25 text-ink/60 outline-none transition-colors duration-200 active:border-accent active:text-accent"
                    >
                      ↑
                    </span>
                    <span
                      onClick={next}
                      onKeyDown={keyActivate(next)}
                      tabIndex={0}
                      role="button"
                      aria-label="Next project"
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent/25 text-ink/60 outline-none transition-colors duration-200 active:border-accent active:text-accent"
                    >
                      ↓
                    </span>
                  </div>
                  <div className="flex flex-1 gap-1">
                    {COMBINED.map((c, i) => (
                      <span
                        key={c.key}
                        className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                        style={{ background: i === active ? "#C9F31D" : "rgba(242,239,233,0.15)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* FEATURED & COLLABS */}
        <section className="mx-auto max-w-[1200px] px-8 pt-6 pb-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <div className="font-mono text-xs tracking-[0.1em] text-ink/40">
              <span className="text-accent">01</span> — FEATURED &amp; COLLABS
            </div>
          </div>
          {isMobile ? (
            <div
              ref={featuredRowRef}
              className={`-mx-8 flex items-start gap-4 overflow-x-auto pb-2 ${styles.noScrollbar}`}
              style={{ scrollSnapType: "x mandatory", paddingInline: "14vw", scrollPaddingInline: "14vw" }}
            >
              {mainProjects.map((p, i) => projectCard(p, i))}
              <div className="min-h-[340px] w-[min(320px,80vw)] flex-none shrink-0 snap-center rounded-xl border border-dashed border-accent/25 p-5 text-center max-[700px]:min-h-[220px] max-[700px]:w-[72vw] max-[700px]:p-3.5">
                <div className="flex h-full flex-col items-center justify-center gap-2.5">
                  <span className="font-mono text-[26px] text-accent/60">+</span>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-ink/40">
                    More client work
                    <br />
                    in progress
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <CurvedWallRow
              cards={[
                ...mainProjects.map((p, i) => ({
                  key: p.key,
                  node: projectCard(p, i),
                  title: p.title,
                  subtitle: p.category,
                })),
                {
                  key: "featured-more",
                  title: "More work",
                  subtitle: "In progress",
                  node: (
                    <div className="min-h-[340px] w-[320px] rounded-xl border border-dashed border-accent/25 p-5 text-center">
                      <div className="flex h-full flex-col items-center justify-center gap-2.5">
                        <span className="font-mono text-[26px] text-accent/60">+</span>
                        <span className="font-mono text-[11px] tracking-[0.06em] text-ink/40">
                          More client work
                          <br />
                          in progress
                        </span>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </section>

        {/* CONCEPTS */}
        <section className="mx-auto max-w-[1200px] px-8 pt-2 pb-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <div className="font-mono text-xs tracking-[0.1em] text-ink/40">
              <span className="text-accent">02</span> — CONCEPTS
            </div>
          </div>
          {isMobile ? (
            <div
              ref={conceptsRowRef}
              className={`-mx-8 flex items-start gap-4 overflow-x-auto pb-2 ${styles.noScrollbar}`}
              style={{ scrollSnapType: "x mandatory", paddingInline: "14vw", scrollPaddingInline: "14vw" }}
            >
              {conceptProjects.map((p, i) => projectCard(p, i))}
              <div
                className={`min-h-[340px] w-[min(320px,80vw)] flex-none shrink-0 snap-center rounded-xl border border-dashed border-accent/25 p-5 text-center max-[700px]:min-h-[220px] max-[700px]:w-[72vw] max-[700px]:p-3.5 ${styles.stack1}`}
              >
                <div className="flex h-full flex-col items-center justify-center gap-2.5">
                  <span className="font-mono text-[26px] text-accent/60">+</span>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-ink/40">
                    More concepts
                    <br />
                    brewing
                  </span>
                </div>
              </div>
              <div
                className={`min-h-[340px] w-[min(320px,80vw)] flex-none shrink-0 snap-center rounded-xl border border-dashed border-accent/15 p-5 text-center max-[700px]:min-h-[220px] max-[700px]:w-[72vw] max-[700px]:p-3.5 ${styles.stack2}`}
              >
                <div className="flex h-full flex-col items-center justify-center gap-2.5">
                  <span className="font-mono text-[26px] text-accent/40">?</span>
                  <span className="font-mono text-[11px] tracking-[0.06em] text-ink/30">
                    Still sketching
                    <br />
                    the next one
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <CurvedWallRow
              cards={[
                ...conceptProjects.map((p, i) => ({
                  key: p.key,
                  node: projectCard(p, i),
                  title: p.title,
                  subtitle: p.category,
                })),
                {
                  key: "concepts-more",
                  title: "More concepts",
                  subtitle: "Brewing",
                  node: (
                    <div className="min-h-[340px] w-[320px] rounded-xl border border-dashed border-accent/25 p-5 text-center">
                      <div className="flex h-full flex-col items-center justify-center gap-2.5">
                        <span className="font-mono text-[26px] text-accent/60">+</span>
                        <span className="font-mono text-[11px] tracking-[0.06em] text-ink/40">
                          More concepts
                          <br />
                          brewing
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "concepts-sketching",
                  title: "Still sketching",
                  subtitle: "The next one",
                  node: (
                    <div className="min-h-[340px] w-[320px] rounded-xl border border-dashed border-accent/15 p-5 text-center">
                      <div className="flex h-full flex-col items-center justify-center gap-2.5">
                        <span className="font-mono text-[26px] text-accent/40">?</span>
                        <span className="font-mono text-[11px] tracking-[0.06em] text-ink/30">
                          Still sketching
                          <br />
                          the next one
                        </span>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </section>

        {/* LAB TEASER */}
        <section className="mx-auto max-w-[1200px] px-8 pt-2 pb-24">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <div className="font-mono text-xs tracking-[0.1em] text-ink/40">
              <span className="text-accent">03</span> — LAB
            </div>
            <Link
              href="/lab"
              className="font-mono text-[11px] tracking-[0.08em] text-accent no-underline hover:underline"
            >
              VIEW ALL →
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl border border-accent/15 p-8 max-[700px]:flex-col-reverse max-[700px]:items-stretch max-[700px]:gap-5 max-[700px]:p-0">
            <div className="max-w-[480px] max-[700px]:max-w-none max-[700px]:px-5 max-[700px]:pb-5">
              <h3 className="m-0 mb-2.5 text-[22px] font-bold max-[700px]:text-[18px]">
                Not everything here is a project for a client.
              </h3>
              <p className="m-0 mb-4 text-sm leading-relaxed text-ink/55 max-[700px]:text-[13px]">
                Small interaction studies and interface experiments — some finished, some just
                proof a hunch works.
              </p>
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 text-[13px] text-accent no-underline hover:underline"
              >
                Visit the Lab →
              </Link>
            </div>
            <div className="flex gap-4 max-[700px]:gap-3 max-[700px]:rounded-t-2xl max-[700px]:border-b max-[700px]:border-accent/15 max-[700px]:bg-band max-[700px]:p-5">
              <div className="flex h-[90px] w-[90px] items-center justify-center rounded-xl border border-accent/20 bg-band max-[700px]:h-[100px] max-[700px]:w-auto max-[700px]:flex-1 max-[700px]:bg-bg">
                <div className="relative h-11 w-11">
                  <div className={`absolute inset-0 ${styles.orbitSpin}`}>
                    <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -ml-[3px] rounded-full bg-accent shadow-[0_0_8px_2px_rgba(201,243,29,0.5)]" />
                  </div>
                  <span className="absolute top-1/2 left-1/2 h-2 w-2 -m-1 rounded-full bg-ink/50" />
                </div>
              </div>
              <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-xl border border-accent/20 bg-band max-[700px]:h-[100px] max-[700px]:w-auto max-[700px]:flex-1 max-[700px]:bg-bg">
                <div
                  className="h-[60px] w-[60px] bg-[radial-gradient(rgba(201,243,29,0.35)_1px,transparent_1.5px)]"
                  style={{ backgroundSize: "12px 12px" }}
                />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <span
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-7 bottom-7 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-accent text-base text-bg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] transition-opacity duration-250 hover:[animation:arrowPulse_0.6s_cubic-bezier(0.34,1.56,0.64,1)_1]"
        style={{ opacity: showTop ? 1 : 0, pointerEvents: showTop ? "auto" : "none" }}
      >
        ↑
      </span>
    </div>
  );
}
