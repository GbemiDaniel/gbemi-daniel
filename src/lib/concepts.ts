import type { Gallery } from "./caseStudies";

export type ConceptSection = {
  heading: string;
  body: string;
};

export type ConceptProject = {
  slug: string;
  title: string;
  /** Short blurb shown on the /concepts grid card. */
  description: string;
  /** Shown in the mono label, e.g. "Prototype", "Experiment". */
  category: string;
  /** Tech tags shown as pills on the card and detail page. */
  tagList: string[];
  year: string;
  liveUrl?: string;
  /**
   * CSS rotation applied to the card on the /concepts grid, e.g. "-0.8deg".
   * Keeps the hand-pinned aesthetic consistent with the design.
   */
  rot: string;
  /** Hero + per-device screen gallery on the detail page. */
  gallery?: Gallery;
  /** Feature close-ups shown after the write-up, same as case studies. */
  features?: Gallery;
  sections: ConceptSection[];
};

export const CONCEPTS: Record<string, ConceptProject> = {
  still: {
    slug: "still",
    title: "Still",
    description:
      "A breathing guide with one warm light: hold to breathe in, let go to breathe out, no account required.",
    category: "Tool",
    tagList: ["TypeScript", "WebGL", "Vite", "Web Audio API", "PWA"],
    year: "2026",
    liveUrl: "https://still-seven-xi.vercel.app",
    rot: "-0.8deg",
    gallery: {
      desktop: [
        { src: "/images/concepts/still/free.webp", label: "Free" },
        { src: "/images/concepts/still/guided-setup.webp", label: "Guided Setup" },
        { src: "/images/concepts/still/timer.webp", label: "Timer" },
        { src: "/images/concepts/still/find-my-pace.webp", label: "Find My Pace" },
      ],
      mobile: [
        { src: "/images/concepts/still/mobile-free.webp", label: "Free" },
        { src: "/images/concepts/still/mobile-guided-setup.webp", label: "Guided Setup" },
        { src: "/images/concepts/still/mobile-timer.webp", label: "Timer" },
        { src: "/images/concepts/still/mobile-find-my-pace.webp", label: "Find My Pace" },
      ],
    },
    features: {
      desktop: [
        { src: "/images/concepts/still/pace-editor.webp", label: "Pace Editor" },
        { src: "/images/concepts/still/options-sheet.webp", label: "Options" },
        { src: "/images/concepts/still/welcome.webp", label: "Welcome" },
      ],
      mobile: [
        { src: "/images/concepts/still/mobile-pace-editor.webp", label: "Pace Editor" },
        { src: "/images/concepts/still/mobile-options-sheet.webp", label: "Options" },
        { src: "/images/concepts/still/mobile-welcome.webp", label: "Welcome" },
      ],
    },
    sections: [
      {
        heading: "The Idea",
        body: "I wanted the simplest possible version of a breathing guide: one that opens instantly, needs no setup, and looks as calm as it is supposed to feel. The whole premise is a single light that responds to touch — hold anywhere to breathe in, let go to breathe out.",
      },
      {
        heading: "Approach",
        body: "The visual is two full-screen WebGL fragment shaders: a low-resolution haze pass upsampled into a full-resolution pass that adds the warm light, vignette, and filmic tone curve. A film grain layer runs above the canvas as a compositor-only CSS element so it never affects shader cost. A spring carries the breath value — different damping for inhale and exhale so the settle feels like a real breath rather than a symmetric tween. An adaptive quality governor measures frame time and steps resolution down in four levels, deciding on the median to avoid reacting to load-time stalls.",
      },
      {
        heading: "What I Built",
        body: "Beyond the free mode, there is a guided mode where a timeline eases your rhythm toward a chosen pace over the first third of a session, watching for signs you are struggling and holding steady rather than pushing on. 'Find my pace' times your own breath over four presses and suggests a slightly slower starting point. Sound is synthesised on demand — a soft open fifth whose pitch tracks the breath — and never created until the toggle is switched on. The pace, natural in/out timing, and chosen session length are the only things stored, in localStorage, on that device only; the page's CSP enforces this.",
      },
      {
        heading: "Outcome",
        body: "It is deployed and installable as a PWA, works offline, and runs at 60 fps on a throttled mid-range profile. It has not yet been tested on a real phone, which is the honest next step — haptics, thumb hold through a full breath, and whether the ease-in pace actually feels gradual.",
      },
    ],
  },
};
