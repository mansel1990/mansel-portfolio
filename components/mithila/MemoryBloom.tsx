"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Land } from "@/lib/mithila/data";
import { useMithila } from "@/lib/mithila/store";
import { X, ChevronLeft, ChevronRight, Music } from "lucide-react";

// Photo gallery for a land (the medley keeps playing underneath).
export default function MemoryBloom({ land }: { land: Land }) {
  const closeOverlay = useMithila((s) => s.closeOverlay);
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const n = land.photos.length;

  const go = (dir: number) => setI((v) => (v + dir + n) % n);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-40 flex flex-col"
      style={{ background: "rgba(4,5,16,0.82)", backdropFilter: "blur(8px)" }}
    >
      {/* header */}
      <div className="flex items-start justify-between px-5 pt-5 md:px-8">
        <div>
          <h2 className="italic text-2xl md:text-3xl" style={{ color: "#f0b866" }}>
            {land.title}
          </h2>
          <div className="text-xs tracking-[0.3em] uppercase mt-1" style={{ opacity: 0.55 }}>
            {land.years} · {land.places.join(" · ")}
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm italic" style={{ opacity: 0.7 }}>
            <Music size={13} /> the song of this land: {land.song.title}
          </div>
        </div>
        <button
          aria-label="back to the road"
          onClick={closeOverlay}
          className="rounded-full p-3 shrink-0"
          style={{ background: "rgba(245,240,232,0.08)", border: "1px solid rgba(245,240,232,0.15)" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* 3D fan carousel */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden"
        style={{ perspective: 1100 }}
        onTouchStart={(e) => setDrag(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (drag === null) return;
          const dx = e.changedTouches[0].clientX - drag;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          setDrag(null);
        }}
      >
        {land.photos.map((ph, k) => {
          let off = k - i;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const visible = Math.abs(off) <= 2;
          return (
            <motion.div
              key={ph.src + k}
              className="absolute"
              animate={{
                x: off * (typeof window !== "undefined" && window.innerWidth < 500 ? 120 : 230),
                rotateY: off * -28,
                scale: off === 0 ? 1 : 0.72,
                opacity: visible ? (off === 0 ? 1 : 0.35) : 0,
                zIndex: 10 - Math.abs(off),
              }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              style={{ transformStyle: "preserve-3d", pointerEvents: off === 0 ? "auto" : "none" }}
              onClick={() => off === 0 && setFull(true)}
            >
              <div
                className="rounded-lg p-2 pb-8 md:p-3 md:pb-10"
                style={{
                  background: "#f5f0e8",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(240,184,102,0.12)",
                  transform: `rotate(${(k % 3) - 1}deg)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ph.src}
                  alt={ph.caption || land.title}
                  className="block object-cover rounded-sm"
                  style={{ width: "min(66vw, 380px)", height: "min(50vh, 380px)" }}
                  loading={visible ? "eager" : "lazy"}
                  draggable={false}
                />
                {ph.caption && (
                  <div className="mithila-serif italic text-center mt-2 text-sm" style={{ color: "#3a3428" }}>
                    {ph.caption}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {n > 1 && (
          <>
            <button aria-label="previous" onClick={() => go(-1)} className="absolute left-2 md:left-6 z-20 rounded-full p-3" style={{ background: "rgba(245,240,232,0.08)" }}>
              <ChevronLeft size={20} />
            </button>
            <button aria-label="next" onClick={() => go(1)} className="absolute right-2 md:right-6 z-20 rounded-full p-3" style={{ background: "rgba(245,240,232,0.08)" }}>
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* footer */}
      <div className="pb-6 text-center">
        <div className="text-xs tracking-[0.3em]" style={{ opacity: 0.5 }}>
          {i + 1} / {n}
        </div>
        <button className="mithila-btn-ghost mt-3" onClick={closeOverlay}>
          back to the road ✦
        </button>
      </div>

      {/* fullscreen viewer */}
      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(2,3,10,0.96)" }}
            onClick={() => setFull(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={land.photos[i].src} alt="" className="max-w-full max-h-full object-contain" style={{ padding: 12 }} />
            {land.photos[i].caption && (
              <div className="absolute bottom-8 left-0 right-0 text-center italic" style={{ opacity: 0.85 }}>
                {land.photos[i].caption}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
