"use client";

import { useState, type FormEvent } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SocialIcon from "@/components/SocialIcon";

const fieldClass =
  "rounded-[10px] border border-accent/15 bg-white/3 px-4 py-3.5 font-grotesk text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(201,243,29,0.15)] placeholder:text-ink/35";

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
        <section className="mx-auto max-w-[900px] px-8 py-20 max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-12">
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

          <div
            className="grid gap-14 max-[700px]:gap-8"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}
          >
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-[0.05em] text-ink/50 uppercase">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-[0.05em] text-ink/50 uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-[0.05em] text-ink/50 uppercase">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project"
                  className={`${fieldClass} resize-y`}
                />
              </div>
              <button
                type="submit"
                className="self-start rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-bg shadow-[0_0_24px_rgba(201,243,29,0.35)] transition-colors hover:bg-ink"
              >
                Send Message
              </button>
            </form>

            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2.5 text-xs tracking-[0.05em] text-ink/50 uppercase">Email</div>
                <a
                  href="mailto:gbemidaniel01@gmail.com"
                  className="text-lg text-accent underline underline-offset-4"
                >
                  gbemidaniel01@gmail.com
                </a>
              </div>
              <div>
                <div className="mb-2.5 text-xs tracking-[0.05em] text-ink/50 uppercase">
                  Elsewhere
                </div>
                <div className="flex gap-3">
                  <SocialIcon network="github" size={36} />
                  <SocialIcon network="x" size={36} />
                  <SocialIcon network="linkedin" size={36} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
