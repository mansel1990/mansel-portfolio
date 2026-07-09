"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { lands, TOTAL_SPARKS, finale } from "@/lib/mithila/data";
import { TOTAL_COINS } from "@/lib/mithila/collectibles";
import { useMithila } from "@/lib/mithila/store";
import { mithilaInput } from "@/lib/mithila/input";
import { Map, Menu as MenuIcon, Volume2, VolumeX, X, Sparkles, RotateCcw, Images } from "lucide-react";

/** On-screen stick + jump for free biome movement */
export function VirtualPad() {
  const phase = useMithila((s) => s.phase);
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const active = useRef(false);

  useEffect(() => {
    return () => {
      mithilaInput.x = 0;
      mithilaInput.y = 0;
    };
  }, []);

  if (phase !== "world") return null;

  const setFromPoint = (clientX: number, clientY: number) => {
    const el = base.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const max = r.width * 0.38;
    const len = Math.hypot(dx, dy) || 1;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setKnob({ x: dx, y: dy });
    mithilaInput.x = dx / max;
    mithilaInput.y = -dy / max;
  };

  const end = () => {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    mithilaInput.x = 0;
    mithilaInput.y = 0;
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none flex items-end justify-between px-5 pb-6 md:pb-8">
      <div
        ref={base}
        className="pointer-events-auto relative h-[120px] w-[120px] rounded-full touch-none select-none"
        style={{
          background: "rgba(9,11,34,0.45)",
          border: "2px solid rgba(240,184,102,0.35)",
          boxShadow: "0 0 24px rgba(0,0,0,0.35)",
        }}
        onPointerDown={(e) => {
          active.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromPoint(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!active.current) return;
          setFromPoint(e.clientX, e.clientY);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
            background: "linear-gradient(135deg,#f0b866,#e8935a)",
            boxShadow: "0 0 16px rgba(240,184,102,0.45)",
          }}
        />
      </div>
      <button
        type="button"
        aria-label="jump"
        className="pointer-events-auto mb-2 h-[72px] w-[72px] rounded-full text-xs font-semibold tracking-wider touch-none"
        style={{
          background: "linear-gradient(135deg,#f0b866,#e8935a)",
          color: "#1a1206",
          boxShadow: "0 0 28px rgba(240,184,102,0.4)",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          mithilaInput.jumpPressed = true;
          if (navigator.vibrate) navigator.vibrate(10);
        }}
      >
        JUMP
      </button>
    </div>
  );
}

// ---------- plaque toast ----------
export function Toast() {
  const toast = useMithila((s) => s.toast);
  const setToast = useMithila((s) => s.setToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast, setToast]);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 mithila-card px-5 py-3 max-w-xs text-center pointer-events-none"
        >
          <span className="mithila-serif italic text-sm" style={{ color: "#f5f0e8", opacity: 0.95 }}>
            {toast}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- top bar: progress + sparks + buttons ----------
export function TopBar({ onMap, onMenu }: { onMap: () => void; onMenu: () => void }) {
  const frontier = useMithila((s) => s.frontier);
  const sparks = useMithila((s) => s.sparks);
  const coins = useMithila((s) => s.coins);
  const muted = useMithila((s) => s.muted);
  const toggleMute = useMithila((s) => s.toggleMute);
  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pt-4 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <button aria-label="menu" onClick={onMenu} className="rounded-full p-3" style={{ background: "rgba(9,11,34,0.6)", border: "1px solid rgba(245,240,232,0.15)" }}>
          <MenuIcon size={16} style={{ color: "#f5f0e8" }} />
        </button>
        <button aria-label="map" onClick={onMap} className="rounded-full p-3" style={{ background: "rgba(9,11,34,0.6)", border: "1px solid rgba(245,240,232,0.15)" }}>
          <Map size={16} style={{ color: "#f5f0e8" }} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full px-2.5 py-1.5" style={{ background: "rgba(9,11,34,0.6)", border: "1px solid rgba(255,215,0,0.35)" }}>
          <span className="text-xs" style={{ color: "#ffd700" }}>
            🪙 {coins.length}/{TOTAL_COINS}
          </span>
        </div>
        <div
          title="Hidden sparks along the road — optional collectibles"
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
          style={{ background: "rgba(9,11,34,0.6)", border: "1px solid rgba(245,240,232,0.15)" }}
        >
          <Sparkles size={13} style={{ color: "#c4b5fd" }} />
          <span className="text-[10px] tracking-wide uppercase" style={{ color: "#c4b5fd", opacity: 0.9 }}>
            sparks
          </span>
          <span className="text-xs" style={{ color: "#f5f0e8" }}>
            {sparks.length}/{TOTAL_SPARKS}
          </span>
        </div>
        <div className="rounded-full px-2.5 py-1.5 text-xs" style={{ background: "rgba(9,11,34,0.6)", border: "1px solid rgba(245,240,232,0.15)", color: "#f0b866" }}>
          {frontier}/10
        </div>
        <button aria-label="mute" onClick={toggleMute} className="rounded-full p-3 pointer-events-auto" style={{ background: "rgba(9,11,34,0.6)", border: "1px solid rgba(245,240,232,0.15)" }}>
          {muted ? <VolumeX size={16} style={{ color: "#f5f0e8" }} /> : <Volume2 size={16} style={{ color: "#f5f0e8" }} />}
        </button>
      </div>
    </div>
  );
}

