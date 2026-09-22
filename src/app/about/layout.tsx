import type { Metadata } from "next";

const TITLE = "About";
const DESCRIPTION =
  "From ideas to products — built to standard, built for real users. I'm Daniel, a frontend engineer with a creative, problem-solving approach.";

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

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
