export type CaseStudySection = {
  heading: string;
  body: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  stack: string[];
  year: string;
  liveUrl?: string;
  heroImage?: string;
  sections: CaseStudySection[];
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "security-engineer-portfolio": {
    slug: "security-engineer-portfolio",
    title: "Security Engineer Portfolio",
    category: "Collab",
    stack: ["React", "Tailwind CSS", "Framer Motion"],
    year: "2026",
    liveUrl: "https://okoh-bernard-portfolio.vercel.app/",
    heroImage: "/images/projects/security-engineer-portfolio/desktop.png",
    sections: [
      {
        heading: "The Brief",
        body: "He needed a personal site that did more than list credentials — it needed to feel like proof of the work itself. Security research lives in precision and restraint; the site had to carry that same weight without tipping into a stereotypical 'hacker' look.",
      },
      {
        heading: "Color & Visual Identity",
        body: "A dark backdrop, a glowing green ring around the profile photo, and monospace terminal-style headers (>_ Pentest —) that signal technical credibility the moment the page loads.",
      },
      {
        heading: "Custom Components",
        body: "Faint terminal-bracket and code-fragment details sit quietly in the background — present enough to reinforce the theme, restrained enough to stay out of the way of the actual content: credentials, write-ups, and how to get in touch.",
      },
      {
        heading: "Outcome",
        body: "A site that reads as credible on load, no explaining needed.",
      },
    ],
  },
  "dice-portfolio": {
    slug: "dice-portfolio",
    title: "Dice Portfolio",
    category: "Collab",
    stack: ["React", "Tailwind CSS", "Responsive UI Systems"],
    year: "2026",
    liveUrl: "https://dice-portfolio.vercel.app/",
    heroImage: "/images/projects/dice-portfolio/desktop.png",
    sections: [
      {
        heading: "The Brief",
        body: "A brand and product designer needed his own visual direction — the identity he'd already defined for himself — translated into a real, responsive site, not just a static comp.",
      },
      {
        heading: "Thinking & Approach",
        body: "The job here wasn't originating a look, it was fidelity: making sure every spacing decision, type choice, and motion cue matched his own direction exactly, across every screen size.",
      },
      {
        heading: "Custom Components",
        body: "Once the fidelity work was solid, I extended the build with interaction patterns beyond the original brief — small motion and hover details that weren't asked for, but showed the difference between a coded comp and a finished product.",
      },
      {
        heading: "Outcome",
        body: "A site that reads as exactly what he designed, plus a few things he didn't expect.",
      },
    ],
  },
  skillzbloom: {
    slug: "skillzbloom",
    title: "SkillzBloom",
    category: "Team Project",
    stack: ["TypeScript", "Tailwind CSS", "Clerk Auth"],
    year: "2025",
    liveUrl: "https://skillz-bloom-jade.vercel.app/skills",
    heroImage: "/images/projects/skillzbloom/desktop.png",
    sections: [
      {
        heading: "The Brief",
        body: "Part of a small team building a platform to help students track their own learning. My piece: the Skills module — where a user sees what they've learned, what they're working on, and how they're progressing.",
      },
      {
        heading: "Thinking & Approach",
        body: "Working inside a team meant the module couldn't just work well on its own — it had to feel like it belonged to the same product everyone else was building, reviewed through shared pull requests.",
      },
      {
        heading: "Custom Components",
        body: "A reusable card system (acquired-skills tracker, in-progress feed, proficiency dashboard) built to drop into other parts of the app without rework.",
      },
      {
        heading: "Outcome",
        body: "A module owned start to finish, shipped into a real shared codebase.",
      },
    ],
  },
  chronovault: {
    slug: "chronovault",
    title: "ChronoVault",
    category: "Collab",
    stack: ["React", "Tailwind CSS", "Framer Motion"],
    year: "2026",
    liveUrl: "https://chronovault-mvp.vercel.app",
    sections: [
      {
        heading: "The Brief",
        body: "A collaborator had an idea and a Figma design for a Web3 'time capsule' — a way to lock away digital assets and memories until a future date. The interface needed to make an abstract, technical concept feel tangible, even a little emotional.",
      },
      {
        heading: "Thinking & Approach",
        body: "The real challenge was performance without losing atmosphere: a full ambient starfield running behind every interaction, without ever feeling sluggish.",
      },
      {
        heading: "Custom Components",
        body: "A dual-vault system for private time-locks or scheduled inheritances, hydration-triggered zoom mounts, state-synchronized spotlight effects, and a space canvas built entirely in CSS keyframes to hold 60fps.",
      },
      {
        heading: "Outcome",
        body: "A concept that started as a Figma file now runs, live, in the browser.",
      },
    ],
  },
  thrifty: {
    slug: "thrifty",
    title: "Thrifty",
    category: "Collab",
    stack: ["React", "Next.js", "Tailwind CSS"],
    year: "2026",
    heroImage: "/images/projects/thrifty/desktop.png",
    sections: [
      {
        heading: "The Brief",
        body: "Turning a collaborator's ecommerce design into a real storefront — built to hold up at catalog scale, not just for a handful of demo products.",
      },
      {
        heading: "Thinking & Approach",
        body: "Ecommerce lives or dies on information architecture: how products group, how categories nest, how a shopper actually finds what they want. Those decisions shaped the component structure from the start.",
      },
      {
        heading: "Custom Components",
        body: "A scalable product-card and category system designed to keep working whether the catalog has ten items or ten thousand.",
      },
      {
        heading: "Outcome",
        body: "A shopping experience that feels premium without feeling templated.",
      },
    ],
  },
  handshakers: {
    slug: "handshakers",
    title: "Handshakers",
    category: "Independent",
    stack: [],
    year: "—",
    sections: [],
  },
};
