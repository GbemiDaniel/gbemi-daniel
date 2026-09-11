"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CameraFrame.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CORNERS = [
  { pos: "top-[-10px] left-[-10px]", border: "border-t-2 border-l-2", from: { x: -16, y: -16 } },
  { pos: "top-[-10px] right-[-10px]", border: "border-t-2 border-r-2", from: { x: 16, y: -16 } },
  { pos: "bottom-[-10px] left-[-10px]", border: "border-b-2 border-l-2", from: { x: -16, y: 16 } },
  { pos: "bottom-[-10px] right-[-10px]", border: "border-b-2 border-r-2", from: { x: 16, y: 16 } },
];

/**
 * A viewfinder-style frame: four corner brackets snap inward like a camera
 * focusing when scrolled into view, and the content behind them holds a
 * slow, continuous Ken Burns zoom.
 */
export default function CameraFrame({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      cornerRefs.current.forEach((corner, i) => {
        if (!corner) return;
        gsap.fromTo(
          corner,
          { opacity: 0, x: CORNERS[i].from.x, y: CORNERS[i].from.y },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            delay: 0.1 + i * 0.06,
            ease: "back.out(1.8)",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`} style={style}>
      {CORNERS.map((c, i) => (
        <span
          key={c.pos}
          ref={(el) => {
            cornerRefs.current[i] = el;
          }}
          className={`absolute z-[2] h-[22px] w-[22px] ${c.pos} ${c.border} border-accent`}
        />
      ))}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className={`absolute inset-0 ${styles.zoomLayer}`}>{children}</div>
      </div>
    </div>
  );
}
