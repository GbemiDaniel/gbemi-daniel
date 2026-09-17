"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import JargonTranslator from "@/components/about/JargonTranslator";
import styles from "./about.module.css";

// Same section vocabulary as the Home page, so About reads as part of the
// same site rather than its own thing.
const sectionLabel = "mb-4 font-mono text-xs tracking-[0.1em] text-ink/40";
const sectionHeading = "m-0 mb-4 text-[clamp(26px,3.6vw,38px)] font-bold leading-[1.15]";
/**
 * The divider (and any clipping) belongs to the full-width section, while the
 * content stays capped at 1200px inside, the same split the Footer uses.
 * Putting the border on the capped box instead made every divider stop short
 * of the nav and the viewport edge on wide screens, leaving a dark strip.
 */
function Section({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={`border-t border-accent/12 ${className}`}>
      <div
        className={`mx-auto max-w-300 px-8 py-20 max-[700px]:px-5 max-[700px]:py-12 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
const arrowCircleBase =
  "flex shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-[transform,box-shadow] duration-300 group-hover:[animation:arrowPulse_0.6s_cubic-bezier(0.34,1.56,0.64,1)_1]";
const inlineLink =
  "text-ink underline decoration-accent/50 underline-offset-[5px] transition-colors hover:text-accent";

const PRINCIPLES = [
  {
    num: "01",
    title: "Your vision stays yours.",
    desc: "I build what you set out to make, not my version of it.",
  },
  {
    num: "02",
    title: "Your users come first.",
    desc: "Every decision is weighed against the people who'll actually use it.",
  },
  {
    num: "03",
    title: "Creative where it counts.",
    desc: "Finding the right solution, not just one that works.",
  },
  {
    num: "04",
    title: "Done to standard.",
    desc: "Industry-standard approaches, so what I build holds up and can grow.",
  },
];

const TOOLS = ["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub", "Vercel"];

const COLLABS = [
  {
    field: "Security",
    name: "Security Engineer Portfolio",
    href: "/case-study/security-engineer-portfolio",
    img: "/images/projects/security-engineer-portfolio/desktop.png",
  },
  {
    field: "Design",
    name: "Dice Portfolio",
    href: "/case-study/dice-portfolio",
    img: "/images/projects/dice-portfolio/desktop.png",
  },
  {
    field: "Everyday tools",
    name: "Handshakers",
    href: "https://handshakers.vercel.app",
    external: true,
  },
];

const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";
const tileBase =
  "group relative overflow-hidden rounded-2xl border border-accent/15 bg-[rgba(0,0,0,0.12)] p-8 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/50 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)] max-[700px]:p-5";

// Small visual per principle, each built from a motif the site already uses.

/** Vision — the camera-frame brackets from the photos, tightening on hover. */
function VisionMark() {
  const corner = "absolute h-3 w-3 border-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
  return (
    <div className="relative h-11 w-16" aria-hidden>
      <span className={`${corner} top-0 left-0 border-t-2 border-l-2 group-hover:translate-x-1.5 group-hover:translate-y-1`} />
      <span className={`${corner} top-0 right-0 border-t-2 border-r-2 group-hover:-translate-x-1.5 group-hover:translate-y-1`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2 group-hover:translate-x-1.5 group-hover:-translate-y-1`} />
      <span className={`${corner} right-0 bottom-0 border-r-2 border-b-2 group-hover:-translate-x-1.5 group-hover:-translate-y-1`} />
      <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(201,243,29,0.5)]" />
    </div>
  );
}

