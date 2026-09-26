"use client";

import { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <span
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-7 bottom-7 z-60 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-accent text-base text-bg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] transition-opacity duration-250 [@media(hover:hover)]:hover:animate-[arrowPulse_0.6s_cubic-bezier(0.16,1,0.3,1)_1]"
      style={{ opacity: showTop ? 1 : 0, pointerEvents: showTop ? "auto" : "none" }}
    >
      ↑
    </span>
  );
}
