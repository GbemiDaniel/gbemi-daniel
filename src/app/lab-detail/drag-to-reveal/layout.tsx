import type { Metadata } from "next";

const TITLE = "Lab — Drag-to-Reveal";
const DESCRIPTION =
  "A breakdown of a drag-to-reveal control on a real damped spring: the physics, the threshold logic, and a live tuner.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function DragRevealDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
