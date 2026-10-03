"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, HOUSE_EASE } from "@/lib/motion";
import SigilD from "./SigilD";
import SocialIcon from "./SocialIcon";
import { useDesktopNavMotion } from "./navMotion";
import styles from "./nav.module.css";

type NavChild = { href: string; label: string; match: (p: string) => boolean };
type NavLink = {
  href: string;
  label: string;
  match: (p: string) => boolean;
  children?: NavChild[];
  /** Roll into the Instrument Serif italic of the writing pages on hover. */
  serif?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "HOME", match: (p) => p === "/" },
  {
    href: "/work",
    label: "WORK",
    match: (p) =>
      p.startsWith("/work") ||
      p.startsWith("/client-work") ||
      p.startsWith("/concepts") ||
      p.startsWith("/case-study") ||
      p.startsWith("/lab"),
    children: [
      {
        href: "/work",
        label: "Overview",
        match: (p) => p === "/work" || p.startsWith("/case-study"),
      },
      // "Collabs" rather than "Client Work" — short enough for the 140px
      // rail (the full title wraps to two lines there), and it matches the
      // COLLAB tag every project on that page already carries.
      { href: "/client-work", label: "Collabs", match: (p) => p.startsWith("/client-work") },
      { href: "/concepts", label: "Concepts", match: (p) => p.startsWith("/concepts") },
      { href: "/lab", label: "Lab", match: (p) => p.startsWith("/lab") },
    ],
  },
  { href: "/about", label: "ABOUT", match: (p) => p.startsWith("/about") },
  {
    href: "/blog",
    label: "WRITING",
    serif: true,
    match: (p) => p.startsWith("/blog") || p.startsWith("/article"),
  },
];

/**
 * Desktop space the floating top bar takes: 16px inset + 60px bar + 8px air.
 * Mirrored by `#main-content`'s padding-top and html's scroll-padding-top in
 * globals.css — change them together.
 */
export const NAV_CLEARANCE = 84;

const skipLinkClass =
  "fixed left-[-9999px] top-0 z-[300] rounded-br-lg bg-accent px-[18px] py-2.5 font-grotesk text-[13px] font-bold text-bg focus:left-0";

// Every page mounts its own <Nav/>, so component state alone would snap the
// tree shut on each navigation. This outlives those remounts but not a full
// reload, so the first render always matches the (collapsed) server HTML.
const openSections = new Set<string>();

function useOpenSections() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(openSections));
  const toggle = (href: string) => {
    if (openSections.has(href)) openSections.delete(href);
    else openSections.add(href);
    setOpen(new Set(openSections));
  };
  return [open, toggle] as const;
}

