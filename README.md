# Gbemi Daniel — Portfolio

Personal portfolio site for Gbemi ("Dee") Daniel, a frontend engineer.
Built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

Live at [gbemidaniel.vercel.app](https://gbemidaniel.vercel.app).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Tech stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript**
- **Tailwind CSS v4** — design tokens defined via `@theme` in
  [`src/app/globals.css`](./src/app/globals.css) (colors, fonts). There is
  no configured `sm`/`md` breakpoint for this design — mobile styling
  throughout the app uses a one-off `max-[700px]:` / `min-[700px]:`
  Tailwind arbitrary-value breakpoint instead of the framework defaults.
- **GSAP** (+ ScrollTrigger) for scroll-linked reveals and a couple of
  bespoke carousel effects
- **next/font** for self-hosted Google Fonts (Space Grotesk, Space Mono,
  Dancing Script, Instrument Serif), tuned per-font with `display: swap`
  or `display: optional` to avoid a visible font-swap flash on the
  hand-lettered wordmark

## Project structure

```
src/
  app/
    page.tsx              Home
    about/                About
    work/                 Work (project index + the pinned "project chain" carousel)
    client-work/           Client Work grid
    concepts/              Concepts grid
    case-study/[slug]/     Dynamic case-study route (see below)
    blog/, article/        Writing index + reader
    lab/, lab-detail/      Experiments index + detail
    contact/               Contact
    loading.tsx            App Router route-transition fallback (real Suspense
                            loading UI, not a fake boot-splash page)
    not-found.tsx          Custom 404
    layout.tsx, globals.css
  components/              Nav, Footer, Reveal, ImageSlot, CameraFrame, etc.
  lib/
    caseStudies.ts         Case-study content, keyed by slug
    writing.ts              Blog/article content
public/
  images/                  Portraits, project screenshots, sigil/logo assets
design-handoff/             Original design reference bundle (see below)
```

### The case-study system

Every project gets its own page at `/case-study/[slug]`, rendered from
[`src/lib/caseStudies.ts`](./src/lib/caseStudies.ts) rather than one
hand-written page per project. Each entry is a slug, title, category,
stack, year, an optional live-site URL, an optional hero screenshot, and
an ordered list of `{ heading, body }` sections (only the sections that
actually apply to that project — there's no forced/empty content). A slug
with no `sections` (currently: Handshakers) renders a plain "full write-up
coming soon" state instead of fabricating detail that doesn't exist yet.
An unknown slug calls `notFound()` and renders the site's 404 page.

### `ImageSlot`

[`src/components/ImageSlot.tsx`](./src/components/ImageSlot.tsx) renders a
real `next/image` when given a `src`, or an on-brand dashed placeholder
labeled with what's expected there when it isn't — so pages can ship with
their layout fully in place before every asset exists. As of this
writing, most portraits and project screenshots are wired to real images;
a few project slots (Handshakers, ChronoVault's case-study screenshots)
are still intentionally on the placeholder because no real asset exists
for them yet — not an oversight.

## Design source

The site originated from a Claude-generated design handoff. See
[`design-handoff/README.md`](./design-handoff/README.md) and
[`design-handoff/chats/chat1.md`](./design-handoff/chats/chat1.md) for the
original design system, decisions, and rationale. A meaningful amount of
content, layout, and interaction has evolved past that original handoff
since (real project case studies, the dynamic case-study route, the
mobile nav, the loading screen, etc.) — the handoff is kept for historical
reference, not as the current source of truth.
