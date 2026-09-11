"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./lab-detail.module.css";
import { NODE_SETS, type NodeData } from "./nodeSets";

type Breakpoint = "desktop" | "tablet" | "mobile";

const NODE_SET_SIZES = [3, 4, 6] as const;

function NodeCard({
  node,
  indent,
  cardWidth,
  setRef,
}: {
  node: NodeData;
  indent: string;
  cardWidth: string;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={setRef}
      className="relative shrink-0 rounded-[10px] border border-accent/20 bg-white/3 p-3.5 backdrop-blur-md"
      style={{ marginLeft: indent, width: cardWidth }}
    >
      <div className="mb-2 font-mono text-[9px] tracking-[0.1em] text-accent">{node.kind}</div>

      {node.type === "text" && (
        <div className="font-mono text-[11px] leading-[1.5] text-ink/70">{node.body}</div>
      )}

      {node.type === "toggles" && (
        <div className="flex flex-col gap-2">
          {node.items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="relative h-[11px] w-5 shrink-0 rounded-full"
                style={{ background: item.on ? "#C9F31D" : "rgba(242,239,233,0.15)" }}
              >
                <span
                  className="absolute top-[1.5px] h-2 w-2 rounded-full"
                  style={{
                    [item.on ? "right" : "left"]: "1.5px",
                    background: item.on ? "#120E17" : "rgba(242,239,233,0.5)",
                  }}
                />
              </span>
              <span
                className="font-mono text-[11px]"
                style={{ color: item.on ? "rgba(242,239,233,0.7)" : "rgba(242,239,233,0.4)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {node.type === "tags" && (
        <div className="flex flex-wrap gap-1.5">
          {node.items.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink/15 px-2 py-[3px] font-mono text-[10px] text-ink/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {node.type === "versions" && (
        <div className="flex gap-3.5">
          {node.items.map((v) => (
            <div key={v.label} className="flex flex-col items-center gap-1.5">
              <span
                className="h-3.5 w-3.5 rounded-full border"
                style={{
                  background: v.final ? "#C9F31D" : "transparent",
                  borderColor: v.final ? "#C9F31D" : "rgba(242,239,233,0.3)",
                }}
              />
              <span
                className="font-mono text-[9px]"
                style={{ color: v.final ? "#C9F31D" : "rgba(242,239,233,0.35)" }}
              >
                {v.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LabDetail() {
  const [descExpanded, setDescExpanded] = useState(false);
  const [bp, setBp] = useState<Breakpoint>("desktop");
  const [activeTab, setActiveTab] = useState<"process" | "live">("process");
  const [nodeSetSize, setNodeSetSize] = useState<3 | 4 | 6>(4);
  const [speed, setSpeed] = useState(5);
  const [glow, setGlow] = useState(5);
  const [radius, setRadius] = useState<"tight" | "wide">("wide");

  const [svgSize, setSvgSize] = useState({ w: 400, h: 300 });
  const [connectorPath, setConnectorPath] = useState("");

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const showProcess = !isMobile || activeTab === "process";
  const showLive = !isMobile || activeTab === "live";

  const measure = useCallback(() => {
    requestAnimationFrame(() => {
      const container = canvasRef.current;
      if (!container) return;
      const rect0 = container.getBoundingClientRect();
      const w = Math.max(1, rect0.width);
      const h = Math.max(1, container.scrollHeight, rect0.height);
      const pts = nodeRefs.current.filter(Boolean).map((el) => {
        const r = el!.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - rect0.left + container.scrollLeft,
          y: r.top + r.height / 2 - rect0.top + container.scrollTop,
        };
      });
      const horizontal = bp === "tablet";
      let d = "";
      if (pts.length > 1) {
        d = `M${pts[0].x},${pts[0].y} `;
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          if (horizontal) {
            d += `C${(p0.x + p1.x) / 2},${p0.y} ${(p0.x + p1.x) / 2},${p1.y} ${p1.x},${p1.y} `;
          } else {
            d += `C${p0.x},${(p0.y + p1.y) / 2} ${p1.x},${(p0.y + p1.y) / 2} ${p1.x},${p1.y} `;
          }
        }
      }
      const totalW = horizontal ? Math.max(w, container.scrollWidth) : w;
      setSvgSize({ w: totalW, h });
      setConnectorPath(d);
    });
  }, [bp]);

  useEffect(() => {
    const updateBp = () => {
      const w = window.innerWidth;
      setBp(w < 700 ? "mobile" : w < 1100 ? "tablet" : "desktop");
    };
    updateBp();
    window.addEventListener("resize", updateBp);
    return () => window.removeEventListener("resize", updateBp);
  }, []);

  useEffect(() => {
    measure();
  }, [measure, nodeSetSize, bp, activeTab]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const nodes = NODE_SETS[nodeSetSize];
  const wide = radius === "wide";
  const orbitDuration = (2.2 - (speed - 1) * 0.16).toFixed(2) + "s";
  const stageSize = wide ? 160 : 100;
  const glowSize = (4 + glow * 1.6).toFixed(0) + "px";
  const glowOpacity = (0.2 + glow * 0.06).toFixed(2);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* HEADER */}
        <section className="mx-auto max-w-[1400px] px-6 pt-8 pb-6 max-[700px]:px-5 max-[700px]:pt-5">
          <Link href="/lab" className="text-[13px] text-ink/50 no-underline hover:text-accent">
            ← Lab
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="m-0 text-[clamp(22px,3.6vw,36px)] font-bold">ORBIT</h1>
            <span className="rounded-full border border-accent/30 px-2.5 py-[3px] font-mono text-[9px] tracking-[0.05em] text-accent">
              Interaction
            </span>
          </div>
          <p className="m-0 mt-2 max-w-[600px] text-sm text-ink/55">
            {descExpanded
              ? "A satellite element that tracks a fixed anchor, built for cursor-follow menus that shouldn't feel laggy — decoupled from scroll, driven entirely by a CSS animation loop instead of a JS tick. "
              : "A satellite element that tracks a fixed anchor, built for cursor-follow menus... "}
            <span
              onClick={() => setDescExpanded((v) => !v)}
              className="cursor-pointer text-accent"
            >
              {descExpanded ? "less" : "more"}
            </span>
          </p>
        </section>

        {/* MOBILE TABS */}
        {isMobile && (
          <div className="mx-auto flex max-w-[1400px] gap-2 px-6 pb-4">
            <span
              onClick={() => setActiveTab("process")}
              className="flex-1 cursor-pointer rounded-lg border border-accent/20 py-2.5 text-center font-mono text-[11px] tracking-[0.05em]"
              style={{
                background: activeTab === "process" ? "#C9F31D" : "transparent",
                color: activeTab === "process" ? "#120E17" : "rgba(242,239,233,0.6)",
              }}
            >
              PROCESS
            </span>
            <span
              onClick={() => setActiveTab("live")}
              className="ml-2 flex-1 cursor-pointer rounded-lg border border-accent/20 py-2.5 text-center font-mono text-[11px] tracking-[0.05em]"
              style={{
                background: activeTab === "live" ? "#C9F31D" : "transparent",
                color: activeTab === "live" ? "#120E17" : "rgba(242,239,233,0.6)",
              }}
            >
              LIVE
            </span>
          </div>
        )}

        {/* WORKSHOP */}
        <section className="mx-auto flex max-w-[1400px] flex-wrap items-stretch gap-5 px-6 pb-24">
          {/* LEFT: PROCESS CANVAS */}
          {showProcess && (
            <div className="flex min-w-[280px] flex-1 basis-[340px] flex-col overflow-hidden rounded-2xl border border-accent/12 bg-band">
              <div className="flex items-center justify-between px-4.5 pt-4 pb-1">
                <span className="font-mono text-[10px] tracking-[0.08em] text-ink/30">
                  PROCESS
                </span>
                <div className="flex gap-1.5">
                  {NODE_SET_SIZES.map((n) => (
                    <span
                      key={n}
                      onClick={() => setNodeSetSize(n)}
                      className="cursor-pointer rounded-full px-2 py-[3px] font-mono text-[9px]"
                      style={{
                        border: `1px solid ${nodeSetSize === n ? "#C9F31D" : "rgba(242,239,233,0.15)"}`,
                        color: nodeSetSize === n ? "#C9F31D" : "rgba(242,239,233,0.4)",
                      }}
                    >
                      {n} nodes
                    </span>
                  ))}
                </div>
              </div>

              <div
                ref={canvasRef}
                className={`relative flex flex-1 gap-5.5 p-5 ${styles.nodeStrip}`}
                style={{
                  flexDirection: isTablet ? "row" : "column",
                  overflowX: isTablet ? "auto" : "visible",
                }}
              >
                <svg
                  className="pointer-events-none absolute top-0 left-0"
                  width={svgSize.w}
                  height={svgSize.h}
                  viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
                >
                  <path d={connectorPath} stroke="rgba(201,243,29,0.35)" strokeWidth="1.2" fill="none" />
                  {[0, 1.3, 2.6].map((begin) => (
                    <circle key={begin} r="3" fill="#C9F31D">
                      <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        begin={`${begin}s`}
                        path={connectorPath}
                      />
                    </circle>
                  ))}
                </svg>

                {nodes.map((node, i) => (
                  <NodeCard
                    key={node.kind}
                    node={node}
                    indent={!isTablet && !isMobile && i % 2 === 1 ? "14%" : "0"}
                    cardWidth={isTablet ? "220px" : isMobile ? "100%" : "78%"}
                    setRef={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* RIGHT: LIVE STAGE */}
          {showLive && (
            <div className="flex min-w-[280px] flex-1 basis-[460px] flex-col overflow-hidden rounded-2xl border border-accent/12 bg-band">
              <div className="relative flex min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(201,243,29,0.05),transparent_65%)] py-8 max-[700px]:min-h-[200px] max-[700px]:py-5">
                <div className="absolute top-4 left-5 flex items-center gap-2.5">
                  <span className="text-[13px] font-bold">ORBIT</span>
                  <span className="rounded-full border border-accent/30 px-2 py-0.5 font-mono text-[9px] tracking-[0.05em] text-accent">
                    Interaction
                  </span>
                </div>

                <div className="relative" style={{ width: stageSize, height: stageSize }}>
                  <div
                    className={`absolute inset-0 ${styles.orbitSpin}`}
                    style={{ animationDuration: orbitDuration }}
                  >
                    <span
                      className="absolute top-0 left-1/2 h-4 w-4 -ml-2 rounded-full bg-accent"
                      style={{ boxShadow: `0 0 ${glowSize} rgba(201,243,29,${glowOpacity})` }}
                    />
                  </div>
                  <span className="absolute top-1/2 left-1/2 h-5 w-5 -m-2.5 rounded-full bg-ink/50" />
                  <div className="absolute inset-0 rounded-full border border-dashed border-ink/15" />
                </div>
              </div>

              {/* CONTROL STRIP */}
              <div className="flex flex-wrap gap-5.5 border-t border-accent/12 px-5 py-4.5">
                <div className="min-w-[140px] basis-full">
                  <div className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.06em] text-ink/45">
                    <span>SPEED</span>
                    <span>{speed}/10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
                <div className="min-w-[140px] basis-full">
                  <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-ink/45">
                    RADIUS
                  </div>
                  <div className="flex overflow-hidden rounded-full border border-accent/20">
                    <span
                      onClick={() => setRadius("tight")}
                      className="flex-1 cursor-pointer py-2 text-center font-mono text-[10px] transition-colors duration-200"
                      style={{
                        background: wide ? "transparent" : "#C9F31D",
                        color: wide ? "rgba(242,239,233,0.5)" : "#120E17",
                      }}
                    >
                      TIGHT
                    </span>
                    <span
                      onClick={() => setRadius("wide")}
                      className="flex-1 cursor-pointer py-2 text-center font-mono text-[10px] transition-colors duration-200"
                      style={{
                        background: wide ? "#C9F31D" : "transparent",
                        color: wide ? "#120E17" : "rgba(242,239,233,0.5)",
                      }}
                    >
                      WIDE
                    </span>
                  </div>
                </div>
                <div className="min-w-[140px] basis-full">
                  <div className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.06em] text-ink/45">
                    <span>GLOW</span>
                    <span>{glow}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={glow}
                    onChange={(e) => setGlow(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}
