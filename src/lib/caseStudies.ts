export type CaseStudySection = {
  heading: string;
  body: string;
};

export type Screen = {
  src: string;
  /** Page name shown in the switcher, e.g. "Home", "Shop", "Dashboard". */
  label: string;
};

export type Gallery = {
  desktop: Screen[];
  /** Optional — the device toggle only appears when this has screens. */
  mobile?: Screen[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  stack: string[];
  year: string;
  liveUrl?: string;
  /**
   * Screens per device. Add a page by appending to a list — the page
   * switcher appears automatically once a device has more than one.
   */
  gallery?: Gallery;
  /** Close-ups of specific features, shown as their own gallery after the write-up. */
  features?: Gallery;
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
    gallery: {
      desktop: [
        { src: "/images/projects/security-engineer-portfolio/desktop.png", label: "Home" },
        { src: "/images/projects/security-engineer-portfolio/loader.png", label: "Loader" },
      ],
      mobile: [{ src: "/images/projects/security-engineer-portfolio/mobile.png", label: "Home" }],
    },
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
    gallery: {
      desktop: [{ src: "/images/projects/dice-portfolio/desktop.png", label: "Home" }],
      mobile: [
        { src: "/images/projects/dice-portfolio/mobile.png", label: "Home" },
        { src: "/images/projects/dice-portfolio/mobile-loader.png", label: "Loader" },
      ],
    },
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
    gallery: {
      desktop: [{ src: "/images/projects/skillzbloom/desktop.png", label: "Home" }],
      mobile: [{ src: "/images/projects/skillzbloom/mobile.png", label: "Home" }],
    },
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
    gallery: {
      desktop: [
        { src: "/images/projects/chronovault/chronovault.png", label: "Home" },
        { src: "/images/projects/chronovault/dashboard.png", label: "Dashboard" },
        { src: "/images/projects/chronovault/create-capsule.png", label: "Create Capsule" },
        { src: "/images/projects/chronovault/capsule-locked-success.png", label: "Capsule Locked" },
      ],
      mobile: [
        { src: "/images/projects/chronovault/mobile-chronovault.png", label: "Home" },
        { src: "/images/projects/chronovault/mobile-dashboard.png", label: "Dashboard" },
        { src: "/images/projects/chronovault/mobile-create-capsule.png", label: "Create Capsule" },
        { src: "/images/projects/chronovault/mobile-capsule-locked-success.png", label: "Capsule Locked" },
      ],
    },
    features: {
      desktop: [
        { src: "/images/projects/chronovault/features/activity-ledger.png", label: "Activity Ledger" },
        { src: "/images/projects/chronovault/features/dashboard-with-filtered-locked-capsules.png", label: "Capsule Filters" },
        { src: "/images/projects/chronovault/features/notifications.png", label: "Notifications" },
      ],
      mobile: [
        { src: "/images/projects/chronovault/features/mobile-activity-ledger.png", label: "Activity Ledger" },
        { src: "/images/projects/chronovault/features/mobile-dashbaord-with-filtered-time-capsules.png", label: "Capsule Filters" },
        { src: "/images/projects/chronovault/features/mobile-notification.png", label: "Notifications" },
        { src: "/images/projects/chronovault/features/mobile-connect-wallet.png", label: "Connect Wallet" },
      ],
    },
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
    gallery: {
      desktop: [{ src: "/images/projects/thrifty/desktop.png", label: "Home" }],
      mobile: [{ src: "/images/projects/thrifty/mobile.png", label: "Home" }],
    },
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
    stack: ["Next.js", "Supabase", "Tailwind CSS"],
    year: "2026",
    liveUrl: "https://handshakers.vercel.app",
    gallery: {
      desktop: [
        { src: "/images/projects/handshakers/desktop.png", label: "Home" },
        { src: "/images/projects/handshakers/dashboard.png", label: "Dashboard" },
        { src: "/images/projects/handshakers/workspace.png", label: "Workspace" },
      ],
      mobile: [
        { src: "/images/projects/handshakers/mobile.png", label: "Home" },
        { src: "/images/projects/handshakers/mobile-dashboard.png", label: "Dashboard" },
        { src: "/images/projects/handshakers/mobile-workspace.png", label: "Workspace" },
      ],
    },
    features: {
      desktop: [
        { src: "/images/projects/handshakers/features/relay-timeline.png", label: "Relay Timeline" },
        { src: "/images/projects/handshakers/features/timeline.png", label: "Team Timeline" },
        { src: "/images/projects/handshakers/features/task-aggregator.png", label: "Task Aggregator" },
        { src: "/images/projects/handshakers/features/payout-calculator.png", label: "Payout Calculator" },
        { src: "/images/projects/handshakers/features/auth.png", label: "Sign In" },
      ],
      mobile: [
        { src: "/images/projects/handshakers/features/mobile-relay-timeline-feature.png", label: "Relay Timeline" },
        { src: "/images/projects/handshakers/features/mobile-timeline.png", label: "Team Timeline" },
        { src: "/images/projects/handshakers/features/mobile-task-aggregator.png", label: "Task Aggregator" },
        { src: "/images/projects/handshakers/features/mobile-payout-calculator.png", label: "Payout Calculator" },
        { src: "/images/projects/handshakers/features/mobile-auth.png", label: "Sign In" },
        { src: "/images/projects/handshakers/features/mobile-payout-report.png", label: "Payout Report" },
      ],
    },
    sections: [
      {
        heading: "The Brief",
        body: "Handshakers started from a specific, real problem: teams that share a single account on a platform — a common setup for contractor pools — have no fair way to split what that account earns. Whoever logs the most convincingly wins, not whoever actually worked the hours. I wanted a tool that made the split honest by construction, not by trust.",
      },
      {
        heading: "Thinking & Approach",
        body: "The payout math itself is simple — each person's share of the total logged time, applied against whatever the platform actually reported paying out, so a shortfall adjusts everyone down proportionally instead of landing on one person. The harder problem was making the underlying log impossible to game. Every entry is a relay: a new log's start time locks to the previous one's stop time, so there's no way to log a gap that inflates your hours or a range that overlaps someone else's.",
      },
      {
        heading: "Custom Components",
        body: "Two people sharing one clock meant collisions were the real engineering problem, not the UI. A live presence channel broadcasts when someone's actively typing a stop time, so teammates see the field lock in real time instead of racing to submit first — and because a UI lock alone isn't enough, every submission also runs a pre-flight check against the database's actual latest entry before writing, aborting with a timeline-collision warning if someone snuck a log in first.",
      },
      {
        heading: "Outcome",
        body: "A shared account that used to run on trust now runs on a timeline nobody can quietly bend.",
      },
    ],
  },
};
