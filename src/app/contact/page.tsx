"use client";

import { useState, type FormEvent } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SocialIcon from "@/components/SocialIcon";

const fieldClass =
  "rounded-[10px] border border-accent/15 bg-white/3 px-4 py-3.5 font-grotesk text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(201,243,29,0.15)] placeholder:text-ink/35";
const labelClass = "flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-ink/45 uppercase";
const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";
const asideLabel = "mb-3 font-mono text-[11px] tracking-[0.1em] text-ink/40 uppercase";

const FIELDS = [
  { num: "01", label: "Name" },
  { num: "02", label: "Email" },
  { num: "03", label: "Message" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New message from ${name || "your site"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:gbemidaniel01@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(1400px_900px_at_15%_-10%,#1c1522_0%,#120e17_55%)] font-grotesk text-ink">
      <Nav />

      <div id="main-content" className="min-w-0 flex-1">
        {/* Clip on the full-width section so the glow fades out instead of
            ending where the content box stops — same as Home and About. */}
        <section className="overflow-hidden">
          <div className="relative mx-auto max-w-[1100px] px-8 py-20 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-12">
            <div className="pointer-events-none absolute -top-[120px] -left-[8%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(140,210,60,0.14),transparent_70%)] blur-[50px]" />

            <Reveal className="relative">
              <div className="mb-5 text-[13px] tracking-[0.1em] text-ink/50 uppercase max-[700px]:mb-3">
                Contact
              </div>
              <h1 className="m-0 mb-10 text-[clamp(28px,7vw,50px)] leading-[1.12] font-semibold max-[700px]:mb-6">
                Let&apos;s build something{" "}
                <span className="text-accent [text-shadow:0_0_18px_rgba(201,243,29,0.5)]">
                  timeless
                </span>
                .
              </h1>
            </Reveal>

            <div className="relative grid gap-12 min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] max-[900px]:gap-8">
              {/* The form sits in the same browser-chrome card the project
                  previews use, so it reads as part of the site's furniture. */}
              <Reveal>
                <form onSubmit={onSubmit}>
                  <div className="flex items-center gap-1.5 rounded-t-xl border border-b-0 border-accent/15 bg-band px-3.5 py-2.5">
                    <span className={chromeDot} />
                    <span className={chromeDot} />
                    <span className={chromeDot} />
                  </div>
                  <div className="flex flex-col gap-5 rounded-b-xl border border-t-0 border-accent/15 bg-[rgba(0,0,0,0.12)] p-7 max-[700px]:gap-4 max-[700px]:p-5">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass} htmlFor="name">
                        <span className="text-accent/60">{FIELDS[0].num}</span> {FIELDS[0].label}
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass} htmlFor="email">
                        <span className="text-accent/60">{FIELDS[1].num}</span> {FIELDS[1].label}
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className={fieldClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass} htmlFor="message">
                        <span className="text-accent/60">{FIELDS[2].num}</span> {FIELDS[2].label}
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about your idea"
                        className={`${fieldClass} resize-y`}
                      />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-4">
                      <button
                        type="submit"
                        className="group flex cursor-pointer items-center gap-3 rounded-full bg-accent py-2 pr-6 pl-2 text-bg shadow-[0_0_24px_rgba(201,243,29,0.25)] transition-[box-shadow,opacity] duration-300 hover:opacity-90"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg/15 text-base transition-transform duration-300 group-hover:translate-x-0.5">
                          →
                        </span>
                        <span className="font-mono text-[13px] font-bold tracking-[0.08em]">
                          SEND MESSAGE
                        </span>
                      </button>
                      <span className="font-mono text-[11px] text-ink/35">
                        Opens in your email app
                      </span>
                    </div>
                  </div>
                </form>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-col gap-8 max-[900px]:gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-accent uppercase">
                    Open to work
                  </span>
                </div>

                <div>
                  <div className={asideLabel}>Or email directly</div>
                  <a
                    href="mailto:gbemidaniel01@gmail.com"
                    className="text-[15px] break-all text-ink underline decoration-accent/50 underline-offset-[5px] transition-colors hover:text-accent"
                  >
                    gbemidaniel01@gmail.com
                  </a>
                </div>

                <div>
                  <div className={asideLabel}>Elsewhere</div>
                  <div className="flex gap-3">
                    <SocialIcon network="github" size={36} />
                    <SocialIcon network="x" size={36} />
                    <SocialIcon network="linkedin" size={36} />
                  </div>
                </div>

                <div className="border-t border-accent/12 pt-6 text-sm leading-relaxed text-ink/55">
                  Open to client projects and full-time roles.
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
