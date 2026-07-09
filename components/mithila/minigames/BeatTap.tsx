"use client";

import { useEffect, useRef, useState } from "react";
import type { BeatTapPuzzle } from "@/lib/mithila/data";

export default function BeatTap({
  puzzle,
  song,
  onSolve,
}: {
  puzzle: BeatTapPuzzle;
  song: { src: string };
  onSolve: () => void;
}) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [hits, setHits] = useState(0);
  const [missFlash, setMissFlash] = useState(false);
  const [pulse, setPulse] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startRef = useRef(0);
  const hitFlags = useRef<boolean[]>([]);
  const intervalMs = 60000 / puzzle.bpm;
  const windowMs = intervalMs * 0.42;

  useEffect(() => {
    const el = new Audio(song.src);
    el.volume = 0.85;
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = "";
    };
  }, [song.src]);

  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => setPulse((p) => !p), intervalMs);
    const end = setTimeout(() => {
      audioRef.current?.pause();
      setPhase("done");
      if (hitFlags.current.filter(Boolean).length >= puzzle.need) {
        setTimeout(onSolve, 700);
      }
    }, intervalMs * puzzle.beats + 400);
    return () => {
      clearInterval(iv);
      clearTimeout(end);
    };
  }, [phase, intervalMs, puzzle.beats, puzzle.need, onSolve]);

  const start = () => {
    hitFlags.current = Array(puzzle.beats).fill(false);
    setHits(0);
    setPhase("playing");
    startRef.current = performance.now() + 350;
    const el = audioRef.current;
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  const tap = () => {
    if (phase !== "playing") return;
    const t = performance.now() - startRef.current;
    if (t < -windowMs) return;
    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < puzzle.beats; i++) {
      if (hitFlags.current[i]) continue;
      const dist = Math.abs(t - i * intervalMs);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    if (best >= 0 && bestDist <= windowMs) {
      hitFlags.current[best] = true;
      setHits((h) => h + 1);
      if (navigator.vibrate) navigator.vibrate(12);
    } else {
      setMissFlash(true);
      setTimeout(() => setMissFlash(false), 120);
    }
  };

  const passed = hits >= puzzle.need;
  const failed = phase === "done" && !passed;

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">feel the beat</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Tap with the song. Hit {puzzle.need} of {puzzle.beats} beats — timing is forgiving.
      </p>

      {phase === "idle" && (
        <button className="mithila-btn mt-2" onClick={start}>
          start the beat
        </button>
      )}

      {phase === "playing" && (
        <button
          type="button"
          onClick={tap}
          className="mx-auto mt-2 flex h-28 w-28 items-center justify-center rounded-full text-lg font-semibold"
          style={{
            background: missFlash
              ? "rgba(232,72,63,0.35)"
              : pulse
                ? "linear-gradient(135deg,#f0b866,#e8935a)"
                : "rgba(240,184,102,0.22)",
            color: "#1a1206",
            boxShadow: pulse ? "0 0 40px rgba(240,184,102,0.45)" : "none",
            transition: "background 0.08s, box-shadow 0.08s",
          }}
        >
          TAP
        </button>
      )}

      {(phase === "playing" || phase === "done") && (
        <p className="mt-5 text-sm tracking-wide" style={{ opacity: 0.75 }}>
          {hits} / {puzzle.need} hits
        </p>
      )}

      {failed && (
        <div className="mt-5">
          <p className="italic text-sm mb-3" style={{ opacity: 0.7 }}>
            Almost — try the bridge again.
          </p>
          <button className="mithila-btn" onClick={start}>
            retry
          </button>
        </div>
      )}

      {phase === "done" && passed && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          In step. The drawbridge listens. ✦
        </p>
      )}
    </div>
  );
}
