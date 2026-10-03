import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

// Mirrors public/resume.pdf. When the PDF changes, update this content too —
// the page is the readable version, the PDF is the one people keep.
// The phone number is deliberately left off the web version (it's in the PDF).

type Entry = {
  title: string;
  subtitle: string;
  meta: string;
  dates: string;
  stack?: string;
  live?: string;
  caseStudy?: string;
  points: string[];
};

const EXPERIENCE: Entry[] = [
  {
    title: "Frontend Engineer",
    subtitle: "Freelance and Independent Work",
    meta: "Self-Directed · Nigeria",
    dates: "Dec 2025 – Present",
    points: [
      "Designed and built client-facing websites for real professionals, translating brand briefs and visual identities into deployed, production-ready frontend systems.",
      "Delivered production-ready frontend systems across multiple projects with emphasis on responsive architecture, interaction design, and scalable UI implementation.",
      "Integrated third-party APIs including OMDB, Google Maps, and custom JSON servers, with async state handling, loading states, and error boundaries.",
      "Built and maintained a personal portfolio system used as both a live product showcase and an ongoing design and engineering reference point.",
    ],
  },
  {
    title: "Frontend Engineering Intern",
    subtitle: "Programmify Academy",
    meta: "Nigeria · Team Environment",
    dates: "Nov 2025 – Dec 2025",
    points: [
      "Collaborated with a cross-functional intern team to design and deliver SkillzBloom, a student growth platform helping users track learning progress, manage tasks, and develop practical skills.",
      "Owned and built the Skills module end-to-end, including the acquired skills tracker, skills-in-progress feed, and proficiency dashboard cards displaying real-time user statistics.",
      "Built reusable TypeScript and React components with Tailwind CSS, maintaining visual consistency and code modularity across the platform.",
      "Worked within a Git/GitHub team workflow, raising pull requests, participating in code reviews, and managing feature branches through to merge.",
    ],
  },
];

const PROJECTS: Entry[] = [
  {
    title: "Handshakers",
    subtitle: "Team Time Tracking and Payout Platform",
    meta: "Full-Stack Product Build",
    dates: "Jul 2026 – Sep 2026",
    stack: "React.js, Next.js, Tailwind CSS, Supabase, SWR, Framer Motion",
    caseStudy: "handshakers",
    points: [
      "Built a real-time team time-tracking and payout platform on Next.js and Supabase that logs entries on a shared timeline and calculates each member's prorated payout hours to three decimal places.",
      "Implemented live presence and collision warnings with Supabase Realtime and SWR polling, so teammates see who is logging time and every client stays in sync without manual refreshes.",
      "Secured the app with Supabase Auth, row level security, and admin and member roles, with timeline and pool cap validation and admin rollback of mistaken entries.",
      "Designed a responsive dual-theme interface with a timeline visualizer and an animated stained glass background, and added Vitest tests for the sync hooks and time calculator.",
    ],
  },
  {
    title: "ChronoVault",
    subtitle: "Web3 Digital Time Capsule",
    meta: "Collaborative Project · Frontend Developer",
    dates: "May 2026 – Jun 2026",
    stack: "React.js, Next.js, Tailwind CSS, Framer Motion",
    live: "https://chronovault-mvp.vercel.app",
    caseStudy: "chronovault",
    points: [
      "Delivered a responsive frontend MVP of a Web3 digital time capsule by translating a Figma design into a Next.js application, covering a landing page, a dashboard with a capsule creation flow, an Activity Ledger history page, and settings and notifications pages, all running on simulated vault data.",
      "Built a motion-driven interface with Framer Motion scroll reveals and page-load transitions, plus a CSS keyframe space background that runs outside the React render path.",
      "Structured the app for production with route-level error and loading states, SEO and Open Graph metadata, and deployment on Vercel.",
    ],
  },
  {
    title: "Thrifty",
    subtitle: "Fashion Ecommerce Platform",
    meta: "In Progress · Independent Product Build",
    dates: "Apr 2026 – Present",
    stack: "React.js, Next.js, Tailwind CSS, Supabase, Scalable UI Architecture",
    caseStudy: "thrifty",
    points: [
      "Building a full-stack fashion ecommerce platform on Next.js and Supabase, pairing a storefront with search, filtering, sorting, pagination, and cart and wishlist state with an admin dashboard, all on a scalable component architecture suited for catalog-scale product display.",
      "Built role-based access control with Supabase Auth and Next.js middleware, so only admin accounts can reach the dashboard while customers stay on the storefront.",
      "Built an admin product catalog with create, edit, and delete flows, a rich text description editor, and an image pipeline that compresses uploads in the browser before storing them in Supabase Storage.",
      "Applying product thinking to the build, with information architecture, user flow, and visual hierarchy decisions made with brand alignment and usability in mind.",
    ],
  },
  {
    title: "SkillzBloom",
    subtitle: "Student Growth Platform",
    meta: "Internship Collaboration · Programmify Academy",
    dates: "Nov – Dec 2025",
    stack: "TypeScript, Tailwind CSS, Clerk Auth, Git/GitHub",
    live: "https://skillz-bloom-jade.vercel.app/skills",
    caseStudy: "skillzbloom",
    points: [
      "Built the Skills module end-to-end, including the acquired skills tracker, skills-in-progress feed, and proficiency dashboard cards showing real-time user statistics.",
      "Designed a reusable card component system used across the Overview and Skills pages, maintaining visual consistency throughout the platform.",
      "Collaborated via Git pull requests and code reviews within a structured intern team workflow, shipping to a shared production codebase.",
    ],
  },
];

