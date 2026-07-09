"use client";

import { useMemo, useState } from "react";
import type { StripShufflePuzzle } from "@/lib/mithila/data";

function shuffledOrder(n: number, seed: number): number[] {
  const arr = [...Array(n).keys()];
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.every((v, i) => v === i)) [arr[0], arr[1]] = [arr[1], arr[0]];
  return arr;
}

export default function StripShuffle({ puzzle, onSolve }: { puzzle: StripShufflePuzzle; onSolve: () => void }) {
  const n = puzzle.strips;
  const initial = useMemo(() => shuffledOrder(n, 2023), [n]);
  const [order, setOrder] = useState(initial);
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const tap = (i: number) => {
    if (done) return;
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    const next = [...order];
    [next[sel], next[i]] = [next[i], next[sel]];
    setOrder(next);
    setSel(null);
    if (next.every((v, k) => v === k)) {
      setDone(true);
      setTimeout(onSolve, 1000);
    }
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">strip shuffle</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Tap two strips to swap. Rebuild the garden memory.
      </p>
      <div
        className="mx-auto overflow-hidden rounded-xl"
        style={{ width: "min(78vw, 330px)", aspectRatio: "1 / 1" }}
      >
        {order.map((strip, pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => tap(pos)}
            className="block w-full"
            style={{
              height: `${100 / n}%`,
              backgroundImage: `url("${encodeURI(puzzle.photo)}")`,
              backgroundSize: `100% ${n * 100}%`,
              backgroundPosition: `center ${(strip / (n - 1)) * 100}%`,
              outline: sel === pos ? "3px solid #f0b866" : "1px solid rgba(0,0,0,0.35)",
              outlineOffset: -2,
            }}
            aria-label={`strip ${pos + 1}`}
          />
        ))}
      </div>
      {done && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          In bloom again. ✦
        </p>
      )}
    </div>
  );
}
