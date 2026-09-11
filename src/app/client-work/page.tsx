"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import styles from "./client-work.module.css";

const PROJECTS = [
  {
    key: "fintech-cw",
    num: "01",
    title: "Fintech Dashboard Redesign",
    description: "A cleaner data-dense interface for tracking spend across teams.",
    category: "CLIENT WORK",
    tagList: ["React", "Supabase"],
    year: "2026",
    href: "/case-study",
    featured: true,
    delay: "0.24s",
    external: false,
  },
  {
    key: "palli-cw",
    num: "02",
    title: "Palli's Portfolio",
    description: "A terminal-styled identity platform for a security engineer, built around layered glow and immersive UI.",
    category: "COLLAB",
    tagList: ["Next.js", "Tailwind"],
    year: "2026",
    href: "https://okoh-bernard-portfolio.vercel.app/",
    featured: false,
    delay: "0.32s",
    external: true,
  },
  {
    key: "handshakers-cw",
    num: "03",
    title: "Handshakers",
    description: "Details coming soon — my newest build.",
    category: "CLIENT WORK",
    tagList: [],
    year: "—",
    href: "/work",
    featured: false,
    delay: "0.4s",
    external: false,
  },
];

export default function ClientWork() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HEADER */}
        <section className="relative mx-auto max-w-[1200px] overflow-hidden px-8 pt-16 pb-10 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-6">
          <Link href="/work" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Back to work
          </Link>
          <div className="mt-6 mb-4 overflow-hidden">
            <div
              className={`${styles.curtainRise} inline-block font-mono text-xs tracking-[0.1em] text-ink/40`}
              style={{ animationDuration: "0.7s" }}
            >
              <span className="text-accent">01</span> — CLIENT WORK &amp; COLLABS
            </div>
          </div>
          <div className="overflow-hidden">
            <h1
              className={`${styles.curtainRise} m-0 mb-3 text-[clamp(28px,4.2vw,44px)] leading-[1.15] font-bold`}
              style={{ animationDuration: "0.8s", animationDelay: "0.08s" }}
            >
              Delivered. Shipped. <span className="text-accent">Still in production.</span>
            </h1>
          </div>
          <div className="overflow-hidden">
            <p
              className={`${styles.curtainRise} m-0 max-w-[560px] text-[15px] text-ink/55`}
              style={{ animationDuration: "0.8s", animationDelay: "0.16s" }}
            >
              The engagements where the work had to survive contact with a real team, a real
              budget, and a real launch date.
            </p>
          </div>
        </section>

        {/* GRID */}
        <section className="mx-auto max-w-[1200px] px-8 pt-2 pb-24 max-[700px]:px-5 max-[700px]:pb-16">
          <div
            className="grid gap-7 max-[700px]:gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
          >
            {PROJECTS.map((p) => {
              const on = hovered === p.key;
              return (
                <Link
                  key={p.key}
                  href={p.href}
                  {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onMouseEnter={() => setHovered(p.key)}
                  onMouseLeave={() => setHovered(null)}
                  className={`${styles.curtainRise} relative block overflow-hidden rounded-xl text-inherit no-underline transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[7px]`}
                  style={{
                    animationDuration: "0.7s",
                    animationDelay: p.delay,
                    border: `1px solid ${on ? "rgba(201,243,29,0.4)" : "rgba(201,243,29,0.15)"}`,
                    boxShadow: on ? "0 28px 50px -16px rgba(0,0,0,0.6)" : "0 0 0 rgba(0,0,0,0)",
                  }}
                >
                  <div className="relative flex items-center justify-between gap-1.5 bg-band px-3.5 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-[7px] w-[7px] rounded-full bg-ink/20" />
                      <span className="h-[7px] w-[7px] rounded-full bg-ink/20" />
                      <span className="h-[7px] w-[7px] rounded-full bg-ink/20" />
                    </div>
                    {p.featured && (
                      <span className="shrink-0 rounded bg-accent px-2 py-[3px] font-mono text-[10px] font-bold tracking-[0.05em] text-bg">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="relative overflow-hidden">
                    <ImageSlot
                      alt={p.title}
                      placeholder="Drop project image"
                      shape="rect"
                      className="h-[200px] w-full max-[700px]:h-[150px]"
                    />
                    <span className="pointer-events-none absolute top-3.5 right-3.5 font-mono text-[44px] leading-none font-bold text-ink/10 max-[700px]:top-2 max-[700px]:right-2 max-[700px]:text-[32px]">
                      {p.num}
                    </span>
                  </div>
                  <div className="p-5 max-[700px]:p-4">
                    <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-accent max-[700px]:text-[10px]">
                      <span>{p.category}</span>
                      <span
                        className="transition-opacity duration-300"
                        style={{ opacity: on ? 1 : 0 }}
                      >
                        →
                      </span>
                    </div>
                    <h3 className="m-0 mb-2 text-[19px] font-semibold max-[700px]:text-[16px]">
                      {p.title}
                    </h3>
                    <p className="m-0 mb-3.5 text-[13px] leading-[1.5] text-ink/55 max-[700px]:line-clamp-2 max-[700px]:text-[12px]">
                      {p.description}
                    </p>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {p.tagList.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-ink/15 px-2 py-[3px] font-mono text-[10px] text-ink/55"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto self-center font-mono text-[10px] text-ink/35">
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
            })}
            <div
              className={`${styles.curtainRise} flex min-h-[340px] flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-accent/25 p-5 text-center max-[700px]:min-h-[180px]`}
              style={{ animationDuration: "0.7s", animationDelay: "0.5s" }}
            >
              <span className="font-mono text-[26px] text-accent/60">+</span>
              <span className="font-mono text-[11px] tracking-[0.06em] text-ink/40">
                More client work
                <br />
                in progress
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
