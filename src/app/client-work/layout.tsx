import type { Metadata } from "next";

const TITLE = "Collaborations";
const DESCRIPTION =
  "Delivered. Shipped. Still in production. Not solo work — every one of these meant teaming up with someone who knows their own craft.";

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

export default function ClientWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
