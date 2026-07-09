"use client";

import { useEffect, useRef, useState } from "react";
import type { WhichEraPuzzle } from "@/lib/mithila/data";
import { Play } from "lucide-react";

export default function WhichEra({
  puzzle,
  song,
  onSolve,
}: {
  puzzle: WhichEraPuzzle;
  song: { src: string };
  onSolve: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [wrong, setWrong] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = new Audio(song.src);
    el.volume = 0.9;
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = "";
    };
  }, [song.src]);

  const play = () => {
    const el = audioRef.current;
    if (!el || playing) return;
    el.currentTime = 0;
    el.play().catch(() => {});
    setPlaying(true);
    setTimeout(() => {
      el.pause();
      setPlaying(false);
    }, 5000);
  };

  const pick = (i: number) => {
    if (i === puzzle.correctIndex) {
      audioRef.current?.pause();
      onSolve();
    } else if (!wrong.includes(i)) setWrong((w) => [...w, i]);
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">which era?</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Listen. Which chapter of the road is this?
      </p>
      <button
        onClick={play}
        disabled={playing}
        className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full"
        style={{
          background: playing ? "rgba(240,184,102,0.25)" : "linear-gradient(135deg,#f0b866,#e8935a)",
          color: "#1a1206",
          boxShadow: "0 0 36px rgba(240,184,102,0.3)",
        }}
        aria-label="play clip"
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
            className="rounded-xl px-4 py-3 text-left"
            style={{
              background: wrong.includes(i) ? "rgba(232,72,63,0.12)" : "rgba(245,240,232,0.06)",
              border: "1px solid rgba(245,240,232,0.14)",
              opacity: wrong.includes(i) ? 0.4 : 1,
            }}
          >
            <div className="font-medium" style={{ color: "#f0b866" }}>
              {opt.label}
            </div>
            <div className="text-xs mt-1" style={{ opacity: 0.55 }}>
              {opt.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
