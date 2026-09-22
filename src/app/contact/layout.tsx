import type { Metadata } from "next";

const TITLE = "Contact";
const DESCRIPTION =
  "Let's build something timeless. Open to client work and full-time roles — tell me about your idea.";

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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
