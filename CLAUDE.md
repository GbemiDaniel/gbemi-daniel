# Gbemi Daniel Portfolio — Agent Instructions

Read [`README.md`](./README.md) first — it documents the real architecture: the tech stack, the case-study system, and the `ImageSlot` placeholder pattern. This file only adds what the README doesn't cover: how to add new Concepts and Lab entries quickly, and the performance rule that keeps them cheap.

Ignore `AGENTS.md` — that file is auto-written by `next dev` itself (see the comment inside it) and is not a project convention.

## Scope check before building anything new: does this belong on this site at all?

Not every self-directed idea is a Concepts entry. There are two different weights of thing, and they get built and hosted differently:

- **A visual/design exploration** (a hero section, a navbar redesign, a landing-page treatment, a brand direction) has no backend and nothing that needs to run independently. It belongs directly in this site as a Concepts entry, per the section below.
- **A full self-directed product** (something with real state, a database, auth, or genuine standalone utility — the kind of thing someone would actually use, not just look at) does **not** belong as a route inside this codebase. It should be built and deployed as its own project (its own repo, its own Vercel deployment), the same way ChronoVault, Markd, Handshakers, and Thrifty already are. This portfolio then only gets a case-study entry for it (`src/lib/caseStudies.ts`) with a write-up, screenshots, and a `liveUrl` pointing at the real deployment.

When asked to add a new self-directed idea, ask which of these two it is before writing any code, if it isn't obvious from the request. Building a real product's backend/data logic inside this repo would tie its uptime to the portfolio's own deploy and drag unrelated dependencies into a codebase that should stay lean — exactly the mistake the rest of this file is trying to prevent.

## What Lab actually is (read before inventing a new entry)

Lab isn't a demo reel and it isn't developer-tool utilities (a calculator, a checker, a generator — those don't belong here). It's a small, self-contained visual piece of UI interaction, motion, or generative work: playful but genuinely interactive, not just decorative. The actual filter is craft that goes unnoticed on purpose — an easing curve, a timing offset, an overshoot, a release behavior — the 5% of polish most people would never think to ask for but clearly feel the absence of when it's missing. If an idea's whole value is obvious at a glance, it's probably not Lab material. If the idea is common but a well-tuned version of it feels completely different from a lazy one, that's the sign it belongs here.

## Adding a Lab entry

Lab lives entirely in two files:
- `src/app/lab/previews.tsx` — one small named component per piece (e.g. `OrbitPreview`, `RipplePreview`). Keep each self-contained: inline styles or a CSS Modules class in `lab.module.css`, no new dependencies unless the effect genuinely needs one.
- `src/app/lab/page.tsx` — the `CARDS` array. Add one object: `{ id, codename, tag, desc, Preview, noPadding, devPrompt? }`.

That's the whole change. The grid, modal, and keyboard handling already exist and don't need touching. Only build a full `/lab-detail`-style breakdown page if the piece genuinely needs a deeper walkthrough (see the existing `nodeSets.ts` pattern) — most entries don't.

## Adding a Concepts entry

- `src/app/concepts/page.tsx` holds the `PROJECTS` array (currently empty on purpose — see the comment above it). Add one object: `{ key, title, description, category, tagList, year, href, rot }`.
- If the concept deserves a full write-up (the way real client work does), add a slug to `src/lib/caseStudies.ts` and point `href` at `/case-study/<slug>`. Sections are optional per entry — only include the ones that actually apply, per the existing pattern (see the README's case-study section).
- Use `ImageSlot` for any image; it already renders an on-brand placeholder when no `src` exists yet, so a Concepts entry can ship before every asset is final.

## Performance rule for new entries

Everything currently in Lab and previews is cheap (CSS/DOM animation, no heavy libraries beyond the GSAP already used site-wide). If a new idea needs something heavier — Three.js, a video background, a large charting library — import it only inside that one preview/component with a dynamic `import()`, never as a top-level import in a shared file. That keeps it out of the bundle for every page that isn't opening that specific card.

## Images

- Source portraits and screenshots should be sized close to their actual display width before adding them (roughly 2x the largest rendered size for retina, not full camera/export resolution). `portrait-hero.jpg` and `portrait-secondary.jpg` are currently 1856×2304 source files; new images shouldn't repeat that.
- Small marks/icons (like the sigil) should be SVG where possible rather than a multi-hundred-KB PNG.
- Always go through `ImageSlot` (never a bare `<img>`), and set `priority` only on the actual above-the-fold image per page — it's already used correctly on the hero portrait and first work card.
