"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import SocialIcon from "./SocialIcon";

const NAV_LINKS = [
  { href: "/", label: "HOME", match: (p: string) => p === "/" },
  {
    href: "/work",
    label: "WORK",
    match: (p: string) =>
      p.startsWith("/work") ||
      p.startsWith("/client-work") ||
      p.startsWith("/concepts") ||
      p.startsWith("/case-study"),
  },
  { href: "/about", label: "ABOUT", match: (p: string) => p.startsWith("/about") },
  {
    href: "/blog",
    label: "WRITING",
    match: (p: string) => p.startsWith("/blog") || p.startsWith("/article"),
  },
];

const skipLinkClass =
  "fixed left-[-9999px] top-0 z-[300] rounded-br-lg bg-accent px-[18px] py-2.5 font-grotesk text-[13px] font-bold text-bg focus:left-0";

const navTileClass =
  "block w-[calc(100%+24px)] rounded-l-lg border border-transparent border-r-0 border-b-[1.5px] py-2.5 pr-5 pl-3 font-mono text-xs tracking-[0.08em] text-ink/55 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/15 hover:border-b-accent hover:bg-accent/5 hover:text-accent";

const navTileActiveClass = "border-accent/15 border-b-accent bg-accent/5 text-accent";

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
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
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
        <Image
          data-mark="sigil"
          src="/images/sigil-d-lime.png"
          alt="D"
          width={40}
          height={40}
          style={{ height: sigilSize, width: "auto" }}
          priority
        />
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

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={`${navTileClass} ${link.match(pathname) ? navTileActiveClass : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function MobileNavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex w-full flex-col">
      {NAV_LINKS.map((link, i) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`relative flex items-baseline gap-3 border-b border-accent/10 px-5 py-4 font-mono text-[13px] tracking-[0.08em] no-underline transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              active ? "text-accent" : "text-ink/55 active:text-ink"
            }`}
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
            {active && (
              <span className="ml-auto h-1.5 w-1.5 animate-pulse self-center rounded-full bg-accent" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

function FooterGroup() {
  return (
    <div className="flex flex-col items-start gap-3.5">
      <Waveform />
      <div className="flex gap-2">
        <SocialIcon network="github" size={28} />
        <SocialIcon network="x" size={28} />
        <SocialIcon network="linkedin" size={28} />
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

      {/* Desktop: sticky sidebar. Same CSS-only visibility approach. */}
      <nav
        aria-label="Primary"
        className="sticky top-0 box-border hidden h-screen w-[140px] shrink-0 flex-col items-start self-start border-r border-accent/12 p-6 font-grotesk min-[700px]:flex"
      >
        <div className="flex flex-col gap-10">
          <BrandMark isMobile={false} />
          <NavLinks pathname={pathname} />
        </div>
        <div className="mt-auto">
          <FooterGroup />
        </div>
      </nav>
    </>
  );
}
