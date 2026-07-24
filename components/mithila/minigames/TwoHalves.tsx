"use client";

import { useMemo, useState } from "react";
import type { TwoHalvesPuzzle } from "@/lib/mithila/data";
import { sfx } from "../audio";

type Choice = { src: string; correct: boolean };

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Split a photo: keep the left half fixed, pick the matching right half. */
export default function TwoHalves({
  puzzle,
  onSolve,
}: {
  puzzle: TwoHalvesPuzzle;
  onSolve: () => void;
}) {
  const choices = useMemo<Choice[]>(() => {
    const wrong = puzzle.decoys.slice(0, 2).map((src) => ({ src, correct: false }));
    return shuffle([{ src: puzzle.photo, correct: true }, ...wrong], 2015);
  }, [puzzle.photo, puzzle.decoys]);

  const [wrong, setWrong] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const pick = (i: number) => {
    if (done || wrong.includes(i)) return;
    if (choices[i].correct) {
      setPicked(i);
      setDone(true);
      sfx.spark();
      if (navigator.vibrate) navigator.vibrate([20, 30, 40]);
      setTimeout(onSolve, 1100);
    } else {
      setWrong((w) => [...w, i]);
      sfx.wiggle();
    }
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">two become one</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Two halves of the same memory. Tap the piece that completes the bridge.
      </p>

      {/* left half (anchor) — expands to the full memory when solved */}
      <div
        className="relative mx-auto mb-4 overflow-hidden rounded-xl"
        style={{
          width: "min(72vw, 280px)",
          aspectRatio: "3 / 4",
          border: "1px solid rgba(245,240,232,0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("${encodeURI(puzzle.photo)}")`,
            backgroundSize: done ? "cover" : "200% 100%",
            backgroundPosition: done ? "center" : "left center",
            transition: "background-size 0.7s ease, background-position 0.7s ease",
          }}
          role="img"
          aria-label="left half of the memory"
        />
        {!done && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[42%]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(4,5,16,0.55) 55%, rgba(4,5,16,0.82))",
              borderLeft: "1px dashed rgba(240,184,102,0.45)",
            }}
          />
        )}
      </div>

      {!done && (
        <p className="mb-3 text-xs tracking-[0.2em] uppercase" style={{ opacity: 0.45 }}>
          choose the matching half
        </p>
      )}

      <div className="mx-auto flex justify-center gap-2" style={{ width: "min(92vw, 340px)" }}>
        {choices.map((c, i) => {
          const isWrong = wrong.includes(i);
          const isWin = done && picked === i;
          return (
            <button
              key={c.src + i}
              type="button"
              onClick={() => pick(i)}
              disabled={done || isWrong}
              className="relative overflow-hidden rounded-lg"
              style={{
                width: "30%",
                aspectRatio: "3 / 5",
                opacity: isWrong ? 0.28 : 1,
                outline: isWin ? "2px solid #f0b866" : "1px solid rgba(245,240,232,0.16)",
                outlineOffset: 1,
                transform: isWin ? "scale(1.04)" : "scale(1)",
                transition: "opacity 0.25s, transform 0.3s",
              }}
              aria-label={isWrong ? "wrong half" : "photo half option"}
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `url("${encodeURI(c.src)}")`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "right center",
                }}
              />
            </button>
          );
        })}
      </div>

      {wrong.length > 0 && !done && (
        <p className="mt-4 text-sm italic" style={{ opacity: 0.65 }}>
          Not that shore — try the other side.
        </p>
      )}
      {done && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          Two roads, one bridge. ✦
        </p>
      )}
    </div>
  );
}
