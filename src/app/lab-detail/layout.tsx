import type { Metadata } from "next";

const TITLE = "Lab — Experiment Detail";
const DESCRIPTION = "A closer look at one of the interaction studies from the Lab.";

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

export default function LabDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
