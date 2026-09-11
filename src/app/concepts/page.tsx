import type { CSSProperties } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import styles from "./concepts.module.css";

const PROJECTS = [
  {
    key: "nightline-c",
    title: "Nightline — Concept",
    description: "An exploration in real-time transit UI, built with no client and no deadline.",
    category: "CONCEPT",
    tagList: ["React", "Mapbox"],
    year: "2024",
    href: "/work",
    rot: "-1.2deg",
  },
];

export default function Concepts() {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HEADER */}
        <section className="relative mx-auto max-w-[1200px] overflow-hidden px-8 pt-16 pb-10 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-6">
          <Link href="/work" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Back to work
          </Link>
          <div className="mt-6 mb-4 font-mono text-xs tracking-[0.1em] text-ink/40">
            {"// "}
            <span className="text-accent">02</span> — CONCEPTS
          </div>
          <h1 className="m-0 mb-4 text-[clamp(28px,4.2vw,44px)] leading-[1.15] font-bold">
            What if
            <span className={styles.cursor} />— <span className="text-accent">no client, no deadline.</span>
          </h1>
          <p className="m-0 max-w-[560px] text-[15px] text-ink/55">
            Unfinished by design — some of these never needed to ship to prove the point.
          </p>
        </section>

        {/* GRID */}
        <section className="mx-auto max-w-[1200px] px-8 pt-2 pb-24 max-[700px]:px-5 max-[700px]:pb-16">
          <div
            className="grid gap-9 max-[700px]:gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
          >
            {PROJECTS.map((p) => (
              <Link
                key={p.key}
                href={p.href}
                className={`${styles.floatIn} ${styles.card} relative block overflow-visible rounded-[10px] border-[1.5px] border-dashed text-inherit no-underline`}
                style={{ "--rot": p.rot, transform: `rotate(${p.rot})` } as CSSProperties}
              >
                <span
                  className="absolute top-[-8px] left-6 z-[2] h-4 w-[34px] rounded-[1px] bg-ink/15"
                  style={{ transform: "rotate(-4deg)" }}
                />
                <div className="relative overflow-hidden rounded-t-[9px]">
                  <ImageSlot
                    alt={p.title}
                    placeholder="Drop project image"
                    shape="rect"
                    className="h-[200px] w-full [filter:saturate(0.9)] max-[700px]:h-[150px]"
                  />
                  <span
                    className="absolute top-3.5 right-3.5 rounded-full border border-accent/30 bg-[rgba(11,8,16,0.7)] px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-ink/60 max-[700px]:px-2 max-[700px]:text-[9px]"
                    style={{ transform: "rotate(3deg)" }}
                  >
                    PROTOTYPE
                  </span>
                </div>
                <div className="rounded-b-[9px] bg-band p-5 max-[700px]:p-4">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-accent max-[700px]:text-[10px]">
                    <span>{p.category}</span>
                  </div>
                  <h3 className="m-0 mb-2 text-[19px] font-semibold max-[700px]:text-[16px]">
                    {p.title}
                  </h3>
                  <p className="m-0 mb-3.5 text-[13px] leading-[1.5] text-ink/55 max-[700px]:line-clamp-2 max-[700px]:text-[12px]">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
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
                </div>
              </Link>
            ))}
            <div
              className={`${styles.floatIn} flex min-h-[340px] flex-col items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-dashed border-accent/20 p-5 text-center max-[700px]:min-h-[180px]`}
              style={{ animationDelay: "0.15s", transform: "rotate(0.8deg)" }}
            >
              <span className="font-mono text-[26px] text-accent/60">?</span>
              <span className="font-mono text-[11px] tracking-[0.06em] text-ink/40">
                Still sketching
                <br />
                the next one
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
