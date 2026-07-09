"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gate } from "@/lib/mithila/data";
import { matchGate } from "@/lib/mithila/fuzzy";
import { useMithila } from "@/lib/mithila/store";

export default function Gate() {
  const unlock = useMithila((s) => s.unlock);
  const [value, setValue] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [shiver, setShiver] = useState(false);
  const [opening, setOpening] = useState(false);

  const submit = () => {
    if (opening) return;
    if (matchGate(value, gate.contains)) {
      setOpening(true);
      if (navigator.vibrate) navigator.vibrate([30, 40, 80]);
      setTimeout(unlock, 2600);
    } else {
      setWrongCount((c) => c + 1);
      setShiver(true);
      setTimeout(() => setShiver(false), 500);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 overflow-hidden">
      {/* purple → dawn wash */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #3a1f5c 0%, #1a0f2e 45%, #0a0614 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, #ffb98a 0%, #e8935a 22%, #5c3a28 55%, #1a120c 78%, #0c0908 100%)",
        }}
      />

      {/* soft path / horizon silhouette */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none">
        <div
          className="absolute inset-x-[-10%] bottom-0 h-full"
          style={{
            background:
              "linear-gradient(to top, rgba(26,18,12,0.95) 0%, rgba(90,58,40,0.55) 40%, transparent 100%)",
          }}
        />
        <svg
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[140%] max-w-none opacity-40"
          viewBox="0 0 800 120"
          fill="none"
        >
          <path
            d="M0 90 C120 70 180 95 280 75 C380 55 420 85 520 70 C620 55 700 80 800 65 L800 120 L0 120 Z"
            fill="#2a1a12"
          />
          <path
            d="M280 75 Q400 40 520 70"
            stroke="#f0b866"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
        {/* floating coin accents */}
        <div
          className="absolute left-[18%] bottom-[28%] h-3 w-3 rounded-full"
          style={{ background: "#f0b866", boxShadow: "0 0 16px #f0b866", animation: "mithila-float 3.2s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[22%] bottom-[34%] h-2 w-2 rounded-full"
          style={{ background: "#ffd27a", boxShadow: "0 0 12px #ffd27a", animation: "mithila-float 2.6s ease-in-out 0.4s infinite" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {opening ? (
          <motion.div
            key="opening"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: -10, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="mx-auto mb-6 h-2 w-2 rounded-full"
              style={{ background: "#f0b866", boxShadow: "0 0 24px #f0b866" }}
            />
            <motion.h1
              initial={{ letterSpacing: "0.35em", opacity: 0 }}
              animate={{ letterSpacing: "0.12em", opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.3 }}
              className="mithila-serif text-3xl md:text-5xl italic"
              style={{ color: "#f0b866", textShadow: "0 0 40px rgba(240,184,102,0.45)" }}
            >
              The Long Walk Home
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 1.4, duration: 0.9 }}
              className="mt-4 text-sm tracking-[0.35em] uppercase"
            >
              welcome, Mithila
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className={`relative z-10 w-full max-w-md text-center ${shiver ? "mithila-shiver" : ""}`}
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ opacity: 0.5, color: "#ffd9b8" }}>
              a road made for one person
            </p>
            <h2
              className="mithila-serif text-2xl md:text-3xl italic mb-8"
              style={{ color: "#f0b866", textShadow: "0 2px 24px rgba(240,184,102,0.25)" }}
            >
              The Long Walk Home
            </h2>
            <h1
              className="mithila-serif whitespace-pre-line text-lg md:text-xl leading-relaxed italic mb-10"
              style={{ opacity: 0.95, color: "#f5f0e8" }}
            >
              {gate.prompt}
            </h1>
            <input
              className="mithila-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="type the city…"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
            />
            <button className="mithila-btn mt-6" onClick={submit}>
              begin the walk
            </button>
            <AnimatePresence>
              {wrongCount > 0 && (
                <motion.p
                  key={wrongCount}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  className="mt-6 text-sm italic"
                  style={{ color: "#ffd9b8" }}
                >
                  {gate.wrong[Math.min(wrongCount - 1, gate.wrong.length - 1)]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
