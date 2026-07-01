import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mansel.co.in"),
  title: "Sanjay Mansel | AI-Augmented Full-Stack Engineer & Tech Lead",
  description:
    "13+ years building and scaling product teams across React, Node.js, and TypeScript. Tech Lead driving AI-native delivery with agentic coding tools and spec-driven workflows — 65% faster cycle time, 8-engineer team, 4-month PWA launch.",
  keywords: ["Full-Stack Engineer", "Tech Lead", "AI-Native Development", "Claude Code", "React", "TypeScript", "Next.js", "Node.js", "Team Leadership"],
  authors: [{ name: "Sanjay Mansel" }],
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Sanjay Mansel | AI-Augmented Full-Stack Engineer & Tech Lead",
    description:
      "13+ years building and scaling product teams. Tech Lead leading AI-native delivery — agentic coding tools, spec-driven workflows, and full-stack ownership from architecture to production.",
    type: "website",
    url: "https://mansel.co.in",
    images: [{ url: "/icon.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjay Mansel | AI-Augmented Full-Stack Engineer & Tech Lead",
    description: "13+ years building and scaling product teams with AI-native delivery.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <GoogleAnalytics gaId="G-YD7G4ZCQQJ" />
      </body>
    </html>
  );
}