// ---------- minimap ----------
export function MiniMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const frontier = useMithila((s) => s.frontier);
  const lastLand = useMithila((s) => s.lastLand);
  const fastTravel = useMithila((s) => s.fastTravel);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: "rgba(4,5,16,0.7)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20 }}
            className="mithila-card w-full max-w-sm px-6 py-6 max-h-[80vh] overflow-y-auto mithila-noscrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="mithila-serif italic text-xl" style={{ color: "#f0b866" }}>
                The Road So Far
              </h3>
              <button aria-label="close" onClick={onClose} className="rounded-full p-2" style={{ background: "rgba(245,240,232,0.07)" }}>
                <X size={14} style={{ color: "#f5f0e8" }} />
              </button>
            </div>
            <div className="relative pl-5">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: "linear-gradient(#f0b866, rgba(245,240,232,0.12))" }} />
              {lands.map((land, i) => {
                const unlocked = i < frontier;
                const here = i === lastLand;
                return (
                  <button
                    key={land.id}
                    disabled={!unlocked}
                    onClick={() => {
                      fastTravel(i);
                      onClose();
                    }}
                    className="relative w-full text-left py-2.5 flex items-center gap-3"
                    style={{ opacity: unlocked ? 1 : 0.35 }}
                  >
                    <span
                      className="absolute -left-5 rounded-full"
                      style={{
                        width: 12,
                        height: 12,
                        background: unlocked ? "#f0b866" : "rgba(245,240,232,0.2)",
                        boxShadow: here ? "0 0 10px 3px rgba(240,184,102,0.7)" : "none",
                      }}
                    />
                    <span>
                      <span className="mithila-serif italic block" style={{ color: unlocked ? "#f5f0e8" : "#8b90b5", fontSize: 16 }}>
                        {unlocked ? land.title : "· · ·"} {here && "◂ you"}
                      </span>
                      <span className="text-xs tracking-widest" style={{ color: "#f5f0e8", opacity: 0.5 }}>
                        {land.years}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-center mt-3" style={{ color: "#f5f0e8", opacity: 0.45 }}>
              tap an unlocked land to travel there
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- pause menu (with double-confirm restart) ----------
export function PauseMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const restart = useMithila((s) => s.restart);
  const sparks = useMithila((s) => s.sparks);
  const finaleSeen = useMithila((s) => s.finaleSeen);
  const setPhase = useMithila((s) => s.setPhase);
  const [confirm, setConfirm] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!open) {
      const id = requestAnimationFrame(() => {
        setConfirm(0);
        setTyped("");
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-5"
          style={{ background: "rgba(4,5,16,0.75)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20 }}
            className="mithila-card w-full max-w-xs px-6 py-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mithila-serif italic text-2xl mb-1" style={{ color: "#f0b866" }}>
              The Long Walk Home
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "#f5f0e8", opacity: 0.5 }}>
              optional sparks: {sparks.length}/{TOTAL_SPARKS}
            </p>

            {confirm === 0 && (
              <div className="grid gap-3">
                <button className="mithila-btn w-full" onClick={onClose}>
                  keep walking
                </button>
                <Link
                  href="/mithila/gallery"
                  className="mithila-btn-ghost w-full flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  <Images size={14} /> our photo gallery
                </Link>
                {finaleSeen && (
                  <button
                    className="mithila-btn-ghost w-full"
                    onClick={() => {
                      setPhase("finale");
                      onClose();
                    }}
                  >
                    replay the finale ✦
                  </button>
                )}
                {sparks.length >= TOTAL_SPARKS && (
                  <div className="mithila-card px-4 py-3 text-sm mithila-serif italic" style={{ color: "#ffd700" }}>
                    ✨ {finale.sparkSecret}
                  </div>
                )}
                <button
                  className="mithila-btn-ghost w-full flex items-center justify-center gap-2"
                  onClick={() => setConfirm(1)}
                  style={{ color: "#e8788a", borderColor: "rgba(232,120,138,0.4)" }}
                >
                  <RotateCcw size={13} /> restart the journey
                </button>
              </div>
            )}

            {confirm === 1 && (
              <div className="grid gap-3">
                <p className="mithila-serif italic text-sm" style={{ color: "#f5f0e8", opacity: 0.9 }}>
                  All gates close. The whole road resets. Every spark scatters.
                </p>
                <button className="mithila-btn-ghost w-full" onClick={() => setConfirm(2)} style={{ color: "#e8788a", borderColor: "rgba(232,120,138,0.4)" }}>
                  yes, reset everything
                </button>
                <button className="mithila-btn w-full" onClick={() => setConfirm(0)}>
                  no, keep my road
                </button>
              </div>
            )}

            {confirm === 2 && (
              <div className="grid gap-3">
                <p className="mithila-serif italic text-sm" style={{ color: "#f5f0e8", opacity: 0.9 }}>
                  Type <b style={{ color: "#e8788a" }}>YES</b> to confirm.
                </p>
                <input className="mithila-input" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="YES" />
                <button
                  className="mithila-btn-ghost w-full"
                  disabled={typed.trim().toUpperCase() !== "YES"}
                  style={{ opacity: typed.trim().toUpperCase() === "YES" ? 1 : 0.35, color: "#e8788a", borderColor: "rgba(232,120,138,0.4)" }}
                  onClick={() => {
                    restart();
                    onClose();
                  }}
                >
                  reset the road
                </button>
                <button className="mithila-btn w-full" onClick={() => setConfirm(0)}>
                  cancel
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
