import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SocialIcon from "@/components/SocialIcon";
import ContactForm from "./ContactForm";

const asideLabel = "mb-3 font-mono text-[11px] tracking-[0.1em] text-ink/40 uppercase";

export default function Contact() {
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
                <ContactForm />
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