function Waveform() {
  return (
    <svg width="64" height="14" viewBox="0 0 64 14" fill="none">
      <path
        d="M0 7H10L14 2L18 12L22 4L26 10L30 7H64"
        stroke="rgba(242,239,233,0.3)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One whole word, revealed by a left-to-right wipe like a pen stroke.
 * Deliberately not split into per-letter spans: inline-block letters drop
 * the font's kerning pairs, which is what made the italic read unevenly
 * spaced. The clip starts closed in CSS so there's no flash before GSAP runs.
 */
function WritingWord({
  text,
  className,
  style,
  dataWord,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  dataWord: string;
}) {
  return (
    <span
      data-word={dataWord}
      className={`inline-block [clip-path:inset(-30%_100%_-30%_-15%)] ${className ?? ""}`}
      style={style}
    >
      {text}
    </span>
  );
}

// Clip states for the wipe. Negative insets leave room for the italic's
// overhang and descenders so nothing is shaved off once it's fully shown.
const WIPE_HIDDEN = "inset(-30% 100% -30% -15%)";
const WIPE_SHOWN = "inset(-30% -15% -30% -15%)";

function BrandMark({ isMobile }: { isMobile: boolean }) {
  // Everything keys off the name size: the G, sigil and every gap are em
  // multiples of it, so mobile and desktop share one set of proportions
  // instead of two hand-tuned pixel sets that drift apart.
  const nameSize = isMobile ? 13 : 16;
  const rootRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const words = root.querySelectorAll("[data-word]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root.querySelectorAll("[data-mark]"), { opacity: 1, y: 0, scale: 1 });
      gsap.set(words, { clipPath: WIPE_SHOWN });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: HOUSE_EASE } });
      tl.fromTo(
        root.querySelector("[data-mark='g']"),
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3 }
      )
        .fromTo(
          root.querySelector("[data-word='bemi']"),
          { clipPath: WIPE_HIDDEN },
          { clipPath: WIPE_SHOWN, duration: 0.45, ease: "power2.inOut" },
          "-=0.12"
        )
        .fromTo(
          root.querySelector("[data-mark='sigil']"),
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.35 },
          "-=0.1"
        )
        .fromTo(
          root.querySelector("[data-word='aniel']"),
          { clipPath: WIPE_HIDDEN },
          { clipPath: WIPE_SHOWN, duration: 0.5, ease: "power2.inOut" },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Link
      ref={rootRef}
      href="/"
      aria-label="Gbemi Daniel — home"
      className="flex shrink-0 items-baseline leading-none no-underline"
      style={{ fontSize: nameSize }}
    >
      <span aria-hidden className="flex items-baseline">
        <span data-mark="g" className={`relative -top-[0.09em] font-script text-[1.9em] leading-none font-bold ${styles.brandG}`}>
          G
        </span>
        <WritingWord
          text="bemi"
          dataWord="bemi"
          className="-ml-[0.08em] font-serif-italic font-normal text-ink/85 italic"
        />
      </span>
      <span aria-hidden className="ml-[0.55em] flex items-baseline">
        <SigilD
          data-mark="sigil"
          className="relative top-[0.1em] h-[1.5em] w-auto"
        />
        <WritingWord
          text="aniel"
          dataWord="aniel"
          className="ml-[0.03em] font-serif-italic font-normal text-ink/85 italic"
        />
      </span>
    </Link>
  );
}

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

/**
 * A label that rolls letter by letter into a second copy of itself: the same
 * Space Mono caps by default, or the Instrument Serif italic of the writing
 * pages with `serif`. Both copies are decorative; the sr-only text carries
 * the accessible name.
 */
function RollLabel({ label, serif = false }: { label: string; serif?: boolean }) {
  const name = /[a-z]/.test(label) ? label : titleCase(label);
  const caps = label.toUpperCase();
  return (
    <>
      <span aria-hidden className={styles.roll} data-face={serif ? "serif" : "mono"}>
        <Letters text={caps} className={styles.mono} />
        <Letters text={serif ? name : caps} className={styles.back} />
      </span>
      <span className="sr-only">{name}</span>
    </>
  );
}

/** True once content starts passing under the bar (drives its frosted state). */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return scrolled;
}

