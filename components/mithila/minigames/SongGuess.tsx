"use client";

import { useEffect, useRef, useState } from "react";
import type { SongGuessPuzzle } from "@/lib/mithila/data";
import { Play } from "lucide-react";

export default function SongGuess({
  puzzle,
  song,
  onSolve,
}: {
  puzzle: SongGuessPuzzle;
  song: { src: string };
  onSolve: () => void;
}) {
  const [plays, setPlays] = useState(0);
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

  // more plays = longer snippet (3s, 5s, 8s, …)
  const snippet = () => {
    const el = audioRef.current;
    if (!el || playing) return;
    const dur = Math.min(3 + plays * 2, 15);
    el.currentTime = 0;
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
      <span className="mithila-badge mb-4">name that tune</span>
      <p className="italic my-5" style={{ opacity: 0.85 }}>
        A few seconds of a song you two played to death. Which one is it?
      </p>
      <button
        onClick={snippet}
        disabled={playing}
        className="mx-auto mb-6 flex items-center justify-center rounded-full"
        style={{
          width: 76,
          height: 76,
          background: playing ? "rgba(240,184,102,0.25)" : "linear-gradient(135deg,#f0b866,#e8935a)",
          boxShadow: "0 0 40px rgba(240,184,102,0.35)",
          color: "#1a1206",
          animation: playing ? "mithila-breathe 1.2s ease-in-out infinite" : "none",
        }}
        aria-label="play snippet"
      >
        <Play size={28} fill="currentColor" />
      </button>
      <div className="grid gap-3">
        {puzzle.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={wrong.includes(i)}
            className="mithila-btn-ghost w-full normal-case tracking-normal text-base"
            style={{
              opacity: wrong.includes(i) ? 0.25 : 1,
              textDecoration: wrong.includes(i) ? "line-through" : "none",
              fontStyle: "italic",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {wrong.length > 0 && (
        <p className="mt-4 text-sm italic" style={{ opacity: 0.65 }}>
          {wrong.length === 1 ? "Nope — play it again, it gets longer each time." : `Hint: ${puzzle.hint}`}
        </p>
      )}
    </div>
  );
}
