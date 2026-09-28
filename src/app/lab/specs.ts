// Copyable artifacts for Lab entries, shared by the Lab modal and each
// entry's /lab-detail breakdown. The *_CODE strings are generated verbatim
// from the real source files: run `npm run lab:snippets` after editing
// dragReveal.ts, rail.tsx, rail.module.css, topbar.tsx or topbar.module.css
// (`npm run lab:snippets -- --check` fails if they have drifted).

export const RAIL_DEV_PROMPT = `Build a desktop sidebar nav that rests as a slim rail and floats open over the
page on hover or keyboard focus. All feedback is typographic: each label rolls,
letter by letter, from monospace caps into a serif italic.

STRUCTURE AND LAYOUT
- A fixed <nav> (top/bottom/left 16px). A separate, empty 108px-wide spacer in the
  page's flex row reserves the rail's footprint. The open panel floats over content
  and never pushes it, so opening causes no page reflow.
- Panel: width 68px as a rail, 232px when open. Radius 22px,
  background rgba(11,8,16,0.78), backdrop-filter blur(18px) saturate(1.2), 1px
  accent border at 12% alpha (16% when open), inset top highlight, and a deeper drop
  shadow when open.
- The panel's content is ALWAYS laid out at the open width (232px). The panel just
  clips it with overflow: hidden plus contain: layout paint style. The only thing
  that changes per frame is the width of one isolated box: no text reflows or
  re-wraps mid-animation, and the rail/open states are the same layout.
- Width transition: 520ms to open, 320ms to close (closing should feel quicker than
  opening), easing cubic-bezier(0.16, 1, 0.3, 1) everywhere.

ROWS
- Each row is [numeral][tick][label], 7px vertical padding. The numeral (01-04) is
  24px wide, centered, Space Mono 10px, tabular-nums, at 30% ink, so in the 68px
  rail only the numerals show.
- Tick: a 9px x 1px line drawn from the numeral with transform scaleX(0 -> 1), origin
  left, 420ms. Shown on hover, on focus-visible and on the current page. It's the only
  accent-colored mark (on the current page).
- Siblings recede: .list:has(.link:hover) .link:not(:hover) drops to 28% ink, so
  pointing at one row focuses it through type alone. There's no background highlight.
- A section with subpages is ONE disclosure button across the whole row (its landing
  page is the first child, "Overview"). There is no split between a link and a
  chevron target. The subtree opens with grid-template-rows 0fr -> 1fr (500ms).
  It's inert while hidden, and never shows while the panel is a rail. Sub rows hang
  off a 1px tree line; their 14px tick is the branch.

THE LETTER ROLL
- Each label is a 24px-tall mask (overflow: clip, padding-right 0.3em so the
  italic's overhang isn't shaved) holding two stacked lines, each split into
  per-letter inline-blocks with line-height 24px and a --i index:
    mono:  Space Mono caps, 12px, letter-spacing 0.12em (visible at rest)
    serif: Instrument Serif italic title case, 18px (waiting at translateY(105%))
  105%, not 100%, so no antialiased edge peeks through the mask.
- Hover, focus-visible and current page: mono letters go to translateY(-105%) and serif
  letters to 0. Each letter's transition is 520ms with delay --i * 16ms, so the
  word rolls left to right.
- Both lines are aria-hidden. An sr-only copy carries the accessible name.

OPEN/CLOSE CHOREOGRAPHY
- Rail: every letter sinks below its mask (translateY(105%), 220ms, no delay).
- Open has two phases, set as data-phase on the panel:
  "opening" (the first 900ms after expanding): letters rise row by row, 640ms each,
    delay 110ms + row * 50ms + i * 18ms. It reads as a cascade down the list.
  "open" (after 900ms): the normal 16ms-per-letter hover delays apply again, so hover
    stays responsive and isn't slowed by the entrance stagger.
- Open-only content fades in 260ms after opening starts. Rail-only content (a
  vertical serif "Work · Lab" current-section label, writing-mode vertical-rl)
  swaps with it. Hidden content uses visibility: hidden after its 160ms fade, so it
  can't be focused.
- The wordmark collapses to its monogram. Fade the letters with filter: opacity(0)
  plus translateX(-6px), not opacity, because a GSAP intro already owns the inline
  opacity of the same elements.

WHEN IS IT OPEN?
- expanded = hover || focus || pinned || touchOpen || peek. Each reason is its
  own boolean, so they come and go without fighting each other.
- Hover (mouse and pen only): open 70ms after pointerenter, as intent, so a cursor
  sweeping past the edge doesn't pop it. Close 280ms after pointerleave, as grace,
  so brushing off the edge doesn't snap it shut. Each timer cancels the other.
- Focus: open on focus only if the target matches :focus-visible (keyboard, not a
  mouse click). Close on blur only when relatedTarget is outside the nav.
- Toggle button (a chevron at the bottom that rotates 180deg when open): pins open,
  or collapses everything. Escape collapses and blurs.
- After an explicit collapse, set suppressHover until the pointer leaves. Otherwise
  the pointer resting on the panel re-opens it immediately.
- Touch (a tablet at 700px or wider): the first tap on the rail opens it instead of
  following whichever numeral was under the finger (preventDefault in a
  click-capture handler), and a pointerdown outside closes it.
- First visit: pop open after 700ms and tuck back at 2.6s, once per page load and
  only with hover-capable pointers and motion allowed. Mark it as done when it
  actually fires, so a cancelled Strict-Mode effect doesn't use it up.

STATE THAT OUTLIVES NAVIGATION
- Every page mounts its own <Nav/>, so keep the pin and the open subtrees in
  module-level variables, not only in component state. They survive client-side
  navigation but not a reload, so the first render always matches the collapsed
  server HTML (no hydration mismatch).

ACCESSIBILITY AND MOTION
- nav aria-label "Primary", aria-current="page" on the current link, aria-expanded
  plus aria-controls on disclosures and the toggle, and inert on hidden subtrees.
- prefers-reduced-motion: force every transition-duration and delay inside the
  panel to 0ms. All states still work; they just change instantly.

DESKTOP ONLY
- Show the rail at 700px and wider. Below that, a separate top bar and dropdown
  menu takes over. Switch between them with CSS alone, not JS, so there's no flash of
  the wrong nav before hydration.`;

