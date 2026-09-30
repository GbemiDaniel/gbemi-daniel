import type { Metadata } from "next";

const TITLE = "Résumé";
const DESCRIPTION =
  "Olugbemi Daniel Adeiza — Frontend Engineer. Experience, selected projects, skills and education, with a downloadable PDF.";

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

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
