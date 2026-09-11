"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import PlatformBadge, { platformLabel } from "@/components/PlatformBadge";
import { ARTICLES } from "@/lib/writing";

function ArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("post");
  const article = (slug && ARTICLES[slug]) || ARTICLES["constraints"];

  const [showShadow, setShowShadow] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      setShowShadow(!nearBottom);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const [firstPara, ...restParagraphs] = article.paragraphs;
  const dropCap = firstPara[0];
  const firstParaRest = firstPara.slice(1);

  return (
    <div className="flex min-h-screen bg-bg font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        <section className="mx-auto max-w-[760px] px-8 pt-16 max-[700px]:px-5 max-[700px]:pt-5">
          <Link href="/blog" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Writing
          </Link>

          <div className="mt-7 mb-4.5 flex flex-wrap items-center gap-2.5 font-mono text-xs text-accent max-[700px]:mt-5 max-[700px]:mb-3">
            <span className="rounded-full border border-accent/35 px-2.5 py-1">{article.tag}</span>
            <span className="flex items-center gap-1.5 text-ink/50">
              <PlatformBadge platform={article.platform} size={13} />
              {platformLabel(article.platform)}
            </span>
            <span className="text-ink/40">
              {article.date} · {article.readTime} read
            </span>
          </div>

          <h1 className="font-serif-italic m-0 mb-5 text-[clamp(28px,7vw,48px)] leading-[1.2] font-normal italic max-[700px]:mb-3">
            {article.title}
          </h1>
          <p className="font-serif-italic m-0 mb-7 max-w-[560px] text-[19px] leading-[1.5] font-normal text-ink/55 italic max-[700px]:mb-4 max-[700px]:text-[15px]">
            {article.excerpt}
          </p>

          <div className="mb-8 flex items-center gap-2.5 max-[700px]:mb-5">
            <ImageSlot alt="Gbemi Daniel" placeholder="Photo" shape="circle" className="h-8 w-8" />
            <span className="text-[13px] text-ink/60">Gbemi Daniel</span>
          </div>

          <ImageSlot
            alt={article.title}
            placeholder="Drop cover image"
            shape="rounded"
            radius={16}
            className="h-[340px] w-full max-[700px]:h-[180px]"
          />
        </section>

        <section className="relative mx-auto max-w-[680px] px-8 pt-10 max-[700px]:px-5 max-[700px]:pt-6">
          <p className="m-0 mb-5.5 text-base leading-[1.75] text-ink/75 max-[700px]:text-[14.5px]">
            <span className="font-serif-italic float-left pr-2.5 text-[60px] leading-[0.75] text-accent italic max-[700px]:pr-2 max-[700px]:text-[42px]">
              {dropCap}
            </span>
            {firstParaRest}
          </p>
          {restParagraphs.map((para, i) => (
            <p
              key={i}
              className="m-0 mb-5.5 text-base leading-[1.75] text-ink/75 max-[700px]:text-[14.5px]"
            >
              {para}
            </p>
          ))}
          <div className="mt-9 flex items-center gap-4 max-[700px]:mt-6">
            <span className="font-script text-[28px] font-bold text-accent/75">Gbemi</span>
            <span className="h-px flex-1 bg-accent/12" />
          </div>
        </section>

        <section className="mx-auto max-w-[680px] px-8 pt-4 pb-24 max-[700px]:px-5 max-[700px]:pb-14">
          <div className="rounded-2xl border border-accent/20 p-8 text-center max-[700px]:p-5">
            <div className="mb-2.5 font-mono text-[11px] tracking-[0.08em] text-ink/45">
              THIS IS A PREVIEW
            </div>
            <p className="m-0 mb-5 text-sm leading-relaxed text-ink/60 max-[700px]:text-[13px]">
              Read the rest of this piece on {platformLabel(article.platform)} — where it was
              originally posted.
            </p>
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-accent px-6 py-3 text-[13px] font-bold text-bg no-underline transition-colors hover:bg-ink"
            >
              Continue Reading →
            </a>
          </div>
        </section>

        <Footer />
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[90px] bg-gradient-to-b from-transparent to-[rgba(11,8,16,0.55)] transition-opacity duration-300"
        style={{ opacity: showShadow ? 1 : 0 }}
      />
    </div>
  );
}

export default function Article() {
  return (
    <Suspense fallback={null}>
      <ArticleContent />
    </Suspense>
  );
}
