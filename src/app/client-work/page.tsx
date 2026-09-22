"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import styles from "./client-work.module.css";

const PROJECTS = [
  {
    key: "security-engineer-portfolio-cw",
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
            {PROJECTS.map((p) => (
              <ProjectCard
                key={p.key}
                project={p}
                hovered={hovered === p.key}
                onHoverStart={() => setHovered(p.key)}
                onHoverEnd={() => setHovered(null)}
              />
            ))}
          </Reveal>
        </section>

        <Footer />
      </div>
    </div>
  );
}
