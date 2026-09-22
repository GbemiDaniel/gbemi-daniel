import type { Metadata } from "next";

const TITLE = "Work";
const DESCRIPTION =
  "Some of this is mine. The rest, I built for people I worked with — real projects, shipped and live.";

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

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