/** Users — a crowd of dots with one person in focus. */
function UsersMark() {
  return (
    <div className="grid w-fit grid-cols-6 gap-1.5 py-1" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            i === 8
              ? "bg-accent shadow-[0_0_8px_2px_rgba(201,243,29,0.5)]"
              : "bg-ink/20 group-hover:bg-ink/40"
          }`}
        />
      ))}
    </div>
  );
}

/** Creative — the Lab's orbit. */
function OrbitMark() {
  return (
    <div className="relative h-11 w-11 rounded-full border border-accent/15" aria-hidden>
      <div className={`absolute inset-0 ${styles.orbitSpin}`}>
        <span className="absolute -top-0.75 left-1/2 h-1.5 w-1.5 -ml-0.75 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(201,243,29,0.5)]" />
      </div>
      <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-1/2 rounded-full bg-ink/50" />
    </div>
  );
}

export default function About() {
  const [showTop, setShowTop] = useState(false);

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
        <section className="mx-auto max-w-300 px-8 pt-16 pb-20 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-12">
          <div
            className="grid items-stretch gap-12 max-[700px]:gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
          >
            <div className={`flex flex-col justify-center ${styles.reveal}`}>
              <div className="mb-5 text-[13px] tracking-widest text-ink/50 uppercase">About</div>
              <h1 className="m-0 mb-6 text-[clamp(30px,4.5vw,46px)] leading-[1.15] font-semibold">
                From ideas to products — built to standard,{" "}
                <span className="text-accent [text-shadow:0_0_18px_rgba(201,243,29,0.5)]">
                  built for real users.
                </span>
              </h1>
              <p className="m-0 max-w-120 text-base leading-[1.7] text-ink/62">
                I&apos;m Daniel, a frontend engineer with a creative, problem-solving approach. I
                work with founders, teams, agencies, and anyone with an idea worth building — and I
                make sure you&apos;re understood before a single line of code gets written.
              </p>
            </div>
            <div
              className={`relative aspect-4/5 min-[700px]:aspect-auto min-[700px]:min-h-105 ${styles.reveal}`}
              style={{ animationDelay: "0.15s" }}
            >
              <span className="absolute -top-2.5 -left-2.5 z-2 h-5.5 w-5.5 border-t-2 border-l-2 border-accent" />
              <span className="absolute -top-2.5 -right-2.5 z-2 h-5.5 w-5.5 border-t-2 border-r-2 border-accent" />
              <span className="absolute -bottom-2.5 -left-2.5 z-2 h-5.5 w-5.5 border-b-2 border-l-2 border-accent" />
              <span className="absolute -right-2.5 -bottom-2.5 z-2 h-5.5 w-5.5 border-r-2 border-b-2 border-accent" />
              <ImageSlot
                alt="Daniel"
                placeholder="Drop Daniel's photo"
                src="/images/portrait-about.jpg"
                objectPosition="center 20%"
                sizes="(max-width: 700px) 90vw, 500px"
                shape="rounded"
                radius={24}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute top-3 left-3 z-2 rounded bg-[rgba(11,8,16,0.55)] px-2 py-1 font-mono text-[10px] text-ink backdrop-blur-sm">
                ABOUT.JPG
              </div>
            </div>
          </div>
        </section>

        {/* 01 — WORKING WITH ME */}
        <Section>
          <div className="grid gap-14 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[900px]:items-center max-[900px]:gap-8">
            <Reveal>
              <div className={sectionLabel}>
                <span className="text-accent">01</span> — WORKING WITH ME
              </div>
              <h2 className={`${sectionHeading} mb-0!`}>
                You won&apos;t need to <span className="text-accent">speak tech.</span>
              </h2>
              <p className="m-0 mt-5 max-w-115 text-base leading-[1.7] text-ink/62 max-[700px]:text-[15px]">
                Most people I build for aren&apos;t technical, and they shouldn&apos;t have to be. I
                listen first, explain things in plain language, and keep you in on the decisions
                that matter — so you always know what&apos;s being built, and why.
              </p>
            </Reveal>
            {/* Shows the promise instead of just stating it: jargon in,
                plain English out. */}
            <Reveal delay={0.1}>
              <JargonTranslator />
            </Reveal>
          </div>
        </Section>

        {/* 02 — HOW I BUILD */}
        <Section>
          <Reveal className="mb-10 max-[700px]:mb-6">
            <div className={sectionLabel}>
              <span className="text-accent">02</span> — HOW I BUILD
            </div>
            <h2 className={`${sectionHeading} mb-0!`}>
              Your vision. Your users. <span className="text-accent">Built properly.</span>
            </h2>
          </Reveal>

          {/* Bento: wide / narrow / narrow / wide on desktop, so it reads as
              a composition rather than four identical boxes. Below 1000px
              the wide cards take a full row and the narrow two pair up. */}
          <Reveal
            stagger={0.08}
            className="grid gap-5 min-[700px]:grid-cols-2 min-[1000px]:grid-cols-6 max-[700px]:gap-3"
          >
            {PRINCIPLES.map((p, i) => {
              const wide = i === 0 || i === 3;
              const mark = [<VisionMark key="v" />, <UsersMark key="u" />, <OrbitMark key="o" />, null][i];
              return (
                <div
                  key={p.num}
                  className={`${tileBase} ${
                    wide ? "min-[700px]:col-span-2 min-[1000px]:col-span-4" : "min-[1000px]:col-span-2"
                  }`}
                >
                  <span className="pointer-events-none absolute top-4 right-5 font-mono text-[56px] leading-none font-bold text-ink/6 max-[700px]:text-[36px]">
                    {p.num}
                  </span>
                  {mark && <div className="mb-7 max-[700px]:mb-5">{mark}</div>}
                  <div className="relative mb-2.5 pr-16 text-xl font-semibold max-[700px]:mb-1.5 max-[700px]:pr-10 max-[700px]:text-base">
                    {p.title}
                  </div>
                  <div className="relative max-w-105 text-sm leading-[1.6] text-ink/55 max-[700px]:text-[13px]">
                    {p.desc}
                  </div>

                  {/* "Done to standard" carries its proof: the degree and the
                      tools, right under the claim they back up. */}
                  {i === 3 && (
                    <div className="relative mt-7 border-t border-accent/12 pt-6 max-[700px]:mt-5 max-[700px]:pt-5">
                      <div className="mb-3 font-mono text-[10px] tracking-[0.12em] text-ink/40 uppercase">
                        Backed by
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] tracking-wider text-accent">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          Computer Science degree
                        </span>
                        {TOOLS.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-full border border-accent/20 px-3 py-1.5 font-mono text-[11px] tracking-wider text-ink/60 transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent hover:bg-accent hover:text-bg"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </Reveal>
        </Section>

        {/* 03 — CURRENTLY */}
        <Section>
          <Reveal>
            <div className={sectionLabel}>
              <span className="text-accent">03</span> — CURRENTLY
            </div>
            <p className="m-0 max-w-230 text-[clamp(22px,2.8vw,34px)] leading-[1.35] font-semibold">
              Building my own ideas and collaborating with people across fields — from{" "}
              <Link href="/case-study/security-engineer-portfolio" className={inlineLink}>
                security
              </Link>{" "}
              and{" "}
              <Link href="/case-study/dice-portfolio" className={inlineLink}>
                design
              </Link>{" "}
              to everyday tools like{" "}
              <a
                href="https://handshakers.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLink}
              >
                Handshakers
              </a>
              , which helps teams on shared accounts log their time and get paid for exactly the
              hours they put in.
            </p>
          </Reveal>
          {/* The three fields from the sentence above, as the real work. */}
          <Reveal
            stagger={0.1}
            className="mt-10 grid gap-5 min-[700px]:grid-cols-3 max-[700px]:mt-8 max-[700px]:gap-4"
          >
            {COLLABS.map((c) => {
              const body = (
                <>
                  <div className="flex items-center gap-1.5 rounded-t-xl border border-b-0 border-accent/15 bg-band px-3.5 py-2.5">
                    <span className={chromeDot} />
                    <span className={chromeDot} />
                    <span className={chromeDot} />
                    <span className="ml-auto font-mono text-[10px] tracking-widest text-ink/45 uppercase transition-colors group-hover:text-accent">
                      {c.field}
                    </span>
                  </div>
                  <div className="relative h-37.5 overflow-hidden border-x border-accent/15 max-[700px]:h-35">
                    {c.img ? (
                      <ImageSlot
                        alt={c.name}
                        src={c.img}
                        objectFit="contain"
                        sizes="(max-width: 700px) 90vw, 380px"
                        shape="rect"
                        className="h-full w-full"
                      />
                    ) : (
                      <div
                        className="flex h-full flex-col items-center justify-center gap-3 bg-band bg-[radial-gradient(rgba(201,243,29,0.18)_1px,transparent_1.5px)]"
                        style={{ backgroundSize: "14px 14px" }}
                      >
                        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-bg/80 px-3 py-1 font-mono text-[10px] tracking-widest text-accent">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                          </span>
                          LIVE
                        </span>
                        <span className="rounded bg-bg/80 px-2 py-0.5 font-mono text-xs text-ink/70">
                          handshakers.vercel.app
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-b-xl border border-t-0 border-accent/15 px-4 py-3.5">
                    <span className="text-[15px] font-semibold">{c.name}</span>
                    <span className="font-mono text-sm text-accent transition-transform duration-300 group-hover:translate-x-1">
                      {c.external ? "↗" : "→"}
                    </span>
                  </div>
                </>
              );
              const cardClass =
                "group block text-inherit no-underline transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1";
              return c.external ? (
                <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {body}
                </a>
              ) : (
                <Link key={c.name} href={c.href} className={cardClass}>
                  {body}
                </Link>
              );
            })}
          </Reveal>

          <Reveal delay={0.1}>
            <p className="m-0 mt-14 max-w-160 border-l-2 border-accent pl-5 text-[17px] leading-[1.7] text-ink/62 max-[700px]:mt-10 max-[700px]:text-[15px]">
              There isn&apos;t really an &quot;off the clock&quot; for me. What I read, the films I
              watch, the long walks, the articles I&apos;m working through — it all points the same
              way: to create, solve problems, and be of service.
            </p>
          </Reveal>
        </Section>

        {/* 04 — CONTACT. The glow stays anchored to the content box
            (innerClassName "relative") but is clipped by the full-width
            section, so it fades out naturally instead of stopping in a hard
            vertical line where the 1200px box ends. */}
        <Section className="overflow-hidden" innerClassName="relative pb-24 max-[700px]:pb-16">
          <div className="pointer-events-none absolute -top-25 left-[-10%] h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(140,210,60,0.14),transparent_70%)] blur-[50px]" />
          <Reveal className="relative">
            <div className={sectionLabel}>
              <span className="text-accent">04</span> — CONTACT
            </div>
            <h2 className={sectionHeading}>
              Have an idea, or a <span className="text-accent">role to fill?</span>
            </h2>
            <p className="m-0 flex items-center gap-2 text-[13px] text-ink/60">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Open to client projects and full-time roles.
            </p>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-3.5 text-inherit no-underline hover:opacity-80 max-[700px]:mt-8"
            >
              <span className={`${arrowCircleBase} h-13 w-13 text-lg max-[700px]:h-10 max-[700px]:w-10 max-[700px]:text-[15px]`}>
                →
              </span>
              <span className="font-mono text-[13px] tracking-[0.08em] text-ink">
                START A CONVERSATION
              </span>
            </Link>
          </Reveal>
        </Section>

        <Footer />
      </div>

      <span
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-7 bottom-7 z-60 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-accent text-base text-bg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] transition-opacity duration-250 hover:animate-[arrowPulse_0.6s_cubic-bezier(0.34,1.56,0.64,1)_1]"
        style={{ opacity: showTop ? 1 : 0, pointerEvents: showTop ? "auto" : "none" }}
      >
        ↑
      </span>
    </div>
  );
}
