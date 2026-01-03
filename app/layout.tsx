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
  title: "Sanjay Mansel | Senior Frontend Engineer & Tech Lead",
  description:
    "13+ years of frontend engineering excellence. Tech Specialist leading teams of 10+ engineers. Expert in React, TypeScript, Node.js, and scalable architecture. Featured work: $1M cost savings, <1s CSV processing of 30K+ rows.",
  keywords: ["Frontend Engineer", "Tech Lead", "React", "TypeScript", "Next.js", "Node.js", "Team Leadership"],
  authors: [{ name: "Sanjay Mansel" }],
  icons: {
    icon: "/ManselIcon.png",
    shortcut: "/ManselIcon.png",
    apple: "/ManselIcon.png",
  },
  openGraph: {
    title: "Sanjay Mansel | Senior Frontend Engineer",
    description:
      "13+ years building high-performance frontend solutions. Tech Lead managing teams and delivering measurable business impact.",
    type: "website",
    url: "https://mansel.co.in",
    images: ["/ManselIcon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanjay Mansel | Senior Frontend Engineer",
    description: "13+ years building high-performance frontend solutions.",
    images: ["/ManselIcon.png"],
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
