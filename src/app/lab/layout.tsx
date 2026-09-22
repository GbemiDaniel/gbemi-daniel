import type { Metadata } from "next";

const TITLE = "Lab";
const DESCRIPTION =
  "A notebook of interfaces, mid-thought. Small components, interaction studies, and design-system experiments — some finished, some just proof a hunch works.";

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

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
