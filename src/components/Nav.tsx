"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, HOUSE_EASE } from "@/lib/motion";
import SigilD from "./SigilD";
import SocialIcon from "./SocialIcon";

type NavChild = { href: string; label: string; match: (p: string) => boolean };
type NavLink = {
  href: string;
  label: string;
  match: (p: string) => boolean;
  children?: NavChild[];
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
    match: (p) => p.startsWith("/blog") || p.startsWith("/article"),
  },
];

const skipLinkClass =
  "fixed left-[-9999px] top-0 z-[300] rounded-br-lg bg-accent px-[18px] py-2.5 font-grotesk text-[13px] font-bold text-bg focus:left-0";

const navTileBase =
  "w-[calc(100%+24px)] rounded-l-lg border border-transparent border-r-0 border-b-[1.5px] py-2.5 pr-5 pl-3 font-mono text-xs tracking-[0.08em] text-ink/55 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/15 hover:border-b-accent hover:bg-accent/5 hover:text-accent";

const navTileClass = `block ${navTileBase}`;

// A section with subpages is a single disclosure button across the whole
// tile — its landing page is reachable as the first child ("Overview"), so
// the row never has to split into a link plus a tiny chevron target.
const navTileToggleClass = `flex cursor-pointer items-center gap-1.5 text-left outline-none focus-visible:border-accent/15 focus-visible:border-b-accent focus-visible:text-accent ${navTileBase}`;

const navTileActiveClass = "border-accent/15 border-b-accent bg-accent/5 text-accent";

// Subpages use the same pill as the main tiles, just indented and at 11px.
// ml-4 shifts the pill in; the width gives back 16px of the 24px bleed so its
// right edge still lands on the sidebar border, flush with the parent tile.
const navSubTileClass =
  "ml-4 block w-[calc(100%+8px)] rounded-l-lg border border-transparent border-r-0 border-b-[1.5px] py-2 pr-3 pl-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap text-ink/55 uppercase transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/15 hover:border-b-accent hover:bg-accent/5 hover:text-accent";

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

function WritingLetters({
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
    <span className={className} style={style} data-word={dataWord} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} data-letter className="inline-block opacity-0">
          {ch}
        </span>
      ))}
    </span>
  );
}

function BrandMark({ isMobile }: { isMobile: boolean }) {
  const gSize = isMobile ? "24px" : "38px";
  const nameSize = isMobile ? "13px" : "17px";
  const sigilSize = isMobile ? "20px" : "30px";
  const rootRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root.querySelectorAll("[data-letter], [data-mark]"), { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: HOUSE_EASE } });
      tl.fromTo(
        root.querySelector("[data-mark='g']"),
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.25 }
      )
        .fromTo(
          root.querySelectorAll("[data-word='bemi'] [data-letter]"),
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.22, stagger: 0.035 },
          "-=0.05"
        )
        .fromTo(
          root.querySelector("[data-mark='sigil']"),
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.3 },
          "-=0.05"
        )
        .fromTo(
          root.querySelectorAll("[data-word='aniel'] [data-letter]"),
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.22, stagger: 0.035 },
          "-=0.15"
        );

      const dee = root.querySelector("[data-mark='dee']");
      if (dee) {
        tl.fromTo(dee, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.05");
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Link
      ref={rootRef}
      href="/"
      className={isMobile ? "flex items-baseline gap-1.5 no-underline" : "flex flex-col gap-1 no-underline"}
    >
      <span className="flex items-baseline gap-px">
        <span
          data-mark="g"
          className="font-script font-bold leading-none text-accent"
          style={{ fontSize: gSize }}
        >
          G
        </span>
        <WritingLetters
          text="bemi"
          dataWord="bemi"
          className="font-serif-italic font-normal text-ink/85 italic"
          style={{ fontSize: nameSize }}
        />
      </span>
      <span className="flex items-baseline gap-1">
        <SigilD data-mark="sigil" style={{ height: sigilSize, width: "auto" }} />
        <WritingLetters
          text="aniel"
          dataWord="aniel"
          className="font-serif-italic font-normal text-ink/85 italic"
          style={{ fontSize: nameSize }}
        />
      </span>
      {!isMobile && (
        <span data-mark="dee" className="mt-1 font-mono text-[10px] tracking-[0.1em] text-accent/55">
          dee
        </span>
      )}
    </Link>
  );
}

function NavChildren({
  items,
  pathname,
  onNavigate,
}: {
  items: NavChild[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="mt-2 mb-1 flex flex-col gap-1.5">
      {items.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onNavigate}
          className={`${navSubTileClass} ${child.match(pathname) ? navTileActiveClass : ""}`}
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  // Collapsed until the user opens a section — not auto-shown just because
  // you're inside it — then stays open as they move between its subpages.
  const [expanded, toggleExpanded] = useOpenSections();

  return (
    <div className="flex w-full flex-col gap-2.5">
      {NAV_LINKS.map((link) => {
        const active = link.match(pathname);

        if (!link.children) {
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`${navTileClass} ${active ? navTileActiveClass : ""}`}
            >
              {link.label}
            </Link>
          );
        }

        const isOpen = expanded.has(link.href);
        return (
          <div key={link.href} className="flex w-full flex-col">
            <button
              type="button"
              onClick={() => toggleExpanded(link.href)}
              aria-expanded={isOpen}
              aria-controls={`nav-sub-${link.label.toLowerCase()}`}
              className={`${navTileToggleClass} ${active ? navTileActiveClass : ""}`}
            >
              {link.label}
              <span className="opacity-60">
                <ChevronIcon open={isOpen} />
              </span>
            </button>
            {/* `inert` while collapsed keeps the hidden links out of the tab
                order — otherwise keyboard users tab into invisible items. */}
            <div
              id={`nav-sub-${link.label.toLowerCase()}`}
              inert={!isOpen}
              className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <NavChildren items={link.children} pathname={pathname} onNavigate={onNavigate} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
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
      <a
        href="/resume.pdf"
        download
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-accent/70 hover:text-accent hover:underline"
      >
        RÉSUMÉ ↓
      </a>
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

      {/* Desktop: sticky sidebar. Same CSS-only visibility approach. Brand
          stays pinned at top and Footer at bottom; the links sit in a
          flex-1 middle band and are vertically centered within it, so
          they re-center as a block (not just jump) when a section
          expands — the flex-1 band's own size is fixed by the brand/footer
          on either side, so only its centered contents grow/shrink. */}
      <nav
        aria-label="Primary"
        className="sticky top-0 box-border hidden h-screen w-[140px] shrink-0 flex-col items-start self-start border-r border-accent/12 p-6 font-grotesk min-[700px]:flex"
      >
        <BrandMark isMobile={false} />
        {/* No `overflow` here, deliberately. Setting overflow-y makes the
            spec compute overflow-x to `auto` as well, and the tiles bleed
            24px past this band by design (`calc(100% + 24px)`) — that became
            horizontal scroll overflow and clipped the first character off
            every label. Spacing below is sized so the expanded tree fits
            without scrolling (~495px against a ~680px viewport), and
            `safe center` degrades to top-alignment rather than clipping if
            a very short window ever did run out of room.

            w-full matters too: the nav is `items-start`, so without it this
            band shrink-wraps and the bleed resolves against an indefinite
            width. */}
        <div
          className="flex w-full flex-1 flex-col"
          style={{ justifyContent: "safe center" }}
        >
          <NavLinks pathname={pathname} />
        </div>
        <FooterGroup />
      </nav>
    </>
  );
}