export const TOPBAR_DEV_PROMPT = `Build a desktop top nav: a floating bar that stays fixed through the whole scroll
and turns from flat into a frosted capsule once content passes under it. All
feedback is typographic: labels roll letter by letter inside a mask, with no hover
pills or colour fills.

STRUCTURE AND LAYOUT
- A fixed <nav> at top 16px with 16px side insets. Inside it, a surface capped at
  1168px wide, 60px tall, radius 20px, 16px horizontal padding. 1168 = a 1200px
  content column minus its 32px side padding, so the brand and the last item sit
  exactly on the page's text edges; at narrower widths, 16px inset + 16px padding
  lands on the same 32px.
- Order: wordmark on the left, then (margin-left auto) the links, a 1px divider,
  social icons and a Resume link on the right. Below 1100px the divider and socials
  drop out (they are in the footer too) so nothing collides on small laptops.
- Give the page content an 84px top clearance (16 inset + 60 bar + 8 air), and set
  html { scroll-padding-top: 84px } so anchors and the skip link land below the bar.
  Put the padding on the main content, not <body>, so each page's own background
  still runs up behind the bar.

FLAT, THEN FROSTED
- At scrollY <= 8 the surface is transparent with a transparent border.
- Past 8px, it becomes the capsule: background rgba(11,8,16,0.74),
  backdrop-filter blur(18px) saturate(1.2), a 1px accent border at 12% alpha, an
  inset top highlight and a soft drop shadow. Transition background, border and
  shadow over 420ms. Read scrollY in a passive scroll listener, batched to one
  requestAnimationFrame.
- The bar never hides on scroll.

THE LETTER ROLL
- Each label is a 24px-tall mask (overflow: clip) holding two stacked copies, each
  split into per-letter inline-blocks with line-height 24px and a --i index.
  front: Space Mono caps, 12px, letter-spacing 0.12em, visible at rest.
  back:  positioned absolutely over the front, centred, waiting at translateY(105%).
  105%, not 100%, so no antialiased edge peeks through the mask.
- Hover and focus-visible: front letters go to translateY(-105%) and back letters to
  0, each 520ms with delay --i * 16ms, so the word rolls left to right.
- For most links the back copy is the SAME mono caps, so the roll never changes the
  font or the width. Only Writing rolls into Instrument Serif italic (18px), the
  face of the writing pages, and it rests in the serif on those pages. There, make
  the serif line the in-flow one and the mono line absolute, so the box sizes to the
  narrower serif word and the gaps either side stay even.
- Both copies are aria-hidden. An sr-only copy carries the accessible name.
- Current page: full-ink colour, no marker. Siblings recede:
  .list:has(.link:hover) .link:not(:hover) drops to 28% ink.

SPACING
- 20px between items. Measure the gaps from rendered glyphs, not boxes: the
  chevron after WORK needs margin-left -2px, because its icon has 3px of inner
  padding and the last letter carries its own tracking; otherwise it floats about
  8px from the K and reads as a separate item.

THE WORK DROPDOWN
- WORK is ONE disclosure button (its landing page is the first item, "Overview"),
  aria-expanded plus aria-controls, with a chevron that rotates 180deg when open.
- The menu is a small frosted panel 14px below the trigger: radius 16px, a 1px
  accent border at 14%. It opens with opacity and translateY(-6px -> 0), and
  visibility flips so it can't be focused while closed. A 16px ::before bridges the
  gap, so the pointer can cross it without the menu closing.
- Items hang off a 1px tree line. Each has a 14px branch tick (scaleX 0 -> 1 on
  hover, accent on the current page) and uses the mono roll at 11px.
- Opening cascade: for 700ms after opening, item letters rise with delay
  60ms + row * 45ms + i * 14ms, 560ms each. After that the normal hover delays
  apply again, so hover never feels slowed by the entrance.
- Hover intent: open 90ms after pointerenter; close 240ms after pointerleave; each
  timer cancels the other. Click toggles. Esc closes and returns focus to the
  trigger. Pointerdown outside closes. Blur leaving the wrapper closes. The menu
  is inert while closed.

ACCESSIBILITY AND MOTION
- nav aria-label "Primary", aria-current="page" on the current link, inert on the
  closed menu.
- prefers-reduced-motion: force every transition-duration and delay inside the bar
  to 0ms. All states still work; they just change instantly.

DESKTOP ONLY
- Show it at 700px and wider; below that a separate mobile bar and menu take over.
  Switch between them with CSS alone, not JS, so the wrong nav never flashes before
  hydration.`;

