import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="max-w-[480px] text-center">
          <div className="mb-5 font-mono text-[13px] text-accent/60">
            $ cd /this-page
            <span className="[animation:blink_1s_step-end_infinite]">_</span>
          </div>
          <div className="mb-1 text-[clamp(64px,12vw,120px)] leading-none font-bold text-ink/8">
            404
          </div>
          <h1 className="m-0 mb-3.5 text-[clamp(22px,3vw,30px)] font-semibold">
            This route doesn&apos;t exist.
          </h1>
          <p className="m-0 mb-8 text-[15px] leading-relaxed text-ink/55">
            The page you&apos;re looking for was moved, renamed, or never built. Let&apos;s get
            you back on track.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-bg no-underline transition-colors hover:bg-ink"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
