"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import styles from "./case-study.module.css";

const PROCESS = [
  {
    num: "01",
    title: "Research",
    desc: "Sat with the finance team to watch how they actually used the old dashboard.",
  },
  {
    num: "02",
    title: "Wireframes",
    desc: "Sketched a handful of layouts that surface totals and trends before the raw table.",
  },
  {
    num: "03",
    title: "Visual design",
    desc: "Built the component system in Figma, then in React so it could ship without a rebuild.",
  },
  {
    num: "04",
    title: "Handoff",
    desc: "Documented the component library so the team could extend it after launch.",
  },
];

const GALLERY = [
  { num: "01", caption: "Screen 01" },
  { num: "02", caption: "Screen 02" },
  { num: "03", caption: "Screen 03" },
  { num: "04", caption: "Screen 04" },
];

const OUTCOMES = [
  { value: "3 → 1", label: "clicks to answer a spend question" },
  { value: "100%", label: "finance team adoption" },
  { value: "6 wks", label: "idea to shipped" },
];

export default function CaseStudy() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [progress, setProgress] = useState(4);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onGalScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? (el.scrollLeft / max) * 100 : 0;
    setProgress(Math.max(4, pct));
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-[1000px] px-8 pt-16 pb-12 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-8">
          <Link href="/work" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Back to work
          </Link>
          <div className="my-6 font-mono text-xs text-accent max-[700px]:my-4">
            01 — Product Design
          </div>
          <h1 className="m-0 mb-6 text-[clamp(26px,7vw,48px)] leading-[1.1] font-semibold max-[700px]:mb-4">
            Fintech Dashboard Redesign
          </h1>
          <p className="m-0 mb-8 max-w-[640px] text-[17px] leading-[1.65] text-ink/62 max-[700px]:mb-5 max-[700px]:text-[14px]">
            A cleaner, data-dense interface that helps finance teams track spend across
            departments without digging through spreadsheets.
          </p>
          <div className="flex flex-wrap gap-8 border-t border-accent/12 pt-6 text-[13px] text-ink/50 max-[700px]:gap-5 max-[700px]:pt-4 max-[700px]:text-[12px]">
            <div>
              <div className="mb-1 text-ink/35">Role</div>Product &amp; UI Design
            </div>
            <div>
              <div className="mb-1 text-ink/35">Year</div>2026
            </div>
            <div>
              <div className="mb-1 text-ink/35">Tools</div>Figma, React, Framer
            </div>
          </div>
        </section>

        <ImageSlot
          alt="Fintech Dashboard hero screenshot"
          placeholder="Drop hero screenshot"
          shape="rect"
          className="block h-[480px] w-full max-[700px]:h-[220px]"
        />

        {/* PROBLEM */}
        <section className="mx-auto max-w-[1000px] px-8 py-18 max-[700px]:px-5 max-[700px]:py-10">
          <div
            className="grid gap-10 max-[700px]:gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))" }}
          >
            <h2 className="m-0 text-[28px] font-semibold max-[700px]:text-[21px]">The problem</h2>
            <p className="m-0 text-base leading-[1.7] text-ink/62 max-[700px]:text-[14px]">
              The existing dashboard buried spend data three clicks deep in dense tables.
              Finance teams were exporting to spreadsheets just to answer simple questions like
              &quot;what did we spend on tools this quarter?&quot;
            </p>
          </div>
        </section>

        {/* PROCESS */}
        <section className="mx-auto max-w-[1000px] px-8 pb-18 max-[700px]:px-5 max-[700px]:pb-10">
          <h2 className="m-0 mb-8 text-[28px] font-semibold max-[700px]:mb-5 max-[700px]:text-[21px]">
            Process
          </h2>
          <div className="flex flex-col">
            {PROCESS.map((step, i) => (
              <div
                key={step.num}
                className={`grid grid-cols-[48px_1fr] gap-5 border-t border-accent/12 py-6 max-[700px]:grid-cols-[28px_1fr] max-[700px]:gap-3 max-[700px]:py-4 ${
                  i === PROCESS.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono text-[13px] text-accent">{step.num}</span>
                <div>
                  <div className="mb-1.5 text-[17px] font-semibold max-[700px]:text-[15px]">
                    {step.title}
                  </div>
                  <div className="text-sm text-ink/55 max-[700px]:text-[12.5px]">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY CAROUSEL */}
        <section className="relative overflow-hidden border-t border-b border-accent/12 bg-band py-20 pb-12 max-[700px]:py-12 max-[700px]:pb-8">
          <div className="mx-auto mb-9 max-w-[1000px] px-8 max-[700px]:mb-5 max-[700px]:px-5">
            <div className="mb-2.5 text-xs tracking-[0.14em] text-accent/60 uppercase">Detail</div>
            <h2 className="m-0 text-[30px] font-semibold max-[700px]:text-[22px]">A Closer Look</h2>
          </div>
          <div
            ref={scrollRef}
            onScroll={onGalScroll}
            className={`mx-auto flex max-w-[1000px] gap-8 overflow-x-auto px-8 pb-3 max-[700px]:gap-4 max-[700px]:px-5 ${styles.noScrollbar}`}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {GALLERY.map((shot, i) => {
              const on = hovered === i;
              return (
                <div
                  key={shot.num}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative h-[280px] w-[min(420px,80vw)] flex-none shrink-0 snap-start overflow-hidden rounded-[18px] transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-[700px]:h-[190px] max-[700px]:w-[70vw]"
                  style={{
                    border: `1px solid ${on ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: on
                      ? "0 20px 40px -14px rgba(0,0,0,0.55)"
                      : "0 8px 20px -10px rgba(0,0,0,0.3)",
                  }}
                >
                  <ImageSlot
                    alt={shot.caption}
                    placeholder={`Drop screen ${shot.num}`}
                    shape="rect"
                    className="h-full w-full"
                  />
                  <span className="pointer-events-none absolute top-5 left-5 font-mono text-[56px] leading-none font-bold text-ink/10 max-[700px]:top-3 max-[700px]:left-3 max-[700px]:text-[36px]">
                    {shot.num}
                  </span>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/8 bg-band px-5 py-4.5 max-[700px]:px-3.5 max-[700px]:py-3">
                    <span className="font-mono text-xs text-ink/55">{shot.caption}</span>
                    <span
                      className="text-accent transition-opacity duration-300"
                      style={{ opacity: on ? 1 : 0 }}
                    >
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mx-auto mt-5 max-w-[1000px] px-8">
            <div className="h-0.5 overflow-hidden rounded-full bg-accent/15">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${progress}%`, transition: "width 0.08s linear" }}
              />
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="mx-auto max-w-[1000px] px-8 pb-18 max-[700px]:px-5 max-[700px]:pb-10">
          <h2 className="m-0 mb-8 text-[28px] font-semibold max-[700px]:mb-5 max-[700px]:text-[21px]">
            Outcome
          </h2>
          <div className="mb-8 flex flex-wrap gap-5 max-[700px]:mb-5 max-[700px]:gap-3">
            {OUTCOMES.map((o) => (
              <div
                key={o.label}
                className="flex-1 basis-[160px] rounded-xl border border-accent/15 px-5 py-5.5 max-[700px]:px-4 max-[700px]:py-4"
              >
                <div className="mb-1.5 text-[32px] font-bold text-accent max-[700px]:text-[24px]">
                  {o.value}
                </div>
                <div className="font-mono text-[11px] tracking-[0.04em] text-ink/50">
                  {o.label}
                </div>
              </div>
            ))}
          </div>
          <p className="m-0 max-w-[640px] text-base leading-[1.7] text-ink/62 max-[700px]:text-[14px]">
            The new dashboard shipped to the whole finance team and is now the default view for
            daily reporting. Spend questions that used to mean a spreadsheet export now get
            answered on the same screen.
          </p>
        </section>

        {/* NEXT PROJECT */}
        <Link
          href="/work"
          className="block bg-accent px-8 py-14 text-bg no-underline transition-colors hover:bg-ink max-[700px]:px-5 max-[700px]:py-9"
        >
          <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-bold">More work</span>
            <span className="text-2xl font-semibold max-[700px]:text-[18px]">
              Back to all projects →
            </span>
          </div>
        </Link>

        <Footer />
      </div>
    </div>
  );
}
