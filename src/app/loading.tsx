import Image from "next/image";
import styles from "./loading.module.css";

/**
 * Next.js's automatic route-loading fallback (App Router `loading.tsx`
 * convention) — shown while a segment's RSC payload/JS is being fetched
 * during navigation. Deliberately a server component with no client state:
 * it needs to paint instantly, before the target route's own JS is even
 * available, so real progress can't be known — the bar is honestly
 * indeterminate rather than a fake, timed fill.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <div className="relative min-w-[280px] px-[52px] py-11">
        <span className="absolute top-0 left-0 h-[22px] w-[22px] border-t-2 border-l-2 border-accent" />
        <span className="absolute top-0 right-0 h-[22px] w-[22px] border-t-2 border-r-2 border-accent" />
        <span className="absolute bottom-0 left-0 h-[22px] w-[22px] border-b-2 border-l-2 border-accent" />
        <span className="absolute right-0 bottom-0 h-[22px] w-[22px] border-r-2 border-b-2 border-accent" />

        <div className="mb-7 flex items-baseline gap-0.5">
          <span className="font-script text-[30px] font-bold text-accent">G</span>
          <span className="font-serif-italic text-[15px] font-normal text-ink/85 italic">
            bemi
          </span>
          <Image
            src="/images/sigil-d-lime.png"
            alt="D"
            width={32}
            height={32}
            className="ml-1.5 h-6 w-auto"
            priority
          />
          <span className="font-serif-italic text-[15px] font-normal text-ink/85 italic">
            aniel
          </span>
        </div>

        <div className="mb-[22px] flex items-center gap-3">
          <div className="relative h-6 w-6 shrink-0">
            <div className={`absolute inset-0 ${styles.orbitSpin}`}>
              <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -ml-[3px] rounded-full bg-accent shadow-[0_0_7px_1px_rgba(201,243,29,0.6)]" />
            </div>
            <span className="absolute top-1/2 left-1/2 h-[7px] w-[7px] -m-[3.5px] rounded-full bg-ink/50" />
          </div>
          <span className="font-mono text-xs text-ink/55">
            booting <span className="text-accent">gbemidaniel.dev</span>
            <span className="[animation:blink_1s_step-end_infinite]">_</span>
          </span>
        </div>

        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div className={`h-full w-2/5 rounded-full bg-accent ${styles.barSweep}`} />
        </div>
      </div>
    </div>
  );
}
