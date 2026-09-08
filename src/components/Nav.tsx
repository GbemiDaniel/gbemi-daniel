"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function BrandMark({ isMobile }: { isMobile: boolean }) {
  const gSize = isMobile ? "26px" : "38px";
  const nameSize = isMobile ? "14px" : "17px";
  const sigilSize = isMobile ? "22px" : "30px";

  return (
    <Link href="/" className="flex flex-col gap-1 no-underline">
      <span className="flex items-baseline gap-px">
        <span className="font-script font-bold leading-[0.7] text-accent" style={{ fontSize: gSize }}>
          G
        </span>
        <span className="font-grotesk font-medium tracking-[0.01em] text-ink/75" style={{ fontSize: nameSize }}>
          bemi
        </span>
      </span>
      {!isMobile && (
        <>
          <span className="flex items-baseline gap-1">
            <Image
              src="/images/sigil-d-lime.png"
              alt="D"
              width={40}
              height={40}
              style={{ height: sigilSize, width: "auto" }}
            />
            <span className="font-grotesk font-medium tracking-[0.01em] text-ink/75" style={{ fontSize: nameSize }}>
              aniel
            </span>
          </span>
          <span className="mt-1 font-mono text-[10px] tracking-[0.1em] text-accent/55">dee</span>
        </>
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
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 700;
      setIsMobile((prev) => {
        if (prev !== mobile) {
          if (!mobile) setMenuOpen(false);
          return mobile;
        }
        return prev;
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleMenuKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  };

  if (isMobile) {
    return (
      <>
        <a href="#main-content" className={skipLinkClass}>
          Skip to content
        </a>
        <div className="fixed inset-x-0 top-0 z-[200] flex flex-col items-stretch border-b border-accent/12 bg-bg font-grotesk">
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
              className="fixed inset-x-0 top-14 z-[199] box-border flex max-h-[calc(100vh-56px)] flex-col gap-6 overflow-y-auto border-t border-accent/12 bg-bg p-5"
            >
              <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
              <FooterGroup />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className={skipLinkClass}>
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="sticky top-0 box-border flex h-screen w-[140px] shrink-0 flex-col items-start justify-between self-start border-r border-accent/12 p-6 font-grotesk"
      >
        <BrandMark isMobile={false} />
        <NavLinks pathname={pathname} />
        <FooterGroup />
      </nav>
    </>
  );
}
