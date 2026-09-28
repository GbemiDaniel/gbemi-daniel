import type { Metadata } from "next";

const TITLE = "Lab — Rail";
const DESCRIPTION =
  "A breakdown of the site's floating sidebar nav: the letter roll, the opening cascade, and why it opens when it does.";

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

export default function RailDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
