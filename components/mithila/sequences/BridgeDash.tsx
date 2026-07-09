"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMithila } from "@/lib/mithila/store";
import { sfx } from "../audio";

const DURATION = 8;
const NEED = 12;

/** Timed tap-run across the collapsing bridge — fail soft, skip after 2 fails. */
export default function BridgeDash() {
  const complete = useMithila((s) => s.completeSequence);
  const close = useMithila((s) => s.closeOverlay);
  const [taps, setTaps] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [fails, setFails] = useState(0);
  const [running, setRunning] = useState(true);
  const [won, setWon] = useState(false);
  const endRef = useRef(false);

  useEffect(() => {
    if (!running || won) return;
    const start = performance.now();
    const iv = setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      const rem = Math.max(0, DURATION - elapsed);
      setLeft(rem);
      if (rem <= 0 && !endRef.current) {
        endRef.current = true;
        setRunning(false);
        setFails((f) => {
          const next = f + 1;
          if (next >= 2) {
            /* allow skip UI */
          }
          return next;
        });
      }
    }, 50);
    return () => clearInterval(iv);
  }, [running, won, fails]);

  const tap = () => {
    if (!running || won) return;
    sfx.tap();
    setTaps((t) => {
      const n = t + 1;
      if (n >= NEED) {
        endRef.current = true;
        setWon(true);
        setRunning(false);
        sfx.solve();
        setTimeout(() => complete("bridge-dash"), 900);
      }
      return n;
    });
    if (navigator.vibrate) navigator.vibrate(8);
  };

  const retry = () => {
    endRef.current = false;
    setTaps(0);
    setLeft(DURATION);
    setRunning(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(4,5,16,0.72)", backdropFilter: "blur(6px)" }}
    >
      <div className="mithila-card w-full max-w-md px-6 py-8 text-center">
        <span className="mithila-badge mb-3">bridge dash</span>
        <h2 className="mithila-serif italic text-2xl mb-2" style={{ color: "#f0b866" }}>
          The Bridge of Two
        </h2>
        <p className="text-sm italic mb-6" style={{ opacity: 0.75 }}>
          The planks are falling — tap fast to run across!
        </p>

        <div className="mb-4 h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(245,240,232,0.1)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(taps / NEED) * 100}%`,
              background: "linear-gradient(90deg,#f0b866,#e8935a)",
            }}
          />
        </div>
        <p className="text-xs mb-6" style={{ opacity: 0.65 }}>
          {taps}/{NEED} steps · {left.toFixed(1)}s
        </p>

        {running && (
          <button
            type="button"
            onClick={tap}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-lg font-semibold"
            style={{
              background: "linear-gradient(135deg,#5cb8a8,#f0b866)",
              color: "#1a1206",
              boxShadow: "0 0 40px rgba(92,184,168,0.45)",
            }}
          >
            RUN
          </button>
        )}

        {won && (
          <p className="italic mt-4" style={{ color: "#f0b866" }}>
            Made it across. Together. ✦
          </p>
        )}

        {!running && !won && (
          <div className="mt-4 space-y-3">
            <p className="text-sm italic" style={{ opacity: 0.7 }}>
              The bridge shook you off…
            </p>
            <button className="mithila-btn w-full" onClick={retry}>
              try again
            </button>
            {fails >= 2 && (
              <button
                className="mithila-btn-ghost w-full"
                onClick={() => {
                  complete("bridge-dash");
                }}
              >
                take the long way ✦
              </button>
            )}
            <button className="mithila-btn-ghost w-full text-xs" onClick={close}>
              back
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
