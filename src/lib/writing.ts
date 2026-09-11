export type Platform = "x" | "devto" | "medium";

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
};

export const ARTICLES: Record<string, Article> = {
  constraints: {
    slug: "constraints",
    tag: "Craft",
    platform: "medium",
    title: "Designing with constraints",
    excerpt:
      "Why the best interfaces usually come from the projects with the least room to move.",
    date: "Sep 2026",
    readTime: "6 min",
    externalUrl: "#",
    paragraphs: [
      "Most of my favorite interfaces came out of projects with almost no room to move — a two-week timeline, a component library I couldn't touch, a client who wanted the old flow kept intact. The constraint forces a decision early instead of letting the design drift through ten equally reasonable directions.",
      "Open briefs are the hardest ones. Given a blank canvas and no real limits, I've watched projects circle for weeks on questions that a single technical constraint would have settled in an afternoon. Constraints aren't the enemy of good design — they're usually where it starts.",
      "Take a dashboard redesign I worked on last year. The client's only real requirement was that the existing keyboard shortcuts couldn't change — hundreds of power users relied on them daily. That single rule ruled out three of the five layout directions we'd sketched in week one, and the remaining two turned out to be sharper for it.",
      "The same thing happens with performance budgets. Tell a team they have 400 milliseconds to work with and the debate about which of twelve animation ideas to ship ends almost immediately — most of them were never going to fit anyway.",
      "None of this means constraints are always comfortable. Some of the best work I've shipped came out of arguing with a limitation for a week before finding the version of the idea that actually worked inside it. But I'd rather have that fight than stare at an empty canvas with no walls to push against.",
    ],
  },
  prototypes: {
    slug: "prototypes",
    tag: "Process",
    platform: "devto",
    title: "Why I still hand-code prototypes",
    excerpt: "Static comps lie about motion and real content. Code doesn't let you get away with it.",
    date: "Aug 2026",
    readTime: "4 min",
    externalUrl: "#",
    paragraphs: [
      "A static comp can't tell you how a list behaves with three items versus three hundred, or what a hover state feels like at the actual frame rate a browser renders it at. Every one of those gaps is a decision quietly deferred to whoever builds the real thing.",
      "Coding the prototype closes that gap immediately. It's slower up front, but it means the thing I hand off — or ship myself — has already been through the hard parts once.",
      "It also changes what feedback you get in a review. Show someone a static frame and they'll critique the color of a button. Show them the same button with real data, real loading states, and real latency, and they start asking better questions — about the flow, not the frame.",
      "I still sketch in Figma first. But the moment an interaction depends on timing, state, or how something looks with a hundred real rows instead of three placeholder ones, I move to code — usually faster than redoing the mockup a fourth time.",
    ],
  },
  "shipping-fast": {
    slug: "shipping-fast",
    tag: "Shipping",
    platform: "x",
    title: "Notes on shipping fast",
    excerpt: "A real product in front of real people beats another week of polish in Figma.",
    date: "Jul 2026",
    readTime: "5 min",
    externalUrl: "#",
    paragraphs: [
      "A rough version in front of five real users teaches you more in an afternoon than another week of internal review ever will. Most of the feedback that actually changes a product doesn't show up until someone outside the team tries to use it.",
      "That doesn't mean skipping polish — it means sequencing it after the parts that could still be wrong.",
      "The teams I've seen ship fastest aren't cutting corners — they're just deciding early which corners are load-bearing. A rough onboarding flow in front of real users this week beats a polished one next month, because the flow itself might be wrong in a way no amount of polish would reveal.",
      "Speed also changes morale. Shipping something small and real every week keeps a team anchored to the actual problem, instead of drifting into debates about details nobody outside the room will ever notice.",
    ],
  },
};

export const FEATURED_ORDER = ["constraints", "prototypes", "shipping-fast"];
export const MORE_WRITING_ORDER = ["prototypes", "shipping-fast"];
