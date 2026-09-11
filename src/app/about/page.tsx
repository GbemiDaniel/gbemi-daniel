"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import styles from "./about.module.css";

const SKILLS = [
  {
    num: "01",
    title: "React & Next.js",
    desc: "Building fast, accessible front ends that hold up in production, not just Figma.",
    big: true,
    delay: "0s",
  },
  {
    num: "02",
    title: "Web Architecture",
    desc: "Structuring pages and component systems so they're easy to extend later.",
    big: false,
    delay: "0.08s",
  },
  {
    num: "03",
    title: "Brand Design",
    desc: "Marks, type systems, and color palettes that hold together across every touchpoint.",
    big: false,
    delay: "0.16s",
  },
  {
    num: "04",
    title: "Design Systems",
    desc: "Reusable components and tokens so teams stop rebuilding the same button.",
    big: true,
    delay: "0.24s",
  },
];

const INTERESTS = ["Street photography", "Pickup basketball", "Vinyl records", "Building keyboards"];

const PRINCIPLES = [
  {
    num: "01",
    title: "Start with constraints",
    desc: "The best ideas usually show up after the boring limits are on the table.",
  },
  {
    num: "02",
    title: "Design in the browser",
    desc: "Static comps lie about motion, type rendering, and real content. Code doesn't.",
  },
  {
    num: "03",
    title: "Sweat the transitions",
    desc: "The gap between states is where most products feel cheap or feel premium.",
  },
  {
    num: "04",
    title: "Ship, then refine",
    desc: "A real product in front of real people beats another week of polish in Figma.",
  },
];

