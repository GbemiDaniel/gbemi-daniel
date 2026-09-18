"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import styles from "./client-work.module.css";

const PROJECTS = [
  {
    key: "security-engineer-portfolio-cw",
    num: "01",
    title: "Security Engineer Portfolio",
    description: "Built a personal website for a security engineer — designed to feel serious, sharp, and trustworthy, the way his work is.",
    category: "COLLAB",
    tagList: ["React", "Tailwind"],
    year: "2026",
    href: "/case-study/security-engineer-portfolio",
    imgSrc: "/images/projects/security-engineer-portfolio/desktop.png",
    featured: false,
  },
  {
    key: "dice-portfolio-cw",
    num: "02",
    title: "Dice Portfolio",
    description: "Worked with a brand and product designer to turn his design into a real, working website — then added extra touches beyond what was originally asked for.",
    category: "COLLAB",
    tagList: ["React", "Tailwind"],
    year: "2026",
    href: "/case-study/dice-portfolio",
    imgSrc: "/images/projects/dice-portfolio/desktop.png",
    featured: false,
  },
  {
    key: "skillzbloom-cw",
    num: "03",
    title: "SkillzBloom",
    description: "Helped build a platform that helps students track their learning. I built the entire Skills section plus a reusable design system used across the app.",
    category: "TEAM PROJECT",
    tagList: ["TypeScript", "Tailwind"],
    year: "2025",
    href: "/case-study/skillzbloom",
    imgSrc: "/images/projects/skillzbloom/desktop.png",
    featured: false,
  },
  {
    key: "chronovault-cw",
    num: "04",
    title: "ChronoVault",
    description: "A digital time-capsule idea that lets people lock away files or messages until a future date. I built the interface from a collaborator's design, bringing the whole idea to life on screen.",
    category: "COLLAB",
    tagList: ["React", "Framer Motion"],
    year: "2026",
    href: "/case-study/chronovault",
    imgSrc: "/images/projects/chronovault/chronovault.png",
    featured: false,
  },
  {
    key: "thrifty-cw",
    num: "05",
    title: "Thrifty",
    description: "An online clothing store frontend — I built out a collaborator's design into a real, working shopping experience.",
    category: "COLLAB",
    tagList: ["React", "Next.js"],
    year: "2026",
    href: "/case-study/thrifty",
    imgSrc: "/images/projects/thrifty/desktop.png",
    featured: false,
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
              <span className="text-accent">01</span> — COLLABORATIONS
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
              Not solo work. Every one of these meant teaming up with someone who knows their
              own craft.
            </p>
          </div>
        </section>

        {/* GRID */}
        <section className="mx-auto max-w-[1200px] px-8 pt-2 pb-24 max-[700px]:px-5 max-[700px]:pb-16">
          <Reveal
            stagger={0.08}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-7 max-[700px]:gap-5"
          >
            {PROJECTS.map((p) => {
              const on = hovered === p.key;
              return (
                <Link
                  key={p.key}
                  href={p.href}
                  onMouseEnter={() => setHovered(p.key)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative block overflow-hidden rounded-xl text-inherit no-underline transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[7px]"
                  style={{
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
                      src={p.imgSrc}
                      objectFit="contain"
                      sizes="(max-width: 700px) 90vw, 380px"
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
          </Reveal>
        </section>

        <Footer />
      </div>
    </div>
  );
}