export const DRAG_REVEAL_DEV_PROMPT = `Build a "drag to reveal" control: a cover panel the user drags horizontally to
uncover content underneath, which settles open or closed on a real damped spring
that overshoots its target before resting. The overshoot is the whole point.

STRUCTURE
- A frame (position: relative; overflow: clip) of width W. Use clip, not hidden: an
  overflow: hidden box is still scrollable by the browser, so focusing the open
  cover (Tab) or scrollIntoView would scroll the frame sideways and the cover
  would look closed while it's open. Measure W with
  frame.offsetWidth at every pointerdown and in a ResizeObserver. Never hard-code it.
- Underneath: the revealed content, absolutely positioned on the left, width 0.74W.
- On top: the cover, absolutely positioned and filling the frame, moved only with
  transform: translate3d(x px, 0, 0). A grip and a "DRAG" label sit on its left edge,
  so they stay visible on the sliver of cover that remains when it is open.
- Cover CSS: touch-action: pan-y (vertical page scroll still works on touch, and
  horizontal movement belongs to us); will-change: transform; user-select: none
  on the frame; cursor: grab, and grabbing while active.

STATES AND GEOMETRY
- x is the cover's offset in px. CLOSED rests at x = 0. OPEN rests at
  x = openX = 0.74W, which leaves 0.26W of the cover showing so it can be dragged back.
- A single boolean, "open", holds the COMMITTED state. It is the spring's target at
  all times, including mid-animation. It changes only on release (or on a key press).
- There are three runtime phases: IDLE (at rest, no rAF running), DRAGGING (the
  pointer owns x), and SPRINGING (a rAF loop moves x toward the committed target).

POINTER HANDLING (Pointer Events only, with no separate mouse or touch handlers)
- pointerdown on the cover: ignore it if a pointer is already active (a second
  finger) or if it is a non-primary mouse button. Record pointerId and call
  cover.setPointerCapture(pointerId). All later move, up and cancel events for that
  pointer then arrive at the cover even when the pointer is outside the frame, the
  modal or the window, so a release outside the element works with no document
  listeners. Cancel any running rAF: grabbing mid-spring freezes the cover where it
  is, and the finger takes over from that exact position with no jump.
- pointermove: only for the captured pointerId. rawX = startRawX + (clientX - startClientX).
  Displayed x = rubber-banded rawX (see below). Write the transform directly.
  Push { t: e.timeStamp, x: clientX } into a sample buffer (keep the last 20).
- pointerup: release with velocity (see below).
- pointercancel and lostpointercapture: the browser took the gesture (for example,
  the user started a vertical scroll on touch). Spring back to the COMMITTED state
  with zero velocity, and don't evaluate the threshold. lostpointercapture also fires
  after a normal pointerup, but by then pointerId has been cleared, so it is a no-op.
- Movement over 3px marks the gesture as a drag. The click that follows a drag is
  stopped (stopPropagation plus preventDefault in a native click listener on the
  cover), so dragging inside a clickable parent (a card that opens a modal) doesn't
  also click it. A tap with under 3px of movement still clicks through. Reset the
  flag on the next pointerdown, because touch drags often produce no click to consume it.

RUBBER BANDING (while dragging past either end)
- Past 0 or past openX, the overflow o is mapped through
  f(o) = (1 - 1 / (o * 0.55 / D + 1)) * D, where D = 0.5W. The cover keeps following
  the finger with more and more resistance, and its stretch past either end
  approaches W/2 but never reaches it, so dragging the pointer far off-screen can't
  fling the cover out of the frame. 0.55 is the iOS scroll-view constant. When
  grabbing mid-overshoot, invert it to recover rawX: o = (D / 0.55) * y / (D - y),
  with y clamped to 0.99D.

RELEASE: THRESHOLD AND VELOCITY
- Velocity: use only samples from the last 100ms before the pointerup timeStamp.
  v = (last.x - first.x) / (last.t - first.t) * 1000 px/s, or 0 with fewer than 2
  samples. A finger that stopped before lifting releases with v = 0, not with its
  earlier speed.
- Projection: projected = x + v * 0.12. A quick flick commits even when it is
  physically short of the line.
- Threshold = 0.3W, measured from the COMMITTED rest position, so there is
  hysteresis:
    committed CLOSED: open if projected >= 0.3W
    committed OPEN:   stay open if projected > openX - 0.3W (= 0.44W), else close
  (W = 380 gives openX = 281px and threshold = 114px. W = 210 gives 155px and 63px.)
- Commit the new state, then start the spring from the current x with the release
  velocity as the initial velocity. Clamp that velocity to ±4W px/s so a violent
  flick can't throw the cover out of the frame at small sizes.

SPRING (a real simulation, not an easing curve)
- m = 1, k = 260, c = 14. Each step: F = -k(x - target) - c*v; v += F/m * dt;
  x += v * dt. This is semi-implicit Euler: update velocity first, then position
  from the new velocity. It is stable at this stiffness, where explicit Euler gains energy.
- Fixed dt = 1/240s. Accumulate real frame time, capped at 1/30s per frame so a
  backgrounded tab can't return with a huge step, and run as many fixed substeps as
  fit. The feel is then identical on 60Hz and 120Hz displays.
- Why these values: w0 = sqrt(k/m) = 16.1 rad/s and damping ratio
  z = c / (2 sqrt(km)) = 0.43. From a still release the step response overshoots by
  exp(-z*pi / sqrt(1 - z^2)) = 22% of the remaining distance, with a visible second,
  smaller rebound (~4%). The damped period is ~0.43s, so the first overshoot peaks
  ~0.2s after release and the motion looks settled by ~0.6s. Below z = 0.35 it
  wobbles like jelly. Above z = 0.6 the overshoot is too small to read. Release
  velocity adds to the overshoot, so a hard flick swings further than a slow drag.
- Stop when |x - target| < 0.05px and |v| < 2px/s: snap exactly to target, zero v,
  cancel the rAF.
- This isn't a tweened elastic ease (GSAP elastic.out or a keyframe curve) because
  a tween can't take the finger's release velocity as its starting condition and
  has to be killed and rebuilt when grabbed mid-flight. The spring does both for free.

RENDERING
- Write the styles imperatively in pointermove and in the rAF tick
  (element.style.transform), never through per-frame React state. React only
  mounts the DOM and calls attach/cleanup in an effect.
- Tie the underlay to progress p = x / openX. Content opacity = 0.2 + 0.8 * clamp(p, 0, 1).
  Content translateX = (p - 1) * 16px, which is unclamped so the revealed content
  shifts slightly with the overshoot too.

ACCESSIBILITY
- prefers-reduced-motion: reduce, read with matchMedia on every release so a live
  OS toggle applies immediately. Skip the spring completely: set x to the resting
  position in one write, with no rAF. While dragging, clamp x to [0, openX] instead
  of rubber banding, so nothing elastic happens at all. Direct manipulation (the
  cover tracking the finger) is kept.
- Keyboard, where the control stands alone: role="switch", tabIndex 0,
  aria-label, and aria-checked kept in sync on every commit. Enter or Space toggles.
  ArrowRight opens and ArrowLeft closes. Both use the same spring with v = 0.
  Ignore keys while a pointer is down. preventDefault so Space doesn't scroll.
  Where the control sits inside another clickable element (a card), make it
  aria-hidden and not focusable. The parent is the control there.

EDGE CASES
- Rapid re-drag mid-animation: pointerdown cancels the rAF and reads the live x
  (inverse rubber band if it's past a bound). The threshold is still judged from
  the committed state, which was already updated at the previous release.
- Release outside the element or window: handled by pointer capture. Don't add
  window or document listeners.
- Touch vs mouse: identical code path. Touch-specific behavior comes from
  touch-action: pan-y (vertical swipe goes to pointercancel and springs back) and
  from the drag-click suppression.
- A second finger during a drag is ignored (pointerId guard).
- Resize: update W. If idle, snap to the new rest position. If springing, the loop
  reads openX every frame, so the target follows.
- Unmount: cancel the rAF, disconnect the ResizeObserver, and remove every listener
  (pointerdown, pointermove, pointerup, pointercancel, lostpointercapture, click,
  keydown). Capture is released automatically when the element leaves the DOM.`;

// Verbatim copy of ./dragReveal.ts, the module that actually runs.
export const DRAG_REVEAL_CODE = `// Drag-to-reveal: a cover panel that springs open/closed with real overshoot.
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
`;