export default function About() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [progress, setProgress] = useState(4);
  const [showTop, setShowTop] = useState(false);

  const onScrollRef = useRef<HTMLDivElement | null>(null);

  const onPrincScroll = () => {
    const el = onScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? (el.scrollLeft / max) * 100 : 0;
    setProgress(Math.max(4, pct));
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* INTRO */}
        <section className="mx-auto max-w-[1200px] px-8 pt-16 pb-14 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-10">
          <div
            className="grid items-stretch gap-12 max-[700px]:gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
          >
            <div className={`flex flex-col justify-center ${styles.reveal}`}>
              <div className="mb-5 text-[13px] tracking-[0.1em] text-ink/50 uppercase">About</div>
              <h1 className="m-0 mb-6 text-[clamp(30px,4.5vw,46px)] leading-[1.15] font-semibold">
                I build interfaces the way I&apos;d want to use them —{" "}
                <span className="text-accent [text-shadow:0_0_18px_rgba(201,243,29,0.5)]">
                  clear, fast, and a little bit fun.
                </span>
              </h1>
              <p className="m-0 max-w-[520px] text-base leading-[1.7] text-ink/62">
                I&apos;m a web &amp; brand designer who ended up writing a lot of code, mostly
                because I got tired of handing off files and hoping they&apos;d survive contact
                with a browser. These days I do both — design systems in Figma, then the real
                thing in React.
              </p>
            </div>
            <div
              className={`relative aspect-[4/5] min-[700px]:aspect-auto min-[700px]:min-h-[420px] ${styles.reveal}`}
              style={{ animationDelay: "0.15s" }}
            >
              <span className="absolute top-[-10px] left-[-10px] z-[2] h-[22px] w-[22px] border-t-2 border-l-2 border-accent" />
              <span className="absolute top-[-10px] right-[-10px] z-[2] h-[22px] w-[22px] border-t-2 border-r-2 border-accent" />
              <span className="absolute bottom-[-10px] left-[-10px] z-[2] h-[22px] w-[22px] border-b-2 border-l-2 border-accent" />
              <span className="absolute right-[-10px] bottom-[-10px] z-[2] h-[22px] w-[22px] border-r-2 border-b-2 border-accent" />
              <ImageSlot
                alt="Daniel"
                placeholder="Drop Daniel's photo"
                shape="rounded"
                radius={24}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute top-3 left-3 z-[2] rounded bg-[rgba(11,8,16,0.55)] px-2 py-1 font-mono text-[10px] text-ink backdrop-blur-sm">
                ABOUT.JPG
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SHOWCASE — bento */}
        <section className="mx-auto max-w-[1200px] border-t border-accent/12 px-8 py-14 max-[700px]:px-5 max-[700px]:py-10">
          <h2 className="m-0 mb-9 text-[28px] font-semibold max-[700px]:mb-5 max-[700px]:text-[22px]">
            What I&apos;m good at
          </h2>
          <div className="mb-5 flex flex-wrap gap-5">
            {SKILLS.slice(0, 2).map((s) => (
              <div
                key={s.num}
                className={`relative overflow-hidden rounded-2xl border border-accent/15 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/50 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)] ${styles.reveal} ${s.big ? "flex-[2_1_320px] p-8 max-[700px]:p-5" : "flex-[1_1_220px] p-7 max-[700px]:p-5"}`}
                style={{ animationDelay: s.delay }}
              >
                <span
                  className={`pointer-events-none absolute top-4 right-5 leading-none font-bold text-ink/6 font-mono ${s.big ? "text-[64px] max-[700px]:text-[40px]" : "text-[48px] max-[700px]:text-[32px]"}`}
                >
                  {s.num}
                </span>
                <div
                  className={`relative mb-2.5 font-semibold max-[700px]:mb-1.5 ${s.big ? "text-2xl max-[700px]:text-lg" : "text-xl max-[700px]:text-base"}`}
                >
                  {s.title}
                </div>
                <div
                  className={`relative text-ink/55 ${s.big ? "max-w-[420px] text-sm leading-[1.55] max-[700px]:text-[12.5px]" : "text-[13px] leading-[1.5] max-[700px]:text-[12px]"}`}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-5">
            {SKILLS.slice(2, 4).map((s) => (
              <div
                key={s.num}
                className={`relative overflow-hidden rounded-2xl border border-accent/15 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/50 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)] ${styles.reveal} ${s.big ? "flex-[2_1_320px] p-8 max-[700px]:p-5" : "flex-[1_1_220px] p-7 max-[700px]:p-5"}`}
                style={{ animationDelay: s.delay }}
              >
                <span
                  className={`pointer-events-none absolute top-4 right-5 leading-none font-bold text-ink/6 font-mono ${s.big ? "text-[64px] max-[700px]:text-[40px]" : "text-[48px] max-[700px]:text-[32px]"}`}
                >
                  {s.num}
                </span>
                <div
                  className={`relative mb-2.5 font-semibold max-[700px]:mb-1.5 ${s.big ? "text-2xl max-[700px]:text-lg" : "text-xl max-[700px]:text-base"}`}
                >
                  {s.title}
                </div>
                <div
                  className={`relative text-ink/55 ${s.big ? "max-w-[420px] text-sm leading-[1.55] max-[700px]:text-[12.5px]" : "text-[13px] leading-[1.5] max-[700px]:text-[12px]"}`}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OFF THE CLOCK */}
        <section className="mx-auto max-w-[1200px] border-t border-accent/12 px-8 py-9">
          <div className="mb-4.5 font-mono text-xs text-ink/40">{"// when I'm not shipping"}</div>
          <div className="flex flex-wrap gap-2.5">
            {INTERESTS.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-accent/15 px-4 py-2 font-mono text-xs text-ink/60 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* PRINCIPLES CAROUSEL */}
        <section
          className={`relative overflow-hidden border-t border-b border-accent/12 bg-band py-20 pb-12 max-[700px]:py-12 max-[700px]:pb-8 ${styles.reveal}`}
        >
          <div className="mx-auto mb-9 max-w-[1200px] px-8 max-[700px]:mb-5 max-[700px]:px-5">
            <div className="mb-2.5 text-xs tracking-[0.14em] text-accent/60 uppercase">Method</div>
            <h2 className="m-0 text-[30px] font-semibold max-[700px]:text-[22px]">How I Work</h2>
          </div>
          <div
            ref={onScrollRef}
            onScroll={onPrincScroll}
            className={`mx-auto flex max-w-[1200px] gap-8 overflow-x-auto px-8 pb-3 max-[700px]:gap-4 max-[700px]:px-5 ${styles.noScrollbar}`}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {PRINCIPLES.map((p, i) => {
              const on = hovered === i;
              return (
                <div
                  key={p.num}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative h-[220px] w-[min(300px,80vw)] flex-none shrink-0 snap-start overflow-hidden rounded-[18px] bg-bg p-6 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-[700px]:h-[170px] max-[700px]:w-[68vw] max-[700px]:p-4"
                  style={{
                    border: `1px solid ${on ? "rgba(255,255,255,0.28)" : "rgba(201,243,29,0.15)"}`,
                    boxShadow: on ? "0 20px 40px -14px rgba(0,0,0,0.55)" : "0 0 0 rgba(0,0,0,0)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <span className="pointer-events-none absolute top-5 left-5 font-mono text-[56px] leading-none font-bold text-ink/7 max-[700px]:top-3 max-[700px]:left-3 max-[700px]:text-[36px]">
                    {p.num}
                  </span>
                  <div className="mb-2 text-[17px] font-semibold max-[700px]:text-[15px]">{p.title}</div>
                  <div className="mb-2 text-[13px] leading-[1.55] text-ink/55 max-[700px]:line-clamp-2 max-[700px]:text-[11.5px]">
                    {p.desc}
                  </div>
                  <div
                    className="h-px bg-accent transition-[width] duration-400 ease-in-out"
                    style={{ width: on ? "48px" : "0px" }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mx-auto mt-5 max-w-[1200px] px-8">
            <div className="h-0.5 overflow-hidden rounded-full bg-accent/15">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${progress}%`, transition: "width 0.08s linear" }}
              />
            </div>
          </div>
        </section>

        {/* SIGNOFF */}
        <section className={`mx-auto max-w-[1200px] px-8 py-20 text-center ${styles.reveal}`}>
          <div className="mb-5 font-mono text-xs tracking-[0.1em] text-ink/40 uppercase">
            Currently
          </div>
          <p className="mx-auto mb-7 max-w-[720px] text-[clamp(24px,3.4vw,34px)] leading-[1.3] font-semibold">
            Open to a handful of new projects this quarter — the kind with room to do it
            properly.
          </p>
          <Link
            href="/contact"
            className="inline-block border-b border-accent pb-[3px] text-sm text-accent no-underline"
          >
            Get in touch →
          </Link>
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
