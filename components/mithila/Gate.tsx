"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gate } from "@/lib/mithila/data";
import { matchGate } from "@/lib/mithila/fuzzy";
import { useMithila } from "@/lib/mithila/store";

type Star = { left: string; top: string; size: number; delay: string; dur: string };

function makeStars(): Star[] {
  let seed = 19900725;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 90 }, () => ({
    left: rnd() * 100 + "%",
    top: rnd() * 100 + "%",
    size: rnd() * 2.2 + 0.6,
    delay: rnd() * 4 + "s",
    dur: 2.5 + rnd() * 4 + "s",
  }));
}

export default function Gate() {
  const unlock = useMithila((s) => s.unlock);
  const [value, setValue] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [shiver, setShiver] = useState(false);
  const [opening, setOpening] = useState(false);

  const stars = useMemo<Star[]>(() => makeStars(), []);

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
    <div className="absolute inset-0 flex items-center justify-center px-6">
      {/* lightweight CSS starfield */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: "#f5f0e8",
              animation: `mithila-twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
              opacity: opening ? 1 : undefined,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {opening ? (
          <motion.div
            key="opening"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            {/* shooting star */}
            <motion.div
              initial={{ x: "-45vw", y: "-20vh", opacity: 0 }}
              animate={{ x: "45vw", y: "8vh", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeIn" }}
              className="absolute -top-24 left-1/2 h-[2px] w-28 -rotate-12"
              style={{ background: "linear-gradient(90deg, transparent, #f5f0e8)", boxShadow: "0 0 12px #f5f0e8" }}
            />
            <motion.h1
              initial={{ letterSpacing: "0.6em", opacity: 0 }}
              animate={{ letterSpacing: "0.25em", opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-3xl md:text-5xl italic"
              style={{ color: "#f0b866", textShadow: "0 0 40px rgba(240,184,102,0.5)" }}
            >
              Written in the Stars
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="mt-4 text-sm tracking-[0.35em] uppercase"
            >
              welcome, Mithila
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 1 }}
            className={`relative z-10 w-full max-w-md text-center ${shiver ? "mithila-shiver" : ""}`}
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ opacity: 0.45 }}>
              this sky was made for one person
            </p>
            <h1 className="whitespace-pre-line text-xl md:text-2xl leading-relaxed italic mb-10" style={{ opacity: 0.95 }}>
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
              open the sky
            </button>
            <AnimatePresence>
              {wrongCount > 0 && (
                <motion.p
                  key={wrongCount}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  className="mt-6 text-sm italic"
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