// Verbatim copy of the source, generated by scripts/sync-lab-snippets.mjs.
export const RAIL_CODE = `// ===== src/app/lab/rail.tsx =====

"use client";

// RAIL: the site's floating sidebar nav, as a self-contained demo.
// Styles live in ./rail.module.css, a frozen copy of the sidebar design:
// the live nav has since become a top bar, and sharing its stylesheet meant
// every nav change silently broke this demo. State is per instance here.

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import styles from "./rail.module.css";

export type RailPhase = "closed" | "opening" | "open";
export type RailState = { hover: boolean; focus: boolean; pin: boolean; phase: RailPhase };

export const OPEN_INTENT_MS = 70; // a cursor sweeping past the edge doesn't pop it
export const CLOSE_GRACE_MS = 280; // brushing off the edge doesn't snap it shut
export const OPENING_MS = 900; // row-by-row entrance, then per-letter hover rolls
const PEEK_EVERY_MS = 4200;
const PEEK_OPEN_MS = 1700;

type Row = { label: string; children?: string[] };
const ROWS: Row[] = [
  { label: "HOME" },
  { label: "WORK", children: ["Overview", "Collabs", "Concepts", "Lab"] },
  { label: "ABOUT" },
  { label: "WRITING" },
];

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Letters({ text, className }: { text: string; className: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ "--i": i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Mono caps roll out of a 24px mask while the serif italic rolls in. */
function RollLabel({ label, xray }: { label: string; xray: boolean }) {
  const serif = /[a-z]/.test(label) ? label : titleCase(label);
  return (
    <>
      <span
        aria-hidden
        className={styles.roll}
        style={xray ? { outline: "1px dashed rgba(201,243,29,0.55)" } : undefined}
      >
        <Letters text={label.toUpperCase()} className={styles.mono} />
        <Letters text={serif} className={styles.serif} />
      </span>
      <span className="sr-only">{serif}</span>
    </>
  );
}

type RowProps = HTMLAttributes<HTMLElement> & {
  interactive: boolean;
  "data-active"?: boolean;
  "aria-current"?: "page";
  "aria-expanded"?: boolean;
};

// Buttons when the demo stands alone; plain spans inside a Lab card, where the
// card itself is the control and nested buttons would be unreachable noise.
function RowEl({ interactive, ...props }: RowProps) {
  return interactive ? <button type="button" {...props} /> : <span {...props} />;
}

export function RailDemo({
  interactive = true,
  tree = false,
  autoPeek = false,
  hoverArea = "panel",
  xray = false,
  timeScale = 1,
  onState,
}: {
  interactive?: boolean;
  tree?: boolean;
  autoPeek?: boolean;
  hoverArea?: "panel" | "scene";
  xray?: boolean;
  /** Stretches the JS timers to match slowed-down CSS (breakdown slow-mo). */
  timeScale?: number;
  onState?: (s: RailState) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [peek, setPeek] = useState(false);
  const [active, setActive] = useState("HOME");
  const [treeOpen, setTreeOpen] = useState(false);
  const expanded = hovered || focused || pinned || peek;

  // "opening" staggers labels in row by row; once settled, hover rolls use
  // their own short per-letter delay instead.
  const [settled, setSettled] = useState(expanded);
  useEffect(() => {
    const t = setTimeout(() => setSettled(expanded), expanded ? OPENING_MS * timeScale : 0);
    return () => clearTimeout(t);
  }, [expanded, timeScale]);
  const phase: RailPhase = !expanded ? "closed" : settled ? "open" : "opening";

  useEffect(() => {
    onState?.({ hover: hovered, focus: focused, pin: pinned, phase });
  }, [hovered, focused, pinned, phase, onState]);

  const sceneRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // After an explicit collapse, ignore the pointer still resting on the panel
  // until it leaves; otherwise the same click would reopen it instantly.
  const suppressHover = useRef(false);
  const pointerInside = useRef(false);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  // Card thumbnail only: tuck out and back now and then, but only while on
  // screen, with the tab visible, and never under reduced motion.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!autoPeek || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let hide: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(scene);
    const cycle = setInterval(() => {
      if (!visible || document.hidden) return;
      setPeek(true);
      hide = setTimeout(() => setPeek(false), PEEK_OPEN_MS);
    }, PEEK_EVERY_MS);
    return () => {
      clearInterval(cycle);
      clearTimeout(hide);
      io.disconnect();
    };
  }, [autoPeek]);

  const collapse = () => {
    // A hover-open still pending from the pointer that just arrived would
    // otherwise re-open the panel right after this collapse.
    clearTimeout(openTimer.current);
    setPinned(false);
    setHovered(false);
    setFocused(false);
    setPeek(false);
    // Only when the pointer is actually on the panel: after a keyboard Esc
    // with the pointer elsewhere, the next hover must still open it.
    suppressHover.current = pointerInside.current;
  };

  const hoverHandlers = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "touch") return;
      pointerInside.current = true;
      if (suppressHover.current) return;
      clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => setHovered(true), OPEN_INTENT_MS * timeScale);
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "touch") return;
      pointerInside.current = false;
      suppressHover.current = false;
      clearTimeout(openTimer.current);
      closeTimer.current = setTimeout(() => setHovered(false), CLOSE_GRACE_MS * timeScale);
    },
  };

  const focusHandlers = interactive
    ? {
        onFocus: (e: FocusEvent<HTMLElement>) => {
          if (e.target.matches(":focus-visible")) setFocused(true);
        },
        onBlur: (e: FocusEvent<HTMLElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (e.key === "Escape" && expanded) {
            e.stopPropagation();
            collapse();
            (document.activeElement as HTMLElement | null)?.blur();
          }
        },
      }
    : {};

  const toggle = () => (expanded ? collapse() : setPinned(true));

  const activeRow = ROWS.find((r) => r.label === active || r.children?.includes(active));
  const section = activeRow
    ? activeRow.children && active !== activeRow.children[0]
      ? titleCase(activeRow.label) + " · " + active
      : titleCase(activeRow.label)
    : null;
  const treeShown = tree && treeOpen && expanded;

  return (
    <div
      ref={sceneRef}
      className="relative h-full w-full overflow-hidden"
      {...(hoverArea === "scene" ? hoverHandlers : {})}
    >
      {/* A stand-in page: the panel floats over it and never pushes it. */}
      <div aria-hidden className="absolute inset-y-4 right-5 left-[100px] flex flex-col gap-3">
        <div className="h-3.5 w-2/5 rounded-full bg-ink/12" />
        <div className="h-2 w-4/5 rounded-full bg-ink/7" />
        <div className="h-2 w-3/5 rounded-full bg-ink/7" />
        <div className="mt-2 grid flex-1 grid-cols-2 gap-3">
          <div className="rounded-xl border border-accent/10 bg-accent/[0.04]" />
          <div className="rounded-xl border border-ink/8 bg-ink/[0.03]" />
        </div>
      </div>

      {xray && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-3 bottom-3 left-3 z-30 w-[232px] rounded-[22px] border border-dashed border-accent/40"
        >
          <span className="absolute right-3 bottom-2 font-mono text-[9px] tracking-[0.08em] text-accent/70">
            LAYOUT BOX · 232PX
          </span>
        </div>
      )}

      <div
        className="absolute top-3 bottom-3 left-3 z-20 flex"
        aria-hidden={interactive ? undefined : true}
        role={interactive ? "navigation" : undefined}
        aria-label={interactive ? "Demo navigation" : undefined}
        {...(hoverArea === "panel" ? hoverHandlers : {})}
        {...focusHandlers}
      >
        <div className={styles.panel + " h-full"} data-expanded={expanded || undefined} data-phase={phase}>
          <div className={styles.inner + " flex h-full flex-col px-[22px] pt-5 pb-4"}>
            <span className="flex items-baseline gap-px">
              <span className="font-script text-[32px] leading-none font-bold text-accent">G</span>
              <span data-word="bemi" className="font-serif-italic text-[16px] text-ink/85 italic">
                bemi
              </span>
            </span>

            <div className="flex w-full flex-1 flex-col py-3" style={{ justifyContent: "safe center" }}>
              <div className={styles.list + " flex w-full flex-col gap-1"}>
                {ROWS.map((row, i) => {
                  const rowStyle = { "--row": i } as CSSProperties;
                  const isActive = activeRow === row;
                  const num = <span className={styles.num}>{"0" + (i + 1)}</span>;
                  if (!row.children || !tree) {
                    return (
                      <RowEl
                        key={row.label}
                        interactive={interactive}
                        onClick={interactive ? () => setActive(row.label) : undefined}
                        aria-current={interactive && isActive ? "page" : undefined}
                        data-active={isActive || undefined}
                        className={styles.link}
                        style={rowStyle}
                      >
                        {num}
                        <span aria-hidden className={styles.tick} />
                        <RollLabel label={row.label} xray={xray} />
                      </RowEl>
                    );
                  }
                  return (
                    <div key={row.label} className="flex w-full flex-col">
                      <RowEl
                        interactive={interactive}
                        onClick={interactive ? () => setTreeOpen((v) => !v) : undefined}
                        aria-expanded={interactive ? treeOpen : undefined}
                        data-active={isActive || undefined}
                        className={styles.link}
                        style={rowStyle}
                      >
                        {num}
                        <span aria-hidden className={styles.tick} />
                        <RollLabel label={row.label} xray={xray} />
                        <span aria-hidden className={styles.chevron} data-open={treeOpen || undefined}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M6 9l6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </RowEl>
                      {/* inert while hidden keeps the sub-links out of the tab order. */}
                      <div
                        inert={!treeShown}
                        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ gridTemplateRows: treeShown ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-0.5 mb-2 ml-3 flex flex-col border-l border-ink/10">
                            {row.children.map((child) => (
                              <RowEl
                                key={child}
                                interactive={interactive}
                                onClick={interactive ? () => setActive(child) : undefined}
                                aria-current={interactive && active === child ? "page" : undefined}
                                data-active={active === child || undefined}
                                className={styles.link + " " + styles.sub}
                                style={rowStyle}
                              >
                                <span aria-hidden className={styles.tick} />
                                <RollLabel label={child} xray={xray} />
                              </RowEl>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {tree && (
              <div className="grid items-end *:[grid-area:1/1]">
                <div className={styles.openOnly + " font-mono text-[10px] tracking-[0.08em] text-accent/70"}>
                  RÉSUMÉ ↓
                </div>
                {section && (
                  <div aria-hidden className={styles.railOnly + " flex w-6 justify-center"}>
                    <span className={styles.vertical}>{section}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 flex w-6 justify-center">
              {interactive ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={expanded}
                  aria-label={expanded ? "Collapse demo navigation" : "Expand demo navigation"}
                  className={styles.toggle}
                >
                  <ToggleIcon />
                </button>
              ) : (
                <span className={styles.toggle}>
                  <ToggleIcon />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ===== src/app/lab/rail.module.css ===== */

/* RAIL (Lab): the floating sidebar-nav design, frozen as its own stylesheet.
   It started as the site nav's CSS, shared by import; the live nav has since
   become a top bar, so the demo keeps its own copy and nav changes can no
   longer break it. */

/* ── Floating desktop nav ───────────────────────────────────────────────
   The panel rests as a slim rail and pops out over the page (never pushing
   it). Its content is laid out once at the full expanded width and simply
   clipped by the panel's own width, so the only thing that changes per frame
   is one isolated fixed box — no child reflow.

   All interaction feedback is typographic: labels are a masked letter roll
   from Space Mono caps to the Instrument Serif italic of the wordmark. */

.panel {
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --rail: 68px;
  --open: 232px;

  width: var(--rail);
  contain: layout paint style;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(201, 243, 29, 0.12);
  background: rgba(11, 8, 16, 0.78);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  box-shadow:
    inset 0 1px 0 rgba(242, 239, 233, 0.05),
    0 10px 30px -18px rgba(0, 0, 0, 0.6);
  transition:
    width 320ms var(--ease),
    box-shadow 320ms var(--ease),
    border-color 320ms var(--ease);
}

.panel[data-expanded] {
  width: var(--open);
  border-color: rgba(201, 243, 29, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(242, 239, 233, 0.06),
    0 30px 70px -24px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(0, 0, 0, 0.25);
  transition-duration: 520ms;
}

/* Content is always laid out at the open width; the panel clips it. */
.inner {
  width: var(--open);
}

/* Brand: collapsed shows only the G / sigil monogram. \\\`filter: opacity()\\\`
   rather than \\\`opacity\\\`, because the brand's GSAP intro owns the inline
   opacity of these same elements. */
.panel [data-word],
.panel [data-mark="dee"] {
  display: inline-block;
  transition:
    filter 260ms var(--ease),
    transform 420ms var(--ease);
}
.panel:not([data-expanded]) [data-word],
.panel:not([data-expanded]) [data-mark="dee"] {
  filter: opacity(0);
  transform: translateX(-6px);
  transition-duration: 160ms;
}
.panel[data-expanded] [data-word],
.panel[data-expanded] [data-mark="dee"] {
  transition-delay: 90ms;
}

/* ── Rows ─────────────────────────────────────────────────────────────── */

.link {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding-block: 7px;
  color: rgba(242, 239, 233, 0.55);
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: color 300ms var(--ease);
}

.link:hover,
.link:focus-visible,
.link[data-active] {
  color: var(--color-ink);
}

/* Focus through type: hovering one row quietly steps the others back. */
.list:has(.link:hover) .link:not(:hover) {
  color: rgba(242, 239, 233, 0.28);
}

.num {
  width: 24px;
  flex-shrink: 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: rgba(242, 239, 233, 0.3);
  transition: color 300ms var(--ease);
}
.link:hover .num,
.link:focus-visible .num {
  color: rgba(242, 239, 233, 0.75);
}
.link[data-active] .num {
  color: var(--color-accent);
}

/* The one hairline of accent: a tick that draws out from the numeral. */
.tick {
  width: 18px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  padding-left: 4px;
}
.tick::before {
  content: "";
  width: 9px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 420ms var(--ease);
}
.link:hover .tick::before,
.link:focus-visible .tick::before {
  transform: scaleX(1);
}
.link[data-active] .tick::before {
  transform: scaleX(1);
  background: var(--color-accent);
}

/* Sub rows hang off the tree line; their tick is the branch into the label. */
.sub {
  padding-block: 4px;
}
.sub .tick {
  width: 30px;
  padding-left: 0;
}
.sub .tick::before {
  width: 14px;
}

/* ── The letter roll ──────────────────────────────────────────────────── */

.roll {
  position: relative;
  display: inline-flex;
  height: 24px;
  align-items: center;
  /* Room for the italic overhang so it isn't shaved by the mask. */
  padding-right: 0.3em;
  overflow: clip;
  white-space: pre;
}

.mono,
.serif {
  display: flex;
  align-items: center;
  height: 100%;
}
.serif {
  position: absolute;
  inset: 0 auto 0 0;
}

.mono {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
}
.serif {
  font-family: var(--font-serif-italic);
  font-style: italic;
  font-size: 18px;
  letter-spacing: 0.005em;
}
.sub .mono {
  font-size: 11px;
}
.sub .serif {
  font-size: 16px;
}

.mono > span,
.serif > span {
  display: inline-block;
  /* Each glyph box is the full mask height, so a roll travels exactly one
     mask and nothing peeks through mid-flight. */
  line-height: 24px;
  will-change: transform;
  transition: transform 520ms var(--ease);
  transition-delay: calc(var(--i) * 16ms);
}

/* Rest (panel open): mono visible, serif waiting below the mask. */
.mono > span {
  transform: translateY(0);
}
.serif > span {
  transform: translateY(105%);
}

/* Hover / focus / current page: mono rolls out the top, serif rises in. */
.link:hover .mono > span,
.link:focus-visible .mono > span,
.link[data-active] .mono > span {
  transform: translateY(-105%);
}
.link:hover .serif > span,
.link:focus-visible .serif > span,
.link[data-active] .serif > span {
  transform: translateY(0);
}

/* Collapsed: every label sinks below its mask… */
.panel:not([data-expanded]) .mono > span,
.panel:not([data-expanded]) .serif > span {
  transform: translateY(105%);
  transition-duration: 220ms;
  transition-delay: 0ms;
}

/* …and rises back row by row as the panel opens. */
.panel[data-phase="opening"] .mono > span,
.panel[data-phase="opening"] .serif > span {
  transition-duration: 640ms;
  transition-delay: calc(110ms + var(--row) * 50ms + var(--i) * 18ms);
}

.chevron {
  margin-left: 2px;
  opacity: 0.5;
  transition:
    transform 360ms var(--ease),
    opacity 300ms var(--ease);
}
.chevron[data-open] {
  transform: rotate(180deg);
}
.link:hover .chevron {
  opacity: 0.9;
}

/* ── Rail-only / open-only extras ─────────────────────────────────────── */

.openOnly,
.railOnly {
  transition:
    opacity 300ms var(--ease),
    transform 480ms var(--ease),
    visibility 0s linear 0s;
}
.panel:not([data-expanded]) .openOnly,
.panel[data-expanded] .railOnly {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 160ms var(--ease),
    transform 160ms var(--ease),
    visibility 0s linear 160ms;
}
.panel:not([data-expanded]) .openOnly {
  transform: translateX(-8px);
}
.panel[data-phase="opening"] .openOnly {
  transition-delay: 260ms, 260ms, 0s;
}

.vertical {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-serif-italic);
  font-style: italic;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: rgba(242, 239, 233, 0.45);
  white-space: nowrap;
}
.vertical::after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 18px;
  margin-top: 10px;
  background: rgba(201, 243, 29, 0.5);
}

.toggle {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: rgba(242, 239, 233, 0.45);
  cursor: pointer;
  outline: none;
  transition: color 250ms var(--ease);
}
.toggle:hover,
.toggle:focus-visible {
  color: var(--color-accent);
}
.toggle:focus-visible {
  box-shadow: 0 0 0 1px rgba(201, 243, 29, 0.5);
}
.toggle svg {
  transition: transform 480ms var(--ease);
}
.panel[data-expanded] .toggle svg {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  .panel *,
  .panel *::before {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }
}
`;

