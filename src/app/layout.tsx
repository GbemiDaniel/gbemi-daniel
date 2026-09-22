import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Dancing_Script, Instrument_Serif } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
  display: "optional",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "optional",
});

const SITE_NAME = "Gbemi Daniel";
const SITE_DESCRIPTION =
  "Frontend engineer building interfaces that are engineered as carefully as they're designed.";

export const metadata: Metadata = {
  metadataBase: new URL("https://gbemidaniel.vercel.app"),
  title: {
    default: "Gbemi Daniel — Frontend Engineer",
    template: "%s | Gbemi Daniel",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/images/sigil-d-lime.png",
  },
  openGraph: {
    title: "Gbemi Daniel — Frontend Engineer",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gbemi Daniel — Frontend Engineer",
    description: SITE_DESCRIPTION,
    creator: "@adamsdaniel043",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${dancingScript.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
