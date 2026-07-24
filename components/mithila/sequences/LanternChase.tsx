"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "../audio";

const TARGET = 10;
const DURATION = 28;

/** Collect drifting lanterns before Birthday City opens fully. */
export default function LanternChase() {
  const complete = useMithila((s) => s.completeSequence);
  const close = useMithila((s) => s.closeOverlay);
  const [got, setGot] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [fails, setFails] = useState(0);
  const [running, setRunning] = useState(true);
  const [won, setWon] = useState(false);
  const [spots, setSpots] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      x: 12 + Math.random() * 76,
      y: 18 + Math.random() * 50,
    })),
  );

  const spawn = () => {
    setSpots(
      Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i,
        x: 12 + Math.random() * 76,
        y: 18 + Math.random() * 50,
      })),
    );
  };

  useEffect(() => {
    if (!running || won) return;
    const start = performance.now();
    const iv = setInterval(() => {
      const rem = Math.max(0, DURATION - (performance.now() - start) / 1000);
      setLeft(rem);
      if (rem <= 0) {
        setRunning(false);
        setFails((f) => f + 1);
      }
    }, 80);
    const move = setInterval(() => {
      setSpots((s) =>
        s.map((p) => ({
          ...p,
          x: Math.min(88, Math.max(8, p.x + (Math.random() - 0.5) * 8)),
          y: Math.min(70, Math.max(14, p.y + (Math.random() - 0.5) * 6)),
        })),
      );
    }, 700);
    return () => {
      clearInterval(iv);
      clearInterval(move);
    };
  }, [running, won]);

  const catchOne = (id: number) => {
    if (!running || won) return;
    sfx.spark();
    setSpots((s) => s.filter((p) => p.id !== id));
    setGot((g) => {
      const n = g + 1;
      if (n >= TARGET) {
        setWon(true);
        setRunning(false);
        sfx.solve();
        setTimeout(() => complete("lantern-chase"), 900);
      } else if (n % 2 === 0) {
        setTimeout(spawn, 200);
      }
      return n;
    });
    if (navigator.vibrate) navigator.vibrate(12);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50"
      style={{ background: "radial-gradient(ellipse at center, #1a1e3f 0%, #050614 100%)" }}
    >
      <div className="absolute top-6 left-0 right-0 text-center z-10 px-4">
        <span className="mithila-badge">lantern chase</span>
        <p className="mithila-serif italic mt-3 text-lg" style={{ color: "#f0b866" }}>
          Catch {TARGET} birthday lanterns
        </p>
        <p className="text-xs mt-1" style={{ opacity: 0.65 }}>
          {got}/{TARGET} · {left.toFixed(0)}s
        </p>
      </div>

      {running &&
        spots.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => catchOne(p.id)}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: 44,
              height: 44,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle at 40% 35%, #ffe9a8, #f0b866 55%, #e8935a)",
              boxShadow: "0 0 28px rgba(240,184,102,0.75)",
              animation: "mithila-float 2s ease-in-out infinite",
            }}
            aria-label="lantern"
          />
        ))}

      {won && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="mithila-serif italic text-2xl" style={{ color: "#f0b866" }}>
            The city lights for you. ✦
          </p>
        </div>
      )}

      {!running && !won && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="mithila-card w-full max-w-sm px-6 py-8 text-center space-y-3">
            <p className="italic text-sm" style={{ opacity: 0.75 }}>
              The lanterns drifted away…
            </p>
            <button
              className="mithila-btn w-full"
              onClick={() => {
                setGot(0);
                setLeft(DURATION);
                spawn();
                setRunning(true);
              }}
            >
              chase again
            </button>
            {fails >= 2 && (
              <button className="mithila-btn-ghost w-full" onClick={() => complete("lantern-chase")}>
                walk in gently ✦
              </button>
            )}
            <button className="mithila-btn-ghost w-full text-xs" onClick={close}>
              back
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