// Verbatim copy of the source, generated by scripts/sync-lab-snippets.mjs.
export const TOPBAR_CODE = `// ===== src/app/lab/topbar.tsx =====

"use client";

// TOPBAR: the site's floating top nav, as a self-contained demo.
// Styles live in ./topbar.module.css, a frozen copy of the live nav's, so nav
// changes can't silently break this (see RAIL). The bar sits over its own
// scrollable stand-in page instead of the window, and all state is per
// instance. \`autoplay\` drives the card thumbnail through a scripted loop via
// data-demo-hover, which the stylesheet treats exactly like :hover.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import SigilD from "@/components/SigilD";
import styles from "./topbar.module.css";

export type MenuPhase = "closed" | "entering" | "open";
export type TopbarState = {
  floating: boolean;
  hovering: string | null;
  menu: MenuPhase;
  active: string;
};

export const FLOAT_AT_PX = 8; // content passing under the bar → frosted capsule
export const MENU_INTENT_MS = 90; // a cursor passing over WORK doesn't flash the menu
export const MENU_GRACE_MS = 240; // a wide diagonal toward the menu doesn't snap it shut
export const MENU_ENTER_MS = 700; // item cascade, then per-letter hover rolls

type Item = { label: string; serif?: boolean; children?: string[] };
const ITEMS: Item[] = [
  { label: "HOME" },
  { label: "WORK", children: ["Overview", "Collabs", "Concepts", "Lab"] },
  { label: "ABOUT" },
  { label: "WRITING", serif: true },
];

// The card thumbnail's loop: one step every STEP_MS.
type Step = { hover?: string; menu?: boolean; sub?: string; scroll?: number };
const STEP_MS = 900;
const SCRIPT: Step[] = [
  { scroll: 0 },
  { hover: "HOME" },
  { hover: "WORK", menu: true },
  { hover: "WORK", menu: true, sub: "Concepts" },
  { hover: "ABOUT" },
  { hover: "WRITING" },
  { scroll: 160 },
  { hover: "HOME", scroll: 160 },
  { scroll: 160 },
];

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Letters({ text, className }: { text: string; className: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ "--i": i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Rolls into a mono copy of itself, or into the serif italic with \`serif\`. */
function RollLabel({ label, serif = false, xray }: { label: string; serif?: boolean; xray: boolean }) {
  const name = /[a-z]/.test(label) ? label : titleCase(label);
  const caps = label.toUpperCase();
  return (
    <>
      <span
        aria-hidden
        className={styles.roll}
        data-face={serif ? "serif" : "mono"}
        style={xray ? { outline: "1px dashed rgba(201,243,29,0.55)" } : undefined}
      >
        <Letters text={caps} className={styles.mono} />
        <Letters text={serif ? name : caps} className={styles.back} />
      </span>
      <span className="sr-only">{name}</span>
    </>
  );
}

type ItemProps = HTMLAttributes<HTMLElement> & {
  interactive: boolean;
  "data-active"?: boolean;
  "data-demo-hover"?: boolean;
  "aria-current"?: "page";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

// Buttons when the demo stands alone; plain spans inside a Lab card, where the
// card itself is the control and nested buttons would be unreachable noise.
function ItemEl({ interactive, ...props }: ItemProps) {
  return interactive ? <button type="button" {...props} /> : <span {...props} />;
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TopbarDemo({
  interactive = true,
  autoplay = false,
  xray = false,
  timeScale = 1,
  onState,
}: {
  interactive?: boolean;
  autoplay?: boolean;
  xray?: boolean;
  /** Stretches the JS timers to match slowed-down CSS (breakdown slow-mo). */
  timeScale?: number;
  onState?: (s: TopbarState) => void;
}) {
  const [floating, setFloating] = useState(false);
  const [active, setActive] = useState("HOME");
  const [menuOpen, setMenuOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const [pointerOn, setPointerOn] = useState<string | null>(null);
  const [demoHover, setDemoHover] = useState<string | null>(null);
  const [demoSub, setDemoSub] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const menuOpenRef = useRef(false);
  const setMenu = useCallback(
    (next: boolean) => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      if (next && !menuOpenRef.current) {
        setEntering(true);
        clearTimeout(enterTimer.current);
        enterTimer.current = setTimeout(() => setEntering(false), MENU_ENTER_MS * timeScale);
      }
      menuOpenRef.current = next;
      setMenuOpen(next);
    },
    [timeScale]
  );

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
    },
    []
  );

  const menu: MenuPhase = !menuOpen ? "closed" : entering ? "entering" : "open";
  useEffect(() => {
    onState?.({ floating, hovering: pointerOn ?? demoHover, menu, active });
  }, [floating, pointerOn, demoHover, menu, active, onState]);

  // Frosted once the stand-in page scrolls under the bar.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setFloating(scroller.scrollTop > FLOAT_AT_PX);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu on a press anywhere outside WORK.
  useEffect(() => {
    if (!menuOpen || !interactive) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (!workRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menuOpen, interactive, setMenu]);

  // Card thumbnail only: play the script while on screen, with the tab
  // visible, and never under reduced motion.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!autoplay || !scroller) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let step = 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(scroller);
    const tick = setInterval(() => {
      if (!visible || document.hidden) return;
      const s = SCRIPT[step];
      step = (step + 1) % SCRIPT.length;
      setDemoHover(s.hover ?? null);
      setDemoSub(s.sub ?? null);
      setMenu(Boolean(s.menu));
      if (s.scroll !== undefined) scroller.scrollTo({ top: s.scroll, behavior: "smooth" });
    }, STEP_MS);
    return () => {
      clearInterval(tick);
      io.disconnect();
    };
  }, [autoplay, setMenu]);

  const track = (label: string) =>
    interactive
      ? {
          onPointerEnter: () => setPointerOn(label),
          onPointerLeave: () => setPointerOn((cur) => (cur === label ? null : cur)),
        }
      : {};

  const workHandlers = interactive
    ? {
        // Hover intent both ways: passing over doesn't flash it open, and a
        // slightly wide diagonal toward the menu doesn't snap it shut.
        onPointerEnter: (e: PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse") return;
          clearTimeout(closeTimer.current);
          openTimer.current = setTimeout(() => setMenu(true), MENU_INTENT_MS * timeScale);
        },
        onPointerLeave: (e: PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse") return;
          clearTimeout(openTimer.current);
          closeTimer.current = setTimeout(() => setMenu(false), MENU_GRACE_MS * timeScale);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (e.key === "Escape" && menuOpen) {
            e.stopPropagation();
            setMenu(false);
            workRef.current?.querySelector("button")?.focus();
          }
        },
      }
    : {};

  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden={interactive ? undefined : true}>
      {/* A stand-in page that scrolls under the bar. */}
      <div
        ref={scrollerRef}
        className={\`absolute inset-0 \${interactive ? "overflow-y-auto" : "overflow-hidden"}\`}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? "Demo page, scroll to frost the bar" : undefined}
      >
        <div aria-hidden className="flex flex-col gap-3 px-8 pt-23 pb-10" style={{ height: 820 }}>
          <div className="h-2 w-24 rounded-full bg-accent/40" />
          <div className="h-5 w-3/5 rounded-full bg-ink/14" />
          <div className="h-5 w-2/5 rounded-full bg-accent/25" />
          <div className="mt-1 h-2 w-4/5 rounded-full bg-ink/8" />
          <div className="h-2 w-3/5 rounded-full bg-ink/8" />
          <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
            <div className="rounded-xl border border-accent/12 bg-accent/5" />
            <div className="rounded-xl border border-ink/8 bg-ink/4" />
            <div className="rounded-xl border border-ink/8 bg-ink/4" />
          </div>
        </div>
      </div>

      <div
        className={styles.bar + " absolute inset-x-3 top-3 z-20"}
        data-floating={floating || undefined}
        role={interactive ? "navigation" : undefined}
        aria-label={interactive ? "Demo navigation" : undefined}
      >
        <div
          className={styles.surface + " flex h-15 items-center gap-6 px-4"}
          style={xray ? { outline: "1px dashed rgba(201,243,29,0.4)", outlineOffset: 2 } : undefined}
        >
          <span className="flex shrink-0 items-baseline gap-2">
            <span className="flex items-baseline gap-px">
              <span className="font-script text-[32px] leading-none font-bold text-accent">G</span>
              <span className="font-serif-italic text-[16px] text-ink/85 italic">bemi</span>
            </span>
            <span className="flex items-baseline gap-1">
              <SigilD style={{ height: 25, width: "auto" }} />
              <span className="font-serif-italic text-[16px] text-ink/85 italic">aniel</span>
            </span>
          </span>

          <div className={styles.list + " ml-auto flex items-center gap-5"}>
            {ITEMS.map((item) => {
              const isActive =
                item.label === active || Boolean(item.children?.includes(active));
              if (!item.children) {
                return (
                  <ItemEl
                    key={item.label}
                    interactive={interactive}
                    onClick={interactive ? () => setActive(item.label) : undefined}
                    aria-current={interactive && isActive ? "page" : undefined}
                    data-active={isActive || undefined}
                    data-demo-hover={demoHover === item.label || undefined}
                    className={styles.link}
                    {...track(item.label)}
                  >
                    <RollLabel label={item.label} serif={item.serif} xray={xray} />
                  </ItemEl>
                );
              }
              return (
                <div key={item.label} ref={workRef} className="relative" {...workHandlers}>
                  <ItemEl
                    interactive={interactive}
                    onClick={interactive ? () => setMenu(!menuOpen) : undefined}
                    aria-expanded={interactive ? menuOpen : undefined}
                    aria-controls={interactive ? "topbar-demo-work" : undefined}
                    data-active={isActive || undefined}
                    data-demo-hover={demoHover === item.label || undefined}
                    className={styles.link}
                    {...track(item.label)}
                  >
                    <RollLabel label={item.label} xray={xray} />
                    <span aria-hidden className={styles.chevron} data-open={menuOpen || undefined}>
                      <Chevron />
                    </span>
                  </ItemEl>
                  <div
                    id={interactive ? "topbar-demo-work" : undefined}
                    inert={!menuOpen}
                    className={styles.menu}
                    data-open={menuOpen || undefined}
                    data-entering={entering || undefined}
                  >
                    <div className={styles.tree}>
                      {item.children.map((child, row) => (
                        <ItemEl
                          key={child}
                          interactive={interactive}
                          onClick={
                            interactive
                              ? () => {
                                  setActive(child);
                                  setMenu(false);
                                }
                              : undefined
                          }
                          aria-current={interactive && active === child ? "page" : undefined}
                          data-active={active === child || undefined}
                          data-demo-hover={demoSub === child || undefined}
                          className={styles.link + " " + styles.sub}
                          style={{ "--row": row } as CSSProperties}
                          {...track(child)}
                        >
                          <span aria-hidden className={styles.tick} />
                          <RollLabel label={child} xray={xray} />
                        </ItemEl>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ItemEl interactive={interactive} className={styles.link} {...track("RÉSUMÉ")}>
            <RollLabel label="Résumé" xray={xray} />
            <span aria-hidden className="ml-1 font-mono text-[11px] text-accent/80">
              ↓
            </span>
          </ItemEl>
        </div>
      </div>
    </div>
  );
}

/* ===== src/app/lab/topbar.module.css ===== */

/* TOPBAR (Lab): the site's floating top nav, frozen as its own stylesheet.
   A copy of src/components/nav.module.css rather than an import of it, so
   later nav changes can't silently break the demo (which is what happened
   to RAIL). Two demo-only additions: [data-demo-hover] mirrors :hover so
   the card thumbnail can play hovers without a cursor, and .bar is
   positioned by the demo's stage instead of the viewport.

   A detached bar that stays put through the whole scroll, settling from
   flat into a frosted capsule once content passes under it. All
   interaction feedback is typographic: labels are a masked letter roll
   (see "The letter roll" below), with no pills or colour fills. */

.bar {
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

.surface {
  position: relative;
  border-radius: 20px;
  border: 1px solid transparent;
  background: transparent;
  transition:
    background-color 420ms var(--ease),
    border-color 420ms var(--ease),
    box-shadow 420ms var(--ease);
}
/* Flat on the page at the very top; a floating frosted capsule once the
   content starts passing underneath it. */
.bar[data-floating] .surface {
  border-color: rgba(201, 243, 29, 0.12);
  background: rgba(11, 8, 16, 0.74);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  box-shadow:
    inset 0 1px 0 rgba(242, 239, 233, 0.05),
    0 24px 60px -28px rgba(0, 0, 0, 0.75);
}

/* ── Rows ─────────────────────────────────────────────────────────────── */

.link {
  position: relative;
  display: flex;
  align-items: center;
  padding-block: 8px;
  color: rgba(242, 239, 233, 0.55);
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: color 300ms var(--ease);
}

.link:hover,
.link[data-demo-hover],
.link:focus-visible,
.link[data-active] {
  color: var(--color-ink);
}

/* Focus through type: hovering one item quietly steps the others back. */
.list:has(.link:hover) .link:not(:hover),
.list:has(.link[data-demo-hover]) .link:not([data-demo-hover]) {
  color: rgba(242, 239, 233, 0.28);
}

/* The one hairline of accent: the branch off the Work dropdown's tree line,
   drawn in on hover and lit for the current page. */
.tick {
  width: 16px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}
.tick::before {
  content: "";
  width: 9px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition:
    transform 420ms var(--ease),
    opacity 300ms var(--ease);
}
.link:hover .tick::before,
.link[data-demo-hover] .tick::before,
.link:focus-visible .tick::before {
  transform: scaleX(1);
}
.link[data-active] .tick::before {
  transform: scaleX(1);
  background: var(--color-accent);
}

/* ── The letter roll ──────────────────────────────────────────────────────
   Two stacked copies of the label inside a mask. On hover the front copy
   rolls out the top letter by letter as the back copy rises in. For most
   links the back copy is the same Space Mono caps, so the motion never
   changes the font or the width. Only Writing (data-face="serif") rolls
   into the Instrument Serif italic of the writing pages. */

.roll {
  position: relative;
  display: inline-flex;
  height: 24px;
  align-items: center;
  overflow: clip;
  white-space: pre;
}

.mono,
.back {
  display: flex;
  align-items: center;
  height: 100%;
}
/* Centred over the front copy: a narrower serif word sits evenly inside the
   mono word's box instead of leaving a lopsided gap after it. */
.back {
  position: absolute;
  inset: 0;
  justify-content: center;
}

.mono,
.roll[data-face="mono"] .back {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
}
.roll[data-face="serif"] .back {
  font-family: var(--font-serif-italic);
  font-style: italic;
  font-size: 18px;
  letter-spacing: 0.005em;
}
.sub .mono,
.sub .roll[data-face="mono"] .back {
  font-size: 11px;
}

.mono > span,
.back > span {
  display: inline-block;
  /* Each glyph box is the full mask height, so a roll travels exactly one
     mask and nothing peeks through mid-flight. */
  line-height: 24px;
  will-change: transform;
  transition: transform 520ms var(--ease);
  transition-delay: calc(var(--i) * 16ms);
}

/* Rest: front visible, back waiting below the mask. */
.mono > span {
  transform: translateY(0);
}
.back > span {
  transform: translateY(105%);
}

/* Hover / focus: front rolls out the top, back rises in. The serif face
   also rests rolled on its own (Writing) pages. */
.link:hover .mono > span,
.link[data-demo-hover] .mono > span,
.link:focus-visible .mono > span,
.link[data-active] .roll[data-face="serif"] .mono > span {
  transform: translateY(-105%);
}
.link:hover .back > span,
.link[data-demo-hover] .back > span,
.link:focus-visible .back > span,
.link[data-active] .roll[data-face="serif"] .back > span {
  transform: translateY(0);
}

/* Resting in the serif (on the Writing pages), the box sizes to the serif
   word rather than the wider mono caps hidden above the mask, so the gaps
   either side of it match the rest of the row. */
.link[data-active] .roll[data-face="serif"] .mono {
  position: absolute;
  inset: 0 auto 0 0;
}
.link[data-active] .roll[data-face="serif"] .back {
  position: relative;
  inset: auto;
}

/* Pulled in against the label: the icon's own 3px inner padding plus the
   last letter's tracking otherwise left ~8px before it, so the chevron read
   as a separate item floating between WORK and ABOUT. */
.chevron {
  margin-left: -2px;
  opacity: 0.5;
  transition:
    transform 360ms var(--ease),
    opacity 300ms var(--ease);
}
.chevron[data-open] {
  transform: rotate(180deg);
}
.link:hover .chevron,
.link[data-demo-hover] .chevron {
  opacity: 0.9;
}

/* ── Work dropdown ────────────────────────────────────────────────────── */

.menu {
  position: absolute;
  top: calc(100% + 14px);
  left: -18px;
  min-width: 200px;
  padding: 14px 22px 14px 18px;
  border-radius: 16px;
  border: 1px solid rgba(201, 243, 29, 0.14);
  background: rgba(11, 8, 16, 0.86);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  box-shadow:
    inset 0 1px 0 rgba(242, 239, 233, 0.05),
    0 30px 70px -24px rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transform-origin: top left;
  transition:
    opacity 200ms var(--ease),
    transform 260ms var(--ease),
    visibility 0s linear 260ms;
}
/* Bridges the gap to the trigger so the pointer can cross it. */
.menu::before {
  content: "";
  position: absolute;
  inset: -16px 0 auto;
  height: 16px;
}
.menu[data-open] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition:
    opacity 260ms var(--ease),
    transform 520ms var(--ease),
    visibility 0s linear 0s;
}

.tree {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  border-left: 1px solid rgba(242, 239, 233, 0.1);
}

/* Sub rows hang off the tree line; their tick is the branch into the label. */
.sub {
  padding-block: 4px;
}
.sub .tick {
  width: 26px;
  justify-content: flex-start;
}
.sub .tick::before {
  width: 14px;
  transform: scaleX(0);
}

/* Items stagger up out of the mask as the menu opens. */
.menu:not([data-open]) .mono > span,
.menu:not([data-open]) .back > span {
  transform: translateY(105%);
  transition-duration: 160ms;
  transition-delay: 0ms;
}
.menu[data-entering] .mono > span,
.menu[data-entering] .back > span {
  transition-duration: 560ms;
  transition-delay: calc(60ms + var(--row) * 45ms + var(--i) * 14ms);
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .bar *,
  .bar *::before {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }
}
`;
