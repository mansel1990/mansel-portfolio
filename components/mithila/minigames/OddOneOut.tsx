"use client";

import { useState } from "react";
import type { OddOneOutPuzzle } from "@/lib/mithila/data";

export default function OddOneOut({ puzzle, onSolve }: { puzzle: OddOneOutPuzzle; onSolve: () => void }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const pick = (i: number) => {
    if (done) return;
    if (i === puzzle.oddIndex) {
      setDone(true);
      setTimeout(onSolve, 900);
    } else if (!wrong.includes(i)) setWrong((w) => [...w, i]);
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">odd one out</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        {puzzle.prompt}
      </p>
      <div className="mx-auto grid grid-cols-2 gap-2" style={{ width: "min(84vw, 340px)" }}>
        {puzzle.photos.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            disabled={wrong.includes(i) || done}
            className="aspect-square overflow-hidden rounded-xl"
            style={{
              opacity: wrong.includes(i) ? 0.35 : 1,
              outline: done && i === puzzle.oddIndex ? "3px solid #f0b866" : "1px solid rgba(245,240,232,0.12)",
              outlineOffset: -2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {wrong.length > 0 && !done && (
        <p className="mt-4 text-sm italic" style={{ opacity: 0.65 }}>
          That one belongs here. Look again.
        </p>
      )}
      {done && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          A wedding wandered in. Curtain opens. ✦
        </p>
      )}
    </div>
  );
}
