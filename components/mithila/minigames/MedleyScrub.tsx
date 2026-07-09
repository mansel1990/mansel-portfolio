"use client";

import { useEffect, useRef, useState } from "react";
import type { MedleyScrubPuzzle } from "@/lib/mithila/data";
import { medleySrc } from "@/lib/mithila/data";
import { Play } from "lucide-react";

export default function MedleyScrub({ puzzle, onSolve }: { puzzle: MedleyScrubPuzzle; onSolve: () => void }) {
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wrong, setWrong] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = new Audio(medleySrc);
    el.volume = 0.9;
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = "";
    };
  }, []);

  const snippet = () => {
    const el = audioRef.current;
    if (!el || playing) return;
    const dur = Math.min(puzzle.durationSec + plays, 12);
    el.currentTime = puzzle.startSec;
    el.play().catch(() => {});
    setPlaying(true);
    setPlays((p) => p + 1);
    setTimeout(() => {
      el.pause();
      setPlaying(false);
    }, dur * 1000);
  };

  const pick = (i: number) => {
    if (i === puzzle.correctIndex) {
      audioRef.current?.pause();
      onSolve();
    } else if (!wrong.includes(i)) setWrong((w) => [...w, i]);
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">medley scrub</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        A slice from the long walk. Which song just played?
      </p>
      <button
        onClick={snippet}
        disabled={playing}
        className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full"
        style={{
          background: playing ? "rgba(240,184,102,0.25)" : "linear-gradient(135deg,#f0b866,#e8935a)",
          color: "#1a1206",
          boxShadow: "0 0 36px rgba(240,184,102,0.3)",
        }}
        aria-label="play medley slice"
      >
        <Play size={26} fill="currentColor" />
      </button>
      <div className="grid gap-3">
        {puzzle.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            disabled={wrong.includes(i)}
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: wrong.includes(i) ? "rgba(232,72,63,0.12)" : "rgba(245,240,232,0.06)",
              border: "1px solid rgba(245,240,232,0.14)",
              opacity: wrong.includes(i) ? 0.4 : 1,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {wrong.length >= 2 && (
        <p className="mt-4 text-sm italic" style={{ opacity: 0.65 }}>
          Hint: {puzzle.hint}
        </p>
      )}
    </div>
  );
}
