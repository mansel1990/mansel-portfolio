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
  title: "The Long Walk Home",
  description: "A road made for one person.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: { title: "The Long Walk Home", description: "A road made for one person." },
};

export const viewport: Viewport = {
  themeColor: "#1a120c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function MithilaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} mithila-serif min-h-screen w-full`}
      style={{ background: "radial-gradient(ellipse at 50% 110%, #5c3a28 0%, #1a120c 50%, #0c0908 100%)" }}
    >
      {children}
    </div>
  );
}
