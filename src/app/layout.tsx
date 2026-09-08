import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Gbemi Daniel — Frontend Engineer",
  description:
    "Frontend engineer building interfaces that are engineered as carefully as they're designed.",
  icons: {
    icon: "/images/sigil-d-lime.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${dancingScript.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
