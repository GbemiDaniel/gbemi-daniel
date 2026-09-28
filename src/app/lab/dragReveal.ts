// Drag-to-reveal: a cover panel that springs open/closed with real overshoot.
// Usage: const cleanup = attachDragReveal(frame, cover, content, options?);
//   frame   - position: relative; overflow: clip (not hidden: a hidden box can
//             still be scrolled by focus/scrollIntoView); user-select: none
//   content - the revealed layer, absolutely positioned on the left
//   cover   - absolutely positioned over the frame; touch-action: pan-y;
//             add role="switch" + tabIndex=0 for keyboard/screen-reader use
//   options - optional; read live on every frame, so mutating the same object
//             retunes a running instance without re-attaching

export const OPEN_RATIO = 0.74; // open rest position, as a fraction of frame width
export const THRESHOLD_RATIO = 0.3; // commit distance from the committed rest position
export const MASS = 1;
export const STIFFNESS = 260; // ω₀ = √(k/m) ≈ 16.1 rad/s → ~0.44s oscillation period
export const DAMPING = 14; // ζ = c / 2√(km) ≈ 0.43 → ~22% overshoot on a still release
const PROJECTION_S = 0.12; // a flick commits where it would be 120ms later
const MAX_SPEED_RATIO = 4; // release speed cap, in frame widths per second
const RUBBER = 0.55; // resistance past either end of the track (iOS constant)
const RUBBER_DIM_RATIO = 0.5; // stretch past an end approaches, never reaches, W/2
export const STEP = 1 / 240; // fixed physics substep, independent of refresh rate

export type DragRevealPhase = "drag" | "spring" | "rest";

export type DragRevealOptions = {
  stiffness?: number;
  damping?: number;
  thresholdRatio?: number;
  // Called after every write to the cover. Instrumentation only.
  onFrame?: (x: number, openX: number, phase: DragRevealPhase, open: boolean) => void;
};

function rubberBand(over: number, dim: number) {
  return (1 - 1 / ((over * RUBBER) / dim + 1)) * dim;
}

function unRubberBand(shown: number, dim: number) {
  const y = Math.min(shown, dim * 0.99);
  return ((dim / RUBBER) * y) / (dim - y);
}

