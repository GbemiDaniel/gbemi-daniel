# Gbemi Daniel — Portfolio

Next.js (App Router) + TypeScript implementation of the "Afterhours" portfolio
redesign, built from the Claude Design handoff in [`design-handoff/`](./design-handoff).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Status

Implemented so far: shared `Nav` (desktop sidebar / mobile hamburger),
`Footer`, `SocialIcon`, and the Home page. Remaining pages (Work, About,
Blog/Article, Case-Study, Client-Work, Concepts, Contact, Lab, Lab-Detail,
404, Loading) are still in `design-handoff/project/*.dc.html` and have not
been ported yet.

Images use an on-brand placeholder (`ImageSlot` with no `src`) until real
photos/screenshots are supplied — pass a `src` to swap one in.

## Design source

See [`design-handoff/README.md`](./design-handoff/README.md) and
[`design-handoff/chats/chat1.md`](./design-handoff/chats/chat1.md) for the
full design system, decisions, and rationale.