const SKILLS: [string, string][] = [
  ["Core", "React.js, Next.js, TypeScript, JavaScript (ES6+)"],
  [
    "UI Engineering",
    "Tailwind CSS, Framer Motion, Responsive Design, Component Architecture, Figma-to-Code Implementation",
  ],
  ["Data & State", "REST APIs, Async State Management, React Hooks, Supabase"],
  ["Tooling", "Git, GitHub, Vercel, DevTools"],
];

const sectionLabel =
  "mb-6 border-b border-accent/12 pb-3 font-mono text-[11px] tracking-[0.1em] text-ink/40 uppercase";
const inlineLink =
  "underline decoration-accent/50 underline-offset-[4px] transition-colors hover:text-accent";

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="m-0 text-[18px] leading-snug font-semibold">
          {entry.caseStudy ? (
            <Link href={`/case-study/${entry.caseStudy}`} className="transition-colors hover:text-accent">
              {entry.title}
            </Link>
          ) : (
            entry.title
          )}
          <span className="font-normal text-ink/55"> — {entry.subtitle}</span>
        </h3>
        <span className="font-mono text-[11px] tracking-[0.06em] whitespace-nowrap text-ink/45">
          {entry.dates}
        </span>
      </div>
      <div className="text-[13px] text-ink/50 italic">{entry.meta}</div>
      {(entry.stack || entry.live) && (
        <div className="flex flex-col gap-1 text-[13px] text-ink/60">
          {entry.stack && (
            <div>
              <span className="text-ink/40">Stack: </span>
              {entry.stack}
            </div>
          )}
          {entry.live && (
            <div>
              <span className="text-ink/40">Live: </span>
              <a href={entry.live} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                {entry.live.replace(/^https:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      )}
      <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0">
        {entry.points.map((point) => (
          <li
            key={point}
            className="relative pl-5 text-[15px] leading-relaxed text-ink/75 before:absolute before:top-[0.7em] before:left-0 before:h-[5px] before:w-[5px] before:rounded-full before:bg-accent/70"
          >
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Resume() {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        <section className="overflow-hidden">
          <div className="relative mx-auto max-w-[860px] px-8 py-20 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-12">
            <div className="pointer-events-none absolute -top-[120px] -left-[8%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(140,210,60,0.14),transparent_70%)] blur-[50px]" />

            <Reveal className="relative mb-16 max-[700px]:mb-10">
              <div className="mb-5 text-[13px] tracking-[0.1em] text-ink/50 uppercase max-[700px]:mb-3">
                Résumé
              </div>
              <h1 className="m-0 mb-3 text-[clamp(28px,7vw,50px)] leading-[1.12] font-semibold">
                Olugbemi Daniel Adeiza
              </h1>
              <p className="m-0 mb-2 text-[17px] text-ink/70">
                Frontend Engineer —{" "}
                <span className="text-accent">Translating Identity Into Digital Experiences</span>
              </p>
              <p className="m-0 mb-8 text-[14px] text-ink/50">
                Enugu / Remote · Nigeria ·{" "}
                <a href="mailto:gbemidaniel01@gmail.com" className={inlineLink}>
                  gbemidaniel01@gmail.com
                </a>
              </p>

              {/* Download is the primary action — it's what a recruiter keeps.
                  "Open" hands the same file to the browser's own PDF viewer. */}
              {/* Same pill as Contact's SEND MESSAGE: glyph in a circle, bold mono label.
                  Text colour sits on the spans, not the <a>: globals.css's unlayered
                  `a { color: inherit }` beats Tailwind's text-* utilities on links. */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/resume.pdf"
                  download="Olugbemi-Daniel-Adeiza-Resume.pdf"
                  className="group flex items-center gap-3 rounded-full border border-accent bg-accent py-2 pr-6 pl-2 shadow-[0_0_24px_rgba(201,243,29,0.25)] transition-[box-shadow,opacity] duration-300 hover:opacity-90"
                >
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-base text-black transition-transform duration-300 group-hover:translate-y-0.5 [@media(hover:hover)]:group-hover:[animation:arrowPulse_0.6s_cubic-bezier(0.16,1,0.3,1)_1]"
                  >
                    ↓
                  </span>
                  <span className="font-mono text-[13px] font-bold tracking-[0.08em] text-black">
                    DOWNLOAD PDF
                  </span>
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full border border-accent/30 py-2 pr-6 pl-2 transition-colors duration-300 hover:bg-accent/10"
                >
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-base text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:[animation:arrowPulse_0.6s_cubic-bezier(0.16,1,0.3,1)_1]"
                  >
                    ↗
                  </span>
                  <span className="font-mono text-[13px] font-bold tracking-[0.08em] text-accent">OPEN PDF</span>
                </a>
              </div>
            </Reveal>

            <div className="relative flex flex-col gap-16 max-[700px]:gap-12">
              <Reveal>
                <h2 className={sectionLabel}>Profile</h2>
                <p className="m-0 text-[16px] leading-relaxed text-ink/75">
                  Frontend Engineer specializing in translating brand identity and product direction
                  into intentional, production-ready digital experiences. I work across design and
                  engineering to build interfaces that reflect who a brand is while maintaining
                  usability, clarity, and strong visual direction. My experience spans collaborative
                  internship work, client-facing projects, and independent product development from
                  concept to deployment.
                </p>
              </Reveal>

              <Reveal>
                <h2 className={sectionLabel}>Professional Experience</h2>
                <div className="flex flex-col gap-10">
                  {EXPERIENCE.map((entry) => (
                    <EntryBlock key={entry.title} entry={entry} />
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <h2 className={sectionLabel}>Selected Projects</h2>
                <div className="flex flex-col gap-10">
                  {PROJECTS.map((entry) => (
                    <EntryBlock key={entry.title} entry={entry} />
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <h2 className={sectionLabel}>Skills</h2>
                <dl className="m-0 grid gap-x-8 gap-y-3 text-[15px] min-[700px]:grid-cols-[160px_1fr]">
                  {SKILLS.map(([group, items]) => (
                    <div key={group} className="contents">
                      <dt className="text-ink/45 max-[700px]:mt-2">{group}</dt>
                      <dd className="m-0 leading-relaxed text-ink/75">{items}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal>
                <h2 className={sectionLabel}>Education</h2>
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 text-[18px] font-semibold">BSc Computer Science</h3>
                  <div className="text-[13px] text-ink/50 italic">
                    University of Nigeria, Nsukka (UNN) · Enugu State
                  </div>
                  <p className="m-0 mt-1 text-[14px] leading-relaxed text-ink/60">
                    Relevant coursework: Data Structures and Algorithms, Object-Oriented Programming,
                    Web Development, Database Management Systems
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
