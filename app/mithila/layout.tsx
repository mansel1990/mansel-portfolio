import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./mithila.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Written in the Stars",
  description: "A sky made for one person.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: "Written in the Stars", description: "A sky made for one person." },
};

export const viewport: Viewport = {
  themeColor: "#07091c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function MithilaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} fixed inset-0 overflow-hidden`}
      style={{ background: "radial-gradient(ellipse at 50% 120%, #141a45 0%, #0b0e2a 45%, #050614 100%)" }}
    >
      {children}
    </div>
  );
}
