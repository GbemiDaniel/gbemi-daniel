"use client";

import { useState, type FormEvent } from "react";

const fieldClass =
  "rounded-[10px] border border-accent/15 bg-white/3 px-4 py-3.5 font-grotesk text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(201,243,29,0.15)] placeholder:text-ink/35";
const labelClass = "flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-ink/45 uppercase";
const chromeDot = "h-[7px] w-[7px] rounded-full bg-ink/20";

const FIELDS = [
  { num: "01", label: "Name" },
  { num: "02", label: "Email" },
  { num: "03", label: "Message" },
];

export default function ContactForm() {
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
  );
}
