"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import CameraFrame from "@/components/CameraFrame";
import styles from "./home.module.css";

const WORK_ITEMS = [
  {
    href: "/case-study/security-engineer-portfolio",
    featured: true,
    stagger: "",
    placeholder: "Drop project image",
    imgSrc: "/images/projects/security-engineer-portfolio/desktop.png",
    title: "Security Engineer Portfolio",
    desc: "Built a personal website for a security engineer — designed to feel serious, sharp, and trustworthy, the way his work is.",
    stack: "React / Tailwind / Framer Motion",
    year: "2026",
  },
  {
    href: "/case-study/chronovault",
    featured: false,
    stagger: "mt-3.5 max-[700px]:mt-0",
    placeholder: "Drop project image",
    title: "ChronoVault",
    desc: "A digital time-capsule idea that lets people lock away files or messages until a future date. I built the interface from a collaborator's design, bringing the whole idea to life on screen.",
    stack: "React / Tailwind / Framer Motion",
    year: "2026",
  },
  {
    href: "/case-study/skillzbloom",
    featured: false,
    stagger: "mt-7 max-[700px]:mt-0",
    placeholder: "Drop project image",
    imgSrc: "/images/projects/skillzbloom/desktop.png",
    title: "SkillzBloom",
    desc: "Helped build a platform that helps students track their learning. I built the entire Skills section — where users see what they've learned, what they're working on, and their progress — plus a reusable design system used across the app.",
    stack: "TypeScript / Tailwind / Clerk Auth",
    year: "2025",
  },
];

const STACK_WORDS = ["React & Next.js", "Tailwind & Framer Motion", "TypeScript", "Git & Vercel"];

const STACK_PILLS = [
  "01 · React & Next.js",
  "02 · Tailwind & Framer Motion",
  "03 · TypeScript & REST APIs",
  "04 · Git, GitHub & Vercel",
];

const CONTACT_SOCIALS = [
  {
    label: "GITHUB",
    href: "https://github.com/GbemiDaniel",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          stroke="#C9F31D"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/adamsdaniel043",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill="#C9F31D"
        />
      </svg>
    ),
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/gbemi-daniel",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="9" width="4" height="12" fill="#C9F31D" />
        <circle cx="4" cy="4" r="2" fill="#C9F31D" />
        <path
          d="M10 9h4v2.1c.9-1.4 2.4-2.4 4.3-2.4 3.7 0 4.7 2.4 4.7 5.6V21h-4v-6c0-1.4 0-3.2-2-3.2s-2.3 1.6-2.3 3.1V21h-4V9z"
          fill="#C9F31D"
        />
      </svg>
    ),
  },
];

const TOTAL_SECTIONS = 5;

const sectionLabel = "mb-4 font-mono text-xs tracking-[0.1em] text-ink/40";
const sectionHeading = "m-0 mb-4 text-[clamp(26px,3.6vw,38px)] font-bold leading-[1.15]";
const sectionLink =
  "inline-flex items-center gap-2 text-[13px] text-ink/60 no-underline hover:text-accent";
const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";
const chromeBar =
  "relative flex items-center gap-1.5 rounded-t-xl border border-b-0 border-accent/15 bg-band px-3.5 py-2.5";
