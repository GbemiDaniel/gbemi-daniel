export type Platform = "x" | "devto" | "medium" | "linkedin";

export type Article = {
  slug: string;
  tag: string;
  platform: Platform;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  externalUrl: string;
  paragraphs: string[];
  /** The banner image from the original post. Falls back to an empty slot when unset. */
  coverImage?: string;
};

export const ARTICLES: Record<string, Article> = {
  "vibe-coding": {
    slug: "vibe-coding",
    tag: "Web Dev",
    platform: "medium",
    title: "Is Frontend Dead or Evolving? Navigating the Era of \u201CVibe Coding\u201D",
    excerpt:
      "I\u2019ve been writing frontend code long enough to remember the genuine excitement of moving from vanilla JavaScript spaghetti to something structured, component-based, and actually maintainable.",
    date: "Mar 2026",
    readTime: "6 min",
    externalUrl:
      "https://medium.com/@gbemidaniel01/is-frontend-dead-or-evolving-navigating-the-era-of-vibe-coding-b58e72f067a0",
    coverImage: "/images/articles/vibe-coding/cover.png",
    paragraphs: [
      "I\u2019ve been writing frontend code long enough to remember the genuine excitement of moving from vanilla JavaScript spaghetti to something structured, component-based, and actually maintainable. The leap from raw DOM manipulation to React felt like finally being handed the right tools for a job I\u2019d been hacking at with a spoon.",
      "But lately, I\u2019ve been watching a different kind of shift \u2014 and it\u2019s not another framework war or a new CSS methodology. It\u2019s something that genuinely makes me pause when I open LinkedIn and see another \u201CI built a full SaaS with zero coding experience in a weekend\u201D post.",
      "Let me be honest about what I feel when I see those. It\u2019s not quite fear. It\u2019s something more complicated \u2014 like watching someone hotwire a car and asking yourself what driving school was actually for.",
    ],
  },
  "frontend-roadmap": {
    slug: "frontend-roadmap",
    tag: "AI & Frontend",
    platform: "devto",
    title: "AI Can Vibe-Code Now \u2014 So What\u2019s the Actual Frontend Roadmap?",
    excerpt:
      "AI can scaffold a landing page in seconds. But can it handle the messy, human parts of frontend \u2014 accessibility, performance, real-world edge cases? Here\u2019s the roadmap that still matters.",
    date: "Apr 2026",
    readTime: "7 min",
    externalUrl:
      "https://dev.to/devdee/ai-can-vibe-code-now-so-whats-the-actual-frontend-roadmap-1mdc",
    paragraphs: [
      "AI can now scaffold a landing page in seconds. It can generate components, suggest layouts, and even wire up state management with a single prompt. So where does that leave us \u2014 the people who spent years learning to do this by hand?",
      "The short answer: in a better position than you might think. But only if you shift where you spend your attention.",
      "Here\u2019s the thing nobody says out loud: most of what AI generates is good enough to demo, but not good enough to ship. It gets the structure right and the details wrong \u2014 accessibility, performance, edge cases, responsive behavior on the weird screen sizes your PM didn\u2019t think about.",
    ],
  },
  "glassmorphism-performance": {
    slug: "glassmorphism-performance",
    tag: "Performance",
    platform: "linkedin",
    title: "Glassmorphism Performance Cost: A Cautionary Tale",
    excerpt: "Glassmorphism is one of the most seductive design patterns in modern UI.",
    date: "\u2014",
    readTime: "2 min",
    externalUrl: "https://lnkd.in/p/eGMBQMgE",
    coverImage: "https://static.licdn.com/aero-v1/sc/h/c45fy346jw096z9pbphyyhdz7",
    paragraphs: [
      "Glassmorphism is one of the most seductive design patterns in modern UI.",
      "I\u2019ve been drawn to it since before I knew it had a name. That frosted, translucent container that borrows the page\u2019s color, holds its own depth, and somehow makes every layout feel like it belongs to a higher tier. It bends to fit almost anything: B2B SaaS dashboards, Web3 platforms, crypto apps, portfolios.",
      "But here\u2019s what nobody tells you upfront: glassmorphism comes with a real performance cost if implemented carelessly.",
      "I ran into this recently while building a landing page with several glassmorphic cards. Everything looked perfect. I matched the design nearly pixel-for-pixel and moved on. Then I deployed it. On desktop, everything felt fine. On mobile, scrolling through the featured section was noticeably sluggish.",
    ],
  },
  "ai-slop": {
    slug: "ai-slop",
    tag: "Design",
    platform: "linkedin",
    title: "Is AI Slop a Reflection of Our Design Choices?",
    excerpt:
      "\u201CAI slop\u201D is becoming the easiest thing to spot and the easiest thing to criticize.",
    date: "Jun 2026",
    readTime: "2 min",
    externalUrl: "https://lnkd.in/p/eMz34tPJ",
    coverImage:
      "https://media.licdn.com/dms/image/v2/D4E22AQHIXWopx0dmcw/feedshare-shrink_800/B4EZ7wY8_HHsAc-/0/1782149534248?e=2147483647&v=beta&t=EkJGVXBfqTBy1pmg93vmuVajMjW-WIe7Y1MOf5KmGic",
    paragraphs: [
      "\u201CAI slop\u201D is becoming the easiest thing to spot and the easiest thing to criticize.",
      "Every day on X, Reddit, and countless design communities, the conversation keeps resurfacing: the em-dashes, the generic pill buttons, the soft gradients, the \u201Cvibe coded\u201D interfaces that somehow feel familiar before you\u2019ve even interacted with them.",
      "As frontend engineers and UI designers, we all know that feeling when a UI looks technically correct but somehow lacks identity. But here\u2019s the uncomfortable question: are we looking at actual AI slop, or are we simply seeing overused design patterns at scale?",
      "Many of the patterns we criticize today were once considered good design \u2014 clean spacing, rounded components, minimal interfaces, friendly typography, accessible visual hierarchy. None of these are inherently bad. The challenge begins when good design becomes default design, and default design becomes indistinguishable from everyone else\u2019s product.",
    ],
  },
};

export const FEATURED_ORDER = ["vibe-coding", "frontend-roadmap", "glassmorphism-performance", "ai-slop"];
export const MORE_WRITING_ORDER = ["vibe-coding", "frontend-roadmap", "glassmorphism-performance", "ai-slop"];

