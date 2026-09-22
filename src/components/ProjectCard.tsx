import type { CSSProperties } from "react";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";

export type ProjectCardData = {
  key: string;
  href: string;
  title: string;
  description: string;
  /** Shown with an arrow in its own row above the title. Row is omitted entirely if not set. */
  category?: string;
  tagList: string[];
  year: string;
  imgSrc?: string;
  featured?: boolean;
};

/**
 * The project card used across Work, Collaborations, and the Home page
 * teaser grid — a full-bleed screenshot (with an optional FEATURED badge
 * overlaid on it, not sitting in a separate bar above), then category,
 * title, description, tags and year. Hover state is
 * controlled by the caller (rather than owned here) so a parent
 * grid/carousel can coordinate which card is active — e.g. Work's desktop
 * wall needs to know this for its own layout math, not just for this
 * card's own styling.
 *
 * Title and description both get a fixed footprint (truncate / line-clamp +
 * an explicit height) regardless of how long the actual text is, so one
 * longer title or blurb doesn't make its card taller than its neighbors.
 */
export default function ProjectCard({
  project: p,
  hovered,
  onHoverStart,
  onHoverEnd,
  className = "",
  style,
  priority = false,
}: {
  project: ProjectCardData;
  hovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  className?: string;
  style?: CSSProperties;
  /** Set on whichever card is likely to be the page's LCP element (typically
   * the first card above the fold) so its image skips lazy-loading. */
  priority?: boolean;
}) {
  return (
    <Link
      href={p.href}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={`group relative block overflow-hidden rounded-2xl text-inherit no-underline transition-[transform,background,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${className}`}
      style={{
        // Fill builds downward so the card is grounded at the bottom and
        // dissolves into the page at the top, where the image takes over.
        background: `linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,${
          hovered ? 0.055 : 0.03
        }) 100%)`,
        boxShadow: hovered ? "0 20px 40px -14px rgba(0,0,0,0.55)" : "0 0 0 rgba(0,0,0,0)",
        ...style,
      }}
    >
      {/* A real element rather than the Link's own `border`, because the
          border has to fade: masked bottom-to-top so it reads crisply across
          the bottom edge, tapers up the sides, and is gone by the top — the
          card is defined where it sits and blends out where the image
          begins. A CSS border can't be masked on its own, hence the overlay. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1 rounded-[inherit] transition-[border-color] duration-300"
        style={{
          border: `1px solid rgba(255,255,255,${hovered ? 0.26 : 0.14})`,
          maskImage: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.35) 45%, transparent 80%)",
          WebkitMaskImage:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.35) 45%, transparent 80%)",
        }}
      />
      {/* Full-bleed: the image runs edge to edge and is clipped by the
          Link's own rounding, so it needs no radius of its own. */}
      <div className="relative overflow-hidden">
        <ImageSlot
          alt={p.title}
          placeholder="Drop project image"
          src={p.imgSrc}
          objectFit="contain"
          sizes="(max-width: 700px) 80vw, 320px"
          shape="rect"
          priority={priority}
          className="h-52 w-full max-[700px]:h-40"
        />
        {p.featured && (
          <span className="absolute top-3.5 left-3.5 rounded-full border border-accent/30 bg-[rgba(11,8,16,0.7)] px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-accent backdrop-blur-sm max-[700px]:px-2 max-[700px]:text-[9px]">
            FEATURED
          </span>
        )}
      </div>
      <div className="p-5 max-[700px]:p-4">
        {p.category && (
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-accent max-[700px]:mb-1.5 max-[700px]:text-[10px]">
            <span>{p.category}</span>
            {/* Dim-but-present by default (not opacity:0) so touch devices —
                which never trigger :hover — still get an actionability cue;
                hover just brightens it further on pointer devices. */}
            <span
              className="transition-opacity duration-300"
              style={{ opacity: hovered ? 1 : 0.45 }}
            >
              →
            </span>
          </div>
        )}
        <h3 className="m-0 mb-2 truncate text-[19px] font-semibold max-[700px]:mb-1 max-[700px]:text-[16px]">
          {p.title}
        </h3>
        <p className="m-0 mb-4.5 line-clamp-3 h-15.5 text-[13px] leading-[1.55] text-ink/55 max-[700px]:mb-3.5 max-[700px]:line-clamp-3 max-[700px]:h-14 max-[700px]:text-[12.5px] max-[700px]:leading-[1.5]">
          {p.description}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5 max-[700px]:mb-2">
          {p.tagList.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink/15 px-2 py-0.75 font-mono text-[10px] text-ink/55 max-[700px]:px-1.5 max-[700px]:text-[9px]"
            >
              {tag}
            </span>
          ))}
          {/* text-ink/35 measures ~2.9:1 against this card's background —
              under the 4.5:1 AA floor for small text. /50 clears it (~4.8:1). */}
          <span className="ml-auto self-center font-mono text-[10px] text-ink/50 max-[700px]:text-[9px]">
            {p.year}
          </span>
        </div>
        <div
          className="h-px bg-accent transition-[width] duration-400 ease-in-out"
          style={{ width: hovered ? "48px" : "0px" }}
        />
      </div>
    </Link>
  );
}