export function attachDragReveal(
  frame: HTMLElement,
  cover: HTMLElement,
  content: HTMLElement,
  options: DragRevealOptions = {},
) {
  let width = frame.offsetWidth;
  let x = 0; // displayed cover offset, px
  let v = 0; // cover velocity, px/s
  let open = false; // committed state — the spring's target
  let raf = 0;
  let lastTime = 0;
  let acc = 0;
  let pointerId: number | null = null;
  let startClientX = 0;
  let startRaw = 0;
  let moved = false;
  let suppressClick = false;
  let reduce = false;
  let samples: { t: number; x: number }[] = [];

  const openX = () => width * OPEN_RATIO;
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const render = (phase: DragRevealPhase) => {
    cover.style.transform = "translate3d(" + x + "px,0,0)";
    const p = x / openX(); // 0 closed, 1 open, >1 or <0 while overshooting
    content.style.opacity = String(0.2 + 0.8 * Math.min(1, Math.max(0, p)));
    content.style.transform = "translate3d(" + (p - 1) * 16 + "px,0,0)";
    options.onFrame?.(x, openX(), phase, open);
  };

  const commit = (nextOpen: boolean) => {
    open = nextOpen;
    cover.dataset.open = String(open);
    if (cover.getAttribute("role") === "switch") cover.setAttribute("aria-checked", String(open));
  };

  const settle = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    x = open ? openX() : 0;
    v = 0;
    render("rest");
  };

  const tick = (now: number) => {
    const target = open ? openX() : 0;
    const k = options.stiffness ?? STIFFNESS;
    const c = options.damping ?? DAMPING;
    acc += Math.max(0, Math.min((now - lastTime) / 1000, 1 / 30));
    lastTime = now;
    while (acc >= STEP) {
      const force = -k * (x - target) - c * v;
      v += (force / MASS) * STEP; // semi-implicit Euler: velocity first,
      x += v * STEP; // then position from the new velocity
      acc -= STEP;
    }
    if (Math.abs(x - target) < 0.05 && Math.abs(v) < 2) return settle();
    render("spring");
    raf = requestAnimationFrame(tick);
  };

  const animateTo = (nextOpen: boolean, velocity: number) => {
    commit(nextOpen);
    if (prefersReduced()) return settle();
    const cap = MAX_SPEED_RATIO * width;
    v = Math.max(-cap, Math.min(cap, velocity));
    cancelAnimationFrame(raf);
    acc = 0;
    lastTime = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const follow = (raw: number) => {
    const max = openX();
    if (reduce) return Math.max(0, Math.min(max, raw));
    if (raw < 0) return -rubberBand(-raw, width * RUBBER_DIM_RATIO);
    if (raw > max) return max + rubberBand(raw - max, width * RUBBER_DIM_RATIO);
    return raw;
  };

  const unfollow = (shown: number) => {
    const max = openX();
    if (shown < 0) return -unRubberBand(-shown, width * RUBBER_DIM_RATIO);
    if (shown > max) return max + unRubberBand(shown - max, width * RUBBER_DIM_RATIO);
    return shown;
  };

  const onDown = (e: PointerEvent) => {
    if (pointerId !== null || (e.pointerType === "mouse" && e.button !== 0)) return;
    pointerId = e.pointerId;
    cover.setPointerCapture(e.pointerId);
    cancelAnimationFrame(raf); // caught mid-flight: the finger takes over
    raf = 0;
    width = frame.offsetWidth;
    reduce = prefersReduced();
    startClientX = e.clientX;
    startRaw = unfollow(x);
    moved = false;
    suppressClick = false;
    samples = [{ t: e.timeStamp, x: e.clientX }];
    render("drag"); // the drag phase starts at the grab, not at the first move
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startClientX;
    if (Math.abs(dx) > 3) moved = true;
    x = follow(startRaw + dx);
    render("drag");
    samples.push({ t: e.timeStamp, x: e.clientX });
    if (samples.length > 20) samples.shift();
  };

  const release = (e: PointerEvent, cancelled: boolean) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    suppressClick = moved;
    if (cancelled) return animateTo(open, 0);
    // Velocity from the last 100ms only: a finger that stopped before
    // lifting should release with zero velocity, not its earlier speed.
    const recent = samples.filter((s) => e.timeStamp - s.t <= 100);
    let velocity = 0;
    if (recent.length > 1) {
      const a = recent[0];
      const b = recent[recent.length - 1];
      if (b.t > a.t) velocity = ((b.x - a.x) / (b.t - a.t)) * 1000;
    }
    const projected = x + velocity * PROJECTION_S;
    const threshold = width * (options.thresholdRatio ?? THRESHOLD_RATIO);
    animateTo(open ? projected > openX() - threshold : projected >= threshold, velocity);
  };

  const onUp = (e: PointerEvent) => release(e, false);
  const onCancel = (e: PointerEvent) => release(e, true);

  const onClick = (e: MouseEvent) => {
    if (!suppressClick) return;
    suppressClick = false;
    e.stopPropagation(); // a drag is not a click on whatever contains this
    e.preventDefault();
  };

  const onKey = (e: KeyboardEvent) => {
    let next: boolean | null = null;
    if (e.key === "Enter" || e.key === " ") next = !open;
    else if (e.key === "ArrowRight") next = true;
    else if (e.key === "ArrowLeft") next = false;
    if (next === null || pointerId !== null) return;
    e.preventDefault();
    e.stopPropagation();
    width = frame.offsetWidth;
    if (next !== open) animateTo(next, 0);
  };

  const ro = new ResizeObserver(() => {
    width = frame.offsetWidth;
    if (pointerId === null && raf === 0) settle();
  });

  cover.addEventListener("pointerdown", onDown);
  cover.addEventListener("pointermove", onMove);
  cover.addEventListener("pointerup", onUp);
  cover.addEventListener("pointercancel", onCancel);
  cover.addEventListener("lostpointercapture", onCancel);
  cover.addEventListener("click", onClick);
  cover.addEventListener("keydown", onKey);
  ro.observe(frame);
  commit(false);
  settle();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    cover.removeEventListener("pointerdown", onDown);
    cover.removeEventListener("pointermove", onMove);
    cover.removeEventListener("pointerup", onUp);
    cover.removeEventListener("pointercancel", onCancel);
    cover.removeEventListener("lostpointercapture", onCancel);
    cover.removeEventListener("click", onClick);
    cover.removeEventListener("keydown", onKey);
  };
}
