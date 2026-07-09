"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { allGalleryPhotos, lands, medleySrc } from "@/lib/mithila/data";
import { useMithila } from "@/lib/mithila/store";
import { audio } from "@/components/mithila/audio";

export default function MithilaGalleryPage() {
  const photos = useMemo(() => allGalleryPhotos(), []);
  const [active, setActive] = useState<number | null>(null);
  const muted = useMithila((s) => s.muted);

  useEffect(() => {
    audio.setMuted(muted);
    audio.playMusic(medleySrc, { loop: true, volume: 0.7 });
  }, [muted]);

  // unlock document scroll for this route (layout is fixed; we scroll the window)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "auto";
    body.style.overflow = "auto";
    html.style.height = "auto";
    body.style.height = "auto";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      html.style.height = "";
      body.style.height = "";
    };
  }, []);

  // lock body scroll while lightbox is open
  useEffect(() => {
    if (active === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  const byLand = useMemo(() => {
    return lands
      .map((land) => ({
        land,
        photos: photos.filter((p) => p.landIndex === land.index),
      }))
      .filter((g) => g.photos.length > 0);
  }, [photos]);

  const open = active !== null ? photos[active] : null;

  const go = (dir: -1 | 1) => {
    if (active === null) return;
    setActive((active + dir + photos.length) % photos.length);
  };

  return (
    <div
      className="mithila-serif relative min-h-screen w-full"
      style={{
        color: "#f5f0e8",
        background: "radial-gradient(ellipse at 50% 0%, #2a1a3f 0%, #1a120c 40%, #0c0908 100%)",
      }}
    >
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 backdrop-blur-md"
        style={{ background: "rgba(12,9,8,0.9)", borderBottom: "1px solid rgba(240,184,102,0.2)" }}
      >
        <Link
          href="/mithila"
          className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase"
          style={{ color: "#f0b866" }}
        >
          <ArrowLeft size={14} /> back to the walk
        </Link>
        <div className="text-xs tracking-[0.25em] uppercase" style={{ opacity: 0.55 }}>
          {photos.length} memories
        </div>
      </div>

      <header className="px-6 pt-10 pb-8 text-center">
        <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ opacity: 0.45 }}>
          the long walk home
        </p>
        <h1 className="italic text-3xl md:text-4xl" style={{ color: "#f0b866" }}>
          Our photos
        </h1>
        <p className="mt-3 text-sm italic max-w-md mx-auto" style={{ opacity: 0.65 }}>
          Every frame from the road — tap any one to look closer.
        </p>
      </header>

      <div className="px-4 pb-28 max-w-3xl mx-auto space-y-10">
        {byLand.map(({ land, photos: group }) => (
          <section key={land.id}>
            <div className="mb-3 flex items-baseline justify-between px-1">
              <h2 className="italic text-xl" style={{ color: land.accent }}>
                {land.title}
              </h2>
              <span className="text-xs tracking-widest" style={{ opacity: 0.45 }}>
                {land.years}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {group.map((p) => {
                const idx = photos.findIndex((x) => x.src === p.src);
                return (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setActive(idx)}
                    className="relative aspect-square overflow-hidden rounded-lg"
                    style={{ border: "1px solid rgba(245,240,232,0.1)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.caption || land.title} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {open && active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "rgba(4,5,16,0.94)" }}
          >
            <div className="flex items-center justify-between px-4 py-4 shrink-0">
              <div className="min-w-0">
                <div className="italic text-lg truncate" style={{ color: "#f0b866" }}>
                  {open.landTitle}
                </div>
                <div className="text-xs tracking-widest" style={{ opacity: 0.5 }}>
                  {open.years}
                  {open.caption ? ` · ${open.caption}` : ""}
                </div>
              </div>
              <button
                type="button"
                aria-label="close"
                onClick={() => setActive(null)}
                className="rounded-full p-3 shrink-0"
                style={{ background: "rgba(245,240,232,0.08)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center px-12 pb-8 min-h-0">
              <button
                type="button"
                aria-label="previous"
                onClick={() => go(-1)}
                className="absolute left-2 rounded-full p-3 z-10"
                style={{ background: "rgba(245,240,232,0.08)" }}
              >
                <ChevronLeft size={22} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={open.src}
                alt={open.caption || open.landTitle}
                className="max-h-full max-w-full object-contain rounded-xl"
                style={{ boxShadow: "0 0 60px rgba(240,184,102,0.2)" }}
              />
              <button
                type="button"
                aria-label="next"
                onClick={() => go(1)}
                className="absolute right-2 rounded-full p-3 z-10"
                style={{ background: "rgba(245,240,232,0.08)" }}
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <p className="text-center text-xs pb-6 tracking-widest shrink-0" style={{ opacity: 0.45 }}>
              {active + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