function WorkMenu({ link, pathname }: { link: NavLink; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const active = link.match(pathname);
  const id = `nav-sub-${link.label.toLowerCase()}`;

  const setMenu = (next: boolean) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    setOpen(next);
    if (next && !open) setEntering(true);
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setEntering(false), 700);
    const onDown = (e: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => {
      clearTimeout(t);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <div
      ref={rootRef}
      data-navitem
      className="relative"
      // Hover intent both ways: a cursor passing over doesn't flash it open,
      // and a slightly wide diagonal toward the menu doesn't snap it shut.
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(closeTimer.current);
        openTimer.current = setTimeout(() => setMenu(true), 90);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(openTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), 240);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setMenu(false);
          rootRef.current?.querySelector("button")?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(false);
      }}
    >
      {/* The landing page is the first item ("Overview"), so the trigger is
          one disclosure button rather than a link plus a tiny chevron. */}
      <button
        type="button"
        onClick={() => setMenu(!open)}
        aria-expanded={open}
        aria-controls={id}
        data-active={active || undefined}
        data-magnet
        className={styles.link}
      >
        <RollLabel label={link.label} />
        <span aria-hidden className={styles.chevron} data-open={open || undefined}>
          <ChevronIcon open={false} />
        </span>
      </button>

      <div
        id={id}
        inert={!open}
        className={styles.menu}
        data-open={open || undefined}
        data-entering={entering || undefined}
      >
        <div className={styles.tree}>
          {link.children!.map((child, i) => {
            const childActive = child.match(pathname);
            return (
              <Link
                key={child.href}
                href={child.href}
                aria-current={childActive ? "page" : undefined}
                data-active={childActive || undefined}
                className={`${styles.link} ${styles.sub}`}
                style={{ "--row": i } as CSSProperties}
              >
                <span aria-hidden className={styles.tick} />
                <RollLabel label={child.label} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  const floating = useScrolled();
  const navRef = useRef<HTMLElement>(null);
  useDesktopNavMotion(navRef);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={`${styles.bar} fixed inset-x-0 top-4 z-[90] hidden px-4 font-grotesk min-[700px]:block`}
      data-floating={floating || undefined}
    >
      {/* 1168 wide with 16px padding puts the brand and Résumé exactly on the
          text edges of the pages' 1200px / px-8 content column — and at
          narrower widths, 16px inset + 16px padding lands on the same 32px. */}
      <div className={`${styles.stage} mx-auto max-w-[1168px]`}>
        <div className={`${styles.row} px-4`}>
          <div className={`${styles.brand} justify-self-start`}>
            <BrandMark isMobile={false} />
          </div>

          <div data-fx="surface" className={styles.capsule}>
            {/* Light layers: a specular sheen and a rim light that follow the
                cursor (positioned by --gx/--gy, strength by --prox). */}
            <span aria-hidden className={styles.glare} />
            <span aria-hidden className={styles.rim} />

            <div
              data-fx="list"
              className={`${styles.list} relative flex items-center gap-6 min-[1000px]:gap-7`}
            >
              {NAV_LINKS.map((link) => {
                if (link.children) {
                  return <WorkMenu key={link.href} link={link} pathname={pathname} />;
                }
                const active = link.match(pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    data-active={active || undefined}
                    data-navitem
                    data-magnet
                    className={styles.link}
                  >
                    <RollLabel label={link.label} serif={link.serif} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Socials drop out below 1100px (they're in the footer too) so
              the three columns never collide on small laptops/tablets. */}
          <div className="flex items-center gap-5 justify-self-end">
            <div className="hidden gap-2 min-[1100px]:flex">
              <SocialIcon network="github" size={32} />
              <SocialIcon network="x" size={32} />
              <SocialIcon network="linkedin" size={32} />
            </div>
            <Link
              href="/resume"
              aria-current={pathname.startsWith("/resume") ? "page" : undefined}
              className={`${styles.link} ${styles.cta}`}
            >
              <RollLabel label="Résumé" />
              <span aria-hidden className={styles.ctaArrow}>
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileNavChildren({
  items,
  pathname,
  onNavigate,
}: {
  items: NavChild[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1 py-1.5 pr-5 pl-11">
      {items.map((child) => {
        const childActive = child.match(pathname);
        return (
          <Link
            key={child.href}
            href={child.href}
            onClick={onNavigate}
            className={`relative py-1.5 pl-3 font-mono text-[12px] tracking-[0.08em] uppercase no-underline transition-colors duration-200 ${
              childActive ? "text-accent" : "text-ink/45 active:text-ink/70"
            }`}
          >
            <span
              aria-hidden
              className={`absolute top-1/2 left-0 h-3 w-[2px] -translate-y-1/2 bg-accent transition-transform duration-200 ${
                childActive ? "scale-y-100" : "scale-y-0"
              }`}
            />
            {child.label}
          </Link>
        );
      })}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  // Unlike the desktop sidebar, the row itself navigates (WORK → its overview)
  // and a separate chevron handles the dropdown. Open state is shared with
  // the sidebar store, so it survives the menu closing and reopening.
  const [expanded, toggleExpanded] = useOpenSections();

  return (
    <div className="flex w-full flex-col">
      {NAV_LINKS.map((link, i) => {
        const active = link.match(pathname);
        const hasChildren = Boolean(link.children);
        const isOpen = expanded.has(link.href);
        return (
          <div key={link.href} className="border-b border-accent/10">
            <div className="flex items-stretch">
              <Link
                href={link.href}
                onClick={onNavigate}
                className={`relative flex flex-1 items-baseline gap-3 py-4 pl-5 font-mono text-[13px] tracking-[0.08em] no-underline outline-none transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:text-accent ${
                  hasChildren ? "pr-2" : "pr-5"
                } ${active ? "text-accent" : "text-ink/55 active:text-ink"}`}
              >
                <span
                  aria-hidden
                  className={`absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <span className={`text-[10px] tabular-nums ${active ? "text-accent/70" : "text-ink/25"}`}>
                  0{i + 1}
                </span>
                <span>{link.label}</span>
              </Link>
              {hasChildren && (
                // The whole right-hand strip of the row is the tap target
                // (well past 44px); the ring inside is just the visual.
                <button
                  type="button"
                  onClick={() => toggleExpanded(link.href)}
                  aria-expanded={isOpen}
                  aria-controls={`mnav-sub-${link.label.toLowerCase()}`}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${link.label} subpages`}
                  className="flex shrink-0 cursor-pointer items-center justify-center px-5 outline-none"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-200 ${
                      isOpen
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-accent/30 text-accent motion-safe:[animation:expandHint_2s_ease-out_infinite]"
                    }`}
                  >
                    <ChevronIcon open={isOpen} />
                  </span>
                </button>
              )}
            </div>
            {hasChildren && (
              <div
                id={`mnav-sub-${link.label.toLowerCase()}`}
                inert={!isOpen}
                className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <MobileNavChildren items={link.children!} pathname={pathname} onNavigate={onNavigate} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FooterGroup() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Waveform />
      <div className="flex gap-2">
        <SocialIcon network="github" size={24} />
        <SocialIcon network="x" size={24} />
        <SocialIcon network="linkedin" size={24} />
      </div>
      <Link
        href="/resume"
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-accent/70 hover:text-accent hover:underline"
      >
        RÉSUMÉ →
      </Link>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 700) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleMenuKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  };

  return (
    <>
      <a href="#main-content" className={skipLinkClass}>
        Skip to content
      </a>

      {/* Mobile: fixed top bar + dropdown menu. Shown/hidden by CSS alone
          (not the isMobile JS state) so there's no flash of the desktop
          sidebar on first paint before the resize effect runs. */}
      <div className="fixed inset-x-0 top-0 z-[200] hidden flex-col items-stretch border-b border-accent/12 bg-bg font-grotesk max-[700px]:flex">
        <div className="flex w-full items-center justify-between px-5 py-3">
          <BrandMark isMobile />
          <button
            type="button"
            onClick={toggleMenu}
            onKeyDown={toggleMenuKeyDown}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
            className="flex shrink-0 border-none bg-transparent p-1.5 text-inherit outline-none focus-visible:opacity-70"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 5L19 19M19 5L5 19"
                  stroke="#F2EFE9"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="#F2EFE9"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
        {menuOpen && (
          <div
            id="mobile-nav-menu"
            className="fixed inset-x-0 top-14 z-[199] box-border flex max-h-[calc(100vh-56px)] flex-col gap-6 overflow-y-auto border-t border-accent/12 bg-bg py-5"
          >
            <MobileNavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            <div className="px-5">
              <FooterGroup />
            </div>
          </div>
        )}
      </div>

      {/* Desktop: floating top bar. Same CSS-only visibility approach. */}
      <DesktopNav pathname={pathname} />
    </>
  );
}
