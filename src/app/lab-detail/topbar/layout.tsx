import type { Metadata } from "next";

const TITLE = "Lab — Topbar";
const DESCRIPTION =
  "A breakdown of the site's floating top nav: flat-to-frosted scroll, the letter roll, and the Work dropdown's timing.";

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

export default function TopbarDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
