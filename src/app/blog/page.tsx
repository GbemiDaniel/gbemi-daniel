"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import PlatformBadge, { platformLabel } from "@/components/PlatformBadge";
import { ARTICLES, FEATURED_ORDER, MORE_WRITING_ORDER } from "@/lib/writing";

const FEATURED = FEATURED_ORDER.map((slug) => ARTICLES[slug]);
const POSTS = MORE_WRITING_ORDER.map((slug) => ARTICLES[slug]);

export default function Blog() {
  const [featIndex, setFeatIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (paused) return;
      setFading(true);
      setTimeout(() => {
        setFeatIndex((i) => (i + 1) % FEATURED.length);
        setFading(false);
      }, 350);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const jumpTo = (i: number) => {
    setFading(true);
    setTimeout(() => {
      setFeatIndex(i);
      setFading(false);
    }, 350);
  };

  const featured = FEATURED[featIndex];

  return (
    <div className="flex min-h-screen bg-bg font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* MASTHEAD */}
        <section className="mx-auto max-w-[1200px] px-8 pt-16 pb-2 max-[700px]:px-5 max-[700px]:pt-5">
          <div className="mb-4 text-[13px] tracking-[0.1em] text-ink/50 uppercase max-[700px]:mb-3">
            Writing
          </div>
          <h1 className="m-0 mb-6 max-w-[760px] text-[clamp(28px,7vw,46px)] leading-[1.15] font-semibold max-[700px]:mb-4">
            Posts, threads and notes from{" "}
            <span className="font-serif-italic text-accent italic font-normal">
              wherever I published them.
            </span>
          </h1>
          <div className="flex items-center gap-3 border-b border-accent/12 pb-8 max-[700px]:pb-5">
            <ImageSlot
              alt="Gbemi Daniel"
              placeholder="Photo"
              shape="circle"
              className="h-9 w-9"
            />
            <span className="text-[13px] text-ink/55">
              Collected from X, Dev.to, Medium and LinkedIn — previewed here, read in full where
              it lives.
            </span>
          </div>
        </section>

        {/* FEATURED PIECE */}
        <section className="mx-auto max-w-[1200px] px-8 py-12 max-[700px]:px-5 max-[700px]:py-6">
          <Link
            href={`/article?post=${featured.slug}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="grid items-center gap-10 text-inherit no-underline transition-opacity duration-350 max-[700px]:gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              opacity: fading ? 0 : 1,
            }}
          >
            <ImageSlot
              alt={featured.title}
              placeholder="Drop cover image"
              shape="rounded"
              radius={16}
              className="h-[340px] w-full max-[700px]:h-[180px]"
            />
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2.5 font-mono text-xs text-accent max-[700px]:mb-2.5">
                <span className="rounded-full border border-accent/35 px-2.5 py-1">
                  {featured.tag}
                </span>
                <span className="flex items-center gap-1.5 text-ink/50">
                  <PlatformBadge platform={featured.platform} size={12} />
                  {platformLabel(featured.platform)}
                </span>
                <span className="text-ink/40">
                  {featured.date} · {featured.readTime} read
                </span>
              </div>
              <h2 className="font-serif-italic m-0 mb-3.5 text-[32px] leading-[1.2] font-normal italic max-[700px]:mb-2 max-[700px]:text-[22px]">
                {featured.title}
              </h2>
              <p className="m-0 mb-4.5 max-w-[460px] text-[15px] leading-[1.7] text-ink/60 max-[700px]:mb-3 max-[700px]:line-clamp-2 max-[700px]:text-[13px]">
                {featured.excerpt}
              </p>
              <span className="border-b border-accent pb-0.5 text-[13px] text-accent">
                Preview the piece →
              </span>
            </div>
          </Link>
          <div className="mt-6 flex gap-1.5 pl-0.5">
            {FEATURED.map((f, i) => (
              <span
                key={f.slug}
                onClick={() => jumpTo(i)}
                className="h-1.5 cursor-pointer rounded-full transition-[width,background] duration-300"
                style={{
                  width: i === featIndex ? 20 : 6,
                  background: i === featIndex ? "#C9F31D" : "rgba(242,239,233,0.25)",
                }}
              />
            ))}
          </div>
        </section>

        {/* MORE WRITING */}
        <section className="mx-auto max-w-[1200px] px-8 pt-6 pb-20 max-[700px]:px-5 max-[700px]:pb-12">
          <div className="mb-2 text-xs tracking-[0.1em] text-ink/40 uppercase">More writing</div>
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/article?post=${post.slug}`}
              className="flex flex-wrap items-baseline justify-between gap-6 border-t border-accent/12 py-7 text-inherit no-underline hover:text-accent max-[700px]:gap-2 max-[700px]:py-4"
            >
              <div className="flex max-w-[600px] flex-col gap-2 max-[700px]:gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-accent/70">
                  <span className="rounded-full border border-accent/25 px-2.5 py-[3px]">
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-ink/45">
                    <PlatformBadge platform={post.platform} size={11} />
                    {platformLabel(post.platform)}
                  </span>
                </div>
                <h3 className="font-serif-italic m-0 text-[22px] font-normal text-inherit italic max-[700px]:text-[17px]">
                  {post.title}
                </h3>
                <p className="m-0 text-sm text-ink/55 max-[700px]:line-clamp-2 max-[700px]:text-[12.5px]">
                  {post.excerpt}
                </p>
              </div>
              <span className="font-mono text-xs whitespace-nowrap text-ink/40">
                {post.date} · {post.readTime}
              </span>
            </Link>
          ))}
        </section>

        <Footer />
      </div>
    </div>
  );
}
