import SocialIcon from "./SocialIcon";

export default function Footer() {
  return (
    <div className="border-t border-accent/12 px-8 py-8 font-grotesk text-ink">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink/40">
          <span>© 2026 Daniel. All rights reserved.</span>
          <div className="flex gap-3">
            <SocialIcon network="github" size={32} />
            <SocialIcon network="x" size={32} />
            <SocialIcon network="linkedin" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
