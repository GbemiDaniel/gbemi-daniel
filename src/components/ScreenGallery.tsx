"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";
import Image from "next/image";
import type { Gallery, Screen } from "@/lib/caseStudies";

type Device = "desktop" | "mobile";

const ease = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";

function MonitorIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Screens stacked on top of each other, crossfading to the active one. */
function ScreenStack({
  screens,
  page,
  title,
  device,
  sizes,
  priority,
}: {
  screens: Screen[];
  page: number;
  title: string;
  device: Device;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      {screens.map((screen, i) => (
        <div
          key={`${i}-${screen.src}`}
          aria-hidden={i !== page}
          className={`absolute inset-0 transition-opacity duration-500 ${ease} ${
            i === page ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={screen.src}
            alt={`${title} — ${screen.label} page, ${device} view`}
            fill
            sizes={sizes}
            priority={priority && i === 0}
            className="object-contain"
          />
        </div>
      ))}
    </>
  );
}

export default function ScreenGallery({
  title,
  gallery,
  priority = false,
}: {
  title: string;
  gallery: Gallery;
  /** Eager-load the first desktop screen — only for a gallery above the fold. */
  priority?: boolean;
}) {
  const mobileScreens = gallery.mobile ?? [];
  const hasMobile = mobileScreens.length > 0;

  const [device, setDevice] = useState<Device>("desktop");
  const [page, setPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const screens = device === "mobile" && hasMobile ? mobileScreens : gallery.desktop;
  const count = screens.length;
  const current = Math.min(page, count - 1);

  const switchDevice = (next: Device) => {
    setDevice(next);
    // Keep the same page if the other device has it, otherwise start over.
    const nextCount = (next === "mobile" ? mobileScreens : gallery.desktop).length;
    setPage((p) => (p < nextCount ? p : 0));
  };

  const go = (delta: number) => setPage((current + delta + count) % count);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (count < 2) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  const toggleBtn = (value: Device, label: string, icon: ReactNode) => {
    const on = device === value;
    return (
      <button
        type="button"
        onClick={() => switchDevice(value)}
        aria-pressed={on}
        className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] uppercase outline-none transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-accent ${
          on ? "bg-accent/12 text-accent" : "text-ink/45 hover:text-ink/80"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screens`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-accent/40"
    >
      {/* Chrome bar doubles as the control strip: dots left, device toggle right. */}
      <div className="flex items-center gap-1.5 rounded-t-xl border border-b-0 border-accent/15 bg-band px-3.5 py-2">
        <span className={chromeDot} />
        <span className={chromeDot} />
        <span className={chromeDot} />
        {hasMobile && (
          <div
            role="group"
            aria-label="Preview device"
            className="ml-auto flex items-center gap-0.5 rounded-full border border-ink/10 p-0.5"
          >
            {toggleBtn("desktop", "Desktop", <MonitorIcon />)}
            {toggleBtn("mobile", "Mobile", <PhoneIcon />)}
          </div>
        )}
      </div>

      {/* Stage. On a phone-width viewport the desktop view stays short (the
          screenshots are wide) while the mobile view gets the height it
          needs, so the frame resizes between the two. */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative h-[480px] overflow-hidden border border-accent/15 bg-band transition-[height] duration-500 ${ease} ${
          count > 1 ? "border-b-0" : "rounded-b-xl"
        } ${device === "mobile" ? "max-[700px]:h-[440px]" : "max-[700px]:h-[220px]"}`}
      >
        {/* Desktop layer */}
        <div
          inert={device !== "desktop"}
          className={`absolute inset-0 transition-opacity duration-500 ${ease} ${
            device === "desktop" ? "opacity-100" : "opacity-0"
          }`}
        >
          <ScreenStack
            screens={gallery.desktop}
            page={device === "desktop" ? current : Math.min(page, gallery.desktop.length - 1)}
            title={title}
            device="desktop"
            sizes="(max-width: 1000px) 100vw, 1000px"
            priority={priority}
          />
        </div>

        {/* Mobile layer: the phone screenshot inside a device bezel. */}
        {hasMobile && (
          <div
            inert={device !== "mobile"}
            className={`absolute inset-0 flex items-center justify-center py-6 transition-[opacity,transform] duration-500 max-[700px]:py-5 ${ease} ${
              device === "mobile" ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
            }`}
          >
            <div className="aspect-[9/20] h-full rounded-[26px] border border-ink/15 bg-black p-[5px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
              <div className="relative h-full w-full overflow-hidden rounded-[21px] bg-band">
                <ScreenStack
                  screens={mobileScreens}
                  page={device === "mobile" ? current : Math.min(page, mobileScreens.length - 1)}
                  title={title}
                  device="mobile"
                  sizes="220px"
                />
              </div>
            </div>
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous page"
              className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-bg/70 text-ink/80 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              <Arrow dir="prev" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next page"
              className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-bg/70 text-ink/80 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              <Arrow dir="next" />
            </button>
          </>
        )}
      </div>

      {/* Page switcher — only once a device has more than one screen. */}
      {count > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-b-xl border border-accent/15 bg-band px-3 py-2.5 [scrollbar-width:none]">
          {screens.map((screen, i) => (
            <button
              key={`${i}-${screen.src}`}
              type="button"
              onClick={() => setPage(i)}
              aria-current={i === current ? "true" : undefined}
              className={`shrink-0 cursor-pointer rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-200 ${
                i === current
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-ink/10 text-ink/45 hover:text-ink/80"
              }`}
            >
              {screen.label}
            </button>
          ))}
          <span className="ml-auto shrink-0 pl-2 font-mono text-[10px] text-ink/35 tabular-nums">
            {String(current + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