const arrowCircleBase =
  "flex shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-[transform,box-shadow] duration-300 group-hover:[animation:arrowPulse_0.6s_cubic-bezier(0.34,1.56,0.64,1)_1]";

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center gap-7 pr-7">
      {STACK_WORDS.map((word) => (
        <Fragment key={word}>
          <span className="whitespace-nowrap text-[clamp(26px,4.4vw,44px)] font-bold text-ink/85">
            {word}
          </span>
          <span className="text-[clamp(26px,4.4vw,44px)] font-bold text-accent">/</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState(1);
  const [marqueeHover, setMarqueeHover] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-index]")
    );

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY + window.innerHeight * 0.3;
        let active = 1;
        for (const el of sections) {
          if (el.offsetTop <= y) active = Number(el.getAttribute("data-section-index"));
        }
        setActiveSection(active);
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HERO */}
        <section data-section-index="1" className="relative overflow-hidden px-0 pt-10 pb-24 max-[700px]:pt-5">
          <div className="pointer-events-none absolute -top-[120px] -right-[10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(140,210,60,0.16),transparent_70%)] blur-[50px]" />
          <div className="pointer-events-none absolute -bottom-[220px] -left-[10%] h-[340px] w-[120%] -rotate-[4deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(90,150,45,0.14),transparent_70%)] blur-[60px]" />
          <div className="relative mx-auto max-w-[1200px] px-8">
            <Reveal className="mb-10 font-mono text-xs leading-[1.7] text-ink/45">
              <div>&gt; frontend engineer</div>
              <div>+ react / next.js / typescript</div>
            </Reveal>

            <div className="flex items-stretch gap-8">
              <div className="flex flex-1 flex-wrap items-stretch gap-10">
                <div className="flex min-h-0 min-w-[260px] flex-1 basis-[280px] flex-col">
                  <div className="flex gap-4">
                    <div className="relative w-px shrink-0 bg-white/15 before:absolute before:-top-3.5 before:-left-1.5 before:text-xs before:text-ink/30 before:content-['+']" />
                    <Reveal y={18} duration={0.9}>
                      <h1 className="m-0 text-[clamp(24px,3.4vw,40px)] leading-[1.15] font-semibold tracking-[-0.02em]">
                        Great interfaces aren&apos;t designed. They&apos;re{" "}
                        <span className="text-accent">engineered.</span>
                      </h1>
                    </Reveal>
                  </div>
                  <Reveal y={16} delay={0.15}>
                    <p className="mt-6 ml-[17px] max-w-[420px] text-sm leading-relaxed text-ink/62">
                      I build websites that actually fit the people and businesses they&apos;re
                      made for — not a template with the colors swapped.
                    </p>
                  </Reveal>
                  <div className="mt-9 ml-[17px] font-mono text-[10px] leading-relaxed tracking-[0.08em] whitespace-nowrap text-ink/30">
                    BUILDING DIGITAL EXPERIENCES /
                  </div>
                  <div className="mt-auto ml-[17px] flex max-w-[420px] flex-wrap items-center gap-5 border-t border-white/8 pt-10 max-[700px]:hidden">
                    <Link href="/work" className="group flex items-center gap-3.5 text-inherit no-underline hover:opacity-80">
                      <span className={`${arrowCircleBase} h-10 w-10 text-[15px]`}>→</span>
                      <span className="font-mono text-[11px] tracking-[0.08em] text-ink">
                        VIEW MY WORK
                      </span>
                    </Link>
                    <span className="h-px min-w-[40px] flex-1 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.25)_0_4px,transparent_4px_8px)]" />
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-ink/40">
                      SCROLL{" "}
                      <span className="inline-block [animation:scrollBob_1.6s_ease-in-out_infinite]">
                        ↓
                      </span>
                    </span>
                  </div>
                </div>

                <div className="relative min-w-[260px] flex-1 basis-[280px]">
                  <CameraFrame className="h-[clamp(300px,36vw,440px)] w-full max-[700px]:h-[clamp(200px,52vw,260px)]">
                    <ImageSlot
                      alt="Portrait of Daniel"
                      placeholder="Drop Daniel's photo"
                      src="/images/portrait-hero.jpg"
                      objectPosition="center 20%"
                      shape="rounded"
                      radius={12}
                      className="h-full w-full"
                      priority
                    />
                  </CameraFrame>
                  <div className="absolute top-4 left-4 rounded bg-[rgba(11,8,16,0.55)] px-2.5 py-[5px] font-mono text-[11px] leading-relaxed text-ink backdrop-blur-sm">
                    DEE.JPG
                    <br />
                    <small className="text-[10px] text-ink/55">2026-08-24 17:42</small>
                  </div>
                  <div className="absolute top-4 right-4 rounded bg-[rgba(11,8,16,0.55)] px-2.5 py-[5px] font-mono text-[11px] text-ink/70 backdrop-blur-sm">
                    VIEW_001
                  </div>
                  <div className="absolute bottom-4 left-4 rounded bg-[rgba(11,8,16,0.55)] px-2.5 py-[5px] font-mono text-[11px] text-ink/70 backdrop-blur-sm">
                    LAGOS, NG
                  </div>
                  <div className="absolute right-4 bottom-4 rounded bg-[rgba(11,8,16,0.55)] px-2.5 py-[5px] font-mono text-[11px] text-ink/70 backdrop-blur-sm">
                    3024×4032
                  </div>
                </div>

                <div className="mt-8 hidden max-[700px]:flex max-w-[420px] flex-wrap items-center gap-5 border-t border-white/8 pt-10">
                  <Link href="/work" className="group flex items-center gap-3.5 text-inherit no-underline hover:opacity-80">
                    <span className={`${arrowCircleBase} h-10 w-10 text-[15px]`}>→</span>
                    <span className="font-mono text-[11px] tracking-[0.08em] text-ink">
                      VIEW MY WORK
                    </span>
                  </Link>
                  <span className="h-px min-w-[40px] flex-1 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.25)_0_4px,transparent_4px_8px)]" />
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-ink/40">
                    SCROLL{" "}
                    <span className="inline-block [animation:scrollBob_1.6s_ease-in-out_infinite]">
                      ↓
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORK TEASER */}
        <section
          data-section-index="2"
          className="mx-auto max-w-[1200px] border-t border-accent/12 px-8 py-20 max-[700px]:px-5 max-[700px]:py-14"
        >
          <Reveal className="mb-12 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className={sectionLabel}>
                <span className="text-accent">01</span> — WORK
              </div>
              <h2 className={`${sectionHeading} max-w-[520px]`}>
                THINGS I&apos;VE BUILT &amp; BROKEN &amp;{" "}
                <span className="text-accent">REBUILT.</span>
              </h2>
              <Link href="/work" className={sectionLink}>
                → VIEW ALL PROJECTS
              </Link>
            </div>
          </Reveal>

          <div className="flex flex-wrap items-start gap-7">
            {WORK_ITEMS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`block min-w-0 flex-1 basis-[280px] text-inherit no-underline transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${item.stagger}`}
              >
                <div className={chromeBar}>
                  <span className={chromeDot} />
                  <span className={chromeDot} />
                  <span className={chromeDot} />
                  {item.featured && (
                    <span className="absolute -top-2.5 right-3.5 rounded bg-accent px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.05em] text-bg">
                      FEATURED
                    </span>
                  )}
                </div>
                <ImageSlot
                  alt={item.title}
                  placeholder={item.placeholder}
                  src={item.imgSrc}
                  shape="rect"
                  className="h-[200px] w-full border-x border-accent/15 max-[700px]:h-[130px]"
                />
                <div className="rounded-b-xl border border-t-0 border-accent/15 p-[18px] max-[700px]:p-3.5">
                  <h3 className="m-0 mb-2 text-[17px] font-semibold max-[700px]:mb-1 max-[700px]:text-[15px]">
                    {item.title}
                  </h3>
                  <p className="m-0 mb-3.5 text-[13px] leading-[1.5] text-ink/55 max-[700px]:mb-2 max-[700px]:line-clamp-2 max-[700px]:text-[11.5px]">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-accent/70 max-[700px]:text-[10px]">
                    <span>{item.stack}</span>
                    <span className="whitespace-nowrap text-ink/40">{item.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* EXPERTISE / STACK */}
        <section data-section-index="3" className="overflow-hidden bg-band py-[72px]">
          <Reveal className="mx-auto mb-10 max-w-[1200px] px-8">
            <div className={sectionLabel}>
              <span className="text-accent">02</span> — STACK
            </div>
            <h2 className={sectionHeading}>
              What I bring to <span className="text-accent">the build.</span>
            </h2>
            <span className="inline-flex items-center gap-2 text-[13px] text-ink/60">
              A few of the tools behind the work.
            </span>
          </Reveal>

          <div
            className={`${styles.marqueeMask} relative overflow-hidden py-[26px]`}
            onMouseEnter={() => setMarqueeHover(true)}
            onMouseLeave={() => setMarqueeHover(false)}
          >
            <div
              className={`${styles.marqueeTrack} flex w-max ${
                marqueeHover ? styles.marqueeTrackPaused : ""
              }`}
            >
              <MarqueeGroup />
              <MarqueeGroup />
            </div>
          </div>

          <div className="mx-auto mt-7 hidden max-w-[1200px] flex-wrap gap-3 px-8 min-[700px]:flex">
            {STACK_PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-accent/20 px-4 py-2 font-mono text-xs tracking-[0.05em] text-ink/60 transition-colors duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent hover:bg-accent hover:text-bg"
              >
                {pill}
              </span>
            ))}
          </div>
        </section>

        {/* ABOUT TEASER */}
        <section data-section-index="4" className="mx-auto max-w-[1200px] px-8 pt-[72px] pb-16 max-[700px]:px-5 max-[700px]:pt-12 max-[700px]:pb-10">
          <Reveal className="mb-8">
            <div className={sectionLabel}>
              <span className="text-accent">03</span> — ABOUT
            </div>
            <h2 className={`${sectionHeading} max-w-[640px]`}>
              THERE&apos;S A PERSON BEHIND THE PIXELS —{" "}
              <span className="text-accent">AND A FEW OPINIONS.</span>
            </h2>
            <Link href="/about" className={sectionLink}>
              → GET TO KNOW ME
            </Link>
          </Reveal>
          <Link
            href="/about"
            className="block overflow-hidden rounded-xl border border-accent/15 text-inherit no-underline transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent/40"
          >
            <div className="flex flex-wrap">
              <div className="w-[260px] flex-[0_0_260px] max-[700px]:w-full max-[700px]:flex-[1_1_100%]">
                <div className="flex items-center gap-1.5 border-b border-accent/15 bg-band px-3.5 py-2.5">
                  <span className={chromeDot} />
                  <span className={chromeDot} />
                  <span className={chromeDot} />
                </div>
                <ImageSlot
                  alt="Daniel"
                  placeholder="Drop Daniel's photo"
                  src="/images/portrait-about.jpg"
                  objectPosition="center 20%"
                  shape="rect"
                  className="h-[200px] w-full"
                />
              </div>
              <div className="flex min-w-[280px] flex-1 items-center border-l border-accent/15 px-9 py-8 max-[700px]:border-t max-[700px]:border-l-0 max-[700px]:px-5 max-[700px]:py-6">
                <p className="m-0 max-w-[480px] text-[15px] leading-relaxed text-ink/60">
                  The stack, the process, and how a designer ended up living in a code
                  editor — the full story is on the About page.
                </p>
              </div>
            </div>
          </Link>
        </section>

        {/* CONTACT CTA */}
        <section
          data-section-index="5"
          className="relative mx-auto max-w-[1200px] overflow-hidden px-8 pt-20 pb-24 max-[700px]:px-5 max-[700px]:pt-14 max-[700px]:pb-16"
        >
          <div className="pointer-events-none absolute -top-[100px] -left-[10%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(140,210,60,0.14),transparent_70%)] blur-[50px]" />
          <Reveal className="relative mb-10">
            <div className={sectionLabel}>
              <span className="text-accent">04</span> — CONTACT
            </div>
            <h2 className={sectionHeading}>
              Got an idea worth <span className="text-accent">building?</span>
            </h2>
            <a href="mailto:gbemidaniel01@gmail.com" className={sectionLink}>
              → gbemidaniel01@gmail.com
            </a>
          </Reveal>
          <div className="flex flex-wrap overflow-hidden rounded-[20px] border border-accent/15">
            <div className="flex min-w-[280px] flex-1 items-center p-12 max-[700px]:p-6">
              <Link href="/contact" className="group flex items-center gap-3.5 text-inherit no-underline hover:opacity-80">
                <span className={`${arrowCircleBase} h-[52px] w-[52px] text-lg max-[700px]:h-10 max-[700px]:w-10 max-[700px]:text-[15px]`}>→</span>
                <span className="font-mono text-[13px] tracking-[0.08em] text-ink">
                  START A CONVERSATION
                </span>
              </Link>
            </div>
            <div className="flex w-full flex-row border-t border-accent/15 min-[700px]:w-[150px] min-[700px]:flex-none min-[700px]:flex-col min-[700px]:border-t-0 min-[700px]:border-l">
              {CONTACT_SOCIALS.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex flex-1 items-center justify-center overflow-hidden py-4 font-mono text-xs tracking-[0.1em] text-ink/50 no-underline transition-colors duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent/5 hover:text-accent ${
                    i < CONTACT_SOCIALS.length - 1
                      ? "border-r border-accent/15 min-[700px]:border-r-0 min-[700px]:border-b"
                      : ""
                  }`}
                >
                  {s.label}
                  <span className="absolute inset-0 flex scale-[0.6] items-center justify-center bg-bg opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100">
                    {s.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <div className="hidden w-[72px] shrink-0 min-[1025px]:block" />

      <div className="fixed top-1/2 right-7 z-50 hidden -translate-y-1/2 flex-col items-end min-[1025px]:flex">
        <div className="text-right font-mono text-[10px] leading-[1.7] tracking-[0.05em] text-ink/50">
          {String(activeSection).padStart(2, "0")}
          <br />/<br />
          {String(TOTAL_SECTIONS).padStart(2, "0")}
        </div>
        <div className="my-3.5 mx-[3px] h-[110px] w-px bg-white/15" />
        <div className="text-right font-mono text-[9px] leading-[1.7] tracking-[0.1em] whitespace-nowrap text-ink/35">
          CREATIVE
          <br />
          <strong className="font-bold text-ink">DEVELOPER</strong>
          <br />/<br />
          FRONTEND
          <br />
          ENGINEER
        </div>
        <span className="my-4 mx-[3px] h-1 w-1 rounded-full bg-accent" />
        <div className="font-mono text-[9px] tracking-[0.15em] whitespace-nowrap text-ink/35 [writing-mode:vertical-rl]">
          SCROLL TO EXPLORE
        </div>
      </div>
    </div>
  );
}
