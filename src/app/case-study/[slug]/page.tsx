import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import Reveal from "@/components/Reveal";
import { CASE_STUDIES } from "@/lib/caseStudies";

const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";
const chromeBar =
  "relative flex items-center gap-1.5 rounded-t-xl border border-b-0 border-accent/15 bg-band px-3.5 py-2.5";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDIES[slug];
  if (!cs) notFound();

  const comingSoon = cs.sections.length === 0;

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-[1000px] px-8 pt-16 pb-12 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-8">
          <Link href="/work" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Back to work
          </Link>
          <Reveal>
            <div className="my-6 font-mono text-xs text-accent max-[700px]:my-4">
              {cs.category} · {cs.year}
            </div>
            <h1 className="m-0 mb-6 text-[clamp(26px,7vw,48px)] leading-[1.1] font-semibold max-[700px]:mb-4">
              {cs.title}
            </h1>
            {(cs.stack.length > 0 || cs.liveUrl) && (
              <div className="flex flex-wrap items-center gap-5 border-t border-accent/12 pt-6 max-[700px]:gap-3 max-[700px]:pt-4">
                {cs.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cs.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[11px] text-ink/55"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {cs.liveUrl && (
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 text-[13px] text-accent no-underline hover:underline"
                  >
                    Visit the live site →
                  </a>
                )}
              </div>
            )}
          </Reveal>
        </section>

        {comingSoon ? (
          <section className="mx-auto max-w-[1000px] px-8 pb-24 max-[700px]:px-5 max-[700px]:pb-16">
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-accent/25 p-10 text-center">
              <span className="font-mono text-[28px] text-accent/60">+</span>
              <span className="font-mono text-[13px] tracking-[0.06em] text-ink/45">
                Full write-up coming soon.
              </span>
            </div>
          </section>
        ) : (
          <>
            <div className={`mx-auto max-w-[1000px] px-8 max-[700px]:px-5`}>
              <div className={chromeBar}>
                <span className={chromeDot} />
                <span className={chromeDot} />
                <span className={chromeDot} />
              </div>
            </div>
            <ImageSlot
              alt={`${cs.title} hero screenshot`}
              placeholder="Drop hero screenshot"
              src={cs.heroImage}
              shape="rect"
              className="mx-auto block h-[480px] w-full max-w-[1000px] rounded-b-xl border border-t-0 border-accent/15 max-[700px]:h-[220px]"
            />

            {/* SECTIONS */}
            <section className="mx-auto max-w-[1000px] px-8 py-18 max-[700px]:px-5 max-[700px]:py-10">
              <div className="flex flex-col">
                {cs.sections.map((s, i) => (
                  <Reveal key={s.heading} y={16}>
                    <div
                      className={`grid grid-cols-[48px_1fr] gap-5 border-t border-accent/12 py-6 max-[700px]:grid-cols-[28px_1fr] max-[700px]:gap-3 max-[700px]:py-4 ${
                        i === cs.sections.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <span className="font-mono text-[13px] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="mb-1.5 text-[17px] font-semibold max-[700px]:text-[15px]">
                          {s.heading}
                        </div>
                        <div className="max-w-[640px] text-sm leading-[1.7] text-ink/62 max-[700px]:text-[12.5px]">
                          {s.body}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </>
        )}

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
