import { useEffect, useRef } from "react";
import styles from "./lab.module.css";

type Size = "sm" | "lg";

export function OrbitPreview({ size }: { size: Size }) {
  const box = size === "sm" ? 70 : 130;
  const dot = size === "sm" ? 8 : 14;
  const center = size === "sm" ? 10 : 18;
  return (
    <div className="relative" style={{ width: box, height: box }}>
      <div className={`absolute inset-0 ${styles.orbitSpin}`}>
        <span
          className="absolute top-0 left-1/2 rounded-full bg-accent"
          style={{
            width: dot,
            height: dot,
            marginLeft: -dot / 2,
            boxShadow: `0 0 ${size === "sm" ? "10px 2px" : "18px 4px"} rgba(201,243,29,0.5)`,
          }}
        />
      </div>
      <span
        className="absolute top-1/2 left-1/2 rounded-full bg-ink/50"
        style={{ width: center, height: center, margin: `${-center / 2}px 0 0 ${-center / 2}px` }}
      />
      <div className="absolute inset-0 rounded-full border border-dashed border-ink/12" />
    </div>
  );
}

export function RipplePreview({ size }: { size: Size }) {
  const ring = size === "sm" ? 60 : 110;
  const center = size === "sm" ? 10 : 16;
  return (
    <>
      {[0, 0.8, 1.6].map((delay) => (
        <span
          key={delay}
          className={`absolute rounded-full border border-accent ${styles.pingRing}`}
          style={{ width: ring, height: ring, animationDelay: `${delay}s` }}
        />
      ))}
      <span
        className="relative rounded-full bg-accent"
        style={{ width: center, height: center }}
      />
    </>
  );
}

export function FieldPreview({ size }: { size: Size }) {
  const sm = [0, 0.1, 0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0.4, 0.5, 0.2, 0.3, 0.4, 0.5, 0.6];
  const lg = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const delays = size === "sm" ? sm : lg;
  const cols = size === "sm" ? 5 : 7;
  const dot = size === "sm" ? 6 : 9;
  const gap = size === "sm" ? 10 : 16;
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          className={`rounded-full bg-accent ${styles.waveDot}`}
          style={{ width: dot, height: dot, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

export function SparklinePreview({ size }: { size: Size }) {
  const w = size === "sm" ? 140 : 320;
  const h = size === "sm" ? 70 : 160;
  return (
    <svg width={w} height={h} viewBox="0 0 140 70" fill="none">
      <path
        d="M4 50 L24 30 L44 42 L64 14 L84 34 L104 20 L136 44"
        stroke="#C9F31D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="240"
        className={styles.dashDraw}
      />
      <circle cx="136" cy="44" r="3" fill="#C9F31D" />
    </svg>
  );
}

export function MagnetPreview({ size }: { size: Size }) {
  const small = size === "sm" ? 14 : 22;
  const big = size === "sm" ? 20 : 32;
  const gap = size === "sm" ? 14 : 24;
  return (
    <div className="flex items-center" style={{ gap }}>
      <span
        className={`rounded bg-ink/50 ${styles.magnetBob}`}
        style={{ width: small, height: small, borderRadius: size === "sm" ? 4 : 6 }}
      />
      <span
        className={`rounded bg-accent ${styles.magnetBob}`}
        style={{ width: big, height: big, borderRadius: size === "sm" ? 6 : 8, animationDelay: "0.2s" }}
      />
      <span
        className={`rounded bg-ink/50 ${styles.magnetBob}`}
        style={{ width: small, height: small, borderRadius: size === "sm" ? 4 : 6, animationDelay: "0.4s" }}
      />
    </div>
  );
}

export function NoisePreview({ size }: { size: Size }) {
  if (size === "sm") {
    return (
      <div
        className={`h-full w-full ${styles.noiseShift}`}
        style={{
          backgroundImage:
            "radial-gradient(rgba(201,243,29,0.35) 1px, transparent 1.5px)",
          backgroundSize: "14px 14px",
        }}
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 ${styles.noiseShift}`}
      style={{
        backgroundImage: "radial-gradient(rgba(201,243,29,0.35) 1.5px, transparent 2px)",
        backgroundSize: "20px 20px",
      }}
    />
  );
}

const REST_SHADOW = "0 0 6px 2px rgba(201,243,29,0.25)";

export function ProximityPreview({ size }: { size: Size }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const dot = size === "sm" ? 14 : 22;

  useEffect(() => {
    const container = containerRef.current;
    const dotEl = dotRef.current;
    if (!container || !dotEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dist = Math.hypot(x - cx, y - cy);
      const maxDist = Math.hypot(cx, cy) || 1;
      const proximity = Math.max(0, 1 - dist / maxDist);
      const scale = 1 + proximity * 0.7;
      const glow = 6 + proximity * 30;
      const opacity = 0.25 + proximity * 0.65;
      dotEl.style.transform = `scale(${scale})`;
      dotEl.style.boxShadow = `0 0 ${glow}px ${glow / 3}px rgba(201,243,29,${opacity})`;
    };
    const onLeave = () => {
      dotEl.style.transform = "scale(1)";
      dotEl.style.boxShadow = REST_SHADOW;
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center">
      <div
        ref={dotRef}
        className="rounded-full bg-accent transition-transform duration-150 ease-out"
        style={{ width: dot, height: dot, boxShadow: REST_SHADOW }}
      />
    </div>
  );
}
