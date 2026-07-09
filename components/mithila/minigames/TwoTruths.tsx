"use client";

// Two truths and a star — tap the memory that never happened.
import { useState } from "react";
import type { TwoTruthsPuzzle } from "@/lib/mithila/data";

export default function TwoTruths({ puzzle, onSolve }: { puzzle: TwoTruthsPuzzle; onSolve: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);

  const pick = (i: number) => {
    if (picked !== null) return;
    if (i === puzzle.fakeIndex) {
      setPicked(i);
      setTimeout(onSolve, 1400);
    } else setWrong((w) => (w.includes(i) ? w : [...w, i]));
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">two truths &amp; a star</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        Two of these really happened. One is an impostor. Tap the lie.
      </p>
      <div className="grid gap-3">
        {puzzle.statements.map((s, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="mithila-btn-ghost w-full normal-case tracking-normal text-base italic leading-relaxed py-4"
            style={{
              opacity: wrong.includes(i) ? 0.35 : 1,
              borderColor: picked === i ? "#f0b866" : undefined,
              color: picked === i ? "#f0b866" : undefined,
            }}
          >
            {s}
            {wrong.includes(i) && <span className="block text-xs mt-1 not-italic" style={{ opacity: 0.7 }}>that one&apos;s real ✦</span>}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className="mt-4 italic" style={{ color: "#f0b866" }}>
          Correct — no llama. Yet.
        </p>
      )}
    </div>
  );
}
